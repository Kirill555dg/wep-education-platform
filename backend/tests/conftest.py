"""Pytest configuration and fixtures."""

import os
import typing as tp
import uuid

import pytest
import sqlalchemy as sa
from sqlalchemy import orm as orm

from app import models as _models  # noqa: F401
from app.db import session as db_session_module


@pytest.fixture(scope="function")
def db_session() -> tp.Iterator[orm.Session]:
    """Create a fresh PostgreSQL schema for each test."""
    default_url = "postgresql+psycopg://wep_user:wep_password@127.0.0.1:5433/wep_education?gssencmode=disable"
    database_url = os.environ.get("DATABASE_URL", default_url)
    if database_url.startswith("postgresql+psycopg2://"):
        database_url = database_url.replace("postgresql+psycopg2://", "postgresql+psycopg://", 1)
    elif database_url.startswith("postgresql://"):
        database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)

    schema = f"test_{uuid.uuid4().hex}"
    admin_engine = sa.create_engine(database_url, isolation_level="AUTOCOMMIT")
    with admin_engine.connect() as connection:
        connection.execute(sa.text(f'CREATE SCHEMA "{schema}"'))

    engine = sa.create_engine(
        database_url,
        connect_args={"options": f"-csearch_path={schema}"},
        pool_pre_ping=True,
    )
    db_session_module.Base.metadata.create_all(bind=engine)

    session_local: orm.sessionmaker[orm.Session] = orm.sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )
    session = session_local()

    try:
        yield session
    finally:
        session.close()
        engine.dispose()
        with admin_engine.connect() as connection:
            connection.execute(sa.text(f'DROP SCHEMA "{schema}" CASCADE'))
        admin_engine.dispose()


def mypy_config_resource() -> tuple[str, str]:
    """Provide mypy config location for plugins."""
    return "backend", "backend/mypy.ini"


def mypy_check_root() -> str:
    """Root directory to type-check."""
    return "backend"
