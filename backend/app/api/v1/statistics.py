"""
Statistics and results endpoints
"""
import typing as tp
from fastapi import APIRouter, Depends, Query

from app.api.dependencies import (
    get_result_service,
    get_current_user,
    get_current_teacher,
    get_current_student,
)
from app.services.result_service import ResultService
from app.schemas.homework import StatisticsResponse
from app.models.users import User

router = APIRouter()


@router.get("/me", response_model=tp.List[StatisticsResponse])
async def get_my_statistics(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_student),
    result_service: ResultService = Depends(get_result_service),
):
    """
    Get all statistics for current student
    
    Returns all homework attempts with scores and status
    """
    return result_service.get_student_statistics(current_user.id, skip, limit)


@router.get("/me/progress")
async def get_my_progress(
    current_user: User = Depends(get_current_student),
    result_service: ResultService = Depends(get_result_service),
):
    """
    Get overall progress for current student
    
    Returns:
    - total_homeworks: Total number of assigned homeworks
    - completed: Number of completed homeworks
    - in_progress: Number of homeworks in progress
    - not_started: Number of not started homeworks
    - average_score_percentage: Average score percentage
    - total_attempts: Total number of attempts
    - total_time_spent_minutes: Total time spent
    """
    return result_service.get_student_progress(current_user.id)


@router.get("/homework/{homework_id}", response_model=tp.List[StatisticsResponse])
async def get_homework_statistics(
    homework_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_teacher),
    result_service: ResultService = Depends(get_result_service),
):
    """
    Get statistics for all students for a specific homework (teachers only)
    
    Returns all student attempts for the homework
    """
    return result_service.get_homework_statistics(homework_id, current_user.id, skip, limit)


@router.get("/classroom/{classroom_id}/progress")
async def get_classroom_progress(
    classroom_id: int,
    current_user: User = Depends(get_current_teacher),
    result_service: ResultService = Depends(get_result_service),
):
    """
    Get overall progress for a classroom (teachers only)
    
    Returns:
    - total_students: Number of students in classroom
    - total_homeworks_assigned: Total homeworks assigned
    - completed_homeworks: Number of completed homeworks
    - average_completion_rate: Average completion rate (%)
    """
    return result_service.get_classroom_progress(classroom_id, current_user.id)


@router.get("/student/{student_user_id}", response_model=tp.List[StatisticsResponse])
async def get_student_statistics_by_teacher(
    student_user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_teacher),
    result_service: ResultService = Depends(get_result_service),
):
    """
    Get statistics for a specific student (teachers only)
    
    Teachers can view any student's statistics
    """
    return result_service.get_student_statistics(student_user_id, skip, limit)

