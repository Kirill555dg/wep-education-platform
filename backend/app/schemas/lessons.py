"""
Lesson Pydantic schemas (DTOs)
"""

import typing as tp
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class LessonBase(BaseModel):
    """Base lesson fields"""

    title: str = Field(..., min_length=1, max_length=255)
    description: tp.Optional[str] = None
    order_number: tp.Optional[int] = Field(None, ge=0)
    scheduled_at: tp.Optional[datetime] = None


class LessonCreate(LessonBase):
    """Schema for creating a lesson"""

    classroom_id: int
    theory_material_ids: tp.List[int] = Field(default_factory=list)


class LessonUpdate(BaseModel):
    """Schema for updating a lesson"""

    title: tp.Optional[str] = Field(None, min_length=1, max_length=255)
    description: tp.Optional[str] = None
    order_number: tp.Optional[int] = Field(None, ge=0)
    scheduled_at: tp.Optional[datetime] = None
    is_published: tp.Optional[bool] = None


class LessonResponse(LessonBase):
    """Schema for lesson response"""

    id: int
    classroom_id: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LessonDetailResponse(LessonResponse):
    """Detailed lesson response with materials"""

    materials_count: int = 0
    homeworks_count: int = 0


# Theory Material schemas
class TheoryMaterialBase(BaseModel):
    """Base theory material fields"""

    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    order_number: int = Field(default=0, ge=0)
    estimated_read_time: tp.Optional[int] = Field(None, ge=1)


class TheoryMaterialCreate(TheoryMaterialBase):
    """Schema for creating theory material"""

    subsection_id: int


class TheoryMaterialUpdate(BaseModel):
    """Schema for updating theory material"""

    title: tp.Optional[str] = Field(None, min_length=1, max_length=255)
    content: tp.Optional[str] = Field(None, min_length=1)
    order_number: tp.Optional[int] = Field(None, ge=0)
    estimated_read_time: tp.Optional[int] = Field(None, ge=1)
    is_published: tp.Optional[bool] = None


class TheoryMaterialResponse(TheoryMaterialBase):
    """Schema for theory material response"""

    id: int
    subsection_id: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
