"""
Classroom management endpoints
"""

import fastapi
from fastapi import status as http_status

from app.api import dependencies as deps
from app.models import users as user_models
from app.schemas import classrooms as classroom_schemas
from app.services import classroom as classroom_service_module

router = fastapi.APIRouter()


@router.post(
    "",
    response_model=classroom_schemas.ClassroomResponse,
    status_code=http_status.HTTP_201_CREATED,
)
async def create_classroom(
    classroom_data: classroom_schemas.ClassroomCreate,
    current_user: user_models.User = fastapi.Depends(deps.get_current_teacher),
    classroom_service: classroom_service_module.ClassroomService = fastapi.Depends(
        deps.get_classroom_service
    ),
):
    """
    Create new classroom (teachers only)

    - **name**: Classroom name
    - **subject**: Subject (e.g., Mathematics, Physics)
    - **grade_level**: Grade level (1-12)
    - **description**: Optional description
    """
    return await classroom_service.create_classroom(classroom_data, current_user.id)


@router.get("", response_model=list[classroom_schemas.ClassroomResponse])
async def get_my_classrooms(
    skip: int = fastapi.Query(0, ge=0),
    limit: int = fastapi.Query(100, ge=1, le=100),
    current_user: user_models.User = fastapi.Depends(deps.get_current_user),
    classroom_service: classroom_service_module.ClassroomService = fastapi.Depends(
        deps.get_classroom_service
    ),
):
    """
    Get classrooms for current user

    - Teachers: classrooms they created
    - Students: classrooms they joined
    """
    # Try to get as teacher first
    teacher_classrooms = await classroom_service.get_teacher_classrooms(current_user.id, skip, limit)
    if teacher_classrooms:
        return teacher_classrooms

    # Otherwise get as student
    return await classroom_service.get_student_classrooms(current_user.id, skip, limit)


@router.get("/{classroom_id}", response_model=classroom_schemas.ClassroomResponse)
async def get_classroom(
    classroom_id: int,
    current_user: user_models.User = fastapi.Depends(deps.get_current_user),
    classroom_service: classroom_service_module.ClassroomService = fastapi.Depends(
        deps.get_classroom_service
    ),
):
    """
    Get classroom details by ID
    """
    return await classroom_service.get_classroom(classroom_id)


@router.patch("/{classroom_id}", response_model=classroom_schemas.ClassroomResponse)
async def update_classroom(
    classroom_id: int,
    classroom_data: classroom_schemas.ClassroomUpdate,
    current_user: user_models.User = fastapi.Depends(deps.get_current_teacher),
    classroom_service: classroom_service_module.ClassroomService = fastapi.Depends(
        deps.get_classroom_service
    ),
):
    """
    Update classroom (teachers only, owner only)
    """
    return await classroom_service.update_classroom(classroom_id, classroom_data, current_user.id)


@router.post("/join", response_model=classroom_schemas.ClassroomResponse)
async def join_classroom(
    join_data: classroom_schemas.JoinClassroomRequest,
    current_user: user_models.User = fastapi.Depends(deps.get_current_student),
    classroom_service: classroom_service_module.ClassroomService = fastapi.Depends(
        deps.get_classroom_service
    ),
):
    """
    Join classroom via invite code (students only)

    - **invite_code**: Unique invite code from teacher
    """
    return await classroom_service.join_classroom(join_data, current_user.id)


@router.get("/{classroom_id}/students")
async def get_classroom_students(
    classroom_id: int,
    skip: int = fastapi.Query(0, ge=0),
    limit: int = fastapi.Query(100, ge=1, le=100),
    current_user: user_models.User = fastapi.Depends(deps.get_current_teacher),
    classroom_service: classroom_service_module.ClassroomService = fastapi.Depends(
        deps.get_classroom_service
    ),
):
    """
    Get list of students in classroom (teachers only)

    Returns student information with enrollment dates
    """
    return await classroom_service.get_classroom_students(classroom_id, current_user.id, skip, limit)
