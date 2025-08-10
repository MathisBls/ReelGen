from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.db import Base

class BillingCustomer(Base):
    __tablename__ = "billing_customers"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    stripe_customer_id = Column(String(255), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    team = relationship("Team", back_populates="billing_customer", uselist=False)
    subscriptions = relationship("Subscription", back_populates="customer")

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("billing_customers.id"), nullable=False)
    plan = Column(String(50), nullable=False)  # basic, pro, enterprise
    status = Column(String(50), nullable=False)  # active, canceled, past_due
    current_period_end = Column(DateTime(timezone=True), nullable=False)
    stripe_sub_id = Column(String(255), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    team = relationship("Team", back_populates="subscriptions")
    customer = relationship("BillingCustomer", back_populates="subscriptions")
