from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), index=True)  # pas unique pour éviter les collisions
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    members: Mapped[list["TeamMember"]] = relationship(
        "TeamMember", back_populates="team", cascade="all, delete-orphan"
    )
    media: Mapped[list["Media"]] = relationship("Media", back_populates="team")
    templates: Mapped[list["Template"]] = relationship("Template", back_populates="team")
    integration_accounts: Mapped[list["IntegrationAccount"]] = relationship("IntegrationAccount", back_populates="team")
    tags: Mapped[list["Tag"]] = relationship("Tag", back_populates="team")
    collections: Mapped[list["Collection"]] = relationship("Collection", back_populates="team")
    billing_customer: Mapped["BillingCustomer"] = relationship("BillingCustomer", back_populates="team", uselist=False)
    subscriptions: Mapped[list["Subscription"]] = relationship("Subscription", back_populates="team")
