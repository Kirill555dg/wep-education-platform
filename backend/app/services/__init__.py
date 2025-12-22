"""
Business logic services
"""

from app.services import auth_service as auth_service
from app.services import classroom_service as classroom_service
from app.services import homework_service as homework_service
from app.services import lesson_service as lesson_service
from app.services import problem_service as problem_service
from app.services import result_service as result_service
from app.services import testing_service as testing_service

AuthService = auth_service.AuthService
ClassroomService = classroom_service.ClassroomService
HomeworkService = homework_service.HomeworkService
LessonService = lesson_service.LessonService
ProblemService = problem_service.ProblemService
ResultService = result_service.ResultService
TestingService = testing_service.TestingService

__all__ = [
    "AuthService",
    "ClassroomService",
    "LessonService",
    "HomeworkService",
    "TestingService",
    "ResultService",
    "ProblemService",
]
