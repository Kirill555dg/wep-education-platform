"""
Authentication service
"""

import fastapi
from fastapi import status as http_status
from sqlalchemy.ext import asyncio as sa_asyncio

from app.core import security as core_security
from app.core import datetime_extensions as dte
from app.repositories import user as user_repository
from app.schemas import users as user_schemas


class AuthService:
    """
    Service for authentication and user management

    Handles user registration, login, and role-based operations
    """

    def __init__(self, db: sa_asyncio.AsyncSession):
        self.db = db
        self.user_repo = user_repository.UserRepository(db)
        self.login_repo = user_repository.LoginDataRepository(db)
        self.teacher_repo = user_repository.TeacherRepository(db)
        self.student_repo = user_repository.StudentRepository(db)

    async def register_user(self, user_data: user_schemas.UserCreate) -> user_schemas.UserResponse:
        """
        Register new user

        Args:
            user_data: User registration data

        Returns:
            Created user

        Raises:
            HTTPException: If username or email already exists
        """
        generated_username = user_data.username or user_data.email.split("@")[0]

        # Check if email exists
        existing_email = await self.user_repo.get_by_email(user_data.email)
        if existing_email:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Create user
        user = await self.user_repo.create(
            {
                "username": generated_username,
                "email": user_data.email,
                "first_name": user_data.first_name,
                "last_name": user_data.last_name,
                "middle_name": user_data.middle_name,
                "full_name": user_data.full_name
                or " ".join(
                    part for part in [user_data.first_name, user_data.middle_name, user_data.last_name] if part
                ),
                "avatar_url": user_data.avatar_url,
                "is_active": True,
                "role": user_data.role.value,
            }
        )

        # Create login data
        hashed_password = core_security.get_password_hash(user_data.password)
        await self.login_repo.create_for_user(user.id, hashed_password)

        # Create BOTH teacher and student profiles
        # This allows users to switch between roles
        await self.teacher_repo.create({"user_id": user.id})
        await self.student_repo.create({"user_id": user.id})

        return user_schemas.UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            middle_name=user.middle_name,
            role=user_schemas.UserRole(user.role),
            username=user.username,
            full_name=user.full_name,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
            hashed_password=hashed_password,
        )

    async def authenticate(
        self,
        login_data: user_schemas.LoginRequest,
    ) -> user_schemas.TokenResponse | None:
        """
        Authenticate user and return JWT token

        Args:
            login_data: Login credentials

        Returns:
            JWT token and user data

        Raises:
            HTTPException: If credentials are invalid
        """
        # Find user by username or email
        user = await self.user_repo.get_by_username_or_email(login_data.username_or_email)
        if not user:
            return None

        # Check if user is active
        if not user.is_active:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        # Get login data
        login_info = await self.login_repo.get_by_user_id(user.id)
        if not login_info:
            return None

        # Verify password
        if not core_security.verify_password(login_data.password, login_info.hashed_password):
            return None

        # Update last login
        await self.login_repo.update(login_info.id, {"last_login": dte.utc_now()})

        # Create access token
        access_token = core_security.create_access_token(data={"sub": str(user.id)})

        return user_schemas.TokenResponse(
            access_token=access_token,
            user=user_schemas.UserResponse(
                id=user.id,
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                middle_name=user.middle_name,
                role=user_schemas.UserRole(user.role),
                username=user.username,
                full_name=user.full_name,
                is_active=user.is_active,
                created_at=user.created_at,
                updated_at=user.updated_at,
                hashed_password=login_info.hashed_password,
            ),
        )

    async def get_user_role(self, user_id: int) -> str | None:
        """
        Get user role (teacher or student)

        Args:
            user_id: User ID

        Returns:
            "teacher" or "student" or None
        """
        teacher = await self.teacher_repo.get_by_user_id(user_id)
        if teacher:
            return "teacher"

        student = await self.student_repo.get_by_user_id(user_id)
        if student:
            return "student"

        return None

    async def get_current_user(self, user_id: int) -> user_schemas.UserResponse:
        """
        Get current authenticated user

        Args:
            user_id: User ID from JWT token

        Returns:
            User data

        Raises:
            HTTPException: If user not found
        """
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return user_schemas.UserResponse.model_validate(user)
