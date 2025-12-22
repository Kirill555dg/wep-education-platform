"""
Database session management
"""

import typing as tp

import sqlalchemy as sa
from sqlalchemy import orm as orm

from app.core import config as core_config

# Create SQLAlchemy engine
database_url = core_config.settings.DATABASE_URL
if database_url.startswith("postgresql+psycopg2://"):
    # Prefer psycopg (psycopg3). Avoid implicit psycopg2 dependency.
    database_url = database_url.replace("postgresql+psycopg2://", "postgresql+psycopg://", 1)
elif database_url.startswith("postgresql://"):
    # Prefer psycopg (psycopg3). Avoid implicit psycopg2 dependency.
    database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)

engine = sa.create_engine(
    database_url,
    echo=core_config.settings.DEBUG,
    pool_pre_ping=True,  # Проверять соединения перед использованием
    pool_size=5,  # Размер пула соединений
    max_overflow=10,  # Максимальное количество дополнительных соединений
)

# Create SessionLocal class
SessionLocal = orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for declarative models
Base = orm.declarative_base()


def get_db() -> tp.Generator[orm.Session, None, None]:
    """
    Dependency for getting database session

    Usage in FastAPI:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
