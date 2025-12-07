# 🎓 Web Education Platform

Образовательная веб-платформа для взаимодействия студентов и преподавателей, построенная на современном стеке технологий с использованием архитектуры Feature-Sliced Design (FSD).

## 📋 Содержание

- [Технологии](#технологии)
- [Требования](#требования)
- [Установка окружения](#установка-окружения)
- [Установка проекта](#установка-проекта)
- [Запуск проекта](#запуск-проекта)
- [Тестирование](#тестирование)
- [Структура проекта](#структура-проекта)
- [Функционал](#функционал)

## 🛠 Технологии

### Frontend
- **React 18** — библиотека для построения пользовательских интерфейсов
- **TypeScript** — типизированный JavaScript
- **Vite** — быстрый сборщик проектов
- **React Router v6** — маршрутизация
- **Zustand** — легковесный state management
- **TanStack Query (React Query)** — управление серверным состоянием
- **React Hook Form** + **Zod** — работа с формами и валидация
- **Tailwind CSS** — utility-first CSS фреймворк
- **Radix UI** — доступные UI-компоненты
- **Axios** — HTTP-клиент
- **Lucide React** — иконки

### Тестирование
- **Vitest** — unit и integration тесты
- **Cypress** — end-to-end тестирование
- **Testing Library** — тестирование React-компонентов

## 📦 Требования

Для работы с проектом необходимо установить:

- **Node.js** >= 18.x (рекомендуется LTS версия)
- **pnpm** >= 10.11.0 (менеджер пакетов)

## 🚀 Установка окружения

### 1. Установка Node.js

#### macOS (с использованием Homebrew):
```bash
# Установка Homebrew (если не установлен)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установка Node.js
brew install node
```

#### macOS/Linux (с использованием nvm - рекомендуется):
```bash
# Установка nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Перезапуск терминала или
source ~/.zshrc  # для zsh
source ~/.bashrc # для bash

# Установка Node.js LTS
nvm install --lts
nvm use --lts
```

#### Проверка установки:
```bash
node --version  # должна вывестись версия >= 18.x
npm --version   # должна вывестись версия npm
```

### 2. Установка pnpm

```bash
# Установка pnpm глобально
npm install -g pnpm

# Проверка установки
pnpm --version  # должна вывестись версия >= 10.11.0
```

Или используйте corepack (встроен в Node.js >= 16.13):
```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
```

## 💻 Установка проекта

### 1. Клонирование репозитория (если еще не клонирован):
```bash
git clone <repository-url>
cd wep-education-platform
```

### 2. Установка зависимостей:
```bash
pnpm install
```

## 🏃 Запуск проекта

### Development сервер (разработка):
```bash
pnpm dev
```
Приложение будет доступно по адресу: http://localhost:5173

### Production build (сборка для продакшена):
```bash
pnpm build
```

### Preview production build (предпросмотр продакшен сборки):
```bash
pnpm preview
```

## 🧪 Тестирование

### Unit-тесты (Vitest):
```bash
# Запуск тестов (один раз)
pnpm test

# Запуск в watch режиме
pnpm test:watch
```

### E2E-тесты (Cypress):
```bash
# Запуск E2E тестов
pnpm test:e2e

# Открыть Cypress UI
pnpm cypress
```

## 📁 Структура проекта

Проект построен на архитектуре **Feature-Sliced Design (FSD)**:

```
wep-education-platform/
├── public/                 # Статические ресурсы
│   ├── avatar/            # Аватары пользователей
│   └── class/             # Изображения предметов
│
├── src/
│   ├── app/               # Инициализация приложения
│   │   ├── index.tsx      # Главный компонент App
│   │   ├── providers/     # Провайдеры (Auth, Class)
│   │   └── router/        # Роутинг и защищенные маршруты
│   │
│   ├── pages/             # Страницы приложения
│   │   ├── auth/          # Авторизация (login, register, reset-password)
│   │   ├── profile/       # Профиль пользователя
│   │   ├── student/       # Страница студента
│   │   ├── teacher/       # Страница преподавателя
│   │   └── notifications/ # Уведомления
│   │
│   ├── widgets/           # Комплексные UI-блоки
│   │   ├── header/        # Шапка сайта
│   │   ├── footer/        # Подвал
│   │   └── layout/        # Общий layout
│   │
│   ├── features/          # Бизнес-функции
│   │   ├── auth/          # Функции авторизации
│   │   ├── profile/       # Редактирование профиля
│   │   ├── notifications/ # Работа с уведомлениями
│   │   └── join-class/    # Присоединение к классу
│   │
│   ├── entities/          # Бизнес-сущности
│   │   ├── user/          # Пользователь
│   │   ├── student/       # Студент
│   │   ├── teacher/       # Преподаватель
│   │   ├── class/         # Класс/Предмет
│   │   ├── notification/  # Уведомление
│   │   └── many-to-many/  # Связи между сущностями
│   │
│   └── shared/            # Переиспользуемый код
│       ├── ui/            # UI-компоненты (Button, Input, Card и т.д.)
│       ├── hooks/         # Общие хуки
│       ├── lib/           # Утилиты
│       ├── api/           # Настройка Axios
│       ├── styles/        # Глобальные стили
│       └── assets/        # Иконки, изображения
│
├── cypress/               # E2E тесты
│   ├── e2e/              # Тестовые сценарии
│   ├── fixtures/         # Тестовые данные
│   └── support/          # Вспомогательные функции
│
└── ... (конфигурационные файлы)
```

### Слои FSD (по убыванию уровня):

1. **app** — инициализация, провайдеры, роутинг
2. **pages** — страницы приложения
3. **widgets** — композитные блоки интерфейса
4. **features** — части бизнес-логики
5. **entities** — бизнес-сущности
6. **shared** — переиспользуемый код

## ✨ Функционал

### 🔐 Авторизация
- Регистрация нового пользователя (студент/преподаватель)
- Вход в систему
- Сброс пароля
- Защита маршрутов (доступ только для авторизованных)

### 👤 Профиль
- Редактирование данных пользователя
- Выбор аватара
- Указание пола
- Персональная информация

### 🏫 Классы/Предметы
- Просмотр доступных классов
- Присоединение к классу (для студентов)
- Управление классами (для преподавателей)
- Информация о предметах (математика, физика, история, литература)

### 🔔 Уведомления
- Система уведомлений
- Фильтрация по типам
- Отметка о прочтении
- Различные типы: достижения, напоминания, системные

### 🎭 Роли
- **Студент**: доступ к своим классам, профилю, уведомлениям
- **Преподаватель**: доступ к управлению классами, профилю, уведомлениям

## 🔧 Скрипты

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Запуск dev-сервера на http://localhost:5173 |
| `pnpm build` | Сборка проекта для production |
| `pnpm preview` | Предпросмотр production сборки |
| `pnpm test` | Запуск unit-тестов |
| `pnpm test:watch` | Запуск тестов в watch-режиме |
| `pnpm test:e2e` | Запуск E2E-тестов |
| `pnpm cypress` | Открыть Cypress UI |

## 🔍 Важные замечания

### Mock API
В текущей версии проект использует **mock API** для разработки:
- Авторизация: `src/features/auth/api/api-mock.ts`
- Профиль: `src/features/profile/api/profile-api-mock.ts`
- Mock данные находятся в `src/entities/*/model/mock-*.ts`

При необходимости можно переключиться на реальное API, изменив импорты в `src/main.tsx`:

```typescript
// Вместо mock API
import { authApiMock } from "@/features/auth/api/api-mock";
import { profileApiMock } from "@/features/profile/api/profile-api-mock";

// Использовать реальное API
import { authApiReal } from "@/features/auth/api/api-real";
import { profileApiReal } from "@/features/profile/api/profile-api-real";
```

### Path Aliases
В проекте настроены path aliases для удобного импорта:
- `@/*` → `src/*`

Пример:
```typescript
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/features/auth/model/store";
```

## 📝 Разработка

### Добавление новой фичи:
1. Создайте папку в `src/features/feature-name/`
2. Добавьте необходимые слои: `api/`, `model/`, `ui/`, `lib/`
3. Подключите в нужной странице

### Добавление новой сущности:
1. Создайте папку в `src/entities/entity-name/`
2. Определите типы в `model/types.ts`
3. Создайте store (если нужен) в `model/store.ts`
4. Добавьте UI-компоненты в `ui/`

### Добавление новой страницы:
1. Создайте папку в `src/pages/page-name/`
2. Добавьте главный компонент `PageName.tsx`
3. Создайте UI-компоненты в `ui/`
4. Добавьте маршрут в `src/app/index.tsx`

## 🤝 Contributing

При внесении изменений следуйте:
1. Архитектуре FSD
2. TypeScript strict mode
3. Соглашениям по именованию
4. Покрытию тестами

## 📄 License

MIT

---

**Приятной разработки! 🚀**

