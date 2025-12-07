"""
Homework management endpoints
"""
import typing as tp
from fastapi import APIRouter, Depends, status, Query

from app.api.dependencies import (
    get_homework_service,
    get_current_user,
    get_current_teacher,
)
from app.services.homework_service import HomeworkService
from app.schemas.homework import (
    HomeworkCreate,
    HomeworkUpdate,
    HomeworkResponse,
    HomeworkDetailResponse,
    ProblemResponse,
    ProblemFullResponse,
)
from app.models.users import User

router = APIRouter()


@router.post("", response_model=HomeworkResponse, status_code=status.HTTP_201_CREATED)
async def create_homework(
    homework_data: HomeworkCreate,
    current_user: User = Depends(get_current_teacher),
    homework_service: HomeworkService = Depends(get_homework_service),
):
    """
    Create new homework assignment (teachers only)
    
    - **lesson_id**: ID of the lesson
    - **title**: Homework title
    - **description**: Optional description
    - **max_score**: Maximum score (default 100)
    - **deadline**: Optional deadline date/time
    - **problem_ids**: List of problem IDs to include
    - **problem_points**: Optional list of points for each problem
    """
    return homework_service.create_homework(homework_data, current_user.id)


@router.get("/lesson/{lesson_id}", response_model=tp.List[HomeworkResponse])
async def get_lesson_homework(
    lesson_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    homework_service: HomeworkService = Depends(get_homework_service),
):
    """
    Get all homework for a lesson
    
    - Teachers see all homework (including unpublished)
    - Students see only published homework
    """
    # This would need to be implemented in HomeworkService
    # For now, returning empty list as placeholder
    return []


@router.get("/{homework_id}", response_model=HomeworkDetailResponse)
async def get_homework(
    homework_id: int,
    current_user: User = Depends(get_current_user),
    homework_service: HomeworkService = Depends(get_homework_service),
):
    """
    Get homework details by ID
    
    Returns homework information.
    Students can only see published homework.
    """
    return homework_service.get_homework(homework_id, current_user.id)


@router.get("/{homework_id}/problems", response_model=tp.List[tp.Union[ProblemResponse, ProblemFullResponse]])
async def get_homework_problems(
    homework_id: int,
    current_user: User = Depends(get_current_user),
    homework_service: HomeworkService = Depends(get_homework_service),
):
    """
    Get all problems for homework
    
    - Teachers see problems with correct answers
    - Students see problems without correct answers
    """
    return homework_service.get_homework_problems(homework_id, current_user.id)


@router.patch("/{homework_id}", response_model=HomeworkResponse)
async def update_homework(
    homework_id: int,
    homework_data: HomeworkUpdate,
    current_user: User = Depends(get_current_teacher),
    homework_service: HomeworkService = Depends(get_homework_service),
):
    """
    Update homework (teachers only, owner only)
    """
    return homework_service.update_homework(homework_id, homework_data, current_user.id)


@router.delete("/{homework_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_homework(
    homework_id: int,
    current_user: User = Depends(get_current_teacher),
    homework_service: HomeworkService = Depends(get_homework_service),
):
    """
    Delete homework (teachers only, owner only)
    
    Note: This would need to be implemented in HomeworkService
    """
    # Placeholder - would need implementation
    return None

