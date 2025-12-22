PYTHON ?= python3.13
UV ?= uv
VENV ?= .venv
PYTHON_BIN ?= $(VENV)/bin/python
APP_MODULE ?= app.main:app
HOST ?= 0.0.0.0
PORT ?= 8023
DB_COMPOSE_FILE ?= ../database/docker-compose.yml
POSTGRES_PORT ?= 5433
POSTGRES_USER ?= wep_user
POSTGRES_PASSWORD ?= wep_password
POSTGRES_DB ?= wep_education
OPENAPI_OUT ?= ../frontend/src/shared/api/openapi.json

.PHONY: install sync lint format type test check run dev clean migrate seed-dev db-up db-down db-reset db-wait bootstrap openapi-export redis-up redis-down redis-logs

install:
	$(UV) venv --python $(PYTHON)
	$(UV) pip install -r requirements.txt

sync:
	$(UV) pip install -r requirements.txt

lint:
	$(PYTHON_BIN) -m ruff check app tests

format:
	$(PYTHON_BIN) -m ruff format app tests

type:
	$(PYTHON_BIN) -m mypy --config-file mypy.ini app

test:
	$(PYTHON_BIN) -m pytest

check: lint type test

run:
	$(PYTHON_BIN) -m app.scripts.run_server --host $(HOST) --port $(PORT)

dev:
	$(PYTHON_BIN) -m app.scripts.run_server --reload --host $(HOST) --port $(PORT)

migrate:
	$(PYTHON_BIN) -m alembic upgrade head

seed-dev:
	$(PYTHON_BIN) -m app.scripts.seed_dev_data

openapi-export:
	$(PYTHON_BIN) -m app.scripts.export_openapi --out "$(OPENAPI_OUT)"

db-up:
	POSTGRES_PORT=$(POSTGRES_PORT) POSTGRES_USER=$(POSTGRES_USER) POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) POSTGRES_DB=$(POSTGRES_DB) docker-compose -f "$(DB_COMPOSE_FILE)" up -d postgres

db-down:
	POSTGRES_PORT=$(POSTGRES_PORT) POSTGRES_USER=$(POSTGRES_USER) POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) POSTGRES_DB=$(POSTGRES_DB) docker-compose -f "$(DB_COMPOSE_FILE)" down

db-reset:
	POSTGRES_PORT=$(POSTGRES_PORT) POSTGRES_USER=$(POSTGRES_USER) POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) POSTGRES_DB=$(POSTGRES_DB) docker-compose -f "$(DB_COMPOSE_FILE)" down -v
	POSTGRES_PORT=$(POSTGRES_PORT) POSTGRES_USER=$(POSTGRES_USER) POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) POSTGRES_DB=$(POSTGRES_DB) docker-compose -f "$(DB_COMPOSE_FILE)" up -d postgres

db-wait:
	@echo "Waiting for PostgreSQL on localhost:$(POSTGRES_PORT)..."
	@i=0; \
	until POSTGRES_PORT=$(POSTGRES_PORT) POSTGRES_USER=$(POSTGRES_USER) POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) POSTGRES_DB=$(POSTGRES_DB) docker-compose -f "$(DB_COMPOSE_FILE)" exec -T postgres pg_isready -U $(POSTGRES_USER) -d $(POSTGRES_DB) >/dev/null 2>&1; do \
	  i=$$((i+1)); \
	  if [ $$i -ge 30 ]; then echo "PostgreSQL is not ready after 30s"; exit 1; fi; \
	  sleep 1; \
	done; \
	echo "PostgreSQL is ready"

bootstrap: db-reset db-wait migrate seed-dev

# Redis (local, outside docker-compose)
REDIS_CONTAINER ?= wep_redis_local
REDIS_PORT ?= 6379
REDIS_IMAGE ?= redis:7-alpine

redis-up:
	@echo "Starting Redis on localhost:$(REDIS_PORT) (container: $(REDIS_CONTAINER))..."
	@docker rm -f "$(REDIS_CONTAINER)" >/dev/null 2>&1 || true
	@docker run -d --restart unless-stopped --name "$(REDIS_CONTAINER)" -p "$(REDIS_PORT):6379" "$(REDIS_IMAGE)" >/dev/null
	@echo "Redis is up"

redis-down:
	@echo "Stopping Redis container $(REDIS_CONTAINER)..."
	@docker rm -f "$(REDIS_CONTAINER)" >/dev/null 2>&1 || true
	@echo "Redis is down"

redis-logs:
	@docker logs -f "$(REDIS_CONTAINER)"

clean:
	rm -rf $(VENV)
