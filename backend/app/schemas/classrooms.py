"""
Classroom Pydantic schemas (DTOs)
"""

import typing as tp
import datetime as dt

import pydantic


class ClassroomBase(pydantic.BaseModel):
    """Base classroom fields"""

    name: str = pydantic.Field(..., min_length=1, max_length=255)
    description: tp.Optional[str] = None
    subject: str = pydantic.Field(..., min_length=1, max_length=100)
    grade_level: tp.Optional[int] = pydantic.Field(None, ge=1, le=12)
    max_students: int = pydantic.Field(default=30, ge=1, le=100)


class ClassroomCreate(ClassroomBase):
    """Schema for creating a classroom"""

    pass  # teacher_id will be taken from authenticated user


class ClassroomUpdate(pydantic.BaseModel):
    """Schema for updating a classroom"""

    name: tp.Optional[str] = pydantic.Field(None, min_length=1, max_length=255)
    description: tp.Optional[str] = None
    subject: tp.Optional[str] = pydantic.Field(None, min_length=1, max_length=100)
    grade_level: tp.Optional[int] = pydantic.Field(None, ge=1, le=12)
    max_students: tp.Optional[int] = pydantic.Field(None, ge=1, le=100)
    is_active: tp.Optional[bool] = None


class ClassroomResponse(ClassroomBase):
    """Schema for classroom response"""

    id: int
    teacher_id: int
    is_active: bool
    invite_code: tp.Optional[str]
    created_at: dt.datetime
    updated_at: dt.datetime
    students_count: int = 0  # Calculated field

    model_config = pydantic.ConfigDict(from_attributes=True)


class ClassroomDetailResponse(ClassroomResponse):
    """Detailed classroom response with nested data"""

    # Can include teacher, students list, etc.
    pass


# Invite schemas
class InviteCreate(pydantic.BaseModel):
    """Schema for creating an invite"""

    classroom_id: int
    max_uses: tp.Optional[int] = pydantic.Field(default=1, ge=1)
    expires_at: tp.Optional[dt.datetime] = None


class InviteResponse(pydantic.BaseModel):
    """Schema for invite response"""

    id: int
    classroom_id: int
    invite_code: str
    max_uses: tp.Optional[int]
    uses_count: int
    status: str
    expires_at: tp.Optional[dt.datetime]
    created_at: dt.datetime

    model_config = pydantic.ConfigDict(from_attributes=True)


class JoinClassroomRequest(pydantic.BaseModel):
    """Schema for joining classroom via invite code"""

    invite_code: str
