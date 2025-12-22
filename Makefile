.PHONY: help up down build rebuild logs ps clean migrate shell-backend shell-db

# Variables
COMPOSE := docker-compose
SERVICES := postgres backend frontend

help:
	@echo "🎓 Web Education Platform - Docker Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make up              - Start all services"
	@echo "  make down            - Stop all services"
	@echo "  make build           - Build all containers"
	@echo "  make rebuild         - Rebuild and restart all services"
	@echo "  make logs            - View logs from all services"
	@echo "  make ps              - List running containers"
	@echo "  make clean           - Remove all containers and volumes"
	@echo "  make migrate         - Run database migrations"
	@echo "  make shell-backend   - Open shell in backend container"
	@echo "  make shell-db        - Open psql in database"
	@echo ""
	@echo "Individual services:"
	@echo "  make up-db           - Start only database"
	@echo "  make up-backend      - Start backend + database"
	@echo "  make logs-backend    - View backend logs"
	@echo "  make logs-frontend   - View frontend logs"

# Start all services
up:
	@echo "🚀 Starting all services..."
	$(COMPOSE) up -d
	@echo "✅ Services started!"
	@echo ""
	@echo "📍 Access points:"
	@echo "   Frontend:  http://localhost"
	@echo "   Backend:   http://localhost:8023"
	@echo "   API Docs:  http://localhost:8023/api/docs"

# Start only database
up-db:
	@echo "🗄️  Starting database..."
	$(COMPOSE) up -d postgres

# Start backend + database
up-backend:
	@echo "🚀 Starting backend and database..."
	$(COMPOSE) up -d postgres backend

# Start with pgAdmin
up-tools:
	@echo "🛠️  Starting all services with tools..."
	$(COMPOSE) --profile tools up -d

# Stop all services
down:
	@echo "🛑 Stopping all services..."
	$(COMPOSE) down

# Build all containers
build:
	@echo "🔨 Building all containers..."
	$(COMPOSE) build

# Rebuild and restart
rebuild:
	@echo "🔄 Rebuilding and restarting..."
	$(COMPOSE) down
	$(COMPOSE) build
	$(COMPOSE) up -d

# View logs
logs:
	$(COMPOSE) logs -f

logs-backend:
	$(COMPOSE) logs -f backend

logs-frontend:
	$(COMPOSE) logs -f frontend

logs-db:
	$(COMPOSE) logs -f postgres

# List containers
ps:
	$(COMPOSE) ps

# Clean everything
clean:
	@echo "🧹 Cleaning up..."
	$(COMPOSE) down -v --remove-orphans
	@echo "✅ Cleanup complete!"

# Run migrations
migrate:
	@echo "🔄 Running database migrations..."
	$(COMPOSE) exec backend alembic upgrade head
	@echo "✅ Migrations complete!"

# Create new migration
migration:
	@read -p "Enter migration message: " msg; \
	$(COMPOSE) exec backend alembic revision --autogenerate -m "$$msg"

# Shell access
shell-backend:
	@echo "🐚 Opening shell in backend container..."
	$(COMPOSE) exec backend /bin/bash

shell-db:
	@echo "🐚 Opening psql in database..."
	$(COMPOSE) exec postgres psql -U wep_user -d wep_education

# Health check
health:
	@echo "🏥 Checking service health..."
	@curl -f http://localhost:8023/api/v1/health || echo "Backend not responding"
	@curl -f http://localhost/ || echo "Frontend not responding"

