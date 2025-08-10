from sqlalchemy import Column, Integer, String, Float, JSON, Enum, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base
import enum

class ClipStatus(enum.Enum):
    CANDIDATE = "candidate"
    APPROVED = "approved"
    REJECTED = "rejected"

class Clip(Base):
    __tablename__ = "clips"

    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey("media.id"), nullable=False)
    t_start = Column(Float, nullable=False)  # Start time in seconds
    t_end = Column(Float, nullable=False)    # End time in seconds
    score = Column(Float, nullable=True)     # AI score for quality
    title_suggested = Column(String(255), nullable=True)
    desc_suggested = Column(Text, nullable=True)
    hashtags_json = Column(JSON, nullable=True)
    status = Column(Enum(ClipStatus), default=ClipStatus.CANDIDATE, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    media = relationship("Media", back_populates="clips")
    renditions = relationship("ClipRendition", back_populates="clip")
    favorites = relationship("Favorite", back_populates="clip")
