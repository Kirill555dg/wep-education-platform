# 🎓 Web Education Platform — Frontend

Фронтенд образовательной веб-платформы, построенный на React + TypeScript с использованием архитектуры Feature-Sliced Design (FSD).

## 🛠 Технологии

- **React 18** — UI библиотека
- **TypeScript** — типизация
- **Vite** — сборщик
- **React Router v6** — маршрутизация
- **Zustand** — state management
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

## ⚙️ Переменные окружения

Создайте `frontend/.env` (или используйте `frontend/env.example` как шаблон — `.env*` файлы могут быть заблокированы в репозитории).

- **`VITE_API_URL`**: base URL API.
  - dev по умолчанию: `http://127.0.0.1:8023`
  - prod по умолчанию: `""` (same-origin, nginx proxy `/api`)
- **`VITE_USE_MOCK_API=true|false`**: включает детерминированные mock-фолбэки для части API (сейчас: статистика).
- **`VITE_MOCK_SEED`**: сид для мок-данных (одинаковый сид → одинаковые данные).

### Генерация клиента из OpenAPI (рекомендуется)

```bash
# OpenAPI обновляется строго из backend
bun run api:regen
```

### Сборка для продакшена

```bash
bun run build
```

### Предпросмотр production сборки

```bash
bun run preview
```

## 🧪 Тестирование

### Unit-тесты (bun:test)

```bash
# Запуск тестов
bun test

# Watch режим
bun run test:watch
```

### E2E-тесты (Cypress)

```bash
# Backend должен быть запущен. По умолчанию Cypress ходит на http://127.0.0.1:8023
#
# Если backend работает на другом порту/хосте — переопредели:
CYPRESS_BACKEND_URL="http://127.0.0.1:8023" VITE_API_URL="http://127.0.0.1:8023" bun run test:e2e

# Открыть Cypress UI
bun run cypress
```

## 📁 Структура проекта (FSD)

```
frontend/
├── src/
│   ├── app/                 # Инициализация приложения (router/guards, providers)
│   │   ├── index.tsx        # Root routes
│   │   ├── providers/       # Bootstrapper'ы
│   │   └── router/          # Guards (RequireAuth/RequireRole)
│   │
│   ├── pages/               # Страницы приложения
│   │   ├── auth/            # Login / Register
│   │   ├── common/          # Redirects
│   │   ├── student/         # Student flows
│   │   └── teacher/         # Teacher flows
│   │
│   ├── widgets/             # Комплексные UI-блоки
│   │   ├── chat/            # ClassroomChat (WS + HTTP fallback)
│   │   ├── header/          # AppHeader
│   │   └── layout/          # AppLayout
│   │
│   ├── entities/            # Бизнес-сущности
│   │   └── session/         # Session store (user + auth bootstrap)
│   │
│   └── shared/            # Переиспользуемый код
│       ├── ui/            # UI-компоненты
│       ├── hooks/         # Хуки
│       ├── lib/           # Утилиты
│       ├── api/           # OpenAPI client (generated) + wrappers + errors
│       └── styles/        # Глобальные стили
│
├── public/                # Статические файлы
├── cypress/               # E2E тесты
└── ... (конфигурационные файлы)
```

## ✨ Функционал

### 🔐 Авторизация
- Регистрация (student/teacher)
- Вход в систему (JWT в `localStorage`)
- Role-based routing (student/teacher)

### 👩‍🏫 Teacher MVP
- Создание класса
- Создание урока (автопубликация для student)
- База задач: список/поиск/редактор
- Создание ДЗ на отдельной странице (выбор задач из базы + баллы + публикация)
- Страница ДЗ учителя (редактирование метаданных + статистика выполнения)
- Статистика по классу/ДЗ/ученику (графики + матрица прогресса)

### 👨‍🎓 Student MVP
- Вступление в класс по invite code
- Просмотр уроков и ДЗ
- Homework Player (stepper, autosave draft, submit per-task + final submit)

### 💬 Чат
- Realtime чат класса через WebSocket
- Reconnect/backoff + polling fallback (если realtime недоступен)
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

## ⚙️ Mock API (детерминированно)

Mock включается через `VITE_USE_MOCK_API=true`. Реализован в `src/shared/api/mock/*` и используется как **fallback** в wrapper'ах `src/shared/api/*` для неготовых/отсутствующих эндпоинтов.

## 🌐 API-слой (Работа с Backend)

Фронтенд имеет полноценный типизированный API-клиент для работы с FastAPI бекендом.

### Генерация клиента из OpenAPI (рекомендуется)

```bash
# backend должен быть запущен на http://localhost:8023
bun run api:regen
```

### Структура API-слоя

