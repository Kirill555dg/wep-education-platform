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

## 🌐 API-слой (Работа с Backend)

Фронтенд имеет полноценный типизированный API-клиент для работы с FastAPI бекендом.

### Структура API-слоя

```
src/shared/api/
├── types/                  # TypeScript типы (синхронизированы с Pydantic)
│   ├── user.types.ts       # User, Teacher, Student, Auth
│   ├── classroom.types.ts  # Classroom, Invite
│   ├── lesson.types.ts     # Lesson, TheoryMaterial
│   ├── homework.types.ts   # Homework, Problem
│   ├── statistics.types.ts # Statistics, Progress
│   └── index.ts            # Централизованный экспорт типов
│
├── auth.api.ts             # Авторизация и регистрация
├── classrooms.api.ts       # Управление классами
├── lessons.api.ts          # Уроки и материалы
├── homework.api.ts         # Домашние задания и тестирование
├── statistics.api.ts       # Статистика и прогресс
├── axios.ts                # Настройка Axios (JWT interceptors)
└── index.ts                # Централизованный экспорт API
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

### Конфигурация

Backend URL настраивается через переменную окружения:

```bash
# .env
VITE_API_URL=http://localhost:8000
```

По умолчанию: `http://localhost:8000`

### JWT Authentication

- JWT токен автоматически добавляется ко всем запросам через Axios interceptor
- При 401 ошибке пользователь автоматически перенаправляется на `/login`
- Токен хранится в `localStorage`

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

