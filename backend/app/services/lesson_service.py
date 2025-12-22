"""
Lesson service
"""

import typing as tp

import fastapi
from fastapi import status as http_status
from sqlalchemy.ext import asyncio as sa_asyncio

from app.repositories import classroom_repository as classroom_repository
from app.repositories import lesson_repository as lesson_repository
from app.repositories import user_repository as user_repository
from app.schemas import lessons as lesson_schemas


class LessonService:
    """
    Service for lesson management

    Handles lessons and their materials
    """

    def __init__(self, db: sa_asyncio.AsyncSession):
        self.db = db
        self.lesson_repo = lesson_repository.LessonRepository(db)
        self.lesson_material_repo = lesson_repository.LessonMaterialRepository(db)
        self.theory_repo = lesson_repository.TheoryMaterialRepository(db)
        self.classroom_repo = classroom_repository.ClassroomRepository(db)
        self.teacher_repo = user_repository.TeacherRepository(db)

    async def create_lesson(
        self,
        lesson_data: lesson_schemas.LessonCreate,
        teacher_user_id: int,
    ) -> lesson_schemas.LessonResponse:
        """
        Create new lesson

        Args:
            lesson_data: Lesson creation data
            teacher_user_id: User ID of teacher

        Returns:
            Created lesson

        Raises:
            HTTPException: If not authorized or classroom not found
        """
        # Verify classroom exists
        classroom = await self.classroom_repo.get_by_id(lesson_data.classroom_id)
        if not classroom:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Classroom not found",
            )

        # Verify teacher owns classroom
        teacher = await self.teacher_repo.get_by_user_id(teacher_user_id)
        if not teacher or classroom.teacher_id != teacher.id:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Only classroom owner can create lessons",
            )

        # Create lesson
        lesson_dict = lesson_data.model_dump(exclude={"theory_material_ids"})
        lesson = await self.lesson_repo.create(lesson_dict)

        # Add theory materials
        for idx, material_id in enumerate(lesson_data.theory_material_ids):
            await self.lesson_material_repo.add_material_to_lesson(
                lesson.id, material_id, order_number=idx
            )

        return lesson_schemas.LessonResponse.model_validate(lesson)

    async def get_lesson(self, lesson_id: int) -> lesson_schemas.LessonDetailResponse:
        """Get lesson by ID"""
        lesson = await self.lesson_repo.get_by_id(lesson_id)
        if not lesson:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Lesson not found",
            )

        response = lesson_schemas.LessonDetailResponse.model_validate(lesson)
        response.materials_count = len(await self.lesson_material_repo.get_by_lesson(lesson_id))
        response.homeworks_count = await self.lesson_repo.count_by_classroom(lesson.classroom_id)
        return response

    async def get_classroom_lessons(
        self, classroom_id: int, user_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[lesson_schemas.LessonResponse]:
        """
        Get lessons for classroom

        Students see only published lessons, teachers see all
        """
        # Check if user is teacher of this classroom
        teacher = await self.teacher_repo.get_by_user_id(user_id)
        classroom = await self.classroom_repo.get_by_id(classroom_id)

        if teacher and classroom and classroom.teacher_id == teacher.id:
            # Teacher sees all lessons
            lessons = await self.lesson_repo.get_by_classroom(classroom_id, skip, limit)
        else:
            # Students see only published
            lessons = await self.lesson_repo.get_published(classroom_id, skip, limit)

        return [lesson_schemas.LessonResponse.model_validate(lesson_item) for lesson_item in lessons]

    async def update_lesson(
        self,
        lesson_id: int,
        lesson_data: lesson_schemas.LessonUpdate,
        teacher_user_id: int,
    ) -> lesson_schemas.LessonResponse:
        """Update lesson (teacher only)"""
        lesson = await self.lesson_repo.get_by_id(lesson_id)
        if not lesson:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Lesson not found",
            )

        # Verify teacher owns classroom
        classroom = await self.classroom_repo.get_by_id(lesson.classroom_id)
        teacher = await self.teacher_repo.get_by_user_id(teacher_user_id)

        if not teacher or not classroom or classroom.teacher_id != teacher.id:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Only classroom owner can update lessons",
            )

        updated = await self.lesson_repo.update(lesson_id, lesson_data.model_dump(exclude_unset=True))
        if not updated:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update lesson",
            )

        return lesson_schemas.LessonResponse.model_validate(updated)

    async def delete_lesson(self, lesson_id: int, teacher_user_id: int) -> bool:
        """Delete lesson (teacher only)"""
        lesson = await self.lesson_repo.get_by_id(lesson_id)
        if not lesson:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Lesson not found",
            )

        # Verify teacher owns classroom
        classroom = await self.classroom_repo.get_by_id(lesson.classroom_id)
        teacher = await self.teacher_repo.get_by_user_id(teacher_user_id)

        if not teacher or not classroom or classroom.teacher_id != teacher.id:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Only classroom owner can delete lessons",
            )

        return await self.lesson_repo.delete(lesson_id)
