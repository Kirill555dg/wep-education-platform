# Web Education Platform — Frontend (архитектурный обзор)

Документ описывает **frontend-проект** как самостоятельный архитектурный компонент системы WEP LMS: роль фронтенда, принципы Feature‑Sliced Design (FSD), правила зависимостей между слоями, ключевые пользовательские сценарии и границы ответственности.

Фокус — **архитектурная ясность** и возможность восстановить **UML component diagram**. Инструкций по запуску намеренно нет.

---

## 1) Роль фронтенда в системе LMS

Frontend — клиентский компонент LMS, который:

- реализует **UI/UX** и пользовательские сценарии для ролей *teacher* и *student*;
- обеспечивает **навигацию** и роль‑ориентированные ограничения доступа (routing + guards);
- управляет **клиентским состоянием** (session) и **кэшированием данных** (HTTP cache);
- визуализирует **статистику** (графики/таблицы) и управляет presentation logic;
- интегрируется с backend через **типизированный API‑контракт** (OpenAPI → generated client) и **WebSocket** (чат).

Фронтенд **не является источником истины** по данным LMS: канонические данные, права доступа и бизнес‑правила обеспечиваются backend + DB.

---

## 2) Архитектурный подход: Feature‑Sliced Design (FSD)

Проект следует **Feature‑Sliced Design**, где структура задаётся не “по типам файлов”, а по **ответственности и направлению зависимостей**.

Основная идея:

- “верхние” слои **композируют** функциональность,
- “нижние” слои **поставляют** примитивы, сущности и сценарии,
- зависимости направлены **строго вниз**: `app → pages → widgets → features → entities → shared`.

Текущая структура `src/`:

- `app/` — bootstrap приложения: роутинг, guards, провайдеры.
- `pages/` — страницы (маршрутизируемые экраны).
- `widgets/` — крупные блоки UI (layout/navigation/chat/statistics).
- `features/` — сценарии/действия пользователя (use‑cases на клиенте).
- `entities/` — сущности домена на клиенте (session + query hooks/keys для доменных данных).
- `shared/` — инфраструктура и UI‑кит (api, ui, lib, hooks, config).

---

## 3) Слои FSD: назначение, типы компонентов, допустимые зависимости

Ниже правила достаточно точны, чтобы по ним строить компонентную диаграмму и проводить архитектурное ревью.

### 3.1 `shared/` — инфраструктура и дизайн‑система

- **Назначение**: переиспользуемые “кирпичики” без знания предметной области LMS.
- **Типы компонентов**:
  - `shared/ui/*`: дизайн‑система (buttons/cards/forms/dialogs/skeletons/toasts/error boundary).
  - `shared/api/*`: API‑интеграция (generated client + thin wrappers + error/pagination policy + mock).
  - `shared/config/*`: env, routes, logging policy.
  - `shared/lib/*`: утилиты (logger, promise pool, форматтеры, `cn`).
  - `shared/hooks/*`: общие хуки (media query, toast).
- **Допустимые зависимости**:
  - может зависеть только от внешних библиотек;
  - **не зависит** от `entities/features/widgets/pages/app`.

### 3.2 `entities/` — сущности и “доменный доступ” на клиенте

- **Назначение**: инкапсулировать работу с доменными сущностями (на уровне клиента) и их данные.
- **Типы компонентов**:
  - `entities/*/api/queryKeys.ts`: единые ключи кэша.
  - `entities/*/api/queries.ts`: React Query hooks (fetch/caching policy).
  - `entities/session/*`: session store (user/role/token bootstrap).
- **Допустимые зависимости**:
  - может зависеть от `shared/*`;
  - **не зависит** от `features/widgets/pages/app`.

### 3.3 `features/` — пользовательские действия (use‑cases на клиенте)

- **Назначение**: оформить “действие пользователя” как модуль (например, выполнение ДЗ).
- **Типы компонентов**:
  - сценарный UI (например, `features/homework/player/ui/*`);
  - сценарная логика, локальное состояние/черновики, обработка ошибок UX‑уровня.
