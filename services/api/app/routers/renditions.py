from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List

from app.core.db import get_db
from app.core.queue import queue
from app.routers.auth import get_current_user
from app.models.user import User
from app.models.clip_rendition import ClipRendition, RenditionStatus
from app.models.clip import Clip
from app.models.media import Media
from app.models.team_member import TeamMember
from app.schemas.rendition import (
    ClipRenditionCreate,
    ClipRenditionUpdate,
    ClipRendition as RenditionSchema,
)

router = APIRouter(tags=["renditions"])

# ------- helpers -------
def assert_can_access_clip(db: Session, clip_id: int, user_id: int) -> Clip:
    c = db.get(Clip, clip_id)
    if not c:
        raise HTTPException(404, "Clip not found")
    m = db.get(Media, c.media_id)
    if m.user_id != user_id:
        is_member = m.team_id and db.query(TeamMember).filter_by(team_id=m.team_id, user_id=user_id).first()
        if not is_member:
            raise HTTPException(403, "Forbidden")
    return c

def assert_can_access_rendition(db: Session, rendition_id: int, user_id: int) -> ClipRendition:
    r = db.get(ClipRendition, rendition_id)
    if not r:
        raise HTTPException(404, "Rendition not found")
    # reuse clip access
    assert_can_access_clip(db, r.clip_id, user_id)
    return r

# ------- create -------
@router.post("", response_model=RenditionSchema)
def create_rendition(
    body: ClipRenditionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1) sécurité
    clip = assert_can_access_clip(db, body.clip_id, current_user.id)

    # 2) créer en "queued" (pas de status/s3_uri fournis par le client)
    r = ClipRendition(
        clip_id=clip.id,
        aspect=body.aspect,
        template_id=body.template_id,
        status=RenditionStatus.QUEUED,
        s3_uri=None,
        subtitle_json=None,
    )
    db.add(r); db.commit(); db.refresh(r)

    # 3) enqueuer
    queue.enqueue("worker.jobs.render_rendition", rendition_id=r.id)
    return r

# ------- list -------
@router.get("", response_model=List[RenditionSchema])
def get_renditions(
    clip_id: int | None = None,
    status: RenditionStatus | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = (
        db.query(ClipRendition)
        .join(Clip, Clip.id == ClipRendition.clip_id)
        .join(Media, Media.id == Clip.media_id)
        .outerjoin(TeamMember, TeamMember.team_id == Media.team_id)
        .filter(
            or_(
                Media.user_id == current_user.id,
                TeamMember.user_id == current_user.id,
            )
        )
    )
    if clip_id:
        q = q.filter(ClipRendition.clip_id == clip_id)
    if status:
        q = q.filter(ClipRendition.status == status)
    return q.offset(skip).limit(limit).all()

# ------- get -------
@router.get("/{rendition_id}", response_model=RenditionSchema)
def get_rendition(
    rendition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return assert_can_access_rendition(db, rendition_id, current_user.id)

# ------- update -------
@router.put("/{rendition_id}", response_model=RenditionSchema)
def update_rendition(
    rendition_id: int,
    payload: ClipRenditionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = assert_can_access_rendition(db, rendition_id, current_user.id)

    # Protéger ces champs (le worker les gère)
    forbidden = {"status", "s3_uri"}
    data = payload.model_dump(exclude_unset=True)
    if any(k in forbidden for k in data.keys()):
        raise HTTPException(400, "status/s3_uri are managed by the renderer")

    for k, v in data.items():
        setattr(r, k, v)
    db.commit(); db.refresh(r)
    return r

# ------- delete -------
@router.delete("/{rendition_id}", status_code=204)
def delete_rendition(
    rendition_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    r = assert_can_access_rendition(db, rendition_id, current_user.id)
    db.delete(r); db.commit()
    return
