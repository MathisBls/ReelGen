from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class PostStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"

class PostBase(BaseModel):
    clip_rendition_id: int
    platform: str
    scheduled_at: Optional[datetime] = None

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None
    status: Optional[PostStatus] = None
    platform_post_id: Optional[str] = None
    logs_json: Optional[Dict[str, Any]] = None

class Post(PostBase):
    id: int
    status: PostStatus
    platform_post_id: Optional[str] = None
    logs_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True
