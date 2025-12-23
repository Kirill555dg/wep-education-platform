### Backend WEP LMS — архитектурный обзор (component view)

Этот документ описывает **backend-проект** как архитектурный компонент системы WEP LMS: его назначение, состав логических подсистем, границы ответственности и интерфейсы взаимодействия.  
Фокус — **компонентная модель** (то, что позволяет восстановить UML-диаграмму компонентов). Инструкций по запуску намеренно нет.

---

### 1) Назначение backend в системе LMS

Backend — это **серверный доменный компонент** LMS, который:

- **экспонирует публичный контракт** системы (REST API + WebSocket для чата),
- **реализует бизнес-правила** учебной платформы (роль, доступ, публикация, статусы, расчёт прогресса),
- **обеспечивает целостность данных** через транзакции и согласованный доступ к БД,
- **формирует DTO-контракты** (Pydantic-схемы) и стабильный формат ошибок/пагинации,
- **служит источником OpenAPI контракта**, по которому фронтенд генерирует типизированного клиента.

Backend не является “приложением с UI”; он — **сервис предметной области LMS**.

---

### 2) Границы backend (scope) и внешние зависимости

#### 2.1 Внешние интерфейсы (контракты)

- **HTTP/REST**: `/api/v1/*` (версионированный публичный API).
- **WebSocket**: чат класса `/api/v1/classrooms/{id}/chat/ws` (реалтайм события и доставка сообщений).
- **OpenAPI**: `/api/openapi.json` (контракт; также экспортируется скриптом `app/scripts/export_openapi.py` для фронтенда).

#### 2.2 Внешние зависимости (external components)

- **PostgreSQL**: основное хранилище данных и источник истины по доменной модели.
- **Redis (опционально)**: fanout WebSocket-сообщений между несколькими инстансами backend (Pub/Sub), а также хранение/обновление presence/typing TTL (в рамках realtime-подсистемы).

#### 2.3 Что backend НЕ делает (out of scope)

- **Не рендерит UI и не отвечает за UX**: навигация, состояние интерфейса, кэширование в браузере, графики/таблицы, пустые состояния — ответственность фронтенда.
- **Не управляет клиентскими стратегиями real-time**: reconnect/backoff/polling fallback — ответственность фронтенда (backend предоставляет WS/HTTP контракты).
- **Не является “аналитической платформой”**: не строит сложные BI-отчёты, не хранит “витрины” и не выполняет тяжёлую агрегацию вне доменно оправданных summary-метрик.
- **Не выполняет фоновые вычисления/очереди**: нет отдельного job-runner/worker/очередей сообщений (в текущей архитектуре).
- **Не является файловым хранилищем**: может хранить метаданные, но “объектное хранилище/ CDN / antivirus” как подсистема — вне текущих границ.

#### 2.4 Делегирование ответственности

- **Фронтенду**: представление данных (таблицы, графики), клиентская валидация форм, удобные сценарии выполнения ДЗ, локальные черновики, маршрутизация/guards, UX ошибок.
- **Базе данных**: физическая целостность (FK/unique/index), оптимизация запросов и планы выполнения, хранение исторических фактов.
- **Redis (если включён)**: кросс-инстанс доставка событий чата (Pub/Sub), TTL-структуры presence/typing.

---

### 3) Высокоуровневая карта компонентов backend (UML-friendly)

Ниже — “component map” (что рисовать на UML компонентной диаграмме и как это соотносится с кодом).

- **API Host (FastAPI Application)** — `app/main.py`
  - включает middleware (CORS, request_id),
  - регистрирует exception handlers,
  - подключает роутер v1.

- **API Layer (REST controllers)** — `app/api/v1/*.py`
  - `auth`, `classrooms`, `lessons`, `homework`, `problems`, `testing`, `statistics`, `theory`, `health`.

