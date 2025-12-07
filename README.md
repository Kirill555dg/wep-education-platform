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

### Фронтенд

```bash
cd frontend
bun install
bun run dev
```

Подробная документация: [`frontend/README.md`](./frontend/README.md)

### Backend

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

- **Bun** >= 1.0.0 (для фронтенда)
- **Python** >= 3.10 (для бекенда)
- **Git**

### Установка Bun

```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Проверка
bun --version
```

## 🎯 Функционал

- ✅ Авторизация и регистрация (студенты/преподаватели)
- ✅ Профили пользователей
- ✅ Система классов
- ✅ Уведомления
- ✅ Backend API (FastAPI)

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

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)

## 📄 License

MIT

---

**Разработка: МИРЭА — РТУ**  
**Проект: Курсовая работа ACSA**

