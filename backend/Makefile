PYTHON ?= python3.13
UV ?= uv
UV_RUN ?= $(UV) run --no-project
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
	$(UV_RUN) ruff check app tests

format:
	$(UV_RUN) ruff format app tests

type:
	$(UV_RUN) mypy --config-file mypy.ini app

test:
	$(UV_RUN) pytest

check: lint type test

run:
	$(UV_RUN) uvicorn $(APP_MODULE) --host $(HOST) --port $(PORT)

dev:
	$(UV_RUN) uvicorn $(APP_MODULE) --reload --host $(HOST) --port $(PORT)

clean:
	rm -rf .venv
