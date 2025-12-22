"""
Lesson and Theory Material repositories
"""

import typing as tp

from sqlalchemy import orm as orm

from app.models import lessons as lesson_models
from app.models import theory as theory_models
from app.repositories import base as base_repository


class LessonRepository(base_repository.BaseRepository[lesson_models.Lesson]):
    """Repository for Lesson operations"""

    def __init__(self, db: orm.Session):
        super().__init__(lesson_models.Lesson, db)

    def get_by_classroom(
        self, classroom_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[lesson_models.Lesson]:
        """Get lessons for classroom"""
        return (
            self.db.query(lesson_models.Lesson)
            .filter(lesson_models.Lesson.classroom_id == classroom_id)
            .order_by(lesson_models.Lesson.order_number)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_published(
        self, classroom_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[lesson_models.Lesson]:
        """Get published lessons for classroom"""
        return (
            self.db.query(lesson_models.Lesson)
            .filter(lesson_models.Lesson.classroom_id == classroom_id, lesson_models.Lesson.is_published)
            .order_by(lesson_models.Lesson.order_number)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_with_materials(self, lesson_id: int) -> tp.Optional[lesson_models.Lesson]:
        """Get lesson with materials"""
        return (
            self.db.query(lesson_models.Lesson)
            .options(orm.joinedload(lesson_models.Lesson.lesson_materials))
            .filter(lesson_models.Lesson.id == lesson_id)
            .first()
        )

    def count_by_classroom(self, classroom_id: int) -> int:
        """Count lessons in classroom"""
        return (
            self.db.query(lesson_models.Lesson)
            .filter(lesson_models.Lesson.classroom_id == classroom_id)
            .count()
        )


class LessonMaterialRepository(base_repository.BaseRepository[lesson_models.LessonMaterial]):
    """Repository for LessonMaterial operations"""

    def __init__(self, db: orm.Session):
        super().__init__(lesson_models.LessonMaterial, db)

    def get_by_lesson(self, lesson_id: int) -> tp.List[lesson_models.LessonMaterial]:
        """Get materials for lesson"""
        return (
            self.db.query(lesson_models.LessonMaterial)
            .filter(lesson_models.LessonMaterial.lesson_id == lesson_id)
            .order_by(lesson_models.LessonMaterial.order_number)
            .all()
        )

    def add_material_to_lesson(
        self, lesson_id: int, material_id: int, order_number: int = 0, is_required: bool = True
    ) -> lesson_models.LessonMaterial:
        """Add material to lesson"""
        return self.create(
            {
                "lesson_id": lesson_id,
                "theory_material_id": material_id,
                "order_number": order_number,
                "is_required": is_required,
            }
        )


class TheoryMaterialRepository(base_repository.BaseRepository[theory_models.TheoryMaterial]):
    """Repository for TheoryMaterial operations"""

    def __init__(self, db: orm.Session):
        super().__init__(theory_models.TheoryMaterial, db)

    def get_by_subsection(
        self, subsection_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[theory_models.TheoryMaterial]:
        """Get materials for subsection"""
        return (
            self.db.query(theory_models.TheoryMaterial)
            .filter(theory_models.TheoryMaterial.subsection_id == subsection_id)
            .order_by(theory_models.TheoryMaterial.order_number)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_published(
        self, subsection_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[theory_models.TheoryMaterial]:
        """Get published materials for subsection"""
        return (
            self.db.query(theory_models.TheoryMaterial)
            .filter(
                theory_models.TheoryMaterial.subsection_id == subsection_id,
                theory_models.TheoryMaterial.is_published,
            )
            .order_by(theory_models.TheoryMaterial.order_number)
            .offset(skip)
            .limit(limit)
            .all()
        )


class SubjectRepository(base_repository.BaseRepository[theory_models.Subject]):
    """Repository for Subject operations"""

    def __init__(self, db: orm.Session):
        super().__init__(theory_models.Subject, db)

    def get_by_name(self, name: str) -> tp.Optional[theory_models.Subject]:
        """Get subject by name"""
        return self.db.query(theory_models.Subject).filter(theory_models.Subject.name == name).first()

    def get_active(self, skip: int = 0, limit: int = 100) -> tp.List[theory_models.Subject]:
        """Get active subjects"""
        return (
            self.db.query(theory_models.Subject)
            .filter(theory_models.Subject.is_active)
            .order_by(theory_models.Subject.order_number)
            .offset(skip)
            .limit(limit)
            .all()
        )
