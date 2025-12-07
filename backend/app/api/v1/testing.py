"""
Testing/Answer submission endpoints
"""
from fastapi import APIRouter, Depends, status

from app.api.dependencies import (
    get_testing_service,
    get_current_student,
)
from app.services.testing_service import TestingService
from app.schemas.homework import (
    AnswerSubmit,
    StatisticsResponse,
)
from app.models.users import User

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
    from app.repositories.user_repository import StudentRepository
    from app.repositories.homework_repository import StatisticsRepository
    from app.db.session import get_db
    from fastapi import Depends as FastAPIDepends
    
    # This is a simplified version - ideally we'd have a method in TestingService
    # For now, using direct repository access
    db = next(get_db())
    student_repo = StudentRepository(db)
    stats_repo = StatisticsRepository(db)
    
    student = student_repo.get_by_user_id(current_user.id)
    if not student:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Student not found")
    
    stats = stats_repo.get_student_homework_stats(student.id, homework_id)
    if not stats:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No attempts found")
    
    return StatisticsResponse.model_validate(stats)

