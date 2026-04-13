# Документация разработчика

Этот каталог содержит автоматически генерируемую документацию для Web Education Platform Backend.

## Быстрый старт

### 1. Установка зависимостей

```bash
pip install sphinx sphinx-autodoc-typehints sphinx-rtd-theme
```

### 2. Генерация и просмотр документации

**Полная перегенерация (рекомендуется):**

```bash
cd docs/
make all
```

Эта команда:
1. Очистит старые файлы
2. Сгенерирует .rst файлы из Python кода
3. Соберёт HTML документацию

**Просмотр в браузере:**

```bash
make view
```

## Команды Makefile

| Команда | Описание |
|---------|----------|
| `make all` | Полная перегенерация (clean + apidoc + html) |
| `make apidoc` | Только генерация .rst из Python кода |
| `make html` | Только сборка HTML из существующих .rst |
| `make clean` | Удалить сгенерированные файлы |
| `make view` | Открыть документацию в браузере |
| `make help` | Показать справку |

## Ручная генерация (без Makefile)

### Шаг 1: Генерация .rst файлов

```bash
cd /Users/kerrodar/Dev/wep-education-platform/backend
sphinx-apidoc -o docs/ app/ -f -e -M --tocfile modules
```

**Параметры:**
- `-o docs/` - выходная директория
- `app/` - исходный код для анализа
- `-f` - перезаписать существующие файлы
- `-e` - отдельная страница для каждого модуля
- `-M` - поместить документацию модулей перед документацией подмодулей
- `--tocfile modules` - имя файла оглавления

### Шаг 2: Сборка HTML

```bash
cd docs/
sphinx-build -b html . _build/html
```

### Шаг 3: Просмотр

```bash
# macOS
open _build/html/index.html

# Linux
xdg-open _build/html/index.html

# Windows
start _build/html/index.html
```

## Когда обновлять документацию

Обновляй документацию после:

1. **Добавления новых модулей/классов/функций**
   ```bash
   cd docs/
   make all
   ```

2. **Изменения docstrings** (описания в коде)
   ```bash
   cd docs/
   make html  # Быстрая пересборка без перегенерации .rst
   ```

3. **Ручного редактирования .rst файлов** (index.rst, architecture.rst)
   ```bash
   cd docs/
   make html
   ```

## Автоматическое обновление

Sphinx не обновляется автоматически. Нужно вручную запускать команды после изменений.

**Лайфхак для автоматической перегенерации при сохранении файлов:**

```bash
# Установить sphinx-autobuild
pip install sphinx-autobuild

# Запустить live-reload сервер
cd docs/
sphinx-autobuild . _build/html --watch ../app
```

Откроет http://127.0.0.1:8000 и будет автоматически пересобирать при изменениях!

## Структура проекта

```
backend/
├── app/                  # Исходный код приложения
│   ├── api/             # API эндпоинты
│   ├── services/        # Бизнес-логика
│   ├── models/          # ORM модели
│   ├── repositories/    # Репозитории
│   └── ...
└── docs/                # Документация
    ├── conf.py          # Конфигурация Sphinx
    ├── index.rst        # Главная страница
    ├── Makefile         # Команды для генерации
    ├── app*.rst         # Автогенерированные файлы (НЕ редактировать!)
    ├── modules.rst      # Автогенерированный индекс модулей
    └── _build/          # Скомпилированная HTML (игнорируется git)
```

## Игнорирование в Git

Добавь в `.gitignore`:

```gitignore
# Sphinx documentation
docs/_build/
docs/app*.rst
docs/modules.rst
```

Храним в git только:
- `conf.py` - конфигурация
- `index.rst`, `introduction.rst`, `architecture.rst` - ручные страницы
- `Makefile` - команды для генерации
- `README.md` - инструкция

## Google-style Docstrings

Используй этот стиль для документирования кода:

```python
def authenticate(username: str, password: str) -> User | None:
    """
    Аутентификация пользователя
    
    Проверяет учётные данные и возвращает пользователя при успехе.
    
    Args:
        username: Имя пользователя или email
        password: Пароль в открытом виде
        
    Returns:
        Объект User при успешной аутентификации, None если неудача
        
    Raises:
        DatabaseError: При ошибке подключения к БД
        
    Example:
        >>> user = authenticate("admin", "secret")
        >>> print(user.email)
        admin@example.com
    """
    pass
```

## Форматы экспорта

Помимо HTML, Sphinx может генерировать:

**PDF через LaTeX:**
```bash
sphinx-build -b latex . _build/latex
cd _build/latex
make
```

**ePub (электронная книга):**
```bash
sphinx-build -b epub . _build/epub
```

**Man pages:**
```bash
sphinx-build -b man . _build/man
```

## Решение проблем

**Ошибка: "No module named 'app'"**

Убедись, что путь к app корректен в `conf.py`:

```python
sys.path.insert(0, os.path.abspath('..'))
```

**Документация не обновляется**

Попробуй полную перегенерацию:

```bash
make clean
make all
```

**Broken links в документации**

Запусти проверку ссылок:

```bash
sphinx-build -b linkcheck . _build/linkcheck
```

## Полезные ссылки

- [Sphinx Documentation](https://www.sphinx-doc.org/)
- [Read the Docs Theme](https://sphinx-rtd-theme.readthedocs.io/)
- [Google Style Guide](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)

