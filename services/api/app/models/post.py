from sqlalchemy import Column, Integer, String, JSON, Enum, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base
import enum

class PostStatus(enum.Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    clip_rendition_id = Column(Integer, ForeignKey("clip_renditions.id"), nullable=False)
    platform = Column(String(50), nullable=False)  # youtube, tiktok, instagram
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(Enum(PostStatus), default=PostStatus.DRAFT, nullable=False)
    platform_post_id = Column(String(255), nullable=True)  # ID from the platform
    logs_json = Column(JSON, nullable=True)  # Error logs, success info
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    rendition = relationship("ClipRendition", back_populates="posts")
    metrics = relationship("Metric", back_populates="post")
