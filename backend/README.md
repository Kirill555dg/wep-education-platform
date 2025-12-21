# 🎓 Web Education Platform — Backend API

Backend для образовательной веб-платформы, построенный на **FastAPI** с использованием многослойной архитектуры.

## 🏗️ Архитектура

Проект следует **многослойной архитектуре** с четким разделением ответственности:

```
backend/
├── app/
│   ├── main.py              # Точка входа FastAPI приложения
│   │
│   ├── api/                 # Слой контроллеров (API endpoints)
│   │   └── v1/             # API версии 1
│   │       ├── health.py   # Health check endpoints
│   │       └── ...         # Другие endpoint модули
│   │
│   ├── services/            # Слой бизнес-логики (Service Layer)
│   │   └── ...             # Сервисы обработки бизнес-правил
│   │
│   ├── repositories/        # Слой доступа к данным (Repository Pattern)
│   │   └── ...             # Репозитории для работы с БД
│   │
│   ├── models/              # ORM модели (SQLAlchemy)
│   │   └── ...             # Модели базы данных
│   │
│   ├── schemas/             # Pydantic схемы (DTO)
│   │   └── ...             # Схемы валидации и сериализации
│   │
│   ├── core/                # Конфигурация приложения
│   │   ├── config.py       # Настройки (через Pydantic Settings)
│   │   └── ...             # Другие общие модули
│   │
│   └── db/                  # Настройка базы данных
│       └── session.py      # Сессии SQLAlchemy, Base
│
├── pyproject.toml           # Зависимости проекта
├── .env.example             # Пример переменных окружения
├── .gitignore               # Git ignore
└── README.md                # Этот файл
```

---

## 📚 Описание слоев

### 1. **API Layer** (`app/api/`)

**Назначение**: Обработка HTTP-запросов, валидация входных данных, формирование ответов.

**Ответственность**:
- Определение endpoint'ов (маршрутов)
- Валидация запросов через Pydantic схемы
- Вызов сервисного слоя
- Обработка исключений и формирование HTTP-ответов

**Пример**:
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()

@router.post("/users", response_model=UserResponse)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    service = UserService(db)
    return service.create_user(user_data)
```

---

### 2. **Service Layer** (`app/services/`)

**Назначение**: Бизнес-логика приложения.

**Ответственность**:
- Реализация бизнес-правил
- Координация между репозиториями
- Обработка транзакций
- Валидация на уровне бизнес-логики

**Пример**:
```python
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate

class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)
    
    def create_user(self, user_data: UserCreate):
        # Бизнес-логика: проверка уникальности email
        existing = self.repository.get_by_email(user_data.email)
        if existing:
            raise ValueError("User with this email already exists")
        
        # Создание пользователя
        return self.repository.create(user_data)
```

**Правила**:
- ❌ Сервисы НЕ должны знать о HTTP, request/response
- ✅ Сервисы работают с доменными объектами и схемами
- ✅ Один сервис = одна бизнес-сущность или процесс

---

### 3. **Repository Layer** (`app/repositories/`)

**Назначение**: Абстракция работы с базой данных.

**Ответственность**:
- CRUD операции
- Сложные запросы к БД
- Инкапсуляция деталей работы с SQLAlchemy

**Пример**:
```python
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate

class UserRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, user_id: int) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()
    
    def create(self, user_data: UserCreate) -> User:
        user = User(**user_data.dict())
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
```

**Правила**:
- ❌ Репозитории НЕ содержат бизнес-логику
- ✅ Репозитории работают только с ORM моделями
- ✅ Один репозиторий = одна таблица/сущность

---

### 4. **Models** (`app/models/`)

**Назначение**: ORM модели SQLAlchemy.

**Ответственность**:
- Определение структуры таблиц БД
- Связи между таблицами (relationships)
- Индексы, ограничения

**Пример**:
```python
from sqlalchemy import Column, Integer, String, Boolean
from app.db.session import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
```

---

### 5. **Schemas** (`app/schemas/`)

**Назначение**: Pydantic схемы для валидации и сериализации данных (DTO - Data Transfer Objects).

**Ответственность**:
- Валидация входных данных
- Сериализация выходных данных
- Документация API (автоматическая через OpenAPI)

**Пример**:
```python
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True  # для SQLAlchemy моделей
```

**Типы схем**:
- `*Base` — базовые поля
- `*Create` — для создания (POST)
- `*Update` — для обновления (PUT/PATCH)
- `*Response` — для ответов API
- `*InDB` — внутреннее представление с хэшами паролей и т.д.

---

## 🛠 Технологии

- **FastAPI** — современный веб-фреймворк для Python
- **SQLAlchemy** — ORM для работы с базами данных
- **Pydantic v2 + pydantic-settings** — валидация данных и конфигурация через `.env`
- **Uvicorn** — ASGI-сервер
- **Alembic** — миграции базы данных
- **Python-JOSE** — JWT токены
- **Argon2 (argon2-cffi)** — хеширование паролей
- **Ruff** — линтинг и форматирование
- **mypy** — статическая проверка типов
- **uv** — быстрый менеджер окружений и зависимостей

---

## 🚀 Быстрый старт

### 🐳 Docker (Рекомендуется)

**Запуск всей системы (backend + frontend + database):**

```bash
# Из корня репозитория
docker-compose up -d
```

**Приложение будет доступно:**
- 🚀 API: http://localhost:8000
- 📖 Swagger UI: http://localhost:8000/api/docs
- 📘 ReDoc: http://localhost:8000/api/redoc
- 🌐 Frontend: http://localhost

**Полезные команды:**
```bash
# Просмотр логов backend
docker-compose logs -f backend

