"""
Problem management endpoints
"""
import typing as tp
from fastapi import APIRouter, Depends, status, Query, HTTPException

from app.api.dependencies import get_current_teacher, get_current_user
from app.repositories.homework_repository import ProblemRepository
from app.schemas.homework import (
    ProblemCreate,
    ProblemUpdate,
    ProblemResponse,
    ProblemFullResponse,
)
from app.models.users import User
from app.db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("", response_model=ProblemFullResponse, status_code=status.HTTP_201_CREATED)
async def create_problem(
    problem_data: ProblemCreate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
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
    problem_repo = ProblemRepository(db)
    problem = problem_repo.create(problem_data.model_dump())
    return ProblemFullResponse.model_validate(problem)


@router.get("", response_model=tp.List[ProblemFullResponse])
async def get_problems(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """
    Get all problems (teachers only)
    
    Teachers can see all problems with correct answers
    """
    problem_repo = ProblemRepository(db)
    problems = problem_repo.get_all(skip, limit)
    return [ProblemFullResponse.model_validate(p) for p in problems]


@router.get("/{problem_id}", response_model=ProblemFullResponse)
async def get_problem(
    problem_id: int,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """
    Get problem by ID (teachers only)
    """
    problem_repo = ProblemRepository(db)
    problem = problem_repo.get_by_id(problem_id)
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    return ProblemFullResponse.model_validate(problem)


@router.patch("/{problem_id}", response_model=ProblemFullResponse)
async def update_problem(
    problem_id: int,
    problem_data: ProblemUpdate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """
    Update problem (teachers only)
    """
    problem_repo = ProblemRepository(db)
    problem = problem_repo.update(problem_id, problem_data.model_dump(exclude_unset=True))
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update problem"
        )
    return ProblemFullResponse.model_validate(problem)


@router.delete("/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_problem(
    problem_id: int,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """
    Delete problem (teachers only)
    """
    problem_repo = ProblemRepository(db)
    success = problem_repo.delete(problem_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    return None

