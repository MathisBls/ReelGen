from sqlalchemy import Column, Integer, String, JSON, DateTime, Text
from sqlalchemy.sql import func
from app.core.db import Base

class Webhook(Base):
    __tablename__ = "webhooks_in"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String(50), nullable=False)  # youtube, tiktok, instagram
    event_type = Column(String(100), nullable=False)
    payload_json = Column(JSON, nullable=False)
    signature = Column(String(500), nullable=True)  # Platform signature for verification
    received_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="pending", nullable=False)  # pending, processed, failed
