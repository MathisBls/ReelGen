from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class AspectRatio(str, Enum):
    SQUARE = "1:1"
    PORTRAIT = "9:16"
    LANDSCAPE = "16:9"
    STORY = "9:16"

class RenditionStatus(str, Enum):
    QUEUED = "queued"
    RENDERING = "rendering"
    READY = "ready"
    FAILED = "failed"

class ClipRenditionBase(BaseModel):
    clip_id: int
    aspect: AspectRatio
    template_id: Optional[int] = None

class ClipRenditionCreate(ClipRenditionBase):
    pass

class ClipRenditionUpdate(BaseModel):
    s3_uri: Optional[str] = None
    subtitle_json: Optional[dict] = None
    template_id: Optional[int] = None
    status: Optional[RenditionStatus] = None

class ClipRendition(ClipRenditionBase):
    id: int
    s3_uri: Optional[str] = None
    subtitle_json: Optional[dict] = None
    status: RenditionStatus
    created_at: datetime

    class Config:
        from_attributes = True
