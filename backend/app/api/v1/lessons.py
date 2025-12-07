"""
Lesson management endpoints
"""
import typing as tp

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies import (
    get_current_teacher,
    get_current_user,
    get_lesson_service,
)
from app.models.users import User
from app.schemas.lessons import (
    LessonCreate,
    LessonDetailResponse,
    LessonResponse,
    LessonUpdate,
)
from app.services.lesson_service import LessonService

router = APIRouter()


@router.post("", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
async def create_lesson(
    lesson_data: LessonCreate,
    current_user: User = Depends(get_current_teacher),
    lesson_service: LessonService = Depends(get_lesson_service),
):
    """
    Create new lesson (teachers only)
    
    - **classroom_id**: ID of the classroom
    - **title**: Lesson title
    - **description**: Optional description
    - **scheduled_at**: Optional scheduled date/time
    - **theory_material_ids**: List of theory material IDs to attach
    """
    return lesson_service.create_lesson(lesson_data, current_user.id)


@router.get("/classroom/{classroom_id}", response_model=tp.List[LessonResponse])
async def get_classroom_lessons(
    classroom_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    lesson_service: LessonService = Depends(get_lesson_service),
):
    """
    Get all lessons for a classroom
    
    - Teachers see all lessons (including unpublished)
    - Students see only published lessons
    """
    return lesson_service.get_classroom_lessons(classroom_id, current_user.id, skip, limit)


@router.get("/{lesson_id}", response_model=LessonDetailResponse)
async def get_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    lesson_service: LessonService = Depends(get_lesson_service),
):
    """
    Get lesson details by ID
    """
    return lesson_service.get_lesson(lesson_id)


@router.patch("/{lesson_id}", response_model=LessonResponse)
async def update_lesson(
    lesson_id: int,
    lesson_data: LessonUpdate,
    current_user: User = Depends(get_current_teacher),
    lesson_service: LessonService = Depends(get_lesson_service),
):
    """
    Update lesson (teachers only, owner only)
    """
    return lesson_service.update_lesson(lesson_id, lesson_data, current_user.id)


@router.delete("/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_teacher),
    lesson_service: LessonService = Depends(get_lesson_service),
):
    """
    Delete lesson (teachers only, owner only)
    """
    lesson_service.delete_lesson(lesson_id, current_user.id)
    return None

