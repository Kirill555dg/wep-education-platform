"""
Homework, Problem, and Statistics repositories
"""

import typing as tp

from sqlalchemy import orm as orm

import sqlalchemy as sa

from app.models import homework as homework_models
from app.models import problems as problem_models
from app.repositories import base as base_repository


class HomeworkRepository(base_repository.BaseRepository[homework_models.Homework]):
    """Repository for Homework operations"""

    def __init__(self, db: orm.Session):
        super().__init__(homework_models.Homework, db)

    def get_by_lesson(
        self, lesson_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[homework_models.Homework]:
        """Get homeworks for lesson"""
        return (
            self.db.query(homework_models.Homework)
            .filter(homework_models.Homework.lesson_id == lesson_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_published(
        self, lesson_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[homework_models.Homework]:
        """Get published homeworks for lesson"""
        return (
            self.db.query(homework_models.Homework)
            .filter(
                homework_models.Homework.lesson_id == lesson_id,
                homework_models.Homework.is_published,
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_with_problems(self, homework_id: int) -> tp.Optional[homework_models.Homework]:
        """Get homework with problems"""
        return (
            self.db.query(homework_models.Homework)
            .options(orm.joinedload(homework_models.Homework.homework_problems))
            .filter(homework_models.Homework.id == homework_id)
            .first()
        )

    def count_by_lesson(self, lesson_id: int) -> int:
        """Count homeworks in lesson"""
        return (
            self.db.query(homework_models.Homework)
            .filter(homework_models.Homework.lesson_id == lesson_id)
            .count()
        )


class HomeworkProblemRepository(base_repository.BaseRepository[homework_models.HomeworkProblem]):
    """Repository for HomeworkProblem operations"""

    def __init__(self, db: orm.Session):
        super().__init__(homework_models.HomeworkProblem, db)

    def get_by_homework(self, homework_id: int) -> tp.List[homework_models.HomeworkProblem]:
        """Get problems for homework"""
        return (
            self.db.query(homework_models.HomeworkProblem)
            .filter(homework_models.HomeworkProblem.homework_id == homework_id)
            .order_by(homework_models.HomeworkProblem.order_number)
            .all()
        )

    def add_problem_to_homework(
        self, homework_id: int, problem_id: int, points: float = 10.0, order_number: int = 0
    ) -> homework_models.HomeworkProblem:
        """Add problem to homework"""
        return self.create(
            {
                "homework_id": homework_id,
                "problem_id": problem_id,
                "points": points,
                "order_number": order_number,
            }
        )

    def remove_problem_from_homework(self, homework_id: int, problem_id: int) -> bool:
        """Remove problem from homework"""
        hw_problem = (
            self.db.query(homework_models.HomeworkProblem)
            .filter(
                homework_models.HomeworkProblem.homework_id == homework_id,
                homework_models.HomeworkProblem.problem_id == problem_id,
            )
            .first()
        )

        if not hw_problem:
            return False

        self.db.delete(hw_problem)
        self.db.commit()
        return True


class ProblemRepository(base_repository.BaseRepository[problem_models.Problem]):
    """Repository for Problem operations"""

    def __init__(self, db: orm.Session):
        super().__init__(problem_models.Problem, db)

    def get_by_type(
        self, problem_type: str, skip: int = 0, limit: int = 100
    ) -> tp.List[problem_models.Problem]:
        """Get problems by type"""
        return (
            self.db.query(problem_models.Problem)
            .filter(problem_models.Problem.problem_type == problem_type)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_difficulty(
        self, difficulty: str, skip: int = 0, limit: int = 100
    ) -> tp.List[problem_models.Problem]:
        """Get problems by difficulty"""
        return (
            self.db.query(problem_models.Problem)
            .filter(problem_models.Problem.difficulty == difficulty)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_published(self, skip: int = 0, limit: int = 100) -> tp.List[problem_models.Problem]:
        """Get published problems"""
        return (
            self.db.query(problem_models.Problem)
            .filter(problem_models.Problem.is_published)
            .offset(skip)
            .limit(limit)
            .all()
        )


class StatisticsRepository(base_repository.BaseRepository[homework_models.Statistics]):
    """Repository for Statistics operations"""

    def __init__(self, db: orm.Session):
        super().__init__(homework_models.Statistics, db)

    def get_by_student(
        self, student_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[homework_models.Statistics]:
        """Get statistics for student"""
        return (
            self.db.query(homework_models.Statistics)
            .filter(homework_models.Statistics.student_id == student_id)
            .order_by(homework_models.Statistics.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_homework(
        self, homework_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[homework_models.Statistics]:
        """Get statistics for homework"""
        return (
            self.db.query(homework_models.Statistics)
            .filter(homework_models.Statistics.homework_id == homework_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_student_homework_stats(
        self, student_id: int, homework_id: int
    ) -> tp.Optional[homework_models.Statistics]:
        """Get specific student homework statistics"""
        return (
            self.db.query(homework_models.Statistics)
            .filter(
                homework_models.Statistics.student_id == student_id,
                homework_models.Statistics.homework_id == homework_id,
            )
            .first()
        )

    def get_or_create_stats(
        self, student_id: int, homework_id: int, max_score: float
    ) -> homework_models.Statistics:
        """Get existing or create new statistics"""
        stats = self.get_student_homework_stats(student_id, homework_id)
        if stats:
            return stats

        return self.create(
            {
                "student_id": student_id,
                "homework_id": homework_id,
                "max_score": max_score,
                "score": 0.0,
                "status": "not_started",
            }
        )

    def update_score(
        self,
        stats_id: int,
        score: float,
        status: str = "in_progress",
    ) -> tp.Optional[homework_models.Statistics]:
        """Update statistics score"""
        return self.update(stats_id, {"score": score, "status": status})

    def submit_homework(self, stats_id: int) -> tp.Optional[homework_models.Statistics]:
        """Mark homework as submitted"""
        return self.update(
            stats_id,
            {
                "status": "submitted",
                "submitted_at": tp.cast(tp.Any, "NOW()"),  # PostgreSQL function
            },
        )

    def get_average_score_by_homework(self, homework_id: int) -> float:
        """Calculate average score for homework"""
        result = (
            self.db.query(sa.func.avg(homework_models.Statistics.score))
            .filter(
                homework_models.Statistics.homework_id == homework_id,
                homework_models.Statistics.status.in_(["submitted", "graded"]),
            )
            .scalar()
        )
        return float(result) if result else 0.0
