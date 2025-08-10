from sqlalchemy import Column, Integer, String, JSON, Enum, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base
import enum

class AspectRatio(enum.Enum):
    SQUARE = "1:1"
    PORTRAIT = "9:16"
    LANDSCAPE = "16:9"
    STORY = "9:16"

class RenditionStatus(enum.Enum):
    QUEUED = "queued"
    RENDERING = "rendering"
    READY = "ready"
    FAILED = "failed"

class ClipRendition(Base):
    __tablename__ = "clip_renditions"

    id = Column(Integer, primary_key=True, index=True)
    clip_id = Column(Integer, ForeignKey("clips.id"), nullable=False)
    aspect = Column(Enum(AspectRatio), nullable=False)
    s3_uri = Column(String(500), nullable=True)
    subtitle_json = Column(JSON, nullable=True)
    template_id = Column(Integer, ForeignKey("templates.id"), nullable=True)
    status = Column(Enum(RenditionStatus), default=RenditionStatus.QUEUED, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    clip = relationship("Clip", back_populates="renditions")
    template = relationship("Template", back_populates="renditions")
    posts = relationship("Post", back_populates="rendition")
