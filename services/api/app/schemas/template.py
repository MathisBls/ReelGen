from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class TemplateBase(BaseModel):
    name: str
    config_json: Dict[str, Any]
    is_default: bool = False

class TemplateCreate(TemplateBase):
    team_id: Optional[int] = None

class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    config_json: Optional[Dict[str, Any]] = None
    is_default: Optional[bool] = None

class Template(TemplateBase):
    id: int
    team_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
