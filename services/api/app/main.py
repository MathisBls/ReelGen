from fastapi import FastAPI
from sqlalchemy import inspect

from app.core.db import Base, engine
from app.routers import media, auth, teams, users, transcripts, clips, renditions, templates, posts, integrations, metrics
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Reelgen API", version="0.1.0")

@app.on_event("startup")
def create_tables():
    # simple pour MVP: crée les tables si elles n'existent pas
    Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(teams.router, prefix="/teams", tags=["teams"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(media.router, prefix="/media", tags=["media"])
app.include_router(transcripts.router, prefix="/transcripts", tags=["transcripts"])
app.include_router(clips.router, prefix="/clips", tags=["clips"])
app.include_router(renditions.router, prefix="/renditions", tags=["renditions"])
app.include_router(templates.router, prefix="/templates", tags=["templates"])
app.include_router(posts.router, prefix="/posts", tags=["posts"])
app.include_router(integrations.router, prefix="/integrations", tags=["integrations"])
app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
