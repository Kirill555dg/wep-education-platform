"""
User Pydantic schemas (DTOs)
"""
import typing as tp
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# Base schemas
class UserBase(BaseModel):
    """Base user fields"""
    username: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=255)
    avatar_url: tp.Optional[str] = None


class UserCreate(UserBase):
    """Schema for creating a user"""
    password: str = Field(..., min_length=8, max_length=128)
    is_teacher: bool = False  # Определяет, создавать Teacher или Student профиль


class UserUpdate(BaseModel):
    """Schema for updating a user"""
    username: tp.Optional[str] = Field(None, min_length=3, max_length=100)
    email: tp.Optional[EmailStr] = None
    full_name: tp.Optional[str] = Field(None, min_length=1, max_length=255)
    avatar_url: tp.Optional[str] = None
    is_active: tp.Optional[bool] = None


class UserResponse(UserBase):
    """Schema for user response"""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

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


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

