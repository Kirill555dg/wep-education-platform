"""
FastAPI dependencies for dependency injection
"""

import fastapi
from fastapi import security as fastapi_security
from fastapi import status as http_status
from sqlalchemy.ext import asyncio as sa_asyncio

from app.core import security as core_security
from app.db import session as db_session
from app.models import users as user_models
from app.repositories import homework_repository as homework_repository
from app.repositories import user_repository as user_repository
from app.services import auth_service as auth_service
from app.services import classroom_service as classroom_service
from app.services import homework_service as homework_service
from app.services import lesson_service as lesson_service
from app.services import problem_service as problem_service
from app.services import result_service as result_service
from app.services import testing_service as testing_service

# Security
security = fastapi_security.HTTPBearer()


def get_current_user_id(
    credentials: fastapi_security.HTTPAuthorizationCredentials = fastapi.Depends(security),
) -> int:
    """
    Extract and validate JWT token, return user ID

    Raises:
        HTTPException: If token is invalid or expired
    """
    token = credentials.credentials
    payload = core_security.decode_access_token(token)

    if not payload:
        raise fastapi.HTTPException(
            status_code=http_status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: str | None = payload.get("sub")
    if not user_id:
        raise fastapi.HTTPException(
            status_code=http_status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return int(user_id)
    except ValueError:
        raise fastapi.HTTPException(
            status_code=http_status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    user_id: int = fastapi.Depends(get_current_user_id),
    db: sa_asyncio.AsyncSession = fastapi.Depends(db_session.get_db),
) -> user_models.User:
    """
    Get current authenticated user from database

    Raises:
        HTTPException: If user not found or inactive
    """
    user_repo = user_repository.UserRepository(db)
    user = await user_repo.get_by_id(user_id)

    if not user:
        raise fastapi.HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if not user.is_active:
        raise fastapi.HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return user


async def get_current_teacher(
    current_user: user_models.User = fastapi.Depends(get_current_user),
    db: sa_asyncio.AsyncSession = fastapi.Depends(db_session.get_db),
) -> user_models.User:
    """
    Verify current user is a teacher

    Raises:
        HTTPException: If user is not a teacher
    """
    teacher_repo = user_repository.TeacherRepository(db)
    teacher = await teacher_repo.get_by_user_id(current_user.id)

    if not teacher:
        raise fastapi.HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Only teachers can access this resource",
        )

    return current_user


async def get_current_student(
    current_user: user_models.User = fastapi.Depends(get_current_user),
    db: sa_asyncio.AsyncSession = fastapi.Depends(db_session.get_db),
) -> user_models.User:
    """
    Verify current user is a student

    Raises:
        HTTPException: If user is not a student
    """
    student_repo = user_repository.StudentRepository(db)
    student = await student_repo.get_by_user_id(current_user.id)

    if not student:
        raise fastapi.HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail="Only students can access this resource",
        )

    return current_user


# Service dependencies
def get_auth_service(
    db: sa_asyncio.AsyncSession = fastapi.Depends(db_session.get_db),
) -> auth_service.AuthService:
    """Get AuthService instance"""
    return auth_service.AuthService(db)


def get_classroom_service(
    db: sa_asyncio.AsyncSession = fastapi.Depends(db_session.get_db),
) -> classroom_service.ClassroomService:
    """Get ClassroomService instance"""
    return classroom_service.ClassroomService(db)


def get_lesson_service(
    db: sa_asyncio.AsyncSession = fastapi.Depends(db_session.get_db),
) -> lesson_service.LessonService:
    """Get LessonService instance"""
    return lesson_service.LessonService(db)


def get_homework_service(
    db: sa_asyncio.AsyncSession = fastapi.Depends(db_session.get_db),
) -> homework_service.HomeworkService:
    """Get HomeworkService instance"""
    return homework_service.HomeworkService(db)


def get_testing_service(
    db: sa_asyncio.AsyncSession = fastapi.Depends(db_session.get_db),
) -> testing_service.TestingService:
    """Get TestingService instance"""
    return testing_service.TestingService(db)


def get_result_service(
    db: sa_asyncio.AsyncSession = fastapi.Depends(db_session.get_db),
) -> result_service.ResultService:
    """Get ResultService instance"""
    return result_service.ResultService(db)


def get_problem_service(
    db: sa_asyncio.AsyncSession = fastapi.Depends(db_session.get_db),
) -> problem_service.ProblemService:
    """Get ProblemService instance"""
    return problem_service.ProblemService(homework_repository.ProblemRepository(db))
