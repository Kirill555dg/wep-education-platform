"""
Classroom repository
"""

import typing as tp

import sqlalchemy.orm as orm

from app.models.classes import Classroom, Invite, StudentClassroom
from app.repositories.base import BaseRepository


class ClassroomRepository(BaseRepository[Classroom]):
    """Repository for Classroom operations"""

    def __init__(self, db: orm.Session):
        super().__init__(Classroom, db)

    def get_by_teacher(
        self, teacher_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[Classroom]:
        """Get classrooms by teacher"""
        return (
            self.db.query(Classroom)
            .filter(Classroom.teacher_id == teacher_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_invite_code(self, invite_code: str) -> tp.Optional[Classroom]:
        """Get classroom by invite code"""
        return self.db.query(Classroom).filter(Classroom.invite_code == invite_code).first()

    def get_with_students(self, classroom_id: int) -> tp.Optional[Classroom]:
        """Get classroom with students"""
        return (
            self.db.query(Classroom)
            .options(orm.joinedload(Classroom.student_memberships))
            .filter(Classroom.id == classroom_id)
            .first()
        )

    def get_active_classrooms(self, skip: int = 0, limit: int = 100) -> tp.List[Classroom]:
        """Get active classrooms"""
        return (
            self.db.query(Classroom)
            .filter(Classroom.is_active)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_subject(self, subject: str, skip: int = 0, limit: int = 100) -> tp.List[Classroom]:
        """Get classrooms by subject"""
        return (
            self.db.query(Classroom)
            .filter(Classroom.subject == subject)
            .offset(skip)
            .limit(limit)
            .all()
        )


class StudentClassroomRepository(BaseRepository[StudentClassroom]):
    """Repository for StudentClassroom operations"""

    def __init__(self, db: orm.Session):
        super().__init__(StudentClassroom, db)

    def get_by_student(
        self, student_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[StudentClassroom]:
        """Get classrooms for student"""
        return (
            self.db.query(StudentClassroom)
            .filter(StudentClassroom.student_id == student_id, StudentClassroom.is_active)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_classroom(
        self, classroom_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[StudentClassroom]:
        """Get students in classroom"""
        return (
            self.db.query(StudentClassroom)
            .filter(
                StudentClassroom.classroom_id == classroom_id, StudentClassroom.is_active
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_membership(self, student_id: int, classroom_id: int) -> tp.Optional[StudentClassroom]:
        """Get specific student-classroom membership"""
        return (
            self.db.query(StudentClassroom)
            .filter(
                StudentClassroom.student_id == student_id,
                StudentClassroom.classroom_id == classroom_id,
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
            self.db.query(StudentClassroom)
            .filter(
                StudentClassroom.classroom_id == classroom_id, StudentClassroom.is_active
            )
            .count()
        )


class InviteRepository(BaseRepository[Invite]):
    """Repository for Invite operations"""

    def __init__(self, db: orm.Session):
        super().__init__(Invite, db)

    def get_by_code(self, invite_code: str) -> tp.Optional[Invite]:
        """Get invite by code"""
        return self.db.query(Invite).filter(Invite.invite_code == invite_code).first()

    def get_by_classroom(
        self, classroom_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[Invite]:
        """Get invites for classroom"""
        return (
            self.db.query(Invite)
            .filter(Invite.classroom_id == classroom_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def increment_uses(self, invite_id: int) -> tp.Optional[Invite]:
        """Increment invite uses count"""
        invite = self.get_by_id(invite_id)
        if not invite:
            return None
        invite.uses_count += 1
        self.db.commit()
        self.db.refresh(invite)
        return invite
