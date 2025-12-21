"""
Homework service
"""

import typing as tp

import fastapi
from fastapi import status as http_status
from sqlalchemy import orm as orm

from app.repositories import classroom_repository as classroom_repository
from app.repositories import homework_repository as homework_repository
from app.repositories import lesson_repository as lesson_repository
from app.repositories import user_repository as user_repository
from app.schemas import homework as homework_schemas


class HomeworkService:
    """
    Service for homework management

    Handles homework creation, problem assignment, viewing
    """

    def __init__(self, db: orm.Session):
        self.db = db
        self.homework_repo = homework_repository.HomeworkRepository(db)
        self.hw_problem_repo = homework_repository.HomeworkProblemRepository(db)
        self.problem_repo = homework_repository.ProblemRepository(db)
        self.lesson_repo = lesson_repository.LessonRepository(db)
        self.classroom_repo = classroom_repository.ClassroomRepository(db)
        self.teacher_repo = user_repository.TeacherRepository(db)
        self.student_repo = user_repository.StudentRepository(db)

    def create_homework(
        self,
        homework_data: homework_schemas.HomeworkCreate,
        teacher_user_id: int,
    ) -> homework_schemas.HomeworkResponse:
        """
        Create new homework

        Args:
            homework_data: Homework creation data
            teacher_user_id: User ID of teacher

        Returns:
            Created homework

        Raises:
            HTTPException: If not authorized
        """
        # Verify lesson exists
        lesson = self.lesson_repo.get_by_id(homework_data.lesson_id)
        if not lesson:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Lesson not found",
            )

        # Verify teacher owns classroom
        classroom = self.classroom_repo.get_by_id(lesson.classroom_id)
        teacher = self.teacher_repo.get_by_user_id(teacher_user_id)

        if not teacher or not classroom or classroom.teacher_id != teacher.id:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Only classroom owner can create homework",
            )

        # Create homework
        homework_dict = homework_data.model_dump(exclude={"problem_ids", "problem_points"})
        homework = self.homework_repo.create(homework_dict)

        # Add problems
        points_list = homework_data.problem_points or []
        for idx, problem_id in enumerate(homework_data.problem_ids):
            points = points_list[idx] if idx < len(points_list) else 10.0
            self.hw_problem_repo.add_problem_to_homework(
                homework.id, problem_id, points=points, order_number=idx
            )

        response = homework_schemas.HomeworkResponse.model_validate(homework)
        response.problems_count = len(homework_data.problem_ids)
        return response

    def get_homework(
        self, homework_id: int, user_id: int
    ) -> homework_schemas.HomeworkDetailResponse:
        """
        Get homework by ID

        Args:
            homework_id: Homework ID
            user_id: User ID (for permission check)

        Returns:
            Homework data
        """
        homework = self.homework_repo.get_by_id(homework_id)
        if not homework:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Homework not found",
            )

        # Check if published for students
        lesson = self.lesson_repo.get_by_id(homework.lesson_id)
        if not lesson:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Lesson not found",
            )

        classroom = self.classroom_repo.get_by_id(lesson.classroom_id)
        teacher = self.teacher_repo.get_by_user_id(user_id)

        # If not teacher of this classroom and homework not published, deny access
        is_teacher = teacher and classroom and classroom.teacher_id == teacher.id
        if not is_teacher and not homework.is_published:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Homework not published yet",
            )

        response = homework_schemas.HomeworkDetailResponse.model_validate(homework)
        response.problems_count = len(self.hw_problem_repo.get_by_homework(homework_id))
        return response

    def get_homework_problems(
        self, homework_id: int, user_id: int
    ) -> tp.List[tp.Union[homework_schemas.ProblemResponse, homework_schemas.ProblemFullResponse]]:
        """
        Get problems for homework

        Teachers get full info (with answers), students get limited info
        """
        homework = self.homework_repo.get_by_id(homework_id)
        if not homework:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Homework not found",
            )

        lesson = self.lesson_repo.get_by_id(homework.lesson_id)
        if not lesson:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Lesson not found",
            )

        classroom = self.classroom_repo.get_by_id(lesson.classroom_id)
        teacher = self.teacher_repo.get_by_user_id(user_id)
        is_teacher = teacher and classroom and classroom.teacher_id == teacher.id

        # Get homework problems
        hw_problems = self.hw_problem_repo.get_by_homework(homework_id)
        problem_ids = [hp.problem_id for hp in hw_problems]

        problems = [self.problem_repo.get_by_id(pid) for pid in problem_ids]
        problems = [p for p in problems if p]  # Filter None

        if is_teacher:
            # Teachers see full info
            return [homework_schemas.ProblemFullResponse.model_validate(p) for p in problems]
        else:
            # Students don't see correct answers
            return [homework_schemas.ProblemResponse.model_validate(p) for p in problems]

    def update_homework(
        self,
        homework_id: int,
        homework_data: homework_schemas.HomeworkUpdate,
        teacher_user_id: int,
    ) -> homework_schemas.HomeworkResponse:
        """Update homework (teacher only)"""
        homework = self.homework_repo.get_by_id(homework_id)
        if not homework:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Homework not found",
            )

        # Verify teacher owns classroom
        lesson = self.lesson_repo.get_by_id(homework.lesson_id)
        if not lesson:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Lesson not found",
            )

        classroom = self.classroom_repo.get_by_id(lesson.classroom_id)
        teacher = self.teacher_repo.get_by_user_id(teacher_user_id)

        if not teacher or not classroom or classroom.teacher_id != teacher.id:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Only classroom owner can update homework",
            )

        updated = self.homework_repo.update(
            homework_id, homework_data.model_dump(exclude_unset=True)
        )
        if not updated:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update homework",
            )

        return homework_schemas.HomeworkResponse.model_validate(updated)

    def get_lesson_homework(
        self, lesson_id: int, user_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[homework_schemas.HomeworkResponse]:
        """
        Get all homework for a lesson

        Teachers see all homework (including unpublished), students see only published.

        Args:
            lesson_id: Lesson ID
            user_id: User ID (for permission check)
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List of homework for the lesson
        """
        # Check if user is teacher of this lesson's classroom
        lesson = self.lesson_repo.get_by_id(lesson_id)
        if not lesson:
            return []

        teacher = self.teacher_repo.get_by_user_id(user_id)
        classroom = self.classroom_repo.get_by_id(lesson.classroom_id)
        is_teacher = teacher and classroom and classroom.teacher_id == teacher.id

        if is_teacher:
            # Teacher sees all homework
            homeworks = self.homework_repo.get_by_lesson(lesson_id, skip, limit)
        else:
            # Students see only published
            homeworks = self.homework_repo.get_published(lesson_id, skip, limit)

        return [homework_schemas.HomeworkResponse.model_validate(hw) for hw in homeworks]
