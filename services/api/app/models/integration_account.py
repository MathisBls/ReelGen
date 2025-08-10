from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base
import enum

class Platform(enum.Enum):
    YOUTUBE = "youtube"
    TIKTOK = "tiktok"
    INSTAGRAM = "instagram"

class IntegrationAccount(Base):
    __tablename__ = "integration_accounts"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    platform = Column(Enum(Platform), nullable=False)
    account_name = Column(String(255), nullable=False)
    token_encrypted = Column(Text, nullable=False)  # Encrypted OAuth token
    refresh_token_encrypted = Column(Text, nullable=True)  # Encrypted refresh token
    expires_at = Column(DateTime(timezone=True), nullable=True)
    scopes = Column(String(500), nullable=True)  # Comma-separated scopes
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    team = relationship("Team", back_populates="integration_accounts")
