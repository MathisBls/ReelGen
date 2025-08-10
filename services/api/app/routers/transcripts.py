from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.media import Media
from app.models.transcript import Transcript
from app.models.team_member import TeamMember
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/by-media/{media_id}")
def get_transcript_by_media(media_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    m = db.get(Media, media_id)
    if not m: raise HTTPException(404, detail="Media not found")
    if m.user_id != user.id:
        if not (m.team_id and db.query(TeamMember).filter_by(team_id=m.team_id, user_id=user.id).first()):
            raise HTTPException(403, detail="Forbidden")
    tr = db.query(Transcript).filter_by(media_id=media_id).order_by(Transcript.id.desc()).first()
    if not tr: raise HTTPException(404, detail="Transcript not found")
    return {
        "id": tr.id,
        "media_id": tr.media_id,
        "language": tr.language,
        "words_json": tr.words_json,
        "created_at": tr.created_at.isoformat(),
    }
