.PHONY: help up down restart logs ps backup restore clean

help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Запустить PostgreSQL
	docker-compose up -d postgres
	@echo "✓ PostgreSQL запущен на localhost:5432"
	@echo "  База данных: wep_education"
	@echo "  Пользователь: wep_user"

up-all: ## Запустить PostgreSQL + pgAdmin
	docker-compose --profile tools up -d
	@echo "✓ PostgreSQL запущен на localhost:5432"
	@echo "✓ pgAdmin доступен на http://localhost:5050"

down: ## Остановить контейнеры
	docker-compose --profile tools down

restart: ## Перезапустить контейнеры
	docker-compose --profile tools restart

logs: ## Показать логи PostgreSQL
	docker-compose logs -f postgres

ps: ## Показать статус контейнеров
	docker-compose ps

exec: ## Подключиться к PostgreSQL через psql
	docker-compose exec postgres psql -U wep_user -d wep_education

backup: ## Создать backup базы данных
	@mkdir -p backups
	@docker-compose exec -T postgres pg_dump -U wep_user wep_education > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "✓ Backup создан в backups/"

restore: ## Восстановить базу данных из последнего backup (ОСТОРОЖНО!)
	@echo "Восстановление из последнего backup..."
	@docker-compose exec -T postgres psql -U wep_user -d wep_education < $$(ls -t backups/*.sql | head -1)
	@echo "✓ База данных восстановлена"

clean: ## Удалить контейнеры и volumes (УДАЛИТ ВСЕ ДАННЫЕ!)
	@echo "⚠️  ВНИМАНИЕ: Это удалит все данные в базе данных!"
	@read -p "Вы уверены? [y/N]: " confirm && [ "$$confirm" = "y" ] || exit 1
	docker-compose --profile tools down -v
	@echo "✓ Контейнеры и volumes удалены"

init: ## Инициализировать новую базу данных
	@cp .env.example .env
	@echo "✓ Создан файл .env"
	@echo "✓ Отредактируйте .env и запустите 'make up'"

