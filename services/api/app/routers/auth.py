from fastapi import APIRouter, Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.security import hash_password, verify_password, create_access_token, decode_token
from app.models.user import User
from app.schemas.auth import SignUp, Login, TokenOut

router = APIRouter()

bearer_scheme = HTTPBearer(auto_error=False)

@router.post("/signup", response_model=TokenOut)
def signup(body: SignUp, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    u = User(email=str(body.email), password_hash=hash_password(body.password))
    db.add(u); db.commit(); db.refresh(u)
    token = create_access_token(sub=str(u.id))
    return TokenOut(access_token=token)

@router.post("/login", response_model=TokenOut)
def login(body: Login, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == body.email).first()
    if not u or not verify_password(body.password, u.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(sub=str(u.id))
    return TokenOut(access_token=token)

def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Missing token")
    data = decode_token(credentials.credentials)
    if not data:
        raise HTTPException(status_code=401, detail="Invalid token")
    u = db.get(User, int(data["sub"]))
    if not u:
        raise HTTPException(status_code=401, detail="User not found")
    return u
