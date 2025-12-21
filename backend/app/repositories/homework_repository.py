"""
Homework, Problem, and Statistics repositories
"""

import typing as tp

import sqlalchemy.orm as orm

from app.models.homework import Homework, HomeworkProblem, Statistics
from app.models.problems import Problem
from app.repositories.base import BaseRepository


class HomeworkRepository(BaseRepository[Homework]):
    """Repository for Homework operations"""

    def __init__(self, db: orm.Session):
        super().__init__(Homework, db)

    def get_by_lesson(self, lesson_id: int, skip: int = 0, limit: int = 100) -> tp.List[Homework]:
        """Get homeworks for lesson"""
        return (
            self.db.query(Homework)
            .filter(Homework.lesson_id == lesson_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_published(self, lesson_id: int, skip: int = 0, limit: int = 100) -> tp.List[Homework]:
        """Get published homeworks for lesson"""
        return (
            self.db.query(Homework)
            .filter(Homework.lesson_id == lesson_id, Homework.is_published)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_with_problems(self, homework_id: int) -> tp.Optional[Homework]:
        """Get homework with problems"""
        return (
            self.db.query(Homework)
            .options(orm.joinedload(Homework.homework_problems))
            .filter(Homework.id == homework_id)
            .first()
        )

    def count_by_lesson(self, lesson_id: int) -> int:
        """Count homeworks in lesson"""
        return self.db.query(Homework).filter(Homework.lesson_id == lesson_id).count()


class HomeworkProblemRepository(BaseRepository[HomeworkProblem]):
    """Repository for HomeworkProblem operations"""

    def __init__(self, db: orm.Session):
        super().__init__(HomeworkProblem, db)

    def get_by_homework(self, homework_id: int) -> tp.List[HomeworkProblem]:
        """Get problems for homework"""
        return (
            self.db.query(HomeworkProblem)
            .filter(HomeworkProblem.homework_id == homework_id)
            .order_by(HomeworkProblem.order_number)
            .all()
        )

    def add_problem_to_homework(
        self, homework_id: int, problem_id: int, points: float = 10.0, order_number: int = 0
    ) -> HomeworkProblem:
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
            self.db.query(HomeworkProblem)
            .filter(
                HomeworkProblem.homework_id == homework_id, HomeworkProblem.problem_id == problem_id
            )
            .first()
        )

        if not hw_problem:
            return False

        self.db.delete(hw_problem)
        self.db.commit()
        return True


class ProblemRepository(BaseRepository[Problem]):
    """Repository for Problem operations"""

    def __init__(self, db: orm.Session):
        super().__init__(Problem, db)

    def get_by_type(self, problem_type: str, skip: int = 0, limit: int = 100) -> tp.List[Problem]:
        """Get problems by type"""
        return (
            self.db.query(Problem)
            .filter(Problem.problem_type == problem_type)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_difficulty(
        self, difficulty: str, skip: int = 0, limit: int = 100
    ) -> tp.List[Problem]:
        """Get problems by difficulty"""
        return (
            self.db.query(Problem)
            .filter(Problem.difficulty == difficulty)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_published(self, skip: int = 0, limit: int = 100) -> tp.List[Problem]:
        """Get published problems"""
        return (
            self.db.query(Problem)
            .filter(Problem.is_published)
            .offset(skip)
            .limit(limit)
            .all()
        )


class StatisticsRepository(BaseRepository[Statistics]):
    """Repository for Statistics operations"""

    def __init__(self, db: orm.Session):
        super().__init__(Statistics, db)

    def get_by_student(
        self, student_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[Statistics]:
        """Get statistics for student"""
        return (
            self.db.query(Statistics)
            .filter(Statistics.student_id == student_id)
            .order_by(Statistics.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_homework(
        self, homework_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[Statistics]:
        """Get statistics for homework"""
        return (
            self.db.query(Statistics)
            .filter(Statistics.homework_id == homework_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_student_homework_stats(
        self, student_id: int, homework_id: int
    ) -> tp.Optional[Statistics]:
        """Get specific student homework statistics"""
        return (
            self.db.query(Statistics)
            .filter(Statistics.student_id == student_id, Statistics.homework_id == homework_id)
            .first()
        )

    def get_or_create_stats(
        self, student_id: int, homework_id: int, max_score: float
    ) -> Statistics:
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
        self, stats_id: int, score: float, status: str = "in_progress"
    ) -> tp.Optional[Statistics]:
        """Update statistics score"""
        return self.update(stats_id, {"score": score, "status": status})

    def submit_homework(self, stats_id: int) -> tp.Optional[Statistics]:
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
        from sqlalchemy import func

        result = (
            self.db.query(func.avg(Statistics.score))
            .filter(
                Statistics.homework_id == homework_id,
                Statistics.status.in_(["submitted", "graded"]),
            )
            .scalar()
        )
        return float(result) if result else 0.0
