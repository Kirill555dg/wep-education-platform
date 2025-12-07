"""
SQLAlchemy ORM models
"""
from app.db.session import Base

# Import all models for Alembic to detect them
from app.models.users import User, LoginData, Teacher, Student
from app.models.classes import Classroom, StudentClassroom, Invite, InviteStatus
from app.models.communication import Chat, Message
from app.models.lessons import Lesson, LessonMaterial
from app.models.theory import Subject, Section, Subsection, TheoryMaterial, MaterialImage
from app.models.homework import Homework, HomeworkProblem, Statistics, HomeworkStatus
from app.models.problems import Problem, ProblemImage, ProblemDifficulty, ProblemType
from app.models.files import File

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
