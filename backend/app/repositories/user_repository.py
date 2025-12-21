"""
User repository
"""

import typing as tp

from sqlalchemy import orm as orm

from app.models import users as user_models
from app.repositories import base as base_repository


class UserRepository(base_repository.BaseRepository[user_models.User]):
    """Repository for User operations"""

    def __init__(self, db: orm.Session):
        super().__init__(user_models.User, db)

    def get_by_username(self, username: str) -> tp.Optional[user_models.User]:
        """Get user by username"""
        return (
            self.db.query(user_models.User)
            .filter(user_models.User.username == username)
            .first()
        )

    def get_by_email(self, email: str) -> tp.Optional[user_models.User]:
        """Get user by email"""
        return self.db.query(user_models.User).filter(user_models.User.email == email).first()

    def get_by_username_or_email(self, username_or_email: str) -> tp.Optional[user_models.User]:
        """Get user by username or email"""
        return (
            self.db.query(user_models.User)
            .filter(
                (user_models.User.username == username_or_email)
                | (user_models.User.email == username_or_email)
            )
            .first()
        )

    def get_with_login_data(self, user_id: int) -> tp.Optional[user_models.User]:
        """Get user with login data"""
        return (
            self.db.query(user_models.User)
            .options(orm.joinedload(user_models.User.login_data))
            .filter(user_models.User.id == user_id)
            .first()
        )

    def get_with_profile(self, user_id: int) -> tp.Optional[user_models.User]:
        """Get user with teacher/student profile"""
        return (
            self.db.query(user_models.User)
            .options(
                orm.joinedload(user_models.User.teacher),
                orm.joinedload(user_models.User.student),
            )
            .filter(user_models.User.id == user_id)
            .first()
        )

    def get_active_users(self, skip: int = 0, limit: int = 100) -> tp.List[user_models.User]:
        """Get all active users"""
        return (
            self.db.query(user_models.User)
            .filter(user_models.User.is_active)
            .offset(skip)
            .limit(limit)
            .all()
        )


class LoginDataRepository(base_repository.BaseRepository[user_models.LoginData]):
    """Repository for LoginData operations"""

    def __init__(self, db: orm.Session):
        super().__init__(user_models.LoginData, db)

    def get_by_user_id(self, user_id: int) -> tp.Optional[user_models.LoginData]:
        """Get login data by user ID"""
        return (
            self.db.query(user_models.LoginData)
            .filter(user_models.LoginData.user_id == user_id)
            .first()
        )

    def create_for_user(self, user_id: int, hashed_password: str) -> user_models.LoginData:
        """Create login data for user"""
        return self.create({"user_id": user_id, "hashed_password": hashed_password})

    def update_password(
        self, user_id: int, hashed_password: str
    ) -> tp.Optional[user_models.LoginData]:
        """Update user password"""
        login_data = self.get_by_user_id(user_id)
        if not login_data:
            return None
        return self.update(login_data.id, {"hashed_password": hashed_password})


class TeacherRepository(base_repository.BaseRepository[user_models.Teacher]):
    """Repository for Teacher operations"""

    def __init__(self, db: orm.Session):
        super().__init__(user_models.Teacher, db)

    def get_by_user_id(self, user_id: int) -> tp.Optional[user_models.Teacher]:
        """Get teacher by user ID"""
        return (
            self.db.query(user_models.Teacher)
            .filter(user_models.Teacher.user_id == user_id)
            .first()
        )

    def get_with_user(self, teacher_id: int) -> tp.Optional[user_models.Teacher]:
        """Get teacher with user data"""
        return (
            self.db.query(user_models.Teacher)
            .options(orm.joinedload(user_models.Teacher.user))
            .filter(user_models.Teacher.id == teacher_id)
            .first()
        )

    def get_by_subject(
        self, subject: str, skip: int = 0, limit: int = 100
    ) -> tp.List[user_models.Teacher]:
        """Get teachers by subject specialization"""
        return (
            self.db.query(user_models.Teacher)
            .filter(user_models.Teacher.subject_specialization == subject)
            .offset(skip)
            .limit(limit)
            .all()
        )


class StudentRepository(base_repository.BaseRepository[user_models.Student]):
    """Repository for Student operations"""

    def __init__(self, db: orm.Session):
        super().__init__(user_models.Student, db)

    def get_by_user_id(self, user_id: int) -> tp.Optional[user_models.Student]:
        """Get student by user ID"""
        return (
            self.db.query(user_models.Student)
            .filter(user_models.Student.user_id == user_id)
            .first()
        )

    def get_with_user(self, student_id: int) -> tp.Optional[user_models.Student]:
        """Get student with user data"""
        return (
            self.db.query(user_models.Student)
            .options(orm.joinedload(user_models.Student.user))
            .filter(user_models.Student.id == student_id)
            .first()
        )

    def get_by_grade_level(
        self, grade_level: int, skip: int = 0, limit: int = 100
    ) -> tp.List[user_models.Student]:
        """Get students by grade level"""
        return (
            self.db.query(user_models.Student)
            .filter(user_models.Student.grade_level == grade_level)
            .offset(skip)
            .limit(limit)
            .all()
        )
