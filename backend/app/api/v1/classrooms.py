"""
Classroom management endpoints
"""

import typing as tp

from fastapi import APIRouter, Depends, Query, status

from app.api.dependencies import (
    get_classroom_service,
    get_current_student,
    get_current_teacher,
    get_current_user,
)
from app.models.users import User
from app.schemas.classrooms import (
    ClassroomCreate,
    ClassroomResponse,
    ClassroomUpdate,
    JoinClassroomRequest,
)
from app.services.classroom_service import ClassroomService

router = APIRouter()


@router.post("", response_model=ClassroomResponse, status_code=status.HTTP_201_CREATED)
async def create_classroom(
    classroom_data: ClassroomCreate,
    current_user: User = Depends(get_current_teacher),
    classroom_service: ClassroomService = Depends(get_classroom_service),
):
    """
    Create new classroom (teachers only)

    - **name**: Classroom name
    - **subject**: Subject (e.g., Mathematics, Physics)
    - **grade_level**: Grade level (1-12)
    - **description**: Optional description
    """
    return classroom_service.create_classroom(classroom_data, current_user.id)


@router.get("", response_model=tp.List[ClassroomResponse])
async def get_my_classrooms(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    classroom_service: ClassroomService = Depends(get_classroom_service),
):
    """
    Get classrooms for current user

    - Teachers: classrooms they created
    - Students: classrooms they joined
    """
    # Try to get as teacher first
    teacher_classrooms = classroom_service.get_teacher_classrooms(current_user.id, skip, limit)
    if teacher_classrooms:
        return teacher_classrooms

    # Otherwise get as student
    return classroom_service.get_student_classrooms(current_user.id, skip, limit)


@router.get("/{classroom_id}", response_model=ClassroomResponse)
async def get_classroom(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    classroom_service: ClassroomService = Depends(get_classroom_service),
):
    """
    Get classroom details by ID
    """
    return classroom_service.get_classroom(classroom_id)


@router.patch("/{classroom_id}", response_model=ClassroomResponse)
async def update_classroom(
    classroom_id: int,
    classroom_data: ClassroomUpdate,
    current_user: User = Depends(get_current_teacher),
    classroom_service: ClassroomService = Depends(get_classroom_service),
):
    """
    Update classroom (teachers only, owner only)
    """
    return classroom_service.update_classroom(classroom_id, classroom_data, current_user.id)


@router.post("/join", response_model=ClassroomResponse)
async def join_classroom(
    join_data: JoinClassroomRequest,
    current_user: User = Depends(get_current_student),
    classroom_service: ClassroomService = Depends(get_classroom_service),
):
    """
    Join classroom via invite code (students only)

    - **invite_code**: Unique invite code from teacher
    """
    return classroom_service.join_classroom(join_data, current_user.id)


@router.get("/{classroom_id}/students")
async def get_classroom_students(
    classroom_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_teacher),
    classroom_service: ClassroomService = Depends(get_classroom_service),
):
    """
    Get list of students in classroom (teachers only)

    Returns student information with enrollment dates
    """
    return classroom_service.get_classroom_students(classroom_id, current_user.id, skip, limit)
