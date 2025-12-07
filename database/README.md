# 🗄️ Database — PostgreSQL Setup

Инфраструктура базы данных для Web Education Platform.

## 📋 Содержание

- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Структура](#структура)
- [Команды Make](#команды-make)
- [Подключение к БД](#подключение-к-бд)
- [Backup и восстановление](#backup-и-восстановление)
- [Production деплой](#production-деплой)

---

## 📦 Требования

- **Docker** >= 20.10
- **Docker Compose** >= 2.0

### Установка Docker

#### macOS:
```bash
brew install --cask docker
```

#### Linux:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose-plugin

# Arch Linux
sudo pacman -S docker docker-compose
```

---

## 🚀 Быстрый старт

### 1. Настройка окружения

Скопируйте пример конфигурации:

```bash
cd database
cp .env.example .env
```

Отредактируйте `.env` и измените пароли:

```env
POSTGRES_USER=wep_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=wep_education
POSTGRES_PORT=5432
```

### 2. Запуск PostgreSQL

```bash
make up
```

Или вручную:

```bash
docker-compose up -d postgres
```

### 3. Проверка состояния

```bash
make ps
```

Вывод:
```
NAME                 IMAGE                 STATUS       PORTS
wep_education_db     postgres:16-alpine    Up 2 min     0.0.0.0:5432->5432/tcp
```

---

## 📁 Структура

```
database/
├── docker-compose.yml    # Docker Compose конфигурация
├── Makefile             # Команды для управления БД
├── .env.example         # Пример переменных окружения
├── .gitignore
│
├── scripts/             # SQL скрипты инициализации
│   └── init.sql        # Создание extensions, настройка
│
└── backups/            # Резервные копии БД
    └── .gitkeep
```

---

## 🔧 Команды Make

### Основные команды

| Команда | Описание |
|---------|----------|
| `make help` | Показать все доступные команды |
| `make up` | Запустить PostgreSQL |
| `make up-all` | Запустить PostgreSQL + pgAdmin |
| `make down` | Остановить контейнеры |
| `make restart` | Перезапустить контейнеры |
| `make logs` | Показать логи PostgreSQL |
| `make ps` | Статус контейнеров |

### Работа с БД

| Команда | Описание |
|---------|----------|
| `make exec` | Подключиться через psql |
| `make backup` | Создать backup |
| `make restore` | Восстановить из backup |
| `make clean` | Удалить контейнеры и данные ⚠️ |

---

## 🔌 Подключение к БД

### Через psql (в контейнере)

```bash
make exec
```

Или:

```bash
docker-compose exec postgres psql -U wep_user -d wep_education
```

### Через psql (локально)

Если у вас установлен PostgreSQL клиент:

```bash
psql -h localhost -p 5432 -U wep_user -d wep_education
```

### Из приложения (Python)

**Connection String:**
```
postgresql://wep_user:wep_password@localhost:5432/wep_education
```

**SQLAlchemy:**
```python
from sqlalchemy import create_engine

DATABASE_URL = "postgresql://wep_user:wep_password@localhost:5432/wep_education"
engine = create_engine(DATABASE_URL)
```

### Через pgAdmin (опционально)

Запустите с pgAdmin:

```bash
make up-all
```

Откройте: http://localhost:5050

**Данные для входа:**
- Email: `admin@wep.local`
- Password: `admin`

**Настройка подключения к серверу:**
- Host: `postgres` (имя сервиса в docker-compose)
- Port: `5432`
- Username: `wep_user`
- Password: `wep_password`

---

## 💾 Backup и восстановление

### Создание backup

```bash
make backup
```

Backup сохраняется в `backups/backup_YYYYMMDD_HHMMSS.sql`

### Восстановление из backup

⚠️ **Внимание:** Это перезапишет текущие данные!

```bash
make restore
```

### Ручной backup

```bash
# Backup всей БД
docker-compose exec -T postgres pg_dump -U wep_user wep_education > my_backup.sql

# Backup только схемы
docker-compose exec -T postgres pg_dump -U wep_user --schema-only wep_education > schema.sql

# Backup только данных
docker-compose exec -T postgres pg_dump -U wep_user --data-only wep_education > data.sql
```

### Ручное восстановление

```bash
docker-compose exec -T postgres psql -U wep_user -d wep_education < my_backup.sql
```

---

## 🌍 Production деплой

### Вариант 1: Docker Compose на сервере

1. Скопируйте директорию `database/` на сервер

2. Создайте `.env` с безопасными паролями:
```bash
POSTGRES_USER=wep_user
POSTGRES_PASSWORD=$(openssl rand -hex 32)
POSTGRES_DB=wep_education
POSTGRES_PORT=5432
```

3. Запустите:
```bash
docker-compose up -d postgres
```

4. Настройте автоматические backup:
```bash
# Добавьте в crontab
0 2 * * * cd /path/to/database && make backup
```

### Вариант 2: Managed PostgreSQL (рекомендуется)

Для продакшена лучше использовать managed решения:

- **AWS RDS PostgreSQL**
- **Google Cloud SQL**
- **Azure Database for PostgreSQL**
- **DigitalOcean Managed Databases**
- **Supabase** (PostgreSQL as a Service)

**Преимущества:**
- ✅ Автоматические backup
- ✅ Высокая доступность
- ✅ Масштабирование
- ✅ Мониторинг
- ✅ Безопасность

### Переменные окружения для backend

После настройки БД обновите `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@host:port/database

# Пример для localhost
DATABASE_URL=postgresql://wep_user:wep_password@localhost:5432/wep_education

# Пример для production
DATABASE_URL=postgresql://user:pass@db.example.com:5432/wep_education
```

---

## 🔐 Безопасность

### Для разработки

- ✅ Используйте простые пароли в `.env`
- ✅ Не коммитьте `.env` в git

### Для продакшена

- ✅ Используйте сложные пароли (минимум 32 символа)
- ✅ Храните пароли в секретах (Kubernetes Secrets, AWS Secrets Manager)
- ✅ Используйте SSL/TLS для подключений
- ✅ Ограничьте сетевой доступ (firewall, VPC)
- ✅ Регулярно обновляйте PostgreSQL
- ✅ Настройте автоматические backup
- ✅ Включите логирование и мониторинг

---

## 🛠 Дополнительные команды

### Просмотр логов

```bash
# Все логи
make logs

# Последние 100 строк
docker-compose logs --tail=100 postgres

# В реальном времени
docker-compose logs -f postgres
```

### Проверка здоровья БД

```bash
docker-compose exec postgres pg_isready -U wep_user -d wep_education
```

### Список баз данных

```bash
docker-compose exec postgres psql -U wep_user -c "\l"
```

### Размер БД

```bash
docker-compose exec postgres psql -U wep_user -d wep_education -c "
  SELECT pg_size_pretty(pg_database_size('wep_education'));
"
```

### Активные подключения

```bash
docker-compose exec postgres psql -U wep_user -d wep_education -c "
  SELECT * FROM pg_stat_activity;
"
```

---

## 🐛 Troubleshooting

### Контейнер не запускается

Проверьте логи:
```bash
docker-compose logs postgres
```

### Порт 5432 занят

Измените порт в `.env`:
```env
POSTGRES_PORT=5433
```

### Забыли пароль

Пересоздайте контейнер:
```bash
make clean
make up
```

### Нехватка места

Очистите старые volumes:
```bash
docker volume prune
```

---

## 📚 Дополнительные ресурсы

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [pg_dump Documentation](https://www.postgresql.org/docs/current/app-pgdump.html)

---

**Разработка: МИРЭА — РТУ**  
**Проект: Курсовая работа ACSA**

