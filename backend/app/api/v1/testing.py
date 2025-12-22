"""
Testing/Answer submission endpoints
"""

import fastapi

from app.api import dependencies as deps
from app.models import users as user_models
from app.schemas import homework as homework_schemas
from app.services import testing_service as testing_service_module

router = fastapi.APIRouter()


@router.post("/submit-answer", response_model=homework_schemas.StatisticsResponse)
async def submit_answer(
    answer_data: homework_schemas.AnswerSubmit,
    current_user: user_models.User = fastapi.Depends(deps.get_current_student),
    testing_service: testing_service_module.TestingService = fastapi.Depends(deps.get_testing_service),
):
    """
    Submit answer for a problem (students only)

    - **homework_id**: ID of the homework
    - **problem_id**: ID of the problem
    - **answer**: Student's answer (string)
    - **time_spent_minutes**: Time spent on this problem

    Returns updated statistics with score
    """
    return testing_service.submit_answer(answer_data, current_user.id)


@router.post(
    "/homework/{homework_id}/submit",
    response_model=homework_schemas.StatisticsResponse,
)
async def submit_homework(
    homework_id: int,
    current_user: user_models.User = fastapi.Depends(deps.get_current_student),
    testing_service: testing_service_module.TestingService = fastapi.Depends(deps.get_testing_service),
):
    """
    Submit homework for final grading (students only)

    Marks homework as submitted. No more answers can be submitted after this.
    """
    return testing_service.submit_homework(homework_id, current_user.id)


@router.get(
    "/homework/{homework_id}/status",
    response_model=homework_schemas.StatisticsResponse,
)
async def get_homework_status(
    homework_id: int,
    current_user: user_models.User = fastapi.Depends(deps.get_current_student),
    testing_service: testing_service_module.TestingService = fastapi.Depends(deps.get_testing_service),
):
    """
    Get current status/progress for homework (students only)

    Returns statistics including score, attempts, time spent
    """
    return testing_service.get_homework_status(homework_id, current_user.id)
