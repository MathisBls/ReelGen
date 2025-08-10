from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class Platform(str, Enum):
    YOUTUBE = "youtube"
    TIKTOK = "tiktok"
    INSTAGRAM = "instagram"

class IntegrationAccountBase(BaseModel):
    team_id: int
    platform: Platform
    account_name: str
    scopes: Optional[str] = None

class IntegrationAccountCreate(IntegrationAccountBase):
    token_encrypted: str
    refresh_token_encrypted: Optional[str] = None
    expires_at: Optional[datetime] = None

class IntegrationAccountUpdate(BaseModel):
    account_name: Optional[str] = None
    token_encrypted: Optional[str] = None
    refresh_token_encrypted: Optional[str] = None
    expires_at: Optional[datetime] = None
    scopes: Optional[str] = None

class IntegrationAccount(IntegrationAccountBase):
    id: int
    expires_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
