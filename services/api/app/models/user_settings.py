from sqlalchemy import ForeignKey, String, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    locale: Mapped[str] = mapped_column(String(10), default="fr_FR")
    timezone: Mapped[str] = mapped_column(String(50), default="Europe/Paris")
    theme: Mapped[str] = mapped_column(String(10), default="system")  # light|dark|system
    onboarding_flags_json: Mapped[dict] = mapped_column(JSON, default=dict)

    # Relationships
    user = relationship("User", back_populates="settings")
