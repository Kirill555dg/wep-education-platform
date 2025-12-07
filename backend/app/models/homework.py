"""
Homework models: Homework, HomeworkProblem, Statistics
"""
import enum
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class HomeworkStatus(str, enum.Enum):
    """Homework status for students"""
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    GRADED = "graded"


class Homework(Base):
    """Homework assignment"""
    __tablename__ = "homeworks"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    max_score = Column(Float, default=100.0, nullable=False)
    deadline = Column(DateTime, nullable=True)
    is_published = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    lesson = relationship("Lesson", back_populates="homeworks")
    homework_problems = relationship("HomeworkProblem", back_populates="homework", cascade="all, delete-orphan")
    statistics = relationship("Statistics", back_populates="homework", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Homework(id={self.id}, title='{self.title}', lesson_id={self.lesson_id})>"


class HomeworkProblem(Base):
    """Many-to-many relationship between Homework and Problems"""
    __tablename__ = "homework_problems"

    id = Column(Integer, primary_key=True, index=True)
    homework_id = Column(Integer, ForeignKey("homeworks.id", ondelete="CASCADE"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id", ondelete="CASCADE"), nullable=False)
    order_number = Column(Integer, default=0, nullable=False)  # порядок задачи в ДЗ
    points = Column(Float, default=10.0, nullable=False)  # баллы за задачу

    # Relationships
    homework = relationship("Homework", back_populates="homework_problems")
    problem = relationship("Problem", back_populates="homework_problems")

    def __repr__(self) -> str:
        return f"<HomeworkProblem(homework_id={self.homework_id}, problem_id={self.problem_id})>"


class Statistics(Base):
    """Student statistics for homework"""
    __tablename__ = "statistics"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    homework_id = Column(Integer, ForeignKey("homeworks.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(Enum(HomeworkStatus), default=HomeworkStatus.NOT_STARTED, nullable=False)
    score = Column(Float, default=0.0, nullable=False)  # набранные баллы
    max_score = Column(Float, nullable=False)  # максимально возможные баллы
    attempts_count = Column(Integer, default=0, nullable=False)  # количество попыток
    time_spent_minutes = Column(Integer, default=0, nullable=False)  # затраченное время
    submitted_at = Column(DateTime, nullable=True)
    graded_at = Column(DateTime, nullable=True)
    feedback = Column(Text, nullable=True)  # обратная связь от преподавателя
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    student = relationship("Student", back_populates="statistics")
    homework = relationship("Homework", back_populates="statistics")

    def __repr__(self) -> str:
        return f"<Statistics(id={self.id}, student_id={self.student_id}, homework_id={self.homework_id}, status='{self.status}')>"

