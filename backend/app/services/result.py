"""
Result service for aggregating student progress
"""

import typing as tp

import fastapi
from fastapi import status as http_status
from sqlalchemy.ext import asyncio as sa_asyncio

from app.repositories import classroom as classroom_repository
from app.repositories import homework as homework_repository
from app.repositories import user as user_repository
from app.schemas import homework as homework_schemas


class ResultService:
    """
    Service for aggregating and analyzing results

    Handles progress tracking, statistics aggregation
    """

    def __init__(self, db: sa_asyncio.AsyncSession):
        self.db = db
        self.stats_repo = homework_repository.StatisticsRepository(db)
        self.homework_repo = homework_repository.HomeworkRepository(db)
        self.student_classroom_repo = classroom_repository.StudentClassroomRepository(db)
        self.student_repo = user_repository.StudentRepository(db)

    async def get_student_statistics(
        self, student_user_id: int, skip: int = 0, limit: int = 100
    ) -> list[homework_schemas.StatisticsResponse]:
        """
        Get all statistics for student

        Args:
            student_user_id: User ID of student
            skip: Pagination offset
            limit: Pagination limit

        Returns:
            List of statistics
        """
        student = await self.student_repo.get_by_user_id(student_user_id)
        if not student:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )

        stats = await self.stats_repo.get_by_student(student.id, skip, limit)
        return [homework_schemas.StatisticsResponse.model_validate(s) for s in stats]

    async def get_homework_statistics(
        self, homework_id: int, teacher_user_id: int, skip: int = 0, limit: int = 100
    ) -> list[homework_schemas.StatisticsResponse]:
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

        stats = await self.stats_repo.get_by_homework(homework_id, skip, limit)
        return [homework_schemas.StatisticsResponse.model_validate(s) for s in stats]

    async def get_student_progress(self, student_user_id: int) -> dict[str, tp.Any]:
        """
        Get overall student progress

        Args:
            student_user_id: User ID of student

        Returns:
            Progress summary
        """
        student = await self.student_repo.get_by_user_id(student_user_id)
        if not student:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Student not found",
            )

        all_stats = await self.stats_repo.get_by_student(student.id, skip=0, limit=1000)

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
            "total_time_spent_minutes": sum(s.time_spent_minutes for s in all_stats),
        }

    async def get_classroom_progress(
        self, classroom_id: int, teacher_user_id: int
    ) -> dict[str, tp.Any]:
        """
        Get progress summary for classroom (teacher only)

        Args:
            classroom_id: Classroom ID
            teacher_user_id: User ID of teacher

        Returns:
            Classroom progress summary
        """
        # Get all students in classroom
        memberships = await self.student_classroom_repo.get_by_classroom(classroom_id)
        student_ids = [m.student_id for m in memberships]

        if not student_ids:
            return {"total_students": 0, "active_students": 0, "average_completion_rate": 0.0}

        # Get all statistics for these students
        all_stats = []
        for student_id in student_ids:
            stats = await self.stats_repo.get_by_student(student_id, skip=0, limit=1000)
            all_stats.extend(stats)

        completed = len([s for s in all_stats if s.status in ["submitted", "graded"]])
        total = len(all_stats)
        completion_rate = (completed / total * 100) if total > 0 else 0.0

        return {
            "total_students": len(student_ids),
            "total_homeworks_assigned": total,
            "completed_homeworks": completed,
            "average_completion_rate": round(completion_rate, 2),
        }
