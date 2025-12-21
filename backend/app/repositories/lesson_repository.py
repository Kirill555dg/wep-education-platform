"""
Lesson and Theory Material repositories
"""

import typing as tp

import sqlalchemy.orm as orm

from app.models.lessons import Lesson, LessonMaterial
from app.models.theory import Subject, TheoryMaterial
from app.repositories.base import BaseRepository


class LessonRepository(BaseRepository[Lesson]):
    """Repository for Lesson operations"""

    def __init__(self, db: orm.Session):
        super().__init__(Lesson, db)

    def get_by_classroom(self, classroom_id: int, skip: int = 0, limit: int = 100) -> tp.List[Lesson]:
        """Get lessons for classroom"""
        return (
            self.db.query(Lesson)
            .filter(Lesson.classroom_id == classroom_id)
            .order_by(Lesson.order_number)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_published(self, classroom_id: int, skip: int = 0, limit: int = 100) -> tp.List[Lesson]:
        """Get published lessons for classroom"""
        return (
            self.db.query(Lesson)
            .filter(Lesson.classroom_id == classroom_id, Lesson.is_published)
            .order_by(Lesson.order_number)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_with_materials(self, lesson_id: int) -> tp.Optional[Lesson]:
        """Get lesson with materials"""
        return (
            self.db.query(Lesson)
            .options(orm.joinedload(Lesson.lesson_materials))
            .filter(Lesson.id == lesson_id)
            .first()
        )

    def count_by_classroom(self, classroom_id: int) -> int:
        """Count lessons in classroom"""
        return self.db.query(Lesson).filter(Lesson.classroom_id == classroom_id).count()


class LessonMaterialRepository(BaseRepository[LessonMaterial]):
    """Repository for LessonMaterial operations"""

    def __init__(self, db: orm.Session):
        super().__init__(LessonMaterial, db)

    def get_by_lesson(self, lesson_id: int) -> tp.List[LessonMaterial]:
        """Get materials for lesson"""
        return (
            self.db.query(LessonMaterial)
            .filter(LessonMaterial.lesson_id == lesson_id)
            .order_by(LessonMaterial.order_number)
            .all()
        )

    def add_material_to_lesson(
        self, lesson_id: int, material_id: int, order_number: int = 0, is_required: bool = True
    ) -> LessonMaterial:
        """Add material to lesson"""
        return self.create(
            {
                "lesson_id": lesson_id,
                "theory_material_id": material_id,
                "order_number": order_number,
                "is_required": is_required,
            }
        )


class TheoryMaterialRepository(BaseRepository[TheoryMaterial]):
    """Repository for TheoryMaterial operations"""

    def __init__(self, db: orm.Session):
        super().__init__(TheoryMaterial, db)

    def get_by_subsection(self, subsection_id: int, skip: int = 0, limit: int = 100) -> tp.List[TheoryMaterial]:
        """Get materials for subsection"""
        return (
            self.db.query(TheoryMaterial)
            .filter(TheoryMaterial.subsection_id == subsection_id)
            .order_by(TheoryMaterial.order_number)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_published(self, subsection_id: int, skip: int = 0, limit: int = 100) -> tp.List[TheoryMaterial]:
        """Get published materials for subsection"""
        return (
            self.db.query(TheoryMaterial)
            .filter(TheoryMaterial.subsection_id == subsection_id, TheoryMaterial.is_published)
            .order_by(TheoryMaterial.order_number)
            .offset(skip)
            .limit(limit)
            .all()
        )


class SubjectRepository(BaseRepository[Subject]):
    """Repository for Subject operations"""

    def __init__(self, db: orm.Session):
        super().__init__(Subject, db)

    def get_by_name(self, name: str) -> tp.Optional[Subject]:
        """Get subject by name"""
        return self.db.query(Subject).filter(Subject.name == name).first()

    def get_active(self, skip: int = 0, limit: int = 100) -> tp.List[Subject]:
        """Get active subjects"""
        return (
            self.db.query(Subject)
            .filter(Subject.is_active)
            .order_by(Subject.order_number)
            .offset(skip)
            .limit(limit)
            .all()
        )
