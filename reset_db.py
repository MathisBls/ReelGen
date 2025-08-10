#!/usr/bin/env python3
"""
Script pour réinitialiser la base de données avec tous les modèles
"""
import os
import sys
from pathlib import Path

# Ajouter le répertoire services/api au path pour les imports
api_dir = Path(__file__).parent / "services" / "api"
sys.path.insert(0, str(api_dir))

# Définir les variables d'environnement pour la base de données
os.environ["DATABASE_URL"] = "postgresql+psycopg://reelgen:reelgen@localhost:5432/reelgen"
os.environ["REDIS_URL"] = "redis://localhost:6379/0"
os.environ["S3_ENDPOINT"] = "http://localhost:9000"
os.environ["S3_BUCKET"] = "reelgen"
os.environ["S3_ACCESS_KEY"] = "minio"
os.environ["S3_SECRET_KEY"] = "minio123"
os.environ["JWT_SECRET"] = "dev-secret-key"

try:
    from sqlalchemy import text
    from app.core.db import engine, Base
    from app.models import *  # Import tous les modèles
except ImportError as e:
    print(f"❌ Erreur d'import: {e}")
    print("💡 Assurez-vous que les dépendances sont installées:")
    print("   cd services/api && pip install -r requirements.txt")
    sys.exit(1)

def reset_database():
    """Réinitialise complètement la base de données"""
    print("🗑️  Suppression de toutes les tables existantes...")

    try:
        # Supprimer toutes les tables
        with engine.connect() as conn:
            conn.execute(text("DROP SCHEMA public CASCADE"))
            conn.execute(text("CREATE SCHEMA public"))
            conn.execute(text("GRANT ALL ON SCHEMA public TO reelgen"))
            conn.execute(text("GRANT ALL ON SCHEMA public TO public"))
            conn.commit()

        print("✅ Tables supprimées")

        print("🏗️  Création de toutes les nouvelles tables...")

        # Créer toutes les tables
        Base.metadata.create_all(bind=engine)

        print("✅ Tables créées avec succès!")
        print("🎉 Base de données réinitialisée!")

    except Exception as e:
        print(f"❌ Erreur: {e}")
        print("💡 Assurez-vous que PostgreSQL est démarré:")
        print("   make up")
        sys.exit(1)

if __name__ == "__main__":
    reset_database()
