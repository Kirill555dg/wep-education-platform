# Production-ready Frontend TODO (WEP)

Документ фиксирует **полный план работ** по доведению фронтенда WEP до production-ready состояния с соблюдением **Feature-Sliced Design (FSD)** и использованием **generated OpenAPI client** как единственного источника типов/контракта.

## Цель

- **Стабильный MVP** (teacher + student + chat + stats) на реальном backend.
- **Production-ready качество**: предсказуемый state, единая обработка ошибок, a11y минимум, воспроизводимые окружения, Cypress покрытие основных и негативных сценариев.

## Окружение и допущения (фиксируем как контракт)

- **Frontend dev**: `http://localhost:5173`
- **Backend**: `http://127.0.0.1:8023`
- **Auth**: JWT в `localStorage` (ключи: `access_token`, `user`)
- **API types/source**: `frontend/src/shared/api/openapi.json`
- **Client generator**: `openapi-typescript-codegen` → `frontend/src/shared/api/generated/*`
- **Все вызовы**: только через `frontend/src/shared/api/*` врапперы, внутри — только `generated/services/*`

### Обновление OpenAPI (строго)

- `openapi.json` **нельзя** скачивать вручную/через `curl`.
- Источник истины: backend schema из приложения.
- Единственный допустимый способ обновить `frontend/src/shared/api/openapi.json`:
  - `cd backend && make openapi-export`
  - (или эквивалентно) `python -m app.scripts.export_openapi --out ../frontend/src/shared/api/openapi.json`

## Архитектурные правила (FSD)

- **shared/api**: конфиг OpenAPI клиента + тонкие врапперы (только маппинг/ошибки/удобные сигнатуры).
- **entities**: доменные модели/стор (session, classroom, lesson, homework, chat, statistics, theory).
- **features**: use-case уровень (формы, экшены, хелперы) без “страничной” композиции.
- **widgets**: крупные блоки (layout, header, chat widget, dashboards).
- **pages**: композиция из features/widgets, маршруты.
- **app**: провайдеры, роутинг, guards, bootstrap.

## Must-have нефункциональные требования

- **Единая ошибка UX**:
  - `ErrorBoundary` для неожиданных ошибок рендера.
  - `toast` для transient ошибок.
  - inline ошибки рядом с полями формы + общая error-summary.
- **Loading UX**:
  - skeletons/empty states на всех list/detail экранах.
  - защита от “миганий”: минимальная задержка/переключения.
- **Auth/Session**:
  - единый bootstrap `me()` при старте приложения.
  - корректная обработка `role_changed` (401 + error code) → принудительная переавторизация.
  - logout очищает состояние и storage.
- **A11y minimum**:
  - корректные `label`/`aria-*`, таб-навигация, focus states.
- **Observability**:
  - `X-Request-ID` для корреляции, фронтовый логгер (в dev) без спама.
- **Security**:
  - без XSS-инъекций в html (никаких `dangerouslySetInnerHTML` без санитайза).
  - валидация и экранирование пользовательского ввода в UI.

## Технический TODO (по подсистемам)

### 1) shared/api (контракт, ошибки, конфиг)

- [ ] **Стабильный baseUrl**:
  - [ ] единая стратегия env: `VITE_API_URL` + дефолт `http://127.0.0.1:8023`.
  - [ ] документировать env для Cypress/CI.
- [ ] **Единый error-parser**:
  - [ ] типизация error-envelope `{ error: { code, message, meta }, request_id }`.
  - [ ] helpers: `getErrorMessage`, `getErrorCode`, `isRoleChanged`, `getRequestId`.
- [ ] **Запрет прямых импортов generated services из UI**:
  - [ ] линтер-правило/арх-проверка (если есть инфраструктура) либо code review правило.
- [ ] **Тесты**:
  - [ ] unit: error parsing (envelope + fallbacks).
  - [ ] unit: session bootstrap (token present/absent, role_changed).

### 2) entities/session (auth state)

- [ ] zustand store:
  - [ ] `bootstrap()` (me) + idempotency.
  - [ ] `login()`/`register()` flows, сохранение token/user.
  - [ ] `logout()` + clear storage.
  - [ ] обработка `role_changed` (триггер re-login).
- [ ] unit tests (bun/vitest):
  - [ ] bootstrap with/without token.
  - [ ] logout clears state/storage.

### 3) Teacher flow (классы → уроки → ДЗ → задачи)

