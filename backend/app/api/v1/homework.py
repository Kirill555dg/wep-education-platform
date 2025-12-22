"""
Homework management endpoints
"""

import typing as tp

import fastapi
from fastapi import status as http_status

from app.api import dependencies as deps
from app.models import users as user_models
from app.schemas import homework as homework_schemas
from app.services import homework_service as homework_service_module

router = fastapi.APIRouter()


@router.post(
    "",
    response_model=homework_schemas.HomeworkResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_homework(
    homework_data: homework_schemas.HomeworkCreate,
    current_user: user_models.User = fastapi.Depends(deps.get_current_teacher),
    homework_service: homework_service_module.HomeworkService = fastapi.Depends(
        deps.get_homework_service
    ),
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
    return await homework_service.create_homework(homework_data, current_user.id)


@router.get(
    "/lesson/{lesson_id}",
    response_model=tp.List[homework_schemas.HomeworkResponse],
)
async def get_lesson_homework(
    lesson_id: int,
    skip: int = fastapi.Query(0, ge=0),
    limit: int = fastapi.Query(100, ge=1, le=100),
    current_user: user_models.User = fastapi.Depends(deps.get_current_user),
    homework_service: homework_service_module.HomeworkService = fastapi.Depends(
        deps.get_homework_service
    ),
):
    """
    Get all homework for a lesson

    - Teachers see all homework (including unpublished)
    - Students see only published homework
    """
    return await homework_service.get_lesson_homework(lesson_id, current_user.id, skip, limit)


@router.get("/{homework_id}", response_model=homework_schemas.HomeworkDetailResponse)
async def get_homework(
    homework_id: int,
    current_user: user_models.User = fastapi.Depends(deps.get_current_user),
    homework_service: homework_service_module.HomeworkService = fastapi.Depends(
        deps.get_homework_service
    ),
):
    """
    Get homework details by ID

    Returns homework information.
    Students can only see published homework.
    """
    return await homework_service.get_homework(homework_id, current_user.id)


@router.get(
    "/{homework_id}/problems",
    response_model=tp.List[tp.Union[homework_schemas.ProblemResponse, homework_schemas.ProblemFullResponse]],
)
async def get_homework_problems(
    homework_id: int,
    current_user: user_models.User = fastapi.Depends(deps.get_current_user),
    homework_service: homework_service_module.HomeworkService = fastapi.Depends(
        deps.get_homework_service
    ),
):
    """
    Get all problems for homework

    - Teachers see problems with correct answers
    - Students see problems without correct answers
    """
    return await homework_service.get_homework_problems(homework_id, current_user.id)


@router.patch("/{homework_id}", response_model=homework_schemas.HomeworkResponse)
async def update_homework(
    homework_id: int,
    homework_data: homework_schemas.HomeworkUpdate,
    current_user: user_models.User = fastapi.Depends(deps.get_current_teacher),
    homework_service: homework_service_module.HomeworkService = fastapi.Depends(
        deps.get_homework_service
    ),
):
    """
    Update homework (teachers only, owner only)
    """
    return await homework_service.update_homework(homework_id, homework_data, current_user.id)


@router.delete("/{homework_id}", status_code=http_status.HTTP_204_NO_CONTENT)
async def delete_homework(
    homework_id: int,
    current_user: user_models.User = fastapi.Depends(deps.get_current_teacher),
    homework_service: homework_service_module.HomeworkService = fastapi.Depends(
        deps.get_homework_service
    ),
):
    """
    Delete homework (teachers only, owner only)

    Note: This would need to be implemented in HomeworkService
    """
    # Placeholder - would need implementation
    return None
