"""
Access control helpers for services layer.

These helpers centralize common authorization checks, such as:
- verifying a user is a teacher (has Teacher profile)
- verifying a teacher owns a classroom

We keep the checks in the services layer (not a generic "utils") because they
represent domain-level access rules.
"""

import fastapi
from fastapi import status as http_status

from app.models import classes as classes_models
from app.models import users as user_models


def require_teacher_profile(
    teacher: user_models.Teacher | None,
    *,
    detail: str,
) -> user_models.Teacher:
    """Ensure user has teacher profile."""
    if not teacher:
        raise fastapi.HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail=detail,
        )
    return teacher


def require_classroom(
    classroom: classes_models.Classroom | None,
    *,
    detail: str = "Classroom not found",
) -> classes_models.Classroom:
    """Ensure classroom exists."""
    if not classroom:
        raise fastapi.HTTPException(
            status_code=http_status.HTTP_404_NOT_FOUND,
            detail=detail,
        )
    return classroom


def require_teacher_owns_classroom(
    *,
    teacher: user_models.Teacher,
    classroom: classes_models.Classroom,
    detail: str,
) -> None:
    """Ensure the teacher owns the given classroom."""
    if classroom.teacher_id != teacher.id:
        raise fastapi.HTTPException(
            status_code=http_status.HTTP_403_FORBIDDEN,
            detail=detail,
        )

