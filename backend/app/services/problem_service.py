"""
Problem Service
Manages problem creation, retrieval, and management
"""
import typing as tp

from fastapi import HTTPException, status

from app.repositories.homework_repository import ProblemRepository
from app.schemas.homework import ProblemCreate, ProblemUpdate


class ProblemService:
    """Service for managing problems"""

    def __init__(self, problem_repo: ProblemRepository):
        self.problem_repo = problem_repo

    def create_problem(self, problem_data: ProblemCreate, teacher_id: int) -> tp.Any:
        """
        Create a new problem
        
        Args:
            problem_data: Problem data
            teacher_id: ID of the teacher creating the problem
            
        Returns:
            Created problem
        """
        # Convert Pydantic model to dict
        data = problem_data.model_dump()

        # Create problem
        problem = self.problem_repo.create(data)
        return problem

    def get_all_problems(self, skip: int = 0, limit: int = 100) -> tp.List[tp.Any]:
        """
        Get all problems
        
        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of problems
        """
        return self.problem_repo.get_all(skip, limit)

    def get_problem_by_id(self, problem_id: int) -> tp.Optional[tp.Any]:
        """
        Get problem by ID
        
        Args:
            problem_id: Problem ID
            
        Returns:
            Problem if found, None otherwise
        """
        problem = self.problem_repo.get_by_id(problem_id)
        if not problem:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found"
            )
        return problem

    def update_problem(
        self,
        problem_id: int,
        problem_data: ProblemUpdate,
        teacher_id: int
    ) -> tp.Any:
        """
        Update a problem
        
        Args:
            problem_id: Problem ID
            problem_data: Updated problem data
            teacher_id: ID of the teacher updating the problem
            
        Returns:
            Updated problem
            
        Raises:
            HTTPException: If problem not found
        """
        # Convert Pydantic model to dict, excluding unset fields
        data = problem_data.model_dump(exclude_unset=True)

        # Update problem
        problem = self.problem_repo.update(problem_id, data)
        if not problem:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found"
            )
        return problem

    def delete_problem(self, problem_id: int, teacher_id: int) -> bool:
        """
        Delete a problem
        
        Args:
            problem_id: Problem ID
            teacher_id: ID of the teacher deleting the problem
            
        Returns:
            True if deleted successfully
            
        Raises:
            HTTPException: If problem not found
        """
        success = self.problem_repo.delete(problem_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found"
            )
        return True