- **Dependency Injection / AuthZ dependencies** — `app/api/dependencies.py`
  - извлечение JWT контекста (user_id, role),
  - загрузка текущего пользователя,
  - роль-ориентированные зависимости (teacher/student),
  - провайдеры сервисов (AuthService, ClassroomService и т.д.).

- **Service Layer (business logic)** — `app/services/*.py`
  - оркестрация use-cases (создание/обновление, проверка доступа, расчёт статусов/прогресса).

- **Data Access Layer (repositories)** — `app/repositories/*.py`
  - SQLAlchemy запросы, CRUD, агрегаты, join’ы.

- **Persistence Model (ORM)** — `app/models/*.py`
  - SQLAlchemy модели (таблицы, связи, индексы/constraints).

- **DTO/Contracts (Pydantic schemas)** — `app/schemas/*.py`
  - request/response DTO, pagination Page[T], error envelope schema.

- **Realtime Subsystem (WS + presence + pub/sub)** — `app/realtime/*.py`
  - `ConnectionManager` (WS connections per classroom),
  - `RedisPubSubBroker` (fanout across instances),
  - `presence` / `auth` (валидация WS токенов, presence/typing).

- **Infrastructure / Cross-cutting** — `app/core/*`, `app/db/*`, `app/api/*`
  - конфигурация, логирование, request context, security (JWT + Argon2), pagination defaults, OpenAPI patching.

---

### 4) Компоненты по слоям: роль, ответственность, данные, взаимодействия

#### 4.1 API слой (контроллеры)

- **Роль**: публичный входной слой — маршрутизация HTTP/WS запросов, адаптация внешнего мира к use-cases.
- **Зона ответственности**:
  - принимают запросы (HTTP),
  - валидируют входные DTO (`app/schemas/*`),
  - получают зависимости через DI (`app/api/dependencies.py`),
  - вызывают соответствующие сервисы,
  - возвращают DTO-ответы,
  - не содержат бизнес-правил (кроме простого ветвления на уровне “какой сервис вызвать”).
- **Типы данных**:
  - вход: Pydantic request-схемы (`UserCreate`, `HomeworkCreate`, `AnswerSubmit`, ...),
  - выход: response-схемы (`ClassroomResponse`, `HomeworkDetailResponse`, `StatisticsResponse`, `Page[T]`, ...),
  - ошибки: envelope `ErrorResponse` (`app/schemas/errors.py`).
- **Точки взаимодействия**:
  - с DI: `get_current_user/get_current_teacher/get_current_student`,
  - с Service Layer: `app/services/*`,
  - с Realtime (для WS): `app/realtime/*` (через `app.state.*` и прямые вызовы).

Привязка к коду:
- Роутер v1: `app/api/v1/__init__.py`
- Контроллеры: `app/api/v1/*.py`

---

#### 4.2 Слой бизнес-логики (Service Layer)

**Общее назначение**: сервисы реализуют use-cases LMS, обеспечивая консистентность доменных правил и прав доступа.

##### 4.2.1 Auth / Identity

- **Компонент**: `AuthService` (`app/services/auth.py`)
- **Роль**: регистрация/логин, управление активной ролью (teacher/student), выдача JWT.
- **Данные**:
  - `User`, `LoginData`, `Teacher`, `Student` (`app/models/users.py`)
  - DTO: `UserCreate`, `LoginRequest`, `TokenResponse`, `UserRolesResponse` (`app/schemas/users.py`)
- **Взаимодействия**:
  - `core/security.py` (Argon2 hashing, JWT encode/decode),
  - `repositories/user.py` (UserRepository, LoginDataRepository, TeacherRepository, StudentRepository),
  - API endpoints: `app/api/v1/auth.py`.

##### 4.2.2 Classroom Management

