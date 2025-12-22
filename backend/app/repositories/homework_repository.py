"""
Homework, Problem, and Statistics repositories
"""

import typing as tp

import sqlalchemy as sa
from sqlalchemy import orm as orm
from sqlalchemy.ext import asyncio as sa_asyncio

from app.models import homework as homework_models
from app.models import problems as problem_models
from app.repositories import base as base_repository


class HomeworkRepository(base_repository.BaseRepository[homework_models.Homework]):
    """Repository for Homework operations"""

    def __init__(self, db: sa_asyncio.AsyncSession):
        super().__init__(homework_models.Homework, db)

    async def get_by_lesson(
        self, lesson_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[homework_models.Homework]:
        """Get homeworks for lesson"""
        stmt = (
            sa.select(homework_models.Homework)
            .where(homework_models.Homework.lesson_id == lesson_id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_published(
        self, lesson_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[homework_models.Homework]:
        """Get published homeworks for lesson"""
        stmt = (
            sa.select(homework_models.Homework)
            .where(
                homework_models.Homework.lesson_id == lesson_id,
                homework_models.Homework.is_published,
            )
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_with_problems(self, homework_id: int) -> tp.Optional[homework_models.Homework]:
        """Get homework with problems"""
        stmt = (
            sa.select(homework_models.Homework)
            .options(orm.joinedload(homework_models.Homework.homework_problems))
            .where(homework_models.Homework.id == homework_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def count_by_lesson(self, lesson_id: int) -> int:
        """Count homeworks in lesson"""
        stmt = (
            sa.select(sa.func.count())
            .select_from(homework_models.Homework)
            .where(homework_models.Homework.lesson_id == lesson_id)
        )
        result = await self.db.execute(stmt)
        count_value = result.scalar_one()
        return tp.cast(int, count_value)


class HomeworkProblemRepository(base_repository.BaseRepository[homework_models.HomeworkProblem]):
    """Repository for HomeworkProblem operations"""

    def __init__(self, db: sa_asyncio.AsyncSession):
        super().__init__(homework_models.HomeworkProblem, db)

    async def get_by_homework(self, homework_id: int) -> tp.List[homework_models.HomeworkProblem]:
        """Get problems for homework"""
        stmt = (
            sa.select(homework_models.HomeworkProblem)
            .where(homework_models.HomeworkProblem.homework_id == homework_id)
            .order_by(homework_models.HomeworkProblem.order_number)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def add_problem_to_homework(
        self, homework_id: int, problem_id: int, points: float = 10.0, order_number: int = 0
    ) -> homework_models.HomeworkProblem:
        """Add problem to homework"""
        return await self.create(
            {
                "homework_id": homework_id,
                "problem_id": problem_id,
                "points": points,
                "order_number": order_number,
            }
        )

    async def remove_problem_from_homework(self, homework_id: int, problem_id: int) -> bool:
        """Remove problem from homework"""
        stmt = sa.select(homework_models.HomeworkProblem).where(
            homework_models.HomeworkProblem.homework_id == homework_id,
            homework_models.HomeworkProblem.problem_id == problem_id,
        )
        result = await self.db.execute(stmt)
        hw_problem = result.scalar_one_or_none()

        if not hw_problem:
            return False

        await self.db.delete(hw_problem)
        await self.db.commit()
        return True


class ProblemRepository(base_repository.BaseRepository[problem_models.Problem]):
    """Repository for Problem operations"""

    def __init__(self, db: sa_asyncio.AsyncSession):
        super().__init__(problem_models.Problem, db)

    async def get_by_type(
        self, problem_type: str, skip: int = 0, limit: int = 100
    ) -> tp.List[problem_models.Problem]:
        """Get problems by type"""
        stmt = (
            sa.select(problem_models.Problem)
            .where(problem_models.Problem.problem_type == problem_type)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_difficulty(
        self, difficulty: int, skip: int = 0, limit: int = 100
    ) -> tp.List[problem_models.Problem]:
        """Get problems by difficulty"""
        stmt = (
            sa.select(problem_models.Problem)
            .where(problem_models.Problem.difficulty == difficulty)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_published(
        self, skip: int = 0, limit: int = 100
    ) -> tp.List[problem_models.Problem]:
        """Get published problems"""
        stmt = (
            sa.select(problem_models.Problem)
            .where(problem_models.Problem.is_published)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())


class StatisticsRepository(base_repository.BaseRepository[homework_models.Statistics]):
    """Repository for Statistics operations"""

    def __init__(self, db: sa_asyncio.AsyncSession):
        super().__init__(homework_models.Statistics, db)

    async def get_by_student(
        self, student_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[homework_models.Statistics]:
        """Get statistics for student"""
        stmt = (
            sa.select(homework_models.Statistics)
            .where(homework_models.Statistics.student_id == student_id)
            .order_by(homework_models.Statistics.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_homework(
        self, homework_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[homework_models.Statistics]:
        """Get statistics for homework"""
        stmt = (
            sa.select(homework_models.Statistics)
            .where(homework_models.Statistics.homework_id == homework_id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_student_homework_stats(
        self, student_id: int, homework_id: int
    ) -> tp.Optional[homework_models.Statistics]:
        """Get specific student homework statistics"""
        stmt = sa.select(homework_models.Statistics).where(
            homework_models.Statistics.student_id == student_id,
            homework_models.Statistics.homework_id == homework_id,
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_or_create_stats(
        self, student_id: int, homework_id: int, max_score: float
    ) -> homework_models.Statistics:
        """Get existing or create new statistics"""
        stats = await self.get_student_homework_stats(student_id, homework_id)
        if stats:
            return stats

        return await self.create(
            {
                "student_id": student_id,
                "homework_id": homework_id,
                "max_score": max_score,
                "score": 0.0,
                "status": "not_started",
            }
        )

    async def update_score(
        self,
        stats_id: int,
        score: float,
        status: str = "in_progress",
    ) -> tp.Optional[homework_models.Statistics]:
        """Update statistics score"""
        return await self.update(stats_id, {"score": score, "status": status})

    async def submit_homework(self, stats_id: int) -> tp.Optional[homework_models.Statistics]:
        """Mark homework as submitted"""
        return await self.update(
            stats_id,
            {
                "status": "submitted",
                "submitted_at": tp.cast(tp.Any, "NOW()"),  # PostgreSQL function
            },
        )

    async def get_average_score_by_homework(self, homework_id: int) -> float:
        """Calculate average score for homework"""
        stmt = sa.select(sa.func.avg(homework_models.Statistics.score)).where(
            homework_models.Statistics.homework_id == homework_id,
            homework_models.Statistics.status.in_(["submitted", "graded"]),
        )
        result = await self.db.execute(stmt)
        avg_value = result.scalar_one_or_none()
        return float(avg_value) if avg_value else 0.0
