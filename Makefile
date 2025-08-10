# --------- Variables ---------
API_DIR=services/api
WORKER_DIR=services/worker
COMPOSE=infra/docker-compose.yml

# --------- Infra ---------
up: ## Démarre DB + Redis + MinIO
	docker compose -f $(COMPOSE) up -d db redis minio

down: ## Stoppe l'infra
	docker compose -f $(COMPOSE) down

logs: ## Logs infra
	docker compose -f $(COMPOSE) logs -f

reset-db: ## Réinitialise la base de données
	cd $(API_DIR) && poetry run python reset_db.py

# --------- Dépendances ---------
install-api: ## Installe deps API (Poetry)
	cd $(API_DIR) && poetry install

install-worker: ## Installe deps Worker (Poetry)
	cd $(WORKER_DIR) && poetry install

# --------- Dev runtime ---------
api: ## Lance FastAPI en dev (http://localhost:8000)
	cd $(API_DIR) && poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

worker: ## Lance le worker RQ
	cd $(WORKER_DIR) && poetry run rq worker --with-scheduler reelgen

# --------- Qualité / Tests ---------
test-api:
	cd $(API_DIR) && poetry run pytest -q

fmt:
	cd $(API_DIR) && poetry run black . && poetry run isort .
	cd $(WORKER_DIR) && poetry run black . && poetry run isort .

.PHONY: up down logs install-api install-worker api worker test-api fmt
