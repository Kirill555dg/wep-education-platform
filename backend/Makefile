PYTHON ?= python3.13
UV ?= uv
APP_MODULE ?= app.main:app
HOST ?= 0.0.0.0
PORT ?= 8000

.PHONY: install sync lint format type test check run dev clean

install:
	$(UV) venv --python $(PYTHON)
	$(UV) pip sync requirements.txt

sync:
	$(UV) pip sync requirements.txt

lint:
	$(UV) run ruff check app tests

format:
	$(UV) run ruff format app tests

type:
	$(UV) run mypy --config-file mypy.ini app

test:
	$(UV) run pytest

check: lint type test

run:
	$(UV) run uvicorn $(APP_MODULE) --host $(HOST) --port $(PORT)

dev:
	$(UV) run uvicorn $(APP_MODULE) --reload --host $(HOST) --port $(PORT)

clean:
	rm -rf .venv
