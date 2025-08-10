from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.models.integration_account import IntegrationAccount, Platform
from app.schemas.integration import IntegrationAccountCreate, IntegrationAccountUpdate, IntegrationAccount as IntegrationSchema
from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter(tags=["integrations"])

@router.post("/", response_model=IntegrationSchema)
def create_integration(
    integration: IntegrationAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new integration account"""
    db_integration = IntegrationAccount(**integration.model_dump())
    db.add(db_integration)
    db.commit()
    db.refresh(db_integration)
    return db_integration

@router.get("/", response_model=List[IntegrationSchema])
def get_integrations(
    team_id: int = None,
    platform: Platform = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get integration accounts with optional filtering"""
    query = db.query(IntegrationAccount)

    if team_id:
        query = query.filter(IntegrationAccount.team_id == team_id)
    if platform:
        query = query.filter(IntegrationAccount.platform == platform)

    integrations = query.offset(skip).limit(limit).all()
    return integrations

@router.get("/{integration_id}", response_model=IntegrationSchema)
def get_integration(
    integration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific integration account by ID"""
    integration = db.query(IntegrationAccount).filter(IntegrationAccount.id == integration_id).first()
    if not integration:
        raise HTTPException(status_code=404, detail="Integration account not found")
    return integration

@router.put("/{integration_id}", response_model=IntegrationSchema)
def update_integration(
    integration_id: int,
    integration_update: IntegrationAccountUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an integration account"""
    db_integration = db.query(IntegrationAccount).filter(IntegrationAccount.id == integration_id).first()
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration account not found")

    update_data = integration_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_integration, field, value)

    db.commit()
    db.refresh(db_integration)
    return db_integration

@router.delete("/{integration_id}")
def delete_integration(
    integration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an integration account"""
    db_integration = db.query(IntegrationAccount).filter(IntegrationAccount.id == integration_id).first()
    if not db_integration:
        raise HTTPException(status_code=404, detail="Integration account not found")

    db.delete(db_integration)
    db.commit()
    return {"message": "Integration account deleted successfully"}
