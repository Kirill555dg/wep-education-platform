"""
Problem models: Problem, ProblemImage
"""
import typing as tp
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.session import Base


class ProblemDifficulty(str, enum.Enum):
    """Problem difficulty levels"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class ProblemType(str, enum.Enum):
    """Problem types"""
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    ESSAY = "essay"
    CODE = "code"
    MATH = "math"


class Problem(Base):
    """Problem/Task/Question"""
    __tablename__ = "problems"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)  # текст задачи
    problem_type = Column(Enum(ProblemType), nullable=False)
    difficulty = Column(Enum(ProblemDifficulty), default=ProblemDifficulty.MEDIUM, nullable=False)
    correct_answer = Column(Text, nullable=True)  # правильный ответ (может быть JSON для вариантов)
    explanation = Column(Text, nullable=True)  # объяснение решения
    hints = Column(Text, nullable=True)  # подсказки (может быть JSON массив)
    is_published = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    homework_problems = relationship("HomeworkProblem", back_populates="problem", cascade="all, delete-orphan")
    images = relationship("ProblemImage", back_populates="problem", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Problem(id={self.id}, title='{self.title}', type='{self.problem_type}')>"


class ProblemImage(Base):
    """Images attached to problems"""
    __tablename__ = "problem_images"
    
    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id", ondelete="CASCADE"), nullable=False, index=True)
    file_id = Column(Integer, ForeignKey("files.id", ondelete="SET NULL"), nullable=True)
    caption = Column(String(255), nullable=True)
    order_number = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    problem = relationship("Problem", back_populates="images")
    file = relationship("File")
    
    def __repr__(self) -> str:
        return f"<ProblemImage(id={self.id}, problem_id={self.problem_id})>"

