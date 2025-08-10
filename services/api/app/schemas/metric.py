from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MetricBase(BaseModel):
    post_id: int
    ts: datetime
    views: int = 0
    likes: int = 0
    comments: int = 0
    watch_time_s: float = 0.0
    ctr: float = 0.0

class MetricCreate(MetricBase):
    pass

class MetricUpdate(BaseModel):
    views: Optional[int] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    watch_time_s: Optional[float] = None
    ctr: Optional[float] = None

class Metric(MetricBase):
    id: int

    class Config:
        from_attributes = True
