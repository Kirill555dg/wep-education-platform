"""
Classroom repository
"""

import typing as tp

import sqlalchemy as sa
from sqlalchemy import orm as orm
from sqlalchemy.ext import asyncio as sa_asyncio

from app.models import classes as classes_models
from app.repositories import base as base_repository


class ClassroomRepository(base_repository.BaseRepository[classes_models.Classroom]):
    """Repository for Classroom operations"""

    def __init__(self, db: sa_asyncio.AsyncSession):
        super().__init__(classes_models.Classroom, db)

    async def get_by_teacher(
        self, teacher_id: int, skip: int = 0, limit: int = 100
    ) -> list[classes_models.Classroom]:
        """Get classrooms by teacher"""
        stmt = (
            sa.select(classes_models.Classroom)
            .where(classes_models.Classroom.teacher_id == teacher_id)
            .offset(skip)
            .limit(limit)
        )
        items = await self._scalars_all(stmt)
        return tp.cast(list[classes_models.Classroom], items)

    async def get_by_invite_code(self, invite_code: str) -> classes_models.Classroom | None:
        """Get classroom by invite code"""
        stmt = sa.select(classes_models.Classroom).where(classes_models.Classroom.invite_code == invite_code)
        obj = await self._scalar_one_or_none(stmt)
        return tp.cast(classes_models.Classroom | None, obj)

    async def get_with_students(self, classroom_id: int) -> classes_models.Classroom | None:
        """Get classroom with students"""
        stmt = (
            sa.select(classes_models.Classroom)
            .options(orm.joinedload(classes_models.Classroom.student_memberships))
            .where(classes_models.Classroom.id == classroom_id)
        )
        obj = await self._scalar_one_or_none(stmt)
        return tp.cast(classes_models.Classroom | None, obj)

    async def get_active_classrooms(
        self, skip: int = 0, limit: int = 100
    ) -> list[classes_models.Classroom]:
        """Get active classrooms"""
        stmt = (
            sa.select(classes_models.Classroom)
            .where(classes_models.Classroom.is_active)
            .offset(skip)
            .limit(limit)
        )
        items = await self._scalars_all(stmt)
        return tp.cast(list[classes_models.Classroom], items)

    async def get_by_subject(
        self, subject: str, skip: int = 0, limit: int = 100
    ) -> list[classes_models.Classroom]:
        """Get classrooms by subject"""
        stmt = (
            sa.select(classes_models.Classroom)
            .where(classes_models.Classroom.subject == subject)
            .offset(skip)
            .limit(limit)
        )
        items = await self._scalars_all(stmt)
        return tp.cast(list[classes_models.Classroom], items)


class StudentClassroomRepository(base_repository.BaseRepository[classes_models.StudentClassroom]):
    """Repository for StudentClassroom operations"""

    def __init__(self, db: sa_asyncio.AsyncSession):
        super().__init__(classes_models.StudentClassroom, db)

    async def get_by_student(
        self, student_id: int, skip: int = 0, limit: int = 100
    ) -> list[classes_models.StudentClassroom]:
        """Get classrooms for student"""
        stmt = (
            sa.select(classes_models.StudentClassroom)
            .where(
                classes_models.StudentClassroom.student_id == student_id,
                classes_models.StudentClassroom.is_active,
            )
            .offset(skip)
            .limit(limit)
        )
        items = await self._scalars_all(stmt)
        return tp.cast(list[classes_models.StudentClassroom], items)

    async def get_by_classroom(
        self, classroom_id: int, skip: int = 0, limit: int = 100
    ) -> list[classes_models.StudentClassroom]:
        """Get students in classroom"""
        stmt = (
            sa.select(classes_models.StudentClassroom)
            .where(
                classes_models.StudentClassroom.classroom_id == classroom_id,
                classes_models.StudentClassroom.is_active,
            )
            .offset(skip)
            .limit(limit)
        )
        items = await self._scalars_all(stmt)
        return tp.cast(list[classes_models.StudentClassroom], items)

    async def get_membership(
        self, student_id: int, classroom_id: int
    ) -> classes_models.StudentClassroom | None:
        """Get specific student-classroom membership"""
        stmt = sa.select(classes_models.StudentClassroom).where(
            classes_models.StudentClassroom.student_id == student_id,
            classes_models.StudentClassroom.classroom_id == classroom_id,
        )
        obj = await self._scalar_one_or_none(stmt)
        return tp.cast(classes_models.StudentClassroom | None, obj)

    async def is_student_in_classroom(self, student_id: int, classroom_id: int) -> bool:
        """Check if student is in classroom"""
        membership = await self.get_membership(student_id, classroom_id)
        return membership is not None and membership.is_active

    async def count_students_in_classroom(self, classroom_id: int) -> int:
        """Count active students in classroom"""
        stmt = (
            sa.select(sa.func.count())
            .select_from(classes_models.StudentClassroom)
            .where(
                classes_models.StudentClassroom.classroom_id == classroom_id,
                classes_models.StudentClassroom.is_active,
            )
        )
        result = await self.db.execute(stmt)
        count_value = result.scalar_one()
        return tp.cast(int, count_value)


class InviteRepository(base_repository.BaseRepository[classes_models.Invite]):
    """Repository for Invite operations"""

    def __init__(self, db: sa_asyncio.AsyncSession):
        super().__init__(classes_models.Invite, db)

    async def get_by_code(self, invite_code: str) -> classes_models.Invite | None:
        """Get invite by code"""
        stmt = sa.select(classes_models.Invite).where(classes_models.Invite.invite_code == invite_code)
        obj = await self._scalar_one_or_none(stmt)
        return tp.cast(classes_models.Invite | None, obj)

    async def get_by_classroom(
        self, classroom_id: int, skip: int = 0, limit: int = 100
    ) -> list[classes_models.Invite]:
        """Get invites for classroom"""
        stmt = (
            sa.select(classes_models.Invite)
            .where(classes_models.Invite.classroom_id == classroom_id)
            .offset(skip)
            .limit(limit)
        )
        items = await self._scalars_all(stmt)
        return tp.cast(list[classes_models.Invite], items)

    async def increment_uses(self, invite_id: int) -> classes_models.Invite | None:
        """Increment invite uses count"""
        invite = await self.get_by_id(invite_id)
        if not invite:
            return None
        invite.uses_count += 1
        await self.db.commit()
        await self.db.refresh(invite)
        return invite
