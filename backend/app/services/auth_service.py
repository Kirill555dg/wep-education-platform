"""
Authentication service
"""
import typing as tp

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.repositories.user_repository import (
    LoginDataRepository,
    StudentRepository,
    TeacherRepository,
    UserRepository,
)
from app.schemas.users import LoginRequest, TokenResponse, UserCreate, UserResponse


class AuthService:
    """
    Service for authentication and user management
    
    Handles user registration, login, and role-based operations
    """

    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.login_repo = LoginDataRepository(db)
        self.teacher_repo = TeacherRepository(db)
        self.student_repo = StudentRepository(db)

    def register_user(self, user_data: UserCreate) -> UserResponse:
        """
        Register new user
        
        Args:
            user_data: User registration data
            
        Returns:
            Created user
            
        Raises:
            HTTPException: If username or email already exists
        """
        # Check if username exists
        existing_user = self.user_repo.get_by_username(user_data.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        # Check if email exists
        existing_email = self.user_repo.get_by_email(user_data.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create user
        user = self.user_repo.create({
            "username": user_data.username,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "avatar_url": user_data.avatar_url,
            "is_active": True
        })

        # Create login data
        hashed_password = get_password_hash(user_data.password)
        self.login_repo.create_for_user(user.id, hashed_password)

        # Create BOTH teacher and student profiles
        # This allows users to switch between roles
        self.teacher_repo.create({"user_id": user.id})
        self.student_repo.create({"user_id": user.id})

        return UserResponse.model_validate(user)

    def authenticate(self, login_data: LoginRequest) -> TokenResponse:
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
        user = self.user_repo.get_by_username_or_email(login_data.username_or_email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username/email or password"
            )

        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )

        # Get login data
        login_info = self.login_repo.get_by_user_id(user.id)
        if not login_info:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Login data not found"
            )

        # Verify password
        if not verify_password(login_data.password, login_info.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username/email or password"
            )

        # Update last login
        self.login_repo.update(login_info.id, {"last_login": tp.cast(tp.Any, "NOW()")})

        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})

        return TokenResponse(
            access_token=access_token,
            user=UserResponse.model_validate(user)
        )

    def get_user_role(self, user_id: int) -> tp.Optional[str]:
        """
        Get user role (teacher or student)
        
        Args:
            user_id: User ID
            
        Returns:
            "teacher" or "student" or None
        """
        teacher = self.teacher_repo.get_by_user_id(user_id)
        if teacher:
            return "teacher"

        student = self.student_repo.get_by_user_id(user_id)
        if student:
            return "student"

        return None

    def get_current_user(self, user_id: int) -> UserResponse:
        """
        Get current authenticated user
        
        Args:
            user_id: User ID from JWT token
            
        Returns:
            User data
            
        Raises:
            HTTPException: If user not found
        """
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return UserResponse.model_validate(user)

