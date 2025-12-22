"""
Tests for AuthService
"""

import pytest

import fastapi

from app.schemas import users as user_schemas
from app.services import auth_service as auth_service_module


def test_register_user_teacher(db_session):
    """Test registering a new teacher user"""
    auth_service = auth_service_module.AuthService(db_session)

    user_data = user_schemas.UserCreate(
        email="teacher@example.com",
        password="TestPassword123!",
        first_name="John",
        last_name="Doe",
        middle_name="Smith",
        role="teacher",
    )

    user = auth_service.register_user(user_data)

    assert user.email == "teacher@example.com"
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.role.value == "teacher"
    assert user.is_active is True
    # Password should be hashed, not plain text
    assert user.hashed_password != "TestPassword123!"


def test_register_user_student(db_session):
    """Test registering a new student user"""
    auth_service = auth_service_module.AuthService(db_session)

    user_data = user_schemas.UserCreate(
        email="student@example.com",
        password="StudentPass456!",
        first_name="Jane",
        last_name="Smith",
        role="student",
    )

    user = auth_service.register_user(user_data)

    assert user.email == "student@example.com"
    assert user.role.value == "student"
    assert user.is_active is True


def test_register_duplicate_email(db_session):
    """Test that registering with duplicate email raises error"""
    auth_service = auth_service_module.AuthService(db_session)

    user_data = user_schemas.UserCreate(
        email="duplicate@example.com",
        password="Password123!",
        first_name="First",
        last_name="User",
        role="student",
    )

    # First registration should succeed
    auth_service.register_user(user_data)

    # Second registration with same email should fail
    duplicate_data = user_schemas.UserCreate(
        email="duplicate@example.com",
        password="DifferentPass123!",
        first_name="Second",
        last_name="User",
        role="teacher",
    )

    with pytest.raises(fastapi.HTTPException) as exc_info:
        auth_service.register_user(duplicate_data)

    assert exc_info.value.status_code == 400
    assert "already registered" in str(exc_info.value.detail).lower()


def test_authenticate_success(db_session):
    """Test successful authentication"""
    auth_service = auth_service_module.AuthService(db_session)

    # Register a user first
    user_data = user_schemas.UserCreate(
        email="auth@example.com",
        password="AuthPassword123!",
        first_name="Auth",
        last_name="Test",
        role="student",
    )
    auth_service.register_user(user_data)

    # Attempt to authenticate
    login_data = user_schemas.UserLogin(username_or_email="auth@example.com", password="AuthPassword123!")

    token = auth_service.authenticate(login_data)

    assert token is not None
    assert token.access_token is not None
    assert token.token_type == "bearer"


def test_authenticate_wrong_password(db_session):
    """Test authentication with wrong password"""
    auth_service = auth_service_module.AuthService(db_session)

    # Register a user
    user_data = user_schemas.UserCreate(
        email="wrongpass@example.com",
        password="CorrectPassword123!",
        first_name="Wrong",
        last_name="Pass",
        role="student",
    )
    auth_service.register_user(user_data)

    # Attempt to authenticate with wrong password
    login_data = user_schemas.UserLogin(username_or_email="wrongpass@example.com", password="WrongPassword123!")

    token = auth_service.authenticate(login_data)

    # Should return None for failed authentication
    assert token is None


def test_authenticate_nonexistent_user(db_session):
    """Test authentication with non-existent email"""
    auth_service = auth_service_module.AuthService(db_session)

    login_data = user_schemas.UserLogin(username_or_email="nonexistent@example.com", password="SomePassword123!")

    token = auth_service.authenticate(login_data)

    # Should return None for non-existent user
    assert token is None
