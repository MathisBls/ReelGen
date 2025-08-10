from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from jose import jwt
from app.core.config import settings

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGO = "HS256"

def hash_password(p: str) -> str:
    return pwd.hash(p)

def verify_password(p: str, h: str) -> bool:
    return pwd.verify(p, h)

def create_access_token(sub: str, expires_minutes: int = 60*24) -> str:
    exp = datetime.utcnow() + timedelta(minutes=expires_minutes)
    payload = {"sub": sub, "exp": exp}
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGO)

def decode_token(token: str) -> Optional[dict]:
    from jose import JWTError
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[ALGO])
    except JWTError:
        return None
