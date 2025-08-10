# 🛠️ Guide de Développement - Reelgen

Ce guide détaille les aspects techniques du développement pour la plateforme Reelgen.

## 📋 Table des Matières

- [Architecture Technique](#architecture-technique)
- [Base de Données](#base-de-données)
- [API FastAPI](#api-fastapi)
- [Worker](#worker)
- [Frontend](#frontend)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture Technique

### Vue d'Ensemble

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API FastAPI   │    │   Worker        │
│   (Next.js)     │◄──►│   (Python)      │◄──►│   (Python)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   PostgreSQL    │    │   Redis Queue   │
                       │   (Database)    │    │   (Jobs)        │
                       └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   MinIO/S3      │    │   FFmpeg        │
                       │   (Storage)     │    │   (Video Proc)  │
                       └─────────────────┘    └─────────────────┘
```

### Flux de Données

1. **Upload** : Frontend → API → MinIO
2. **Traitement** : API → Redis Queue → Worker → FFmpeg
3. **Rendu** : Worker → MinIO → API → Frontend
4. **Publication** : Frontend → API → Plateformes sociales

## 🗄️ Base de Données

### Modèles SQLAlchemy

#### Syntaxe Mixte

Le projet utilise une syntaxe mixte SQLAlchemy :
- **Mapped** pour les modèles existants (`User`, `Team`, `Media`)
- **Column** pour les nouveaux modèles

```python
# Syntaxe Mapped (existante)
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)

# Syntaxe Column (nouveaux modèles)
class Clip(Base):
    __tablename__ = "clips"
    id = Column(Integer, primary_key=True, index=True)
    media_id = Column(Integer, ForeignKey("media.id"), nullable=False)
```

### Relations

#### Relations Principales

```python
# User ↔ Media (One-to-Many)
class User(Base):
    media: Mapped[list["Media"]] = relationship("Media", back_populates="user")

class Media(Base):
    user = relationship("User", back_populates="media")

# Media ↔ Clip (One-to-Many)
class Media(Base):
    clips = relationship("Clip", back_populates="media")

class Clip(Base):
    media = relationship("Media", back_populates="clips")

# Clip ↔ ClipRendition (One-to-Many)
class Clip(Base):
    renditions = relationship("ClipRendition", back_populates="clip")

class ClipRendition(Base):
    clip = relationship("Clip", back_populates="renditions")
```

#### Relations Many-to-Many

```python
# Media ↔ Tag (Many-to-Many via MediaTag)
class Media(Base):
    media_tags = relationship("MediaTag", back_populates="media")

class Tag(Base):
    media_tags = relationship("MediaTag", back_populates="tag")

class MediaTag(Base):
    media = relationship("Media", back_populates="media_tags")
    tag = relationship("Tag", back_populates="media_tags")
```

### Migrations

#### Réinitialisation Complète

```bash
# Script de réinitialisation
python reset_db.py
```

#### Migrations Incrémentales (Futur)

```bash
# Installer Alembic
pip install alembic

# Initialiser
alembic init alembic

# Créer une migration
alembic revision --autogenerate -m "Add new table"

# Appliquer
alembic upgrade head
```

## 🔌 API FastAPI

### Structure des Routers

```
app/routers/
├── auth.py          # Authentification JWT
├── users.py         # Gestion utilisateurs
├── teams.py         # Gestion équipes
├── media.py         # Upload et gestion médias
├── clips.py         # Gestion clips
├── renditions.py    # Gestion rendus
├── templates.py     # Gestion templates
├── posts.py         # Gestion publications
├── integrations.py  # Gestion intégrations
└── metrics.py       # Gestion métriques
```

### Authentification

#### JWT Token

```python
# Génération de token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=ALGO)
    return encoded_jwt

# Validation de token
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload.get("sub")
    user = db.get(User, int(user_id))
    return user
```

#### Protection des Routes

```python
@router.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user.email}"}
```

### Validation des Données

#### Schémas Pydantic

```python
class ClipCreate(BaseModel):
    media_id: int
    t_start: float
    t_end: float
    score: Optional[float] = None
    title_suggested: Optional[str] = None
    desc_suggested: Optional[str] = None
    hashtags_json: Optional[dict] = None
    status: ClipStatus = ClipStatus.CANDIDATE

class ClipUpdate(BaseModel):
    t_start: Optional[float] = None
    t_end: Optional[float] = None
    score: Optional[float] = None
    title_suggested: Optional[str] = None
    desc_suggested: Optional[str] = None
    hashtags_json: Optional[dict] = None
    status: Optional[ClipStatus] = None
```

### Gestion d'Erreurs

```python
from fastapi import HTTPException

@router.get("/{clip_id}")
def get_clip(clip_id: int, db: Session = Depends(get_db)):
    clip = db.query(Clip).filter(Clip.id == clip_id).first()
    if not clip:
        raise HTTPException(status_code=404, detail="Clip not found")
    return clip
```

## 🔄 Worker

### Architecture du Worker

```python
# services/worker/worker/main.py
from rq import Queue
from redis import Redis

redis_conn = Redis.from_url(settings.redis_url)
queue = Queue('reelgen', connection=redis_conn)

# Jobs disponibles
@queue.job
def render_rendition(rendition_id: int):
    # Logique de rendu vidéo
    pass

@queue.job
def transcode_video(media_id: int):
    # Logique de transcodage
    pass
```

### Types de Jobs

1. **render_rendition** : Rendu de clips avec FFmpeg
2. **transcode_video** : Transcodage de vidéos sources
3. **generate_thumbnails** : Génération de miniatures
4. **extract_audio** : Extraction audio pour STT

### Configuration FFmpeg

```python
# packages/ffmpeg-presets/presets.py
RENDITION_PRESETS = {
    "9:16": {
        "width": 1080,
        "height": 1920,
        "fps": 30,
        "codec": "libx264",
        "crf": 23
    },
    "1:1": {
        "width": 1080,
        "height": 1080,
        "fps": 30,
        "codec": "libx264",
        "crf": 23
    }
}
```

## 🎨 Frontend

### Architecture Next.js 14

```
apps/web/
├── app/                    # App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Dashboard utilisateur
│   └── api/               # API routes (si nécessaire)
├── components/            # Composants réutilisables
├── lib/                   # Utilitaires et configurations
├── hooks/                 # Custom hooks React
└── types/                 # Types TypeScript
```

### Authentification Frontend

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    setToken(data.access_token);
    setUser(data.user);
  };

  return { user, token, login, logout };
}
```

### Upload de Fichiers

```typescript
// components/VideoUpload.tsx
export function VideoUpload() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/media/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const media = await response.json();
    setUploading(false);
    return media;
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      {uploading && <div>Uploading...</div>}
    </div>
  );
}
```

## 🧪 Tests

### Tests API

```python
# tests/test_clips.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_clip():
    response = client.post(
        "/clips/",
        json={
            "media_id": 1,
            "t_start": 0.0,
            "t_end": 10.0,
            "status": "candidate"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["media_id"] == 1
```

### Tests Frontend

```typescript
// __tests__/VideoUpload.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoUpload } from '../components/VideoUpload';

test('uploads video file', async () => {
  render(<VideoUpload />);

  const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' });
  const input = screen.getByRole('file');

  fireEvent.change(input, { target: { files: [file] } });

  expect(screen.getByText('Uploading...')).toBeInTheDocument();
});
```

### Tests d'Intégration

```python
# tests/integration/test_workflow.py
def test_complete_workflow():
    # 1. Upload vidéo
    media = upload_video("test.mp4")

    # 2. Créer clip
    clip = create_clip(media.id, 0, 10)

    # 3. Créer rendu
    rendition = create_rendition(clip.id, "9:16")

    # 4. Vérifier que le job est en queue
    assert job_in_queue("render_rendition", rendition.id)
```

## 🚀 Déploiement

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: '3.9'
services:
  api:
    build: ./services/api
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      S3_ENDPOINT: ${S3_ENDPOINT}
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis

  worker:
    build: ./services/worker
    environment:
      REDIS_URL: ${REDIS_URL}
    depends_on:
      - redis

  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    depends_on:
      - api
```

### Variables d'Environnement Production

```env
# Production
DATABASE_URL=postgresql://user:pass@host:5432/reelgen
REDIS_URL=redis://host:6379/0
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=reelgen-prod
S3_ACCESS_KEY=AKIA...
S3_SECRET_KEY=...
JWT_SECRET=production-secret-key-256-bits
```

### Monitoring

#### Métriques Prometheus

```python
# services/api/app/core/metrics.py
from prometheus_client import Counter, Histogram

REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time

    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    REQUEST_DURATION.observe(duration)

    return response
```

#### Logs Structurés

```python
import structlog

logger = structlog.get_logger()

def process_video(media_id: int):
    logger.info("Processing video", media_id=media_id, status="started")
    try:
        # Traitement
        logger.info("Video processed successfully", media_id=media_id, status="completed")
    except Exception as e:
        logger.error("Video processing failed", media_id=media_id, error=str(e))
        raise
```

## 🔧 Troubleshooting

### Problèmes Courants

#### 1. Erreur de Base de Données

```bash
# Vérifier la connexion
psql -h localhost -U reelgen -d reelgen

# Réinitialiser la base
python reset_db.py
```

#### 2. Erreur Redis

```bash
# Vérifier Redis
redis-cli ping

# Vider les queues
redis-cli FLUSHALL
```

#### 3. Erreur MinIO

```bash
# Vérifier MinIO
curl http://localhost:9000/minio/health/live

# Créer le bucket
mc mb local/reelgen
```

#### 4. Erreur FFmpeg

```bash
# Vérifier FFmpeg
ffmpeg -version

# Tester un rendu simple
ffmpeg -i input.mp4 -c:v libx264 -preset fast output.mp4
```

### Logs de Débogage

```python
# Activer les logs détaillés
import logging
logging.basicConfig(level=logging.DEBUG)

# Logs SQLAlchemy
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
```

### Performance

#### Optimisations Base de Données

```python
# Index sur les colonnes fréquemment utilisées
class Media(Base):
    __table_args__ = (
        Index('idx_media_user_status', 'user_id', 'status'),
        Index('idx_media_created_at', 'created_at'),
    )
```

#### Cache Redis

```python
# Cache des requêtes fréquentes
def get_user_media(user_id: int, db: Session):
    cache_key = f"user_media:{user_id}"
    cached = redis.get(cache_key)

    if cached:
        return json.loads(cached)

    media = db.query(Media).filter(Media.user_id == user_id).all()
    redis.setex(cache_key, 300, json.dumps([m.dict() for m in media]))

    return media
```

---

Ce guide couvre les aspects techniques essentiels pour le développement de Reelgen. Pour plus de détails, consultez la documentation spécifique de chaque composant.
