"""
SQLAlchemy ORM models
"""

from app.db.session import Base
from app.models.classes import Classroom, Invite, InviteStatus, StudentClassroom
from app.models.communication import Chat, Message
from app.models.files import File
from app.models.homework import Homework, HomeworkProblem, HomeworkStatus, Statistics
from app.models.lessons import Lesson, LessonMaterial
from app.models.problems import Problem, ProblemDifficulty, ProblemImage, ProblemType
from app.models.theory import MaterialImage, Section, Subject, Subsection, TheoryMaterial

# Import all models for Alembic to detect them
from app.models.users import LoginData, Student, Teacher, User

__all__ = [
    # Base
    "Base",
    # Users
    "User",
    "LoginData",
    "Teacher",
    "Student",
    # Classes
    "Classroom",
    "StudentClassroom",
    "Invite",
    "InviteStatus",
    # Communication
    "Chat",
    "Message",
    # Lessons
    "Lesson",
    "LessonMaterial",
    # Theory
    "Subject",
    "Section",
    "Subsection",
    "TheoryMaterial",
    "MaterialImage",
    # Homework
    "Homework",
    "HomeworkProblem",
    "Statistics",
    "HomeworkStatus",
    # Problems
    "Problem",
    "ProblemImage",
    "ProblemDifficulty",
    "ProblemType",
    # Files
    "File",
]
