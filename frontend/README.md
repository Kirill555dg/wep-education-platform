# 🎓 Web Education Platform — Frontend

Фронтенд образовательной веб-платформы, построенный на React + TypeScript с использованием архитектуры Feature-Sliced Design (FSD).

## 🛠 Технологии

- **React 18** — UI библиотека
- **TypeScript** — типизация
- **Vite** — сборщик
- **React Router v6** — маршрутизация
- **Zustand** — state management
- **TanStack Query** — управление серверным состоянием
- **React Hook Form + Zod** — формы и валидация
- **Tailwind CSS** — стилизация
- **Radix UI** — UI компоненты
- **Vitest + Cypress** — тестирование

## 🚀 Быстрый старт

### Установка зависимостей

```bash
bun install
```

### Запуск dev-сервера

```bash
bun run dev
```

Приложение будет доступно по адресу: http://localhost:5173

### Сборка для продакшена

```bash
bun run build
```

### Предпросмотр production сборки

```bash
bun run preview
```

## 🧪 Тестирование

### Unit-тесты (Vitest)

```bash
# Запуск тестов
bun test

# Watch режим
bun run test:watch
```

### E2E-тесты (Cypress)

```bash
# Запуск E2E тестов
bun run test:e2e

# Открыть Cypress UI
bun run cypress
```

## 📁 Структура проекта (FSD)

```
frontend/
├── src/
│   ├── app/               # Инициализация приложения
│   │   ├── index.tsx      # Главный компонент App
│   │   ├── providers/     # Провайдеры (Auth, Class)
│   │   └── router/        # Роутинг и защищенные маршруты
│   │
│   ├── pages/             # Страницы приложения
│   │   ├── auth/          # Авторизация
│   │   ├── profile/       # Профиль пользователя
│   │   ├── student/       # Страница студента
│   │   ├── teacher/       # Страница преподавателя
│   │   └── notifications/ # Уведомления
│   │
│   ├── widgets/           # Комплексные UI-блоки
│   │   ├── header/        # Шапка
│   │   ├── footer/        # Подвал
│   │   └── layout/        # Layout
│   │
│   ├── features/          # Бизнес-функции
│   │   ├── auth/          # Авторизация
│   │   ├── profile/       # Редактирование профиля
│   │   ├── notifications/ # Уведомления
│   │   └── join-class/    # Присоединение к классу
│   │
│   ├── entities/          # Бизнес-сущности
│   │   ├── user/          # Пользователь
│   │   ├── student/       # Студент
│   │   ├── teacher/       # Преподаватель
│   │   ├── class/         # Класс/Предмет
│   │   └── notification/  # Уведомление
│   │
│   └── shared/            # Переиспользуемый код
│       ├── ui/            # UI-компоненты
│       ├── hooks/         # Хуки
│       ├── lib/           # Утилиты
│       ├── api/           # Axios
│       └── styles/        # Глобальные стили
│
├── public/                # Статические файлы
├── cypress/               # E2E тесты
└── ... (конфигурационные файлы)
```

## ✨ Функционал

### 🔐 Авторизация
- Регистрация (студент/преподаватель)
- Вход в систему
- Сброс пароля
- Защищенные маршруты

### 👤 Профиль
- Редактирование данных
- Выбор аватара
- Персональная информация

### 🏫 Классы
- Просмотр классов
- Присоединение к классу (студенты)
- Управление классами (преподаватели)

### 🔔 Уведомления
- Система уведомлений
- Фильтрация по типам
- Отметка о прочтении

## 🔧 Скрипты

| Команда | Описание |
|---------|----------|
| `bun run dev` | Запуск dev-сервера |
| `bun run build` | Сборка для production |
| `bun run preview` | Предпросмотр production |
| `bun test` | Запуск unit-тестов |
| `bun run test:watch` | Тесты в watch-режиме |
| `bun run test:e2e` | E2E-тесты |
| `bun run cypress` | Cypress UI |

## 📝 Path Aliases

В проекте настроены path aliases:
- `@/*` → `src/*`

Пример:
```typescript
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/features/auth/model/store";
```

## ⚙️ Mock API

Проект использует mock API для разработки:
- `src/features/auth/api/api-mock.ts`
- `src/features/profile/api/profile-api-mock.ts`

Переключение на реальное API выполняется в `src/main.tsx`.

---

**Приятной разработки! 🚀**

