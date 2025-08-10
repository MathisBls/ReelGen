from datetime import datetime
from pydantic import BaseModel
from typing import Any, List, Dict

class TranscriptOut(BaseModel):
    id: int
    media_id: int
    language: str
    words_json: Dict[str, Any] | List[Dict[str, Any]]
    created_at: datetime
