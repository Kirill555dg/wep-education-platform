# 🎓 Web Education Platform — Monorepo

Образовательная веб-платформа для взаимодействия студентов и преподавателей.

## 📁 Структура проекта

Проект организован как **monorepo** с следующей структурой:

```
wep-education-platform/
├── frontend/          # React + TypeScript фронтенд
│   ├── src/          # Исходный код (FSD архитектура)
│   ├── public/       # Статические файлы
│   ├── cypress/      # E2E тесты
│   └── README.md     # Документация фронтенда
│
└── backend/           # FastAPI backend
    ├── app/          # Исходный код
    │   ├── api/      # API endpoints (контроллеры)
    │   ├── services/ # Бизнес-логика
    │   ├── repositories/ # Работа с БД
    │   ├── models/   # SQLAlchemy ORM модели
    │   └── schemas/  # Pydantic схемы
    ├── pyproject.toml
    └── README.md     # Документация backend
```

## 🚀 Быстрый старт

### 🐳 Docker (Рекомендуется)

**Самый простой способ запустить всю систему:**

```bash
# 1. Скопируйте пример конфигурации
cp .env.example .env

# 2. Запустите все сервисы
docker-compose up -d

# 3. Проверьте статус
docker-compose ps
```

**Доступ к сервисам:**
- 🌐 **Frontend**: http://localhost
- 🚀 **Backend API**: http://localhost:8000
- 📖 **API Docs (Swagger)**: http://localhost:8000/api/docs
- 🗄️ **pgAdmin** (опционально): http://localhost:5050

**Полезные команды:**
```bash
# Просмотр логов
docker-compose logs -f

# Остановить сервисы
docker-compose down

# Пересобрать при изменениях
docker-compose up -d --build

# Запустить с pgAdmin
docker-compose --profile tools up -d
```

### 💻 Локальная разработка

#### Фронтенд

```bash
cd frontend
bun install
bun run dev
```

Подробная документация: [`frontend/README.md`](./frontend/README.md)

#### Backend

```bash
cd backend
pip install -e .
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Подробная документация: [`backend/README.md`](./backend/README.md)

## 🛠 Технологии

### Frontend
- React 18 + TypeScript
- Vite
- Zustand + TanStack Query
- Tailwind CSS + Radix UI
- Vitest + Cypress

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL / SQLite
- REST API
- Pydantic

## 📄 Требования

### Для Docker (рекомендуется)
- **Docker** >= 20.10
- **Docker Compose** >= 2.0

### Для локальной разработки
- **Bun** >= 1.0.0 (для фронтенда)
- **Python** >= 3.10 (для бекенда)
- **PostgreSQL** >= 16 (для базы данных)
- **Git**

### Установка Docker

```bash
# macOS (Homebrew)
brew install --cask docker

# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh

# Проверка
docker --version
docker-compose --version
```

### Установка Bun (для локальной разработки)

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Проверка
bun --version
```

## 🎯 Функционал

- ✅ Авторизация и регистрация (студенты/преподаватели)
- ✅ Профили пользователей
- ✅ Создание и управление классами
- ✅ Уроки и домашние задания
- ✅ Автоматическая проверка ответов
- ✅ Статистика и прогресс студентов
- ✅ Система уведомлений
- ✅ REST API (FastAPI)
- ✅ PostgreSQL база данных
- ✅ Docker-контейнеризация

## 📝 Git Workflow

Основная ветка: `master`  
Рабочая ветка: `acsa-coursework` (курсовая работа ACSA)

```bash
# Переключиться на рабочую ветку
git checkout acsa-coursework

# Создать новую feature-ветку
git checkout -b feature/название-функции
```

## 🤝 Contributing

1. Создайте feature-ветку от `acsa-coursework`
2. Следуйте архитектуре FSD для фронтенда
3. Покрывайте код тестами
4. Создайте Pull Request

## 📚 Документация

- [Frontend Documentation](./frontend/README.md) — React + TypeScript + FSD
- [Backend Documentation](./backend/README.md) — FastAPI + SQLAlchemy
- [Database Setup](./database/README.md) — PostgreSQL + Docker
- [Testing Guide](./TESTING_GUIDE.md) — E2E сценарий тестирования

## 🏗️ Архитектура

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │      │   Backend   │      │  PostgreSQL │
│   (React)   │◄────►│  (FastAPI)  │◄────►│     DB      │
│   Port 80   │      │  Port 8000  │      │  Port 5432  │
└─────────────┘      └─────────────┘      └─────────────┘
     │                     │                     │
     └─────────────────────┴─────────────────────┘
                  Docker Network
```

**Frontend** → Nginx + React SPA  
**Backend** → FastAPI + Uvicorn  
**Database** → PostgreSQL 16  
**API Docs** → Swagger UI (OpenAPI 3.0)

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env` в корне проекта:

```bash
# Database
POSTGRES_USER=wep_user
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=wep_education

# Backend
SECRET_KEY=your-super-secret-jwt-key
DEBUG=false

# Optional: pgAdmin
PGADMIN_EMAIL=admin@wep.local
PGADMIN_PASSWORD=admin
```

### Порты

- **80** — Frontend (Nginx)
- **8000** — Backend API
- **5432** — PostgreSQL
- **5050** — pgAdmin (опционально, только с `--profile tools`)

## 📄 License

MIT

---

**Разработка: МИРЭА — РТУ**  
**Проект: Курсовая работа ACSA**

