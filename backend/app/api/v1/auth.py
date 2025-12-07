"""
Authentication endpoints
"""
from fastapi import APIRouter, Depends, status

from app.api.dependencies import get_auth_service, get_current_user
from app.models.users import User
from app.schemas.users import LoginRequest, TokenResponse, UserCreate, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Register new user (student or teacher)
    
    - **username**: Unique username (3-100 characters)
    - **email**: Valid email address
    - **password**: Password (min 8 characters)
    - **full_name**: User's full name
    - **is_teacher**: False for student, True for teacher
    """
    return auth_service.register_user(user_data)


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Authenticate user and get JWT token
    
    - **username_or_email**: Username or email
    - **password**: User password
    
    Returns JWT access token and user data
    """
    return auth_service.authenticate(credentials)


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    """
    Get current authenticated user profile
    
    Requires valid JWT token in Authorization header
    """
    return UserResponse.model_validate(current_user)


@router.get("/me/role")
async def get_current_user_role(
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Get current user's role (teacher or student)
    
    Returns: {"role": "teacher"} or {"role": "student"}
    """
    role = auth_service.get_user_role(current_user.id)
    return {"role": role}

