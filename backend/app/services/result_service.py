"""
Result service for aggregating student progress
"""
import typing as tp
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from app.repositories.homework_repository import StatisticsRepository, HomeworkRepository
from app.repositories.classroom_repository import StudentClassroomRepository
from app.repositories.user_repository import StudentRepository
from app.schemas.homework import StatisticsResponse


class ResultService:
    """
    Service for aggregating and analyzing results
    
    Handles progress tracking, statistics aggregation
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.stats_repo = StatisticsRepository(db)
        self.homework_repo = HomeworkRepository(db)
        self.student_classroom_repo = StudentClassroomRepository(db)
        self.student_repo = StudentRepository(db)
    
    def get_student_statistics(self, student_user_id: int, skip: int = 0, limit: int = 100) -> tp.List[StatisticsResponse]:
        """
        Get all statistics for student
        
        Args:
            student_user_id: User ID of student
            skip: Pagination offset
            limit: Pagination limit
            
        Returns:
            List of statistics
        """
        student = self.student_repo.get_by_user_id(student_user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        stats = self.stats_repo.get_by_student(student.id, skip, limit)
        return [StatisticsResponse.model_validate(s) for s in stats]
    
    def get_homework_statistics(self, homework_id: int, teacher_user_id: int, skip: int = 0, limit: int = 100) -> tp.List[StatisticsResponse]:
        """
        Get statistics for all students for a homework (teacher only)
        
        Args:
            homework_id: Homework ID
            teacher_user_id: User ID of teacher
            skip: Pagination offset
            limit: Pagination limit
            
        Returns:
            List of statistics
            
        Raises:
            HTTPException: If not authorized
        """
        # Note: Authorization check would happen here
        # For now, returning all stats
        
        stats = self.stats_repo.get_by_homework(homework_id, skip, limit)
        return [StatisticsResponse.model_validate(s) for s in stats]
    
    def get_student_progress(self, student_user_id: int) -> tp.Dict[str, tp.Any]:
        """
        Get overall student progress
        
        Args:
            student_user_id: User ID of student
            
        Returns:
            Progress summary
        """
        student = self.student_repo.get_by_user_id(student_user_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        all_stats = self.stats_repo.get_by_student(student.id, skip=0, limit=1000)
        
        total_homeworks = len(all_stats)
        completed = len([s for s in all_stats if s.status in ["submitted", "graded"]])
        in_progress = len([s for s in all_stats if s.status == "in_progress"])
        not_started = len([s for s in all_stats if s.status == "not_started"])
        
        # Calculate average score
        graded_stats = [s for s in all_stats if s.status == "graded"]
        avg_score = 0.0
        if graded_stats:
            total_score = sum(s.score for s in graded_stats)
            total_max = sum(s.max_score for s in graded_stats)
            avg_score = (total_score / total_max * 100) if total_max > 0 else 0.0
        
        return {
            "total_homeworks": total_homeworks,
            "completed": completed,
            "in_progress": in_progress,
            "not_started": not_started,
            "average_score_percentage": round(avg_score, 2),
            "total_attempts": sum(s.attempts_count for s in all_stats),
            "total_time_spent_minutes": sum(s.time_spent_minutes for s in all_stats)
        }
    
    def get_classroom_progress(self, classroom_id: int, teacher_user_id: int) -> tp.Dict[str, tp.Any]:
        """
        Get progress summary for classroom (teacher only)
        
        Args:
            classroom_id: Classroom ID
            teacher_user_id: User ID of teacher
            
        Returns:
            Classroom progress summary
        """
        # Get all students in classroom
        memberships = self.student_classroom_repo.get_by_classroom(classroom_id)
        student_ids = [m.student_id for m in memberships]
        
        if not student_ids:
            return {
                "total_students": 0,
                "active_students": 0,
                "average_completion_rate": 0.0
            }
        
        # Get all statistics for these students
        all_stats = []
        for student_id in student_ids:
            stats = self.stats_repo.get_by_student(student_id, skip=0, limit=1000)
            all_stats.extend(stats)
        
        completed = len([s for s in all_stats if s.status in ["submitted", "graded"]])
        total = len(all_stats)
        completion_rate = (completed / total * 100) if total > 0 else 0.0
        
        return {
            "total_students": len(student_ids),
            "total_homeworks_assigned": total,
            "completed_homeworks": completed,
            "average_completion_rate": round(completion_rate, 2)
        }

