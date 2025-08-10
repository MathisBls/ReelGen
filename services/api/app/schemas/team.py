from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class TeamCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)

class TeamOut(BaseModel):
    id: int
    name: str
    created_at: datetime
    my_role: str

class MemberAdd(BaseModel):
    email: EmailStr
    role: str = "editor"  # owner|editor|publisher

class MemberOut(BaseModel):
    user_id: int
    email: EmailStr
    role: str
    joined_at: datetime
