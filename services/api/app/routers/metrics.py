from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.models.metric import Metric
from app.schemas.metric import MetricCreate, MetricUpdate, Metric as MetricSchema
from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter(tags=["metrics"])

@router.post("/", response_model=MetricSchema)
def create_metric(
    metric: MetricCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new metric"""
    db_metric = Metric(**metric.model_dump())
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric

@router.get("/", response_model=List[MetricSchema])
def get_metrics(
    post_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get metrics with optional filtering"""
    query = db.query(Metric)

    if post_id:
        query = query.filter(Metric.post_id == post_id)

    metrics = query.offset(skip).limit(limit).all()
    return metrics

@router.get("/{metric_id}", response_model=MetricSchema)
def get_metric(
    metric_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific metric by ID"""
    metric = db.query(Metric).filter(Metric.id == metric_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    return metric

@router.put("/{metric_id}", response_model=MetricSchema)
def update_metric(
    metric_id: int,
    metric_update: MetricUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a metric"""
    db_metric = db.query(Metric).filter(Metric.id == metric_id).first()
    if not db_metric:
        raise HTTPException(status_code=404, detail="Metric not found")

    update_data = metric_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_metric, field, value)

    db.commit()
    db.refresh(db_metric)
    return db_metric

@router.delete("/{metric_id}")
def delete_metric(
    metric_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a metric"""
    db_metric = db.query(Metric).filter(Metric.id == metric_id).first()
    if not db_metric:
        raise HTTPException(status_code=404, detail="Metric not found")

    db.delete(db_metric)
    db.commit()
    return {"message": "Metric deleted successfully"}
