"""
User Pydantic schemas (DTOs)
"""

import enum
import typing as tp
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRole(str, enum.Enum):
    """User roles"""

    TEACHER = "teacher"
    STUDENT = "student"


# Base schemas
class UserBase(BaseModel):
    """Base user fields"""

    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    middle_name: tp.Optional[str] = Field(default=None, max_length=100)
    role: UserRole = UserRole.STUDENT
    avatar_url: tp.Optional[str] = None
    username: tp.Optional[str] = Field(default=None, min_length=3, max_length=100)
    full_name: tp.Optional[str] = Field(default=None, max_length=255)


class UserCreate(UserBase):
    """Schema for creating a user"""

    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    """Schema for updating a user"""

    username: tp.Optional[str] = Field(default=None, min_length=3, max_length=100)
    email: tp.Optional[EmailStr] = None
    first_name: tp.Optional[str] = Field(default=None, min_length=1, max_length=100)
    last_name: tp.Optional[str] = Field(default=None, min_length=1, max_length=100)
    middle_name: tp.Optional[str] = Field(default=None, max_length=100)
    full_name: tp.Optional[str] = Field(default=None, max_length=255)
    avatar_url: tp.Optional[str] = None
    is_active: tp.Optional[bool] = None


class UserResponse(BaseModel):
    """Schema for user response"""

    id: int
    email: EmailStr
    first_name: str
    last_name: str
    middle_name: tp.Optional[str] = None
    role: UserRole
    username: tp.Optional[str] = None
    full_name: tp.Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    hashed_password: str

    model_config = ConfigDict(from_attributes=True)


class UserInDB(UserResponse):
    """User model with sensitive data"""

    hashed_password: str


# Teacher schemas
class TeacherBase(BaseModel):
    """Base teacher fields"""

    bio: tp.Optional[str] = None
    subject_specialization: tp.Optional[str] = None
    years_of_experience: int = Field(default=0, ge=0)


class TeacherCreate(TeacherBase):
    """Schema for creating a teacher (used internally)"""

    user_id: int


class TeacherUpdate(TeacherBase):
    """Schema for updating a teacher"""

    pass


class TeacherResponse(TeacherBase):
    """Schema for teacher response"""

    id: int
    user_id: int
    rating: int
    user: UserResponse  # Nested user data

    model_config = ConfigDict(from_attributes=True)


# Student schemas
class StudentBase(BaseModel):
    """Base student fields"""

    grade_level: tp.Optional[int] = Field(None, ge=1, le=12)
    student_id_number: tp.Optional[str] = None


class StudentCreate(StudentBase):
    """Schema for creating a student (used internally)"""

    user_id: int


class StudentUpdate(StudentBase):
    """Schema for updating a student"""

    pass


class StudentResponse(StudentBase):
    """Schema for student response"""

    id: int
    user_id: int
    enrollment_date: datetime
    user: UserResponse  # Nested user data

    model_config = ConfigDict(from_attributes=True)


# Authentication schemas
class LoginRequest(BaseModel):
    """Login request schema"""

    username_or_email: str
    password: str


class UserLogin(LoginRequest):
    """Alias for backward compatibility"""


class TokenResponse(BaseModel):
    """Token response schema"""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse
