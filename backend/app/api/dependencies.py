"""
FastAPI dependencies for dependency injection
"""
import typing as tp

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.users import User
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.classroom_service import ClassroomService
from app.services.homework_service import HomeworkService
from app.services.lesson_service import LessonService
from app.services.problem_service import ProblemService
from app.services.result_service import ResultService
from app.services.testing_service import TestingService

# Security
security = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> int:
    """
    Extract and validate JWT token, return user ID
    
    Raises:
        HTTPException: If token is invalid or expired
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: tp.Optional[str] = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return int(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID in token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> User:
    """
    Get current authenticated user from database
    
    Raises:
        HTTPException: If user not found or inactive
    """
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    return user


def get_current_teacher(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    """
    Verify current user is a teacher
    
    Raises:
        HTTPException: If user is not a teacher
    """
    from app.repositories.user_repository import TeacherRepository
    teacher_repo = TeacherRepository(db)
    teacher = teacher_repo.get_by_user_id(current_user.id)

    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can access this resource"
        )

    return current_user


def get_current_student(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    """
    Verify current user is a student
    
    Raises:
        HTTPException: If user is not a student
    """
    from app.repositories.user_repository import StudentRepository
    student_repo = StudentRepository(db)
    student = student_repo.get_by_user_id(current_user.id)

    if not student:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access this resource"
        )

    return current_user


# Service dependencies
def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """Get AuthService instance"""
    return AuthService(db)


def get_classroom_service(db: Session = Depends(get_db)) -> ClassroomService:
    """Get ClassroomService instance"""
    return ClassroomService(db)


def get_lesson_service(db: Session = Depends(get_db)) -> LessonService:
    """Get LessonService instance"""
    return LessonService(db)


def get_homework_service(db: Session = Depends(get_db)) -> HomeworkService:
    """Get HomeworkService instance"""
    return HomeworkService(db)


def get_testing_service(db: Session = Depends(get_db)) -> TestingService:
    """Get TestingService instance"""
    return TestingService(db)


def get_result_service(db: Session = Depends(get_db)) -> ResultService:
    """Get ResultService instance"""
    return ResultService(db)


def get_problem_service(db: Session = Depends(get_db)) -> ProblemService:
    """Get ProblemService instance"""
    from app.repositories.homework_repository import ProblemRepository
    return ProblemService(ProblemRepository(db))

