"""Pytest configuration and fixtures."""

import typing as tp

import pytest
import sqlalchemy as sa
from sqlalchemy import orm as orm

from app.db import session as db_session_module


@pytest.fixture(scope="function")
def db_session() -> tp.Iterator[orm.Session]:
    """Create a fresh in-memory SQLite session for each test."""
    engine = sa.create_engine("sqlite:///:memory:")
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
        db_session_module.Base.metadata.drop_all(bind=engine)


def mypy_config_resource() -> tuple[str, str]:
    """Provide mypy config location for plugins."""
    return "backend", "backend/mypy.ini"


def mypy_check_root() -> str:
    """Root directory to type-check."""
    return "backend"
