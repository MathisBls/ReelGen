from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class Media(Base):
    __tablename__ = "media"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    team_id: Mapped[int | None] = mapped_column(ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    key: Mapped[str] = mapped_column(String(512), unique=True, index=True)
    filename: Mapped[str] = mapped_column(String(255))
    content_type: Mapped[str] = mapped_column(String(100), default="video/mp4")
    status: Mapped[str] = mapped_column(String(50), default="uploaded")  # uploaded|processing|ready|failed
    duration_s: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    clips = relationship("Clip", back_populates="media")
    media_tags = relationship("MediaTag", back_populates="media")
    transcripts = relationship("Transcript", back_populates="media")
    team = relationship("Team", back_populates="media")
    user = relationship("User", back_populates="media")