- **Компонент**: `ClassroomService` (`app/services/classroom.py`)
- **Роль**: создание/обновление классов, управление инвайт-кодом, присоединение ученика, список учеников класса.
- **Данные**:
  - `Classroom`, `StudentClassroom`, `Invite` (`app/models/classes.py`)
  - DTO: `ClassroomCreate/Update/Response`, `JoinClassroomRequest`, `ClassroomStudentResponse` (`app/schemas/classrooms.py`)
- **Взаимодействия**:
  - `services/access_control.py` (проверки ownership/доступа),
  - `repositories/classroom.py`, `repositories/user.py`,
  - API endpoints: `app/api/v1/classrooms.py` (REST + WS-чат как часть контекста класса).

##### 4.2.3 Lessons & Content Binding

- **Компонент**: `LessonService`, `TheoryService` (`app/services/lesson.py`, `app/services/theory.py`)
- **Роль**:
  - уроки: публикация, список уроков по классу, привязка к классу,
  - теория: предметы/разделы/материалы и связь материалов с уроками (`LessonMaterial`).
- **Данные**:
  - `Lesson`, `LessonMaterial` (`app/models/lessons.py`),
  - `TheoryMaterial` и иерархия теории (`app/models/theory.py`),
  - DTO: `LessonCreate/Update/Response`, theory DTO (`app/schemas/lessons.py`, `app/schemas/theory.py`).
- **Взаимодействия**:
  - репозитории уроков/теории,
  - access control (teacher owns classroom),
  - API endpoints: `app/api/v1/lessons.py`, `app/api/v1/theory.py`.

##### 4.2.4 Homework & Problem Library

- **Компоненты**: `HomeworkService`, `ProblemService` (`app/services/homework.py`, `app/services/problem.py`)
- **Роль**:
  - сборка ДЗ из задач (problem_ids + points + order),
  - управление публикацией ДЗ,
  - выдача задач для ДЗ: teacher видит “полные” данные, student — “без ответов”.
- **Данные**:
  - `Homework`, `HomeworkProblem`, `Problem` (`app/models/homework.py`, `app/models/problems.py`)
  - DTO: `HomeworkCreate/Update/Response`, `ProblemResponse/ProblemFullResponse` (`app/schemas/homework.py`, `app/schemas/problems.py`)
- **Взаимодействия**:
  - репозитории: `repositories/homework.py`, `repositories/lesson.py`, `repositories/classroom.py`,
  - access control: teacher owns classroom, student access зависит от `is_published`,
  - API endpoints: `app/api/v1/homework.py`, `app/api/v1/problems.py`.

##### 4.2.5 Testing / Auto-checking

- **Компонент**: `TestingService` (`app/services/testing.py`)
- **Роль**: приём ответов ученика, базовая автопроверка, обновление статистики попыток.
- **Данные**:
  - `Statistics` (`app/models/homework.py`) как “срез состояния выполнения ДЗ студентом”,
  - вход: `AnswerSubmit`, выход: `StatisticsResponse` (`app/schemas/homework.py`).
- **Взаимодействия**:
  - `StatisticsRepository`, `HomeworkProblemRepository`, `ProblemRepository`,
  - API endpoints: `app/api/v1/testing.py`.

##### 4.2.6 Results / Progress / Statistics

- **Компонент**: `ResultService` (`app/services/result.py`)
- **Роль**: агрегирование прогресса ученика и сводных метрик (student progress, classroom progress), выдача попыток/статусов.
- **Данные**:
  - `Statistics` как факт попыток/статусов,
  - DTO: `StudentProgressResponse`, `ClassroomProgressResponse`, `StatisticsResponse`, `Page[T]`.
- **Взаимодействия**:
  - `StatisticsRepository` (в т.ч. агрегаты одной SQL-командой),
  - API endpoints: `app/api/v1/statistics.py`.

##### 4.2.7 Chat (domain + persistence)

- **Компонент**: `ChatService` (`app/services/chat.py`)
- **Роль**: гарантировать чат на класс (создание при необходимости), контроль доступа, хранение/выдача сообщений.
- **Данные**:
  - `Chat`, `Message` (`app/models/communication.py`)
  - DTO: `MessageCreate`, `MessageResponse`, `UserPublic` (`app/schemas/communication.py`)
