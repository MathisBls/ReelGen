from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.models.clip import Clip, ClipStatus
from app.schemas.clip import ClipCreate, ClipUpdate, Clip as ClipSchema
from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter(tags=["clips"])

@router.post("/", response_model=ClipSchema)
def create_clip(
    clip: ClipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new clip"""
    db_clip = Clip(**clip.model_dump())
    db.add(db_clip)
    db.commit()
    db.refresh(db_clip)
    return db_clip

@router.get("/", response_model=List[ClipSchema])
def get_clips(
    media_id: int = None,
    status: ClipStatus = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get clips with optional filtering"""
    query = db.query(Clip)

    if media_id:
        query = query.filter(Clip.media_id == media_id)
    if status:
        query = query.filter(Clip.status == status)

    clips = query.offset(skip).limit(limit).all()
    return clips

@router.get("/{clip_id}", response_model=ClipSchema)
def get_clip(
    clip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific clip by ID"""
    clip = db.query(Clip).filter(Clip.id == clip_id).first()
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")
    return clip

@router.put("/{clip_id}", response_model=ClipSchema)
def update_clip(
    clip_id: int,
    clip_update: ClipUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a clip"""
    db_clip = db.query(Clip).filter(Clip.id == clip_id).first()
    if not db_clip:
        raise HTTPException(status_code=404, detail="Clip not found")

    update_data = clip_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_clip, field, value)

    db.commit()
    db.refresh(db_clip)
    return db_clip

@router.delete("/{clip_id}")
def delete_clip(
    clip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a clip"""
    db_clip = db.query(Clip).filter(Clip.id == clip_id).first()
    if not db_clip:
        raise HTTPException(status_code=404, detail="Clip not found")

    db.delete(db_clip)
    db.commit()
    return {"message": "Clip deleted successfully"}
