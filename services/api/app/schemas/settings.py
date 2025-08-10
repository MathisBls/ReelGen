from pydantic import BaseModel
from typing import Any, Dict

class UserSettingsOut(BaseModel):
    locale: str
    timezone: str
    theme: str
    onboarding_flags_json: Dict[str, Any] = {}

class UserSettingsUpdate(BaseModel):
    locale: str | None = None
    timezone: str | None = None
    theme: str | None = None
    onboarding_flags_json: Dict[str, Any] | None = None