- [ ] **TeacherHome**:
  - [ ] список классов (pagination), create classroom.
  - [ ] empty state + error state.
- [ ] **TeacherClassroom**:
  - [ ] детали класса (invite code, students list).
  - [ ] create lesson (автопубликация/ручная публикация — уточнить контракт).
  - [ ] chat widget.
- [ ] **TeacherLesson**:
  - [ ] create homework (автопубликация/ручная публикация — уточнить).
  - [ ] attach problems (list/select/create).
  - [ ] publish toggle (если нужен).
- [ ] **Teacher stats**:
  - [ ] classroom progress (если endpoint есть) + UI.
  - [ ] homework stats page (teacher view).

### 4) Student flow (join → уроки → ДЗ → решение)

- [ ] **StudentHome**:
  - [ ] список классов + прогресс “Мой прогресс”.
- [ ] **Join class**:
  - [ ] join by invite code (валидировать формат, показать ошибки).
- [ ] **StudentClassroom**:
  - [ ] список уроков (только published).
  - [ ] chat widget.
- [ ] **StudentLesson**:
  - [ ] список ДЗ (published).
- [ ] **StudentHomework**:
  - [ ] список задач/1 задача (минимум) + форма ответа.
  - [ ] submit answer (обновление статистики, toast + inline feedback).
  - [ ] (опционально) submit homework / status.

### 5) Chat (HTTP + WS)

- [ ] **WS подключение**:
  - [ ] авторизация через `?token=<jwt>` согласно backend.
  - [ ] reconnect/backoff.
  - [ ] graceful fallback: если WS недоступен — polling/history.
- [ ] **History pagination**:
  - [ ] tail load + before_id pagination.
- [ ] **Presence/typing** (если используется):
  - [ ] отображение online/typing, TTL refresh.
- [ ] **Тесты**:
  - [ ] Cypress: чат отправка/получение сообщения в классе.

### 6) Routing/Guards

- [ ] RequireAuth:
  - [ ] redirect to `/auth/login` если нет сессии.
- [ ] RequireRole:
  - [ ] защита teacher/student страниц.
- [ ] UX:
  - [ ] “loading session” экран во время bootstrap.

### 7) UI/UX консистентность

- [ ] unified design system: использовать `shared/ui/*`.
- [ ] consistent empty/skeleton/error states.
- [ ] forms:
  - [ ] validation messages, disabled submit while loading.

## Cypress E2E: обязательные сценарии

### Общие предпосылки

- backend поднят на `127.0.0.1:8023`
- frontend поднят на `localhost:5173`
- e2e **создают данные через публичные endpoint’ы** (register/login/create class/…)

### Auth

- [ ] register teacher → login → logout (happy path)
- [ ] register student → login → logout (happy path)
- [ ] login wrong password (негативный)
- [ ] expired/invalid token (негативный): редирект на login

### Teacher → Student end-to-end (главный MVP флоу)

- [ ] teacher: create classroom → create lesson → create homework + attach problem → publish
- [ ] student: register → join classroom by invite code → open lesson → open homework → submit answer
- [ ] verify: student sees progress updated (карточка “Мой прогресс”)

### Chat

- [ ] teacher creates classroom → opens chat → sends message
- [ ] student joins same classroom → opens chat → sees message (WS или fallback)

### Негативные сценарии (минимум)

- [ ] student пытается открыть teacher route → 403 UX/redirect
- [ ] join with invalid invite code → inline error
- [ ] submit empty answer → validation error

## Unit/Integration tests (bun/vitest)

- [ ] `shared/api/errors` — уже есть, расширить покрытие (request_id, meta, role_changed)
- [ ] `entities/session` store — bootstrap/login/logout
- [ ] smoke-тесты UI компонентов (минимально, без фанатизма)

## CI/Dev ergonomics

- [ ] команды:
  - [ ] `bun test` (unit)
  - [ ] `bun run typecheck`
  - [ ] `bun run lint` (если есть)
  - [ ] `cypress run` (e2e)
- [ ] документация:
  - [ ] как поднимать backend + seed (или e2e без seed)
  - [ ] как генерить `openapi.json` и client

## “Готово” (Definition of Done)

- основные teacher/student/chat/stats сценарии покрыты Cypress
- есть негативные сценарии (auth/roles/validation)
- нет прямых вызовов generated services из pages/widgets
- стабильный baseUrl + отсутствуют “магические” переписывания URL в рантайме
- единые error/loading/empty UX паттерны


