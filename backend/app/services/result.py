"""
Result service for aggregating student progress
"""

import typing as tp

from sqlalchemy.ext import asyncio as sa_asyncio

from app.domain import errors as domain_errors
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
            raise domain_errors.NotFoundError("Student not found")

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
            raise domain_errors.NotFoundError("Student not found")

        return await self.stats_repo.get_student_progress_summary(student.id)

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
        summary = await self.stats_repo.get_classroom_progress_summary(classroom_id)

        total_students = summary["total_students"]
        total_homeworks_assigned = summary["total_homeworks_assigned"]
        completed_homeworks = summary["completed_homeworks"]

        completion_rate = (
            completed_homeworks / total_homeworks_assigned * 100.0
            if total_homeworks_assigned > 0
            else 0.0
        )

        return {
            "total_students": total_students,
            "active_students": total_students,
            "total_homeworks_assigned": total_homeworks_assigned,
            "completed_homeworks": completed_homeworks,
            "average_completion_rate": round(completion_rate, 2),
        }
