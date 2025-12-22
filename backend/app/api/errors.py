"""
API-level error mapping.

Converts domain errors (raised by services) into HTTP responses.
"""

import typing as tp

import fastapi
from fastapi import responses as fastapi_responses
from fastapi import status as http_status

from app.domain import errors as domain_errors


def _status_code(exc: domain_errors.DomainError) -> int:
    if isinstance(exc, domain_errors.BadRequestError):
        return http_status.HTTP_400_BAD_REQUEST
    if isinstance(exc, domain_errors.UnauthorizedError):
        return http_status.HTTP_401_UNAUTHORIZED
    if isinstance(exc, domain_errors.ForbiddenError):
        return http_status.HTTP_403_FORBIDDEN
    if isinstance(exc, domain_errors.NotFoundError):
        return http_status.HTTP_404_NOT_FOUND
    if isinstance(exc, domain_errors.ConflictError):
        return http_status.HTTP_409_CONFLICT
    if isinstance(exc, domain_errors.InternalError):
        return http_status.HTTP_500_INTERNAL_SERVER_ERROR
    return http_status.HTTP_400_BAD_REQUEST


def register_exception_handlers(app: fastapi.FastAPI) -> None:
    @app.exception_handler(domain_errors.DomainError)
    async def domain_error_handler(
        request: fastapi.Request,  # noqa: ARG001
        exc: domain_errors.DomainError,
    ) -> fastapi_responses.JSONResponse:
        payload: dict[str, tp.Any] = {"detail": exc.message}
        if exc.code is not None:
            payload["code"] = exc.code
        if exc.meta:
            payload["meta"] = exc.meta

        return fastapi_responses.JSONResponse(
            status_code=_status_code(exc),
            content=payload,
        )

