PYTHON ?= python3.13
UV ?= uv
VENV ?= .venv
PYTHON_BIN ?= $(VENV)/bin/python
APP_MODULE ?= app.main:app
HOST ?= 0.0.0.0
PORT ?= 8000

.PHONY: install sync lint format type test check run dev clean

install:
	$(UV) venv --python $(PYTHON)
	$(UV) pip install -r requirements.txt

sync:
	$(UV) pip install -r requirements.txt

lint:
	$(PYTHON_BIN) -m ruff check app tests

format:
	$(PYTHON_BIN) -m ruff format app tests

type:
	$(PYTHON_BIN) -m mypy --config-file mypy.ini app

test:
	$(PYTHON_BIN) -m pytest

check: lint type test

run:
	$(PYTHON_BIN) -m uvicorn $(APP_MODULE) --host $(HOST) --port $(PORT)

dev:
	$(PYTHON_BIN) -m uvicorn $(APP_MODULE) --reload --host $(HOST) --port $(PORT)

clean:
	rm -rf $(VENV)
