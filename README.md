# 🎬 Reelgen - Plateforme de Génération de Reels Automatisée

Reelgen est une plateforme complète pour la génération automatique de reels et de contenu vidéo court. Le projet utilise une architecture microservices avec FastAPI, PostgreSQL, Redis, et MinIO pour le stockage S3-compatible.

## 📋 Table des Matières

- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Documentation](#api-documentation)
- [Base de Données](#base-de-données)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Contribuer](#contribuer)

## 🏗️ Architecture

Le projet suit une architecture microservices avec les composants suivants :

```
Reelgen/
├── apps/
│   └── web/                 # Frontend Next.js
├── services/
│   ├── api/                 # API FastAPI
│   └── worker/              # Worker de traitement vidéo
├── packages/
│   ├── ffmpeg-presets/      # Presets FFmpeg
│   └── shared/              # Code partagé
└── infra/
    └── docker-compose.yml   # Infrastructure Docker
```

### Composants Principaux

- **API FastAPI** : Backend principal avec authentification JWT
- **Worker** : Traitement asynchrone des vidéos et rendus
- **Frontend Next.js** : Interface utilisateur moderne
- **PostgreSQL** : Base de données relationnelle
- **Redis** : Cache et file d'attente
- **MinIO** : Stockage S3-compatible

## 🛠️ Technologies

### Backend
- **FastAPI** : Framework web moderne et rapide
- **SQLAlchemy** : ORM pour PostgreSQL
- **Pydantic** : Validation de données
- **JWT** : Authentification sécurisée
- **Redis Queue** : Traitement asynchrone

### Frontend
- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire

### Infrastructure
- **Docker Compose** : Orchestration des services
- **PostgreSQL 16** : Base de données
- **Redis 7** : Cache et file d'attente
- **MinIO** : Stockage objet S3-compatible

## 🚀 Installation

### Prérequis

- Docker et Docker Compose
- Python 3.13+
- Node.js 18+
- Git

### Installation Rapide

1. **Cloner le repository**
```bash
git clone <repository-url>
cd Reelgen
```

2. **Démarrer l'infrastructure**
```bash
make up
```

3. **Réinitialiser la base de données**
```bash
python reset_db.py
```

4. **Installer les dépendances**
```bash
# API
cd services/api
pip install fastapi uvicorn sqlalchemy psycopg[binary] pydantic-settings boto3

# Frontend
cd ../../apps/web
npm install
```

5. **Démarrer les services**
```bash
# API (dans un terminal)
cd services/api
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (dans un autre terminal)
cd apps/web
npm run dev
```

## ⚙️ Configuration

### Variables d'Environnement

Créer un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_URL=postgresql+psycopg://reelgen:reelgen@localhost:5432/reelgen

# Redis
REDIS_URL=redis://localhost:6379/0

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=reelgen
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
AWS_REGION=us-east-1

# JWT
JWT_SECRET=your-secret-key-here
```

### Services Disponibles

- **API** : http://localhost:8000
- **Frontend** : http://localhost:3000
- **MinIO Console** : http://localhost:9001
- **PostgreSQL** : localhost:5432
- **Redis** : localhost:6379

## 📖 Utilisation

### Commandes Makefile

```bash
# Infrastructure
make up          # Démarrer DB + Redis + MinIO
make down        # Stoppe l'infra
make logs        # Logs infra

# Base de données
make reset-db    # Réinitialise la base de données

# Développement
make api         # Lance FastAPI en dev
make worker      # Lance le worker RQ

# Tests et qualité
make test-api    # Tests API
make fmt         # Formatage du code
```

### Workflow Typique

1. **Upload d'une vidéo** via l'API `/media/upload`
2. **Génération automatique de clips** via `/clips/`
3. **Création de rendus** via `/renditions/`
4. **Publication** via `/posts/`

## 📚 API Documentation

### Authentification

L'API utilise l'authentification JWT Bearer Token.

```bash
# Inscription
POST /auth/signup
{
  "email": "user@example.com",
  "password": "password123"
}

# Connexion
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Endpoints Principaux

#### 🔐 Authentification
- `POST /auth/signup` - Inscription utilisateur
- `POST /auth/login` - Connexion utilisateur

#### 👥 Utilisateurs et Équipes
- `GET /users/me` - Profil utilisateur actuel
- `GET /teams/` - Liste des équipes
- `POST /teams/` - Créer une équipe
- `GET /teams/{team_id}/members` - Membres d'équipe

#### 📹 Médias
- `POST /media/upload` - Upload de vidéo
- `GET /media/` - Liste des médias
- `GET /media/{media_id}` - Détails d'un média
- `DELETE /media/{media_id}` - Supprimer un média

#### 🎬 Clips
- `POST /clips/` - Créer un clip
- `GET /clips/` - Liste des clips
- `GET /clips/{clip_id}` - Détails d'un clip
- `PUT /clips/{clip_id}` - Modifier un clip
- `DELETE /clips/{clip_id}` - Supprimer un clip

#### 🎨 Rendu
- `POST /renditions/` - Créer un rendu
- `GET /renditions/` - Liste des rendus
- `GET /renditions/{rendition_id}` - Détails d'un rendu
- `PUT /renditions/{rendition_id}` - Modifier un rendu
- `DELETE /renditions/{rendition_id}` - Supprimer un rendu

#### 📝 Templates
- `POST /templates/` - Créer un template
- `GET /templates/` - Liste des templates
- `GET /templates/{template_id}` - Détails d'un template
- `PUT /templates/{template_id}` - Modifier un template
- `DELETE /templates/{template_id}` - Supprimer un template

#### 📱 Publications
- `POST /posts/` - Créer une publication
- `GET /posts/` - Liste des publications
- `GET /posts/{post_id}` - Détails d'une publication
- `PUT /posts/{post_id}` - Modifier une publication
- `DELETE /posts/{post_id}` - Supprimer une publication

#### 🔗 Intégrations
- `POST /integrations/` - Créer une intégration
- `GET /integrations/` - Liste des intégrations
- `GET /integrations/{integration_id}` - Détails d'une intégration
- `PUT /integrations/{integration_id}` - Modifier une intégration
- `DELETE /integrations/{integration_id}` - Supprimer une intégration

#### 📊 Métriques
- `POST /metrics/` - Créer une métrique
- `GET /metrics/` - Liste des métriques
- `GET /metrics/{metric_id}` - Détails d'une métrique
- `PUT /metrics/{metric_id}` - Modifier une métrique
- `DELETE /metrics/{metric_id}` - Supprimer une métrique

### Documentation Interactive

Accédez à la documentation interactive Swagger UI :
- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

## 🗄️ Base de Données

### Schéma Principal

Le projet utilise 20 tables organisées en deux catégories :

#### Core (MVP - 12 tables)
1. **users** - Comptes utilisateurs
2. **teams** - Organisations/agences
3. **team_members** - Appartenance et rôles
4. **user_settings** - Préférences utilisateur
5. **media** - Vidéos sources
6. **transcripts** - STT + timecodes
7. **clips** - Segments candidats
8. **clip_renditions** - Exports (9:16, 1:1...)
9. **templates** - Styles de sous-titres
10. **integration_accounts** - Connexions plateformes
11. **posts** - Publications et planning
12. **metrics** - Performances des posts

#### Avancé (v1 - 8 tables)
13. **favorites** - Favoris par utilisateur
14. **tags** - Tags libres
15. **media_tags** - Association média-tags
16. **collections** - Projets/campagnes
17. **collection_items** - Éléments de collection
18. **webhooks_in** - Événements entrants
19. **jobs** - Journal des jobs worker
20. **billing** - Facturation (Stripe)

### Relations Principales

```mermaid
erDiagram
    users ||--o{ media : "possède"
    teams ||--o{ media : "possède"
    media ||--o{ clips : "contient"
    clips ||--o{ clip_renditions : "génère"
    clip_renditions ||--o{ posts : "publie"
    posts ||--o{ metrics : "mesure"
    teams ||--o{ integration_accounts : "connecte"
    users ||--o{ favorites : "favorise"
    media ||--o{ media_tags : "tagge"
    tags ||--o{ media_tags : "associe"
```

## 🛠️ Développement

### Structure du Code

```
services/api/app/
├── core/           # Configuration et utilitaires
│   ├── config.py   # Variables d'environnement
│   ├── db.py       # Configuration base de données
│   ├── security.py # Utilitaires de sécurité
│   └── s3.py       # Client S3/MinIO
├── models/         # Modèles SQLAlchemy
├── schemas/        # Schémas Pydantic
├── routers/        # Routes FastAPI
└── main.py         # Point d'entrée
```

### Conventions de Code

- **Python** : Black + isort pour le formatage
- **TypeScript** : ESLint + Prettier
- **Commits** : Conventional Commits
- **Branches** : Git Flow

### Tests

```bash
# Tests API
cd services/api
pytest

# Tests Frontend
cd apps/web
npm test
```

### Linting et Formatage

```bash
# Python
cd services/api
black .
isort .
mypy .

# TypeScript
cd apps/web
npm run lint
npm run format
```

## 🚀 Déploiement

### Production

1. **Variables d'environnement**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379/0
S3_ENDPOINT=https://s3.amazonaws.com
JWT_SECRET=production-secret-key
```

2. **Docker Compose Production**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Migrations de base de données**
```bash
# Créer les migrations
alembic revision --autogenerate -m "Initial migration"

# Appliquer les migrations
alembic upgrade head
```

### Monitoring

- **Logs** : ELK Stack ou CloudWatch
- **Métriques** : Prometheus + Grafana
- **Tracing** : Jaeger ou AWS X-Ray
- **Alertes** : PagerDuty ou Slack

## 🤝 Contribuer

### Workflow de Contribution

1. **Fork** le repository
2. **Créer** une branche feature
3. **Développer** avec tests
4. **Tester** localement
5. **Créer** une Pull Request

### Standards de Code

- Tests unitaires obligatoires
- Documentation des nouvelles APIs
- Respect des conventions de nommage
- Code review obligatoire

### Communication

- **Issues** : GitHub Issues
- **Discussions** : GitHub Discussions
- **Documentation** : Wiki GitHub

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

- **Documentation** : [Wiki du projet](wiki-url)
- **Issues** : [GitHub Issues](issues-url)
- **Discussions** : [GitHub Discussions](discussions-url)
- **Email** : support@reelgen.com

## 🙏 Remerciements

- **FastAPI** pour le framework web
- **SQLAlchemy** pour l'ORM
- **Next.js** pour le frontend
- **Docker** pour la containerisation
- **MinIO** pour le stockage S3-compatible

---

**Reelgen** - Transformez vos vidéos en reels automatiquement 🎬✨