- **Допустимые зависимости**:
  - может зависеть от `entities/*` и `shared/*`;
  - **не зависит** от `widgets/pages/app`.

### 3.4 `widgets/` — композиционные блоки страниц

- **Назначение**: большие UI‑блоки, которые используются на страницах.
- **Типы компонентов**:
  - `widgets/layout/*`: каркас приложения (shell).
  - `widgets/navigation/*`: sidebar/mobile nav/role nav.
  - `widgets/chat/*`: realtime чат (WS + fallback).
  - `widgets/statistics/*`: графики/таблицы (recharts + tanstack table).
- **Допустимые зависимости**:
  - может зависеть от `features/*`, `entities/*`, `shared/*`;
  - **не зависит** от `pages/app`.

### 3.5 `pages/` — маршрутизируемые экраны

- **Назначение**: конечные страницы, соответствующие URL‑маршрутам.
- **Типы компонентов**:
  - `pages/teacher/*`, `pages/student/*`, `pages/chat/*`, `pages/auth/*`.
- **Где бизнес‑логика**:
  - на страницах допустима **orchestration‑логика**: извлечь `:id` из URL, выбрать виджет, связать параметры;
  - “логика данных” и доменные операции — в `entities/features/shared/api`.
- **Допустимые зависимости**:
  - может зависеть от `widgets/*`, `features/*`, `entities/*`, `shared/*`.

### 3.6 `app/` — точка сборки приложения

- **Назначение**: верхний слой, который собирает всё вместе.
- **Типы компонентов**:
  - роутинг: `app/index.tsx`;
  - guards: `app/router/guards.tsx` (`RequireAuth`, `RequireRole`);
  - providers: `app/providers/*` (React Query provider, session bootstrap).
- **Допустимые зависимости**:
  - может зависеть от всех слоёв (верхняя точка композиции).

---

## 4) Компоненты интеграции с backend API

### 4.1 API компонент фронтенда

Расположение: `src/shared/api/*`.

- **`shared/api/generated/*`** — OpenAPI‑generated клиент (типизированный контракт).
- **`shared/api/openapi.ts`** — конфигурация клиента:
  - base URL (dev vs prod same‑origin),
  - токен (JWT из `localStorage`),
  - трассировка `X-Request-ID`.
- **`shared/api/*` wrappers** (`auth`, `classrooms`, `lessons`, `homework`, `problems`, `statistics`):
  - нормализуют параметры (например, `limit <= 100`),
  - содержат “domain-friendly” методы (`fetchAllPages`/`list*All`),
  - могут включать controlled mock‑fallback (см. ниже).
- **`shared/api/errors.ts`** — разбор error envelope `{ error, request_id }` и выделение `role_changed`.

### 4.2 Mock API (детерминированно)

Расположение: `src/shared/api/mock/*`.

Назначение: позволить фронтенду развиваться, когда часть backend‑эндпоинтов временно отсутствует/не готова.

Архитектурный контракт:

- mock включается **конфигурацией окружения** (`VITE_USE_MOCK_API`) и использует сид (`VITE_MOCK_SEED`) для детерминизма;
- mock применяется как **fallback** в wrappers `shared/api/*` (а не “магией” в UI).

### 4.3 Контракты взаимодействия (важно для диаграммы)

- **REST**: `/api/v1/*` — основной канал данных.
- **WebSocket**: чат `/api/v1/classrooms/{id}/chat/ws` + HTTP fallback `/chat/messages`.
- **Ошибки**: единый envelope (и `request_id`), фронт показывает `request_id` в UX.
- **Пагинация**: `skip/limit`, лимит жёстко ограничен backend’ом (`limit <= 100`) — фронт обязан соблюдать.
- **OpenAPI**: `shared/api/openapi.json` — артефакт контракта; генерируется backend‑скриптом (фронт не должен добывать контракт “curl’ом”).

---

## 5) Ключевые пользовательские сценарии (слои, логика, API)

Сценарии описаны как трассы по слоям — это удобный формат для защиты архитектуры и построения UML.

