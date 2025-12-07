"""
Lesson models: Lesson, LessonMaterial
"""
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class Lesson(Base):
    """Lesson in classroom"""
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order_number = Column(Integer, nullable=True)  # порядковый номер урока в курсе
    is_published = Column(Boolean, default=False, nullable=False)
    scheduled_at = Column(DateTime, nullable=True)  # когда урок запланирован
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    classroom = relationship("Classroom", back_populates="lessons")
    homeworks = relationship("Homework", back_populates="lesson", cascade="all, delete-orphan")
    lesson_materials = relationship("LessonMaterial", back_populates="lesson", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Lesson(id={self.id}, title='{self.title}', classroom_id={self.classroom_id})>"


class LessonMaterial(Base):
    """Many-to-many relationship between Lessons and TheoryMaterials"""
    __tablename__ = "lesson_materials"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    theory_material_id = Column(Integer, ForeignKey("theory_materials.id", ondelete="CASCADE"), nullable=False)
    order_number = Column(Integer, default=0, nullable=False)  # порядок материала в уроке
    is_required = Column(Boolean, default=True, nullable=False)  # обязателен ли материал
    added_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    lesson = relationship("Lesson", back_populates="lesson_materials")
    theory_material = relationship("TheoryMaterial", back_populates="lesson_materials")

    def __repr__(self) -> str:
        return f"<LessonMaterial(lesson_id={self.lesson_id}, theory_material_id={self.theory_material_id})>"

