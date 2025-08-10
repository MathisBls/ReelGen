from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.db import Base

class MediaTag(Base):
    __tablename__ = "media_tags"

    media_id = Column(Integer, ForeignKey("media.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)

    # Relationships
    media = relationship("Media", back_populates="media_tags")
    tag = relationship("Tag", back_populates="media_tags")
