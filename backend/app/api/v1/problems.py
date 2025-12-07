"""
Problem management endpoints
"""
import typing as tp

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies import get_current_teacher, get_problem_service
from app.models.users import User
from app.schemas.homework import (
    ProblemCreate,
    ProblemFullResponse,
    ProblemUpdate,
)
from app.services.problem_service import ProblemService

router = APIRouter()


@router.post("", response_model=ProblemFullResponse, status_code=status.HTTP_201_CREATED)
async def create_problem(
    problem_data: ProblemCreate,
    current_user: User = Depends(get_current_teacher),
    problem_service: ProblemService = Depends(get_problem_service),
):
    """
    Create new problem (teachers only)
    
    - **title**: Problem title
    - **description**: Problem description/text
    - **problem_type**: Type of problem
    - **difficulty**: Difficulty level
    - **correct_answer**: Correct answer
    - **explanation**: Explanation of solution
    - **hints**: Hints (optional)
    """
    problem = problem_service.create_problem(problem_data, current_user.id)
    return ProblemFullResponse.model_validate(problem)


@router.get("", response_model=tp.List[ProblemFullResponse])
async def get_problems(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_teacher),
    problem_service: ProblemService = Depends(get_problem_service),
):
    """
    Get all problems (teachers only)
    
    Teachers can see all problems with correct answers
    """
    problems = problem_service.get_all_problems(skip, limit)
    return [ProblemFullResponse.model_validate(p) for p in problems]


@router.get("/{problem_id}", response_model=ProblemFullResponse)
async def get_problem(
    problem_id: int,
    current_user: User = Depends(get_current_teacher),
    problem_service: ProblemService = Depends(get_problem_service),
):
    """
    Get problem by ID (teachers only)
    """
    problem = problem_service.get_problem_by_id(problem_id)
    return ProblemFullResponse.model_validate(problem)


@router.patch("/{problem_id}", response_model=ProblemFullResponse)
async def update_problem(
    problem_id: int,
    problem_data: ProblemUpdate,
    current_user: User = Depends(get_current_teacher),
    problem_service: ProblemService = Depends(get_problem_service),
):
    """
    Update problem (teachers only)
    """
    problem = problem_service.update_problem(problem_id, problem_data, current_user.id)
    return ProblemFullResponse.model_validate(problem)


@router.delete("/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_problem(
    problem_id: int,
    current_user: User = Depends(get_current_teacher),
    problem_service: ProblemService = Depends(get_problem_service),
):
    """
    Delete problem (teachers only)
    """
    problem_service.delete_problem(problem_id, current_user.id)
    return None

