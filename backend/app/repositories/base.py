"""
Base repository pattern implementation
"""

import typing as tp

import sqlalchemy as sa
from sqlalchemy import orm as orm
from sqlalchemy.ext import asyncio as sa_asyncio

from app.db import session as db_session

T = tp.TypeVar("T", bound=db_session.Base)


class BaseRepository(tp.Generic[T]):
    """
    Base repository with CRUD operations

    Generic repository that provides common database operations
    for any SQLAlchemy model.
    """

    def __init__(self, model: tp.Type[T], db: sa_asyncio.AsyncSession):
        self.model = model
        self.db = db

    async def get_by_id(self, id: int) -> tp.Optional[T]:
        """Get entity by ID"""
        stmt = sa.select(self.model).where(self.model.id == id)  # type: ignore[attr-defined]
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> tp.List[T]:
        """Get all entities with pagination"""
        stmt = sa.select(self.model).offset(skip).limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create(self, obj_in: tp.Dict[str, tp.Any]) -> T:
        """Create new entity"""
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def update(self, id: int, obj_in: tp.Dict[str, tp.Any]) -> tp.Optional[T]:
        """Update entity by ID"""
        db_obj = await self.get_by_id(id)
        if not db_obj:
            return None

        for field, value in obj_in.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)

        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def delete(self, id: int) -> bool:
        """Delete entity by ID"""
        db_obj = await self.get_by_id(id)
        if not db_obj:
            return False

        await self.db.delete(db_obj)
        await self.db.commit()
        return True

    async def count(self) -> int:
        """Count all entities"""
        stmt = sa.select(sa.func.count()).select_from(self.model)
        result = await self.db.execute(stmt)
        count_value = result.scalar_one()
        return tp.cast(int, count_value)