- **Взаимодействия**:
  - `repositories/communication.py` (MessageRepository, ChatRepository),
  - `repositories/classroom.py` (membership проверки),
  - API endpoints: `app/api/v1/classrooms.py` (HTTP list/post + WS endpoint).

---

#### 4.3 Слой доступа к данным (Repository Layer)

- **Роль**: абстракция доступа к PostgreSQL, изоляция SQLAlchemy/SQL деталей от business logic.
- **Зона ответственности**:
  - CRUD, фильтрации, join’ы, агрегаты,
  - транзакционные границы в текущей реализации часто совпадают с repository методом (commit/refresh внутри BaseRepository).
- **Типы данных**:
  - вход: примитивы/идентификаторы/параметры пагинации,
  - выход: ORM модели (`app/models/*`).
- **Точки взаимодействия**:
  - вызываются сервисами (`app/services/*`),
  - используют `AsyncSession` (`app/db/session.py`),
  - отражают структуру таблиц и связей (`app/models/*`).

Привязка к коду:
- `BaseRepository` — `app/repositories/base.py` (общие операции).
- Доменные репозитории — `app/repositories/{user,classroom,lesson,homework,communication}.py`.

---

#### 4.4 Модель данных (ORM) и DTO

##### ORM модель (Persistence Model)

- **Роль**: формальная модель таблиц/связей, которая определяет “физическую” структуру данных.
- **Ключевые сущности** (примерный состав для UML):
  - Identity: `User`, `LoginData`, `Teacher`, `Student`
  - Academic: `Classroom`, `StudentClassroom`, `Lesson`, `LessonMaterial`
  - Content: `Problem`, `Homework`, `HomeworkProblem`, `TheoryMaterial` (+ иерархия теории)
  - Communication: `Chat`, `Message`
  - Analytics: `Statistics`
- **Точки взаимодействия**:
  - репозитории (SQLAlchemy запросы),
  - миграции Alembic (эволюция схемы).

##### DTO / Schemas (Contracts)

- **Роль**: стабильный контракт на границе API и внутри сервисов (request/response модели).
- **Зона ответственности**:
  - входная валидация (FastAPI + Pydantic),
  - сериализация ответов (ORM -> DTO).
- **Точки взаимодействия**:
  - API слой использует схемы как публичный контракт,
  - сервисы формируют/возвращают DTO, но не зависят от HTTP.

---

#### 4.5 Инфраструктурные модули (cross-cutting / platform)

##### 4.5.1 Конфигурация и окружение

- **Компонент**: `app/core/config.py`
- **Роль**: единственный источник конфигурации (DB URL, CORS, JWT, pagination limits, realtime settings).
- **Взаимодействия**:
  - `db/session.py` (создание engine),
  - `main.py` (CORS/middleware, поведение debug),
  - security/logging.

##### 4.5.2 Security

- **Компонент**: `app/core/security.py`
- **Роль**: Argon2id hashing + JWT (в токене содержится `sub` и `role`).
- **Взаимодействия**:
  - `api/dependencies.py` декодирует токен и проверяет `role` (сценарий `role_changed`).

##### 4.5.3 Единый request_id и формат ошибок

- **Request ID middleware**: `app/api/middleware/request_id.py`
  - читает/генерирует `X-Request-ID`, кладёт в `ContextVar`, возвращает в response header.
- **Error mapping**: `app/api/errors.py` + `app/domain/errors.py`
  - доменные ошибки сервисов конвертируются в стабильный HTTP envelope:
    - `{ error: { code, message, meta }, request_id }`.
- **OpenAPI patch**: `app/api/openapi.py`
  - включает `ErrorResponse` в компоненты схемы и добавляет стандартные error responses ко всем операциям (важно для генерации клиента).

