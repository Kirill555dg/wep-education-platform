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
└── backend/          # Backend (планируется)
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

> 🚧 Backend находится в разработке

## 🛠 Технологии

### Frontend
- React 18 + TypeScript
- Vite
- Zustand + TanStack Query
- Tailwind CSS + Radix UI
- Vitest + Cypress

### Backend (планируется)
- Node.js / Bun
- PostgreSQL / MongoDB
- REST API / GraphQL

## 📄 Требования

- **Bun** >= 1.0.0 (или Node.js >= 18.x)
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
- 🚧 Backend API (в разработке)

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
- Backend Documentation (в разработке)

## 📄 License

MIT

---

**Разработка: МИРЭА — РТУ**  
**Проект: Курсовая работа ACSA**

