"""
Data access repositories
"""
from app.repositories.base import BaseRepository
from app.repositories.classroom_repository import (
    ClassroomRepository,
    InviteRepository,
    StudentClassroomRepository,
)
from app.repositories.homework_repository import (
    HomeworkProblemRepository,
    HomeworkRepository,
    ProblemRepository,
    StatisticsRepository,
)
from app.repositories.lesson_repository import (
    LessonMaterialRepository,
    LessonRepository,
    SubjectRepository,
    TheoryMaterialRepository,
)
from app.repositories.user_repository import (
    LoginDataRepository,
    StudentRepository,
    TeacherRepository,
    UserRepository,
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
