from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base

class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    ts = Column(DateTime(timezone=True), nullable=False)  # Timestamp of the metric
    views = Column(Integer, default=0, nullable=False)
    likes = Column(Integer, default=0, nullable=False)
    comments = Column(Integer, default=0, nullable=False)
    watch_time_s = Column(Float, default=0.0, nullable=False)  # Watch time in seconds
    ctr = Column(Float, default=0.0, nullable=False)  # Click-through rate

    # Relationships
    post = relationship("Post", back_populates="metrics")
