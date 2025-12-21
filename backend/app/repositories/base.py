"""
Base repository pattern implementation
"""

import typing as tp

from sqlalchemy.orm import Session

from app.db.session import Base

T = tp.TypeVar("T", bound=Base)


class BaseRepository(tp.Generic[T]):
    """
    Base repository with CRUD operations

    Generic repository that provides common database operations
    for any SQLAlchemy model.
    """

    def __init__(self, model: tp.Type[T], db: Session):
        self.model = model
        self.db = db

    def get_by_id(self, id: int) -> tp.Optional[T]:
        """Get entity by ID"""
        return self.db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> tp.List[T]:
        """Get all entities with pagination"""
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def create(self, obj_in: tp.Dict[str, tp.Any]) -> T:
        """Create new entity"""
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, id: int, obj_in: tp.Dict[str, tp.Any]) -> tp.Optional[T]:
        """Update entity by ID"""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None

        for field, value in obj_in.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)

        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, id: int) -> bool:
        """Delete entity by ID"""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False

        self.db.delete(db_obj)
        self.db.commit()
        return True

    def count(self) -> int:
        """Count all entities"""
        return self.db.query(self.model).count()
