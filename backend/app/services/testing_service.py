"""
Testing service for answer checking and grading
"""
import typing as tp
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime

from app.repositories.homework_repository import HomeworkRepository, ProblemRepository, StatisticsRepository, HomeworkProblemRepository
from app.repositories.user_repository import StudentRepository
from app.schemas.homework import AnswerSubmit, StatisticsResponse


class TestingService:
    """
    Service for testing and grading
    
    Handles answer submission, automatic checking, and statistics updates
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.homework_repo = HomeworkRepository(db)
        self.problem_repo = ProblemRepository(db)
        self.stats_repo = StatisticsRepository(db)
        self.hw_problem_repo = HomeworkProblemRepository(db)
        self.student_repo = StudentRepository(db)
    
    def submit_answer(self, answer_data: AnswerSubmit, student_user_id: int) -> StatisticsResponse:
        """
        Submit answer for a problem
        
        Args:
            answer_data: Submitted answer data
            student_user_id: User ID of student
            
        Returns:
            Updated statistics
            
        Raises:
            HTTPException: If not authorized or validation fails
        """
        # Verify student
        student = self.student_repo.get_by_user_id(student_user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only students can submit answers"
            )
        
        # Verify homework and problem exist
        homework = self.homework_repo.get_by_id(answer_data.homework_id)
        if not homework:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Homework not found"
            )
        
        problem = self.problem_repo.get_by_id(answer_data.problem_id)
        if not problem:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found"
            )
        
        # Check if problem is in homework
        hw_problems = self.hw_problem_repo.get_by_homework(answer_data.homework_id)
        hw_problem = next((hp for hp in hw_problems if hp.problem_id == answer_data.problem_id), None)
        
        if not hw_problem:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Problem not in this homework"
            )
        
        # Get or create statistics
        stats = self.stats_repo.get_or_create_stats(
            student.id, 
            answer_data.homework_id, 
            homework.max_score
        )
        
        # Check answer and calculate score
        is_correct = self._check_answer(answer_data.answer, problem.correct_answer)
        
        if is_correct:
            # Add points for this problem
            new_score = stats.score + hw_problem.points
            new_score = min(new_score, stats.max_score)  # Cap at max_score
        else:
            new_score = stats.score
        
        # Update statistics
        updated_stats = self.stats_repo.update(stats.id, {
            "score": new_score,
            "status": "in_progress",
            "attempts_count": stats.attempts_count + 1,
            "time_spent_minutes": stats.time_spent_minutes + answer_data.time_spent_minutes
        })
        
        if not updated_stats:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update statistics"
            )
        
        return StatisticsResponse.model_validate(updated_stats)
    
    def submit_homework(self, homework_id: int, student_user_id: int) -> StatisticsResponse:
        """
        Submit homework for grading
        
        Args:
            homework_id: Homework ID
            student_user_id: User ID of student
            
        Returns:
            Final statistics
        """
        student = self.student_repo.get_by_user_id(student_user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only students can submit homework"
            )
        
        # Get statistics
        stats = self.stats_repo.get_student_homework_stats(student.id, homework_id)
        if not stats:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No attempts found for this homework"
            )
        
        # Mark as submitted
        updated_stats = self.stats_repo.submit_homework(stats.id)
        if not updated_stats:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to submit homework"
            )
        
        return StatisticsResponse.model_validate(updated_stats)
    
    def _check_answer(self, student_answer: str, correct_answer: tp.Optional[str]) -> bool:
        """
        Check if answer is correct
        
        Simple string comparison for now.
        Can be extended for different problem types.
        """
        if not correct_answer:
            return False  # Auto-graded only if correct_answer is set
        
        # Simple case-insensitive comparison
        return student_answer.strip().lower() == correct_answer.strip().lower()

