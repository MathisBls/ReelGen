from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base
import enum

class ItemKind(enum.Enum):
    MEDIA = "media"
    CLIP = "clip"
    RENDITION = "rendition"
    POST = "post"

class CollectionItem(Base):
    __tablename__ = "collection_items"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=False)
    kind = Column(Enum(ItemKind), nullable=False)
    ref_id = Column(Integer, nullable=False)  # ID of the referenced item
    position = Column(Integer, nullable=False)  # Order in collection
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    collection = relationship("Collection", back_populates="items")
