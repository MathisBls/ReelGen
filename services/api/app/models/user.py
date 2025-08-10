from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))

    # Relationships
    media: Mapped[list["Media"]] = relationship("Media", back_populates="user")
    favorites: Mapped[list["Favorite"]] = relationship("Favorite", back_populates="user")
    team_members: Mapped[list["TeamMember"]] = relationship("TeamMember", back_populates="user")
    settings: Mapped["UserSettings"] = relationship("UserSettings", back_populates="user", uselist=False)
