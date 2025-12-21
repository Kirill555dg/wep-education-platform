"""
Database session management
"""

import typing as tp

import sqlalchemy as sa
from sqlalchemy import orm as orm

from app.core import config as core_config

# Create SQLAlchemy engine
# For SQLite, we need check_same_thread=False
# For PostgreSQL, we can add pool settings
connect_args = {}
if "sqlite" in core_config.settings.DATABASE_URL:
    connect_args = {"check_same_thread": False}

engine = sa.create_engine(
    core_config.settings.DATABASE_URL,
    connect_args=connect_args,
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
