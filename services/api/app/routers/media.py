import uuid
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session

from app.core.s3 import s3_client
from app.core.config import settings
from app.core.db import get_db
from app.core.queue import queue
from app.models.media import Media
from app.models.team_member import TeamMember
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.media import (
    CreateMediaRequest,
    CreateMediaResponse,
    UploadMediaResponse,
)

router = APIRouter()  # le prefix et les tags sont ajoutés dans main.py

# ------- helpers -------
def _assert_team_member(db: Session, team_id: int | None, user_id: int):
    if team_id is not None:
        tm = db.query(TeamMember).filter_by(team_id=team_id, user_id=user_id).first()
        if not tm:
            raise HTTPException(status_code=403, detail="Not a member of this team")

# ------- mode 1: URL présignée (upload depuis le client) -------
@router.post("", response_model=CreateMediaResponse)
def create_media(
    body: CreateMediaRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _assert_team_member(db, body.team_id, user.id)

    key = f"uploads/{uuid.uuid4()}_{body.filename}"
    url = s3_client().generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": settings.s3_bucket, "Key": key, "ContentType": body.content_type},
        ExpiresIn=3600,
    )

    # NOTE: on enregistre "uploaded" pour le MVP; en prod tu peux mettre "pending_upload"
    m = Media(
        team_id=body.team_id,
        user_id=user.id,
        key=key,
        filename=body.filename,
        content_type=body.content_type,
        status="uploaded",
    )
    db.add(m); db.commit(); db.refresh(m)
    return CreateMediaResponse(id=m.id, key=key, upload_url=url, content_type=body.content_type)

# ------- mode 2: upload direct (multipart) -------
@router.post("/upload", response_model=UploadMediaResponse)
async def upload_media(
    file: UploadFile = File(...),
    team_id: int | None = Form(default=None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    _assert_team_member(db, team_id, user.id)

    filename = Path(file.filename).name
    content_type = file.content_type or "application/octet-stream"
    key = f"uploads/{uuid.uuid4()}_{filename}"

    s3 = s3_client()
    s3.upload_fileobj(
        Fileobj=file.file,
        Bucket=settings.s3_bucket,
        Key=key,
        ExtraArgs={"ContentType": content_type},
    )

    m = Media(
        team_id=team_id,
        user_id=user.id,
        key=key,
        filename=filename,
        content_type=content_type,
        status="uploaded",
    )
    db.add(m); db.commit(); db.refresh(m)
    return UploadMediaResponse(id=m.id, key=key, filename=filename, content_type=content_type)

# ------- listing -------
@router.get("", response_model=list[dict])
def list_media(
    team_id: int | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = db.query(Media)
    if team_id is not None:
        _assert_team_member(db, team_id, user.id)
        q = q.filter(Media.team_id == team_id)
    else:
        q = q.filter(Media.user_id == user.id)

    rows = q.order_by(Media.id.desc()).all()
    return [
        {
            "id": m.id,
            "team_id": m.team_id,
            "user_id": m.user_id,
            "key": m.key,
            "filename": m.filename,
            "content_type": m.content_type,
            "status": m.status,
            "duration_s": m.duration_s,
            "created_at": m.created_at.isoformat(),
        }
        for m in rows
    ]

# ------- ingest (enfile un job worker) -------
@router.post("/{media_id}/ingest", response_model=dict)
def ingest_media_endpoint(
    media_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    m = db.get(Media, media_id)
    if not m:
        raise HTTPException(404, detail="Media not found")

    # autorisations
    if m.user_id != user.id:
        _assert_team_member(db, m.team_id, user.id)

    m.status = "processing"
    db.commit()

    job = queue.enqueue("worker.jobs.ingest_media", media_id=media_id)
    return {"enqueued": True, "job_id": job.get_id(), "media_id": m.id}
