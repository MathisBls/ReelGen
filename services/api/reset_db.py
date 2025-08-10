#!/usr/bin/env python3
"""
Script pour réinitialiser la base de données avec tous les modèles
"""
import os
import sys
from pathlib import Path

# Ajouter le répertoire parent au path pour les imports
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import text
from app.core.db import engine, Base
from app.models import *  # Import tous les modèles

def reset_database():
    """Réinitialise complètement la base de données"""
    print("🗑️  Suppression de toutes les tables existantes...")

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

if __name__ == "__main__":
    reset_database()
