from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ClipStatus(str, Enum):
    CANDIDATE = "candidate"
    APPROVED = "approved"
    REJECTED = "rejected"

class ClipBase(BaseModel):
    media_id: int
    t_start: float
    t_end: float
    score: Optional[float] = None
    title_suggested: Optional[str] = None
    desc_suggested: Optional[str] = None
    hashtags_json: Optional[dict] = None
    status: ClipStatus = ClipStatus.CANDIDATE

class ClipCreate(ClipBase):
    pass

class ClipUpdate(BaseModel):
    t_start: Optional[float] = None
    t_end: Optional[float] = None
    score: Optional[float] = None
    title_suggested: Optional[str] = None
    desc_suggested: Optional[str] = None
    hashtags_json: Optional[dict] = None
    status: Optional[ClipStatus] = None

class Clip(ClipBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