### 5.1 Auth: login/register + guards

- **Участвуют**: `pages/auth` → `entities/session` → `shared/api/auth` → backend.
- **Бизнес‑логика**:
  - backend: проверка учётных данных, роль в JWT;
  - frontend: UX форм, хранение токена/пользователя, guards.
- **Интеграция**:
  - REST `auth` endpoints;
  - обработка `role_changed`: UX‑реакция (toast/logout/redirect).

### 5.2 Teacher: классы → уроки → ДЗ → база задач

- **Участвуют**:
  - страницы: `pages/teacher/*`;
  - данные: `entities/classroom`, `entities/lesson`, `entities/homework`, `entities/problem`;
  - UI: `widgets/navigation`, `shared/ui`;
  - API: `shared/api/*` (classrooms/lessons/homework/problems).
- **Где логика**:
  - pages: orchestration (идентификаторы из URL, выбор страницы/виджетов);
  - entities/shared: fetching + кэш + инвалидации;
  - backend: права доступа (teacher owns classroom), правила публикации.

### 5.3 Student: вступление → уроки → выполнение ДЗ

- **Участвуют**:
  - страницы: `pages/student/*`;
  - сценарий: `features/homework/player/*`;
  - данные: `entities/homework` (+ classroom/lesson);
  - API: `shared/api/homework` + `shared/api/testing` (submit/status).
- **Где логика**:
  - frontend: UX “плеера” (stepper, drafts, progressive submit, сообщения/ошибки);
  - backend: оценивание/статусы попыток, итоговые значения статистики.

### 5.4 Статистика: student/teacher

- **Участвуют**:
  - страницы: `pages/*Stats*`;
  - данные: `entities/statistics`;
  - визуализация: `widgets/statistics/*`;
  - API: `shared/api/statistics`.
- **Где логика**:
  - frontend: presentation logic (серии данных, проценты, таблицы, drill‑down навигация);
  - backend: агрегаты и данные статистики.

### 5.5 Чат: отдельная страница + preview в классе

- **Участвуют**:
  - страница: `pages/chat/ChatPage.tsx` (единый чат, выбор класса через query params),
  - виджеты: `widgets/chat/ClassroomChat.tsx` (WS), `ClassroomChatPreview.tsx`,
  - данные: `entities/chat` (tail messages),
  - API: `shared/api/classrooms` (HTTP messages) + backend WS.
- **Где логика**:
  - frontend: reconnect/backoff/polling fallback, UI состояния realtime;
  - backend: авторизация WS, persistence сообщений, fanout (опционально через Redis).

---

## 6) Границы ответственности фронтенда

Frontend отвечает за:

- UI/UX, навигацию и layout;
- клиентскую валидацию и формы;
- кэширование/повторы запросов/инвалидации (HTTP cache);
- визуализацию статистики и presentation logic;
- устойчивость UX при ошибках (error boundary, toast, empty/error states).

Frontend не отвечает за:

- авторизацию/разрешения на уровне предметной области (это backend);
- консистентность и целостность данных (это backend + DB);
- вычисление оценок/статусов попыток как доменных фактов (это backend);
- миграции/управление схемой данных.

---

## 7) Компонентная диаграмма фронтенда (что рисовать)

Минимальный набор компонентов (UML-friendly):

- **App Shell** (`app/*` + `widgets/layout/*` + `widgets/navigation/*`)
  - Router/Guards
  - Layout + role navigation
- **Screens** (`pages/*`)
  - Teacher / Student / Auth / Chat
- **Domain Access** (`entities/*`)
  - query hooks/keys, session store
- **API Integration** (`shared/api/*`)
  - generated OpenAPI client + wrappers + error/pagination policy + mock fallback
- **UI Kit & Utilities** (`shared/ui/*`, `shared/lib/*`, `shared/hooks/*`)
- **Realtime UI** (`widgets/chat/*`) ⇄ backend (WS/HTTP)

Типовой поток данных:

`pages/widgets` → `entities (queries)` → `shared/api wrappers` → `shared/api/generated` → backend.


