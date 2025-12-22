"""
Classroom repository
"""

import typing as tp

from sqlalchemy import orm as orm

from app.models import classes as classes_models
from app.repositories import base as base_repository


class ClassroomRepository(base_repository.BaseRepository[classes_models.Classroom]):
    """Repository for Classroom operations"""

    def __init__(self, db: orm.Session):
        super().__init__(classes_models.Classroom, db)

    def get_by_teacher(
        self, teacher_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[classes_models.Classroom]:
        """Get classrooms by teacher"""
        return (
            self.db.query(classes_models.Classroom)
            .filter(classes_models.Classroom.teacher_id == teacher_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_invite_code(self, invite_code: str) -> tp.Optional[classes_models.Classroom]:
        """Get classroom by invite code"""
        return (
            self.db.query(classes_models.Classroom)
            .filter(classes_models.Classroom.invite_code == invite_code)
            .first()
        )

    def get_with_students(self, classroom_id: int) -> tp.Optional[classes_models.Classroom]:
        """Get classroom with students"""
        return (
            self.db.query(classes_models.Classroom)
            .options(orm.joinedload(classes_models.Classroom.student_memberships))
            .filter(classes_models.Classroom.id == classroom_id)
            .first()
        )

    def get_active_classrooms(
        self, skip: int = 0, limit: int = 100
    ) -> tp.List[classes_models.Classroom]:
        """Get active classrooms"""
        return (
            self.db.query(classes_models.Classroom)
            .filter(classes_models.Classroom.is_active)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_subject(
        self, subject: str, skip: int = 0, limit: int = 100
    ) -> tp.List[classes_models.Classroom]:
        """Get classrooms by subject"""
        return (
            self.db.query(classes_models.Classroom)
            .filter(classes_models.Classroom.subject == subject)
            .offset(skip)
            .limit(limit)
            .all()
        )


class StudentClassroomRepository(base_repository.BaseRepository[classes_models.StudentClassroom]):
    """Repository for StudentClassroom operations"""

    def __init__(self, db: orm.Session):
        super().__init__(classes_models.StudentClassroom, db)

    def get_by_student(
        self, student_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[classes_models.StudentClassroom]:
        """Get classrooms for student"""
        return (
            self.db.query(classes_models.StudentClassroom)
            .filter(
                classes_models.StudentClassroom.student_id == student_id,
                classes_models.StudentClassroom.is_active,
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_classroom(
        self, classroom_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[classes_models.StudentClassroom]:
        """Get students in classroom"""
        return (
            self.db.query(classes_models.StudentClassroom)
            .filter(
                classes_models.StudentClassroom.classroom_id == classroom_id,
                classes_models.StudentClassroom.is_active,
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_membership(
        self, student_id: int, classroom_id: int
    ) -> tp.Optional[classes_models.StudentClassroom]:
        """Get specific student-classroom membership"""
        return (
            self.db.query(classes_models.StudentClassroom)
            .filter(
                classes_models.StudentClassroom.student_id == student_id,
                classes_models.StudentClassroom.classroom_id == classroom_id,
            )
            .first()
        )

    def is_student_in_classroom(self, student_id: int, classroom_id: int) -> bool:
        """Check if student is in classroom"""
        membership = self.get_membership(student_id, classroom_id)
        return membership is not None and membership.is_active

    def count_students_in_classroom(self, classroom_id: int) -> int:
        """Count active students in classroom"""
        return (
            self.db.query(classes_models.StudentClassroom)
            .filter(
                classes_models.StudentClassroom.classroom_id == classroom_id,
                classes_models.StudentClassroom.is_active,
            )
            .count()
        )


class InviteRepository(base_repository.BaseRepository[classes_models.Invite]):
    """Repository for Invite operations"""

    def __init__(self, db: orm.Session):
        super().__init__(classes_models.Invite, db)

    def get_by_code(self, invite_code: str) -> tp.Optional[classes_models.Invite]:
        """Get invite by code"""
        return (
            self.db.query(classes_models.Invite)
            .filter(classes_models.Invite.invite_code == invite_code)
            .first()
        )

    def get_by_classroom(
        self, classroom_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[classes_models.Invite]:
        """Get invites for classroom"""
        return (
            self.db.query(classes_models.Invite)
            .filter(classes_models.Invite.classroom_id == classroom_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def increment_uses(self, invite_id: int) -> tp.Optional[classes_models.Invite]:
        """Increment invite uses count"""
        invite = self.get_by_id(invite_id)
        if not invite:
            return None
        invite.uses_count += 1
        self.db.commit()
        self.db.refresh(invite)
        return invite