```
src/shared/api/
├── generated/              # OpenAPI-generated клиент (НЕ редактировать вручную)
├── openapi.ts              # конфиг OpenAPI (BASE/TOKEN/HEADERS)
├── errors.ts               # разбор error envelope + helpers
├── pagination.ts           # clampLimit + fetchAllPages
├── mock/                   # детерминированные mock generators (опционально, dev)
├── auth.ts                 # доменный wrapper над generated
├── classrooms.ts
├── lessons.ts
├── homework.ts
├── problems.ts
├── statistics.ts
└── index.ts                # централизованный экспорт
```

### Использование API

#### 1. Авторизация

```typescript
import { authApi } from "@/shared/api";

// Регистрация
const user = await authApi.register({
  username: "john_doe",
  email: "john@example.com",
  password: "securepass123",
  full_name: "John Doe",
  is_teacher: false,
});

// Вход (JWT токен автоматически сохраняется)
const { access_token, user } = await authApi.login({
  username_or_email: "john_doe",
  password: "securepass123",
});

// Получить текущего пользователя
const currentUser = await authApi.getCurrentUser();

// Получить роль
const { role } = await authApi.getCurrentUserRole(); // "teacher" | "student"

// Выход
authApi.logout();
```

#### 2. Классы

```typescript
import { classroomsApi } from "@/shared/api";

// Создать класс (учитель)
const classroom = await classroomsApi.create({
  name: "Математика 10А",
  subject: "Математика",
  grade_level: 10,
  description: "Алгебра и геометрия",
});

// Получить все классы пользователя
const classrooms = await classroomsApi.getAll();

// Присоединиться к классу (студент)
const joined = await classroomsApi.join({
  invite_code: "ABC123XYZ",
});

// Получить студентов класса (учитель)
const students = await classroomsApi.getStudents(classroomId);
```

#### 3. Уроки

```typescript
import { lessonsApi } from "@/shared/api";

// Создать урок (учитель)
const lesson = await lessonsApi.create({
  classroom_id: 1,
  title: "Тригонометрия",
  description: "Основы тригонометрических функций",
  theory_material_ids: [5, 6, 7],
});

// Получить уроки класса
const lessons = await lessonsApi.getByClassroom(classroomId);

// Обновить урок
await lessonsApi.update(lessonId, { is_published: true });
```

#### 4. Домашние задания

```typescript
import { homeworkApi } from "@/shared/api";

// Создать ДЗ (учитель)
const homework = await homeworkApi.create({
  lesson_id: 1,
  title: "Задачи на синус и косинус",
  max_score: 100,
  deadline: "2024-12-20T23:59:00",
  problem_ids: [10, 11, 12],
  problem_points: [30, 30, 40],
});

// Получить задачи ДЗ
const problems = await homeworkApi.getProblems(homeworkId);

// Отправить ответ (студент)
const stats = await homeworkApi.submitAnswer({
  homework_id: 1,
  problem_id: 10,
  answer: "0.5",
  time_spent_minutes: 15,
});

// Финальная отправка ДЗ
await homeworkApi.submitHomework(homeworkId);

// Проверить статус
const status = await homeworkApi.getStatus(homeworkId);
```

#### 5. Статистика

```typescript
import { statisticsApi } from "@/shared/api";

// Получить свою статистику (студент)
const myStats = await statisticsApi.getMy();

// Получить свой прогресс
const progress = await statisticsApi.getMyProgress();
// {
//   total_homeworks: 15,
//   completed: 10,
//   in_progress: 3,
//   not_started: 2,
//   average_score_percentage: 87.5
// }

// Получить статистику по ДЗ (учитель)
const homeworkStats = await statisticsApi.getHomeworkStats(homeworkId);

// Прогресс класса (учитель)
const classProgress = await statisticsApi.getClassroomProgress(classroomId);
```

### TypeScript типы

Все типы автоматически синхронизированы с Pydantic схемами бекенда:

```typescript
import type {
  User,
  Classroom,
  Lesson,
  Homework,
  Problem,
  Statistics,
} from "@/shared/api";

const user: User = {
  id: 1,
  username: "john_doe",
  email: "john@example.com",
  full_name: "John Doe",
  // ... и т.д. (полностью типизировано)
};
```

### JWT Authentication

- JWT токен берётся из `localStorage` (см. `src/shared/api/openapi.ts`)
- При 401/403 пользователь должен заново войти (guards/handlers)

### Интеграция с React Query

Рекомендуется использовать API-клиенты вместе с TanStack Query:

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { classroomsApi } from "@/shared/api";

// Получение данных
const { data: classrooms, isLoading } = useQuery({
  queryKey: ["classrooms"],
  queryFn: () => classroomsApi.getAll(),
});

// Мутации
const joinMutation = useMutation({
  mutationFn: (code: string) => classroomsApi.join({ invite_code: code }),
  onSuccess: () => {
    // Обновить список классов
    queryClient.invalidateQueries({ queryKey: ["classrooms"] });
  },
});
```

---

**Приятной разработки! 🚀**