# Перезапуск backend после изменений
docker-compose up -d --build backend

# Остановка
docker-compose down
```

### 💻 Локальная разработка

#### 1. Установка зависимостей (Python 3.13, uv)

```bash
# Из директории backend/
make install
```

#### 2. Настройка окружения

Скопируйте `.env.example` в `.env` и настройте переменные:

```bash
cp .env.example .env
```

**Важно**: Для локальной разработки убедитесь, что PostgreSQL запущен:

```bash
# Из корня репозитория
cd database
make up
```

#### 3. Запуск миграций

```bash
# Из директории backend/
uv run alembic upgrade head

# Создать новую миграцию (при изменении моделей)
uv run alembic revision --autogenerate -m "описание изменений"
```

#### 4. Запуск сервера

```bash
# Из директории backend/
make dev
```

#### Полезные команды

- `make lint` — Ruff (линтер)
- `make format` — Ruff (форматирование)
- `make type` — mypy (проверка типов)
- `make test` — pytest
- `make check` — линт + типы + тесты
- `make run` — uvicorn без `--reload`
- `make sync` — синхронизация зависимостей из `requirements.txt`

**Приложение будет доступно:**
- API: http://localhost:8000
- Документация (Swagger): http://localhost:8000/api/docs
- Документация (ReDoc): http://localhost:8000/api/redoc

---

## 📡 API Endpoints

### Health Check

- **GET** `/api/v1/health` — проверка состояния приложения
- **GET** `/api/v1/ping` — простой ping-pong

### Пример запроса:

```bash
curl http://localhost:8000/api/v1/health
```

**Ответ**:
```json
{
  "status": "healthy",
  "app_name": "Web Education Platform API",
  "version": "1.0.0",
  "timestamp": "2024-01-01T12:00:00"
}
```

---

## 🗄️ База данных

### SQLite (по умолчанию)

Для разработки используется **SQLite**:
```env
DATABASE_URL="sqlite:///./wep_education.db"
```

### PostgreSQL (для продакшена)

Для продакшена рекомендуется **PostgreSQL**:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/wep_education"
```

Драйвер `psycopg[binary]` уже прописан в `requirements.txt`.

---

## 🧪 Тестирование

```bash
# Запуск тестов
make test

# Полный прогон качества
make check
```

---

## 🔧 Инструменты разработки

Используем единый набор команд через `make` (см. раздел "Локальная разработка"). Линтинг выполняет только Ruff, типы проверяет mypy с конфигом `backend/mypy.ini`.

---

## 📝 Принципы разработки

### 1. Dependency Injection

Используйте FastAPI Depends для внедрения зависимостей:

```python
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    ...
```

### 2. Разделение ответственности

- **Контроллеры** (API) → HTTP-логика
- **Сервисы** → Бизнес-логика
- **Репозитории** → Работа с БД
- **Модели** → Структура данных
- **Схемы** → Валидация и сериализация

### 3. Типизация

Используйте типы Python везде:

```python
import typing as tp
from sqlalchemy.orm import Session

def get_user(user_id: int, db: Session) -> User | None:
    ...
```

### 4. Обработка ошибок

Используйте HTTPException для API ошибок:

```python
from fastapi import HTTPException, status

if not user:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )
```

---

## 🔐 Безопасность

- **Хеширование паролей**: используйте `passlib` с bcrypt
- **JWT токены**: для аутентификации
- **CORS**: настроен для фронтенда
- **Environment variables**: все секреты в `.env`

---

## 📄 License

MIT

---

**Разработка: МИРЭА — РТУ**  
**Проект: Курсовая работа ACSA**

