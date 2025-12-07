"""
Data access repositories
"""
from app.repositories.base import BaseRepository
from app.repositories.user_repository import (
    UserRepository,
    LoginDataRepository,
    TeacherRepository,
    StudentRepository,
)
from app.repositories.classroom_repository import (
    ClassroomRepository,
    StudentClassroomRepository,
    InviteRepository,
)
from app.repositories.lesson_repository import (
    LessonRepository,
    LessonMaterialRepository,
    TheoryMaterialRepository,
    SubjectRepository,
)
from app.repositories.homework_repository import (
    HomeworkRepository,
    HomeworkProblemRepository,
    ProblemRepository,
    StatisticsRepository,
)

__all__ = [
    # Base
    "BaseRepository",
    
    # Users
    "UserRepository",
    "LoginDataRepository",
    "TeacherRepository",
    "StudentRepository",
    
    # Classrooms
    "ClassroomRepository",
    "StudentClassroomRepository",
    "InviteRepository",
    
    # Lessons
    "LessonRepository",
    "LessonMaterialRepository",
    "TheoryMaterialRepository",
    "SubjectRepository",
    
    # Homework
    "HomeworkRepository",
    "HomeworkProblemRepository",
    "ProblemRepository",
    "StatisticsRepository",
]
