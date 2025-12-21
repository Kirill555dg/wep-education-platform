"""
Classroom service
"""

import typing as tp

import fastapi
import nanoid
from fastapi import status as http_status
from sqlalchemy import orm as orm

from app.repositories import classroom_repository as classroom_repository
from app.repositories import user_repository as user_repository
from app.schemas import classrooms as classroom_schemas


class ClassroomService:
    """
    Service for classroom management

    Handles classroom creation, invites, student enrollment
    """

    def __init__(self, db: orm.Session):
        self.db = db
        self.classroom_repo = classroom_repository.ClassroomRepository(db)
        self.student_classroom_repo = classroom_repository.StudentClassroomRepository(db)
        self.invite_repo = classroom_repository.InviteRepository(db)
        self.teacher_repo = user_repository.TeacherRepository(db)
        self.student_repo = user_repository.StudentRepository(db)

    def create_classroom(
        self,
        classroom_data: classroom_schemas.ClassroomCreate,
        teacher_user_id: int,
    ) -> classroom_schemas.ClassroomResponse:
        """
        Create new classroom

        Args:
            classroom_data: Classroom creation data
            teacher_user_id: User ID of the teacher

        Returns:
            Created classroom

        Raises:
            HTTPException: If user is not a teacher
        """
        # Verify user is a teacher
        teacher = self.teacher_repo.get_by_user_id(teacher_user_id)
        if not teacher:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Only teachers can create classrooms",
            )

        # Generate unique invite code
        invite_code = nanoid.generate(size=10)

        # Create classroom
        classroom = self.classroom_repo.create(
            {**classroom_data.model_dump(), "teacher_id": teacher.id, "invite_code": invite_code}
        )

        response = classroom_schemas.ClassroomResponse.model_validate(classroom)
        response.students_count = 0
        return response

    def get_classroom(self, classroom_id: int) -> classroom_schemas.ClassroomResponse:
        """Get classroom by ID"""
        classroom = self.classroom_repo.get_by_id(classroom_id)
        if not classroom:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Classroom not found",
            )

        response = classroom_schemas.ClassroomResponse.model_validate(classroom)
        response.students_count = self.student_classroom_repo.count_students_in_classroom(
            classroom_id
        )
        return response

    def get_teacher_classrooms(
        self, teacher_user_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[classroom_schemas.ClassroomResponse]:
        """Get classrooms for teacher"""
        teacher = self.teacher_repo.get_by_user_id(teacher_user_id)
        if not teacher:
            return []

        classrooms = self.classroom_repo.get_by_teacher(teacher.id, skip, limit)
        return [classroom_schemas.ClassroomResponse.model_validate(c) for c in classrooms]

    def get_student_classrooms(
        self, student_user_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[classroom_schemas.ClassroomResponse]:
        """Get classrooms for student"""
        student = self.student_repo.get_by_user_id(student_user_id)
        if not student:
            return []

        memberships = self.student_classroom_repo.get_by_student(student.id, skip, limit)
        classroom_ids = [m.classroom_id for m in memberships]

        classrooms = [self.classroom_repo.get_by_id(cid) for cid in classroom_ids]

        return [classroom_schemas.ClassroomResponse.model_validate(c) for c in classrooms if c]

    def update_classroom(
        self,
        classroom_id: int,
        classroom_data: classroom_schemas.ClassroomUpdate,
        teacher_user_id: int,
    ) -> classroom_schemas.ClassroomResponse:
        """Update classroom (teacher only)"""
        classroom = self.classroom_repo.get_by_id(classroom_id)
        if not classroom:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Classroom not found",
            )

        # Verify teacher owns classroom
        teacher = self.teacher_repo.get_by_user_id(teacher_user_id)
        if not teacher or classroom.teacher_id != teacher.id:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Only classroom owner can update it",
            )

        updated = self.classroom_repo.update(
            classroom_id, classroom_data.model_dump(exclude_unset=True)
        )
        if not updated:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update classroom",
            )

        return classroom_schemas.ClassroomResponse.model_validate(updated)

    def join_classroom(
        self,
        join_data: classroom_schemas.JoinClassroomRequest,
        student_user_id: int,
    ) -> classroom_schemas.ClassroomResponse:
        """
        Student joins classroom via invite code

        Args:
            join_data: Invite code
            student_user_id: User ID of the student

        Returns:
            Joined classroom

        Raises:
            HTTPException: If invite invalid or user not a student
        """
        # Verify user is a student
        student = self.student_repo.get_by_user_id(student_user_id)
        if not student:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Only students can join classrooms",
            )

        # Find classroom by invite code
        classroom = self.classroom_repo.get_by_invite_code(join_data.invite_code)
        if not classroom:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Invalid invite code",
            )

        # Check if already member
        existing = self.student_classroom_repo.get_membership(student.id, classroom.id)
        if existing and existing.is_active:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_400_BAD_REQUEST,
                detail="Already a member of this classroom",
            )

        # Check max students
        current_students = self.student_classroom_repo.count_students_in_classroom(classroom.id)
        if classroom.max_students and current_students >= classroom.max_students:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_400_BAD_REQUEST,
                detail="Classroom is full",
            )

        # Enroll student
        if existing:
            # Reactivate membership
            self.student_classroom_repo.update(existing.id, {"is_active": True})
        else:
            # Create new membership
            self.student_classroom_repo.create(
                {"student_id": student.id, "classroom_id": classroom.id}
            )

        return classroom_schemas.ClassroomResponse.model_validate(classroom)

    def get_classroom_students(
        self, classroom_id: int, teacher_user_id: int, skip: int = 0, limit: int = 100
    ) -> tp.List[tp.Dict[str, tp.Any]]:
        """
        Get list of students in classroom (teacher only)

        Args:
            classroom_id: Classroom ID
            teacher_user_id: User ID of teacher (for verification)
            skip: Pagination offset
            limit: Pagination limit

        Returns:
            List of students with enrollment info

        Raises:
            HTTPException: If not authorized
        """
        # Verify teacher owns classroom
        classroom = self.classroom_repo.get_by_id(classroom_id)
        if not classroom:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Classroom not found",
            )

        teacher = self.teacher_repo.get_by_user_id(teacher_user_id)
        if not teacher or classroom.teacher_id != teacher.id:
            raise fastapi.HTTPException(
                status_code=http_status.HTTP_403_FORBIDDEN,
                detail="Only classroom owner can view students",
            )

        # Get students
        memberships = self.student_classroom_repo.get_by_classroom(classroom_id, skip, limit)

        students_data = []
        for membership in memberships:
            student = self.student_repo.get_with_user(membership.student_id)
            if student:
                students_data.append(
                    {
                        "student_id": student.id,
                        "user": student.user,
                        "enrolled_at": membership.enrolled_at,
                        "grade_level": student.grade_level,
                    }
                )

        return students_data