##### 4.5.4 Pagination policy

- **Компоненты**: `app/core/pagination.py`, `app/api/pagination.py`
- **Роль**: единые defaults/лимиты и валидация `skip/limit` на уровне API (`limit <= MAX_LIMIT`, сейчас это 100).
- **Взаимодействия**:
  - используется всеми list endpoints (`Page[T]`).

##### 4.5.5 Realtime (WS + Redis fanout)

- **Компоненты**:
  - `ConnectionManager` (`app/realtime/connection_manager.py`) — удерживает WS соединения по classroom_id и делает broadcast.
  - `RedisPubSubBroker` (`app/realtime/redis_pubsub.py`) — публикация и подписка на каналы `chat.classroom.{id}` для multi-instance.
  - `presence` / `auth` (`app/realtime/presence.py`, `app/realtime/auth.py`) — механика presence/typing и авторизации WS.
- **Точки взаимодействия**:
  - инициализация в `app/main.py` (startup/shutdown),
  - WS endpoint в `app/api/v1/classrooms.py`.

##### 4.5.6 Скрипты платформы

- **Компонент**: `app/scripts/export_openapi.py`
- **Роль**: “официальный” путь экспорта OpenAPI контракта в артефакт для фронтенда (контракт-центричное взаимодействие).

---

### 5) Ключевые потоки взаимодействия (сценарии на уровне компонентов)

#### 5.1 Аутентификация и роль

- Frontend вызывает `auth` endpoint → получает JWT.
- Все защищённые endpoints используют `get_current_user`:
  - декодирует JWT,
  - проверяет пользователя в БД,
  - сверяет `token.role` с `user.role` (иначе `role_changed`).

**Архитектурный смысл**: роль — часть токена; смена роли требует обновления токена на фронтенде.

#### 5.2 “Учитель создаёт ДЗ из базы задач”

- API: `POST /homework` → Service `HomeworkService.create_homework`:
  - проверяет lesson/classroom ownership,
  - создаёт Homework,
  - создаёт HomeworkProblem связи с points/order.
- Репозитории фиксируют изменения в БД (commit), возвращают ORM модели → DTO.

#### 5.3 “Ученик решает ДЗ”

- API: `GET /homework/{id}` + `GET /homework/{id}/problems`
  - `HomeworkService` скрывает correct_answer для student.
- API: `POST /testing/submit-answer`
  - `TestingService` валидирует принадлежность problem ↔ homework, обновляет `Statistics`.
- API: `POST /testing/homework/{id}/submit`
  - статус `submitted` (итоговая фиксация).

#### 5.4 “Статистика”

- Student: `GET /statistics/me`, `GET /statistics/me/progress`
- Teacher: `GET /statistics/homework/{homework_id}`, `GET /statistics/classroom/{classroom_id}/progress`, `GET /statistics/student/{student_user_id}`

Сервис `ResultService` агрегирует summary, `StatisticsRepository` делает агрегаты одной SQL-командой.

#### 5.5 Чат класса (HTTP + WS)

- HTTP:
  - `ChatService` гарантирует доступ и хранение сообщений (`MessageRepository`).
- WS:
  - `ConnectionManager` держит соединения,
  - при наличии Redis — `RedisPubSubBroker` масштабирует broadcast на несколько инстансов.

---

### 6) Резюме для UML-диаграммы компонентов

Если рисовать UML component diagram, минимальный набор компонентов и связей:

- **Frontend UI** ⇄ (**REST API** / **WS Chat Gateway**) → **Service Layer** → **Repository Layer** → **PostgreSQL**
- **WS Chat Gateway** ⇄ **Realtime Subsystem** → (**Redis Pub/Sub**, опционально) → **WS Broadcast**
- **Service Layer** → **Core/Security/Config/Logging** (cross-cutting)
- **Backend** → **OpenAPI Provider** (контракт для генерации клиента фронтенда)


