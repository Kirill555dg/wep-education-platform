"""
Testing/Answer submission endpoints
"""

from fastapi import APIRouter, Depends

from app.api.dependencies import (
    get_current_student,
    get_testing_service,
)
from app.models.users import User
from app.schemas.homework import (
    AnswerSubmit,
    StatisticsResponse,
)
from app.services.testing_service import TestingService

router = APIRouter()


@router.post("/submit-answer", response_model=StatisticsResponse)
async def submit_answer(
    answer_data: AnswerSubmit,
    current_user: User = Depends(get_current_student),
    testing_service: TestingService = Depends(get_testing_service),
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


@router.post("/homework/{homework_id}/submit", response_model=StatisticsResponse)
async def submit_homework(
    homework_id: int,
    current_user: User = Depends(get_current_student),
    testing_service: TestingService = Depends(get_testing_service),
):
    """
    Submit homework for final grading (students only)

    Marks homework as submitted. No more answers can be submitted after this.
    """
    return testing_service.submit_homework(homework_id, current_user.id)


@router.get("/homework/{homework_id}/status", response_model=StatisticsResponse)
async def get_homework_status(
    homework_id: int,
    current_user: User = Depends(get_current_student),
    testing_service: TestingService = Depends(get_testing_service),
):
    """
    Get current status/progress for homework (students only)

    Returns statistics including score, attempts, time spent
    """
    return testing_service.get_homework_status(homework_id, current_user.id)
