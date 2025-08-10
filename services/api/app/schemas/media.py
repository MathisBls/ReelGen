from pydantic import BaseModel

class UploadMediaResponse(BaseModel):
    id: int
    key: str
    filename: str
    content_type: str


class CreateMediaRequest(BaseModel):
    filename: str
    content_type: str = "video/mp4"
    team_id: int | None = None

class CreateMediaResponse(BaseModel):
    id: int
    key: str
    upload_url: str
    content_type: str
