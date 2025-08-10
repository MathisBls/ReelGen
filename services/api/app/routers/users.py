from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.user import User
from app.models.user_settings import UserSettings
from app.routers.auth import get_current_user
from app.schemas.settings import UserSettingsOut, UserSettingsUpdate

router = APIRouter()

@router.get("/me/settings", response_model=UserSettingsOut)
def get_my_settings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    s = db.get(UserSettings, user.id)
    if not s:
        s = UserSettings(user_id=user.id)  # valeurs par défaut
        db.add(s); db.commit(); db.refresh(s)
    return UserSettingsOut(
        locale=s.locale, timezone=s.timezone, theme=s.theme, onboarding_flags_json=s.onboarding_flags_json
    )

@router.put("/me/settings", response_model=UserSettingsOut)
def update_my_settings(body: UserSettingsUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    s = db.get(UserSettings, user.id)
    if not s:
        s = UserSettings(user_id=user.id)
        db.add(s)
    if body.locale is not None: s.locale = body.locale
    if body.timezone is not None: s.timezone = body.timezone
    if body.theme is not None: s.theme = body.theme
    if body.onboarding_flags_json is not None: s.onboarding_flags_json = body.onboarding_flags_json
    db.commit(); db.refresh(s)
    return UserSettingsOut(
        locale=s.locale, timezone=s.timezone, theme=s.theme, onboarding_flags_json=s.onboarding_flags_json
    )
