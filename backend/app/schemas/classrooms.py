"""
Classroom Pydantic schemas (DTOs)
"""

import typing as tp
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ClassroomBase(BaseModel):
    """Base classroom fields"""

    name: str = Field(..., min_length=1, max_length=255)
    description: tp.Optional[str] = None
    subject: str = Field(..., min_length=1, max_length=100)
    grade_level: tp.Optional[int] = Field(None, ge=1, le=12)
    max_students: int = Field(default=30, ge=1, le=100)


class ClassroomCreate(ClassroomBase):
    """Schema for creating a classroom"""

    pass  # teacher_id will be taken from authenticated user


class ClassroomUpdate(BaseModel):
    """Schema for updating a classroom"""

    name: tp.Optional[str] = Field(None, min_length=1, max_length=255)
    description: tp.Optional[str] = None
    subject: tp.Optional[str] = Field(None, min_length=1, max_length=100)
    grade_level: tp.Optional[int] = Field(None, ge=1, le=12)
    max_students: tp.Optional[int] = Field(None, ge=1, le=100)
    is_active: tp.Optional[bool] = None


class ClassroomResponse(ClassroomBase):
    """Schema for classroom response"""

    id: int
    teacher_id: int
    is_active: bool
    invite_code: tp.Optional[str]
    created_at: datetime
    updated_at: datetime
    students_count: int = 0  # Calculated field

    model_config = ConfigDict(from_attributes=True)


class ClassroomDetailResponse(ClassroomResponse):
    """Detailed classroom response with nested data"""

    # Can include teacher, students list, etc.
    pass


# Invite schemas
class InviteCreate(BaseModel):
    """Schema for creating an invite"""

    classroom_id: int
    max_uses: tp.Optional[int] = Field(default=1, ge=1)
    expires_at: tp.Optional[datetime] = None


class InviteResponse(BaseModel):
    """Schema for invite response"""

    id: int
    classroom_id: int
    invite_code: str
    max_uses: tp.Optional[int]
    uses_count: int
    status: str
    expires_at: tp.Optional[datetime]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JoinClassroomRequest(BaseModel):
    """Schema for joining classroom via invite code"""

    invite_code: str
