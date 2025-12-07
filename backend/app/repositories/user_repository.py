"""
User repository
"""
import typing as tp

from sqlalchemy.orm import Session, joinedload

from app.models.users import LoginData, Student, Teacher, User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """Repository for User operations"""

    def __init__(self, db: Session):
        super().__init__(User, db)

    def get_by_username(self, username: str) -> tp.Optional[User]:
        """Get user by username"""
        return self.db.query(User).filter(User.username == username).first()

    def get_by_email(self, email: str) -> tp.Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username_or_email(self, username_or_email: str) -> tp.Optional[User]:
        """Get user by username or email"""
        return self.db.query(User).filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()

    def get_with_login_data(self, user_id: int) -> tp.Optional[User]:
        """Get user with login data"""
        return self.db.query(User).options(
            joinedload(User.login_data)
        ).filter(User.id == user_id).first()

    def get_with_profile(self, user_id: int) -> tp.Optional[User]:
        """Get user with teacher/student profile"""
        return self.db.query(User).options(
            joinedload(User.teacher),
            joinedload(User.student)
        ).filter(User.id == user_id).first()

    def get_active_users(self, skip: int = 0, limit: int = 100) -> tp.List[User]:
        """Get all active users"""
        return self.db.query(User).filter(
            User.is_active == True
        ).offset(skip).limit(limit).all()


class LoginDataRepository(BaseRepository[LoginData]):
    """Repository for LoginData operations"""

    def __init__(self, db: Session):
        super().__init__(LoginData, db)

    def get_by_user_id(self, user_id: int) -> tp.Optional[LoginData]:
        """Get login data by user ID"""
        return self.db.query(LoginData).filter(LoginData.user_id == user_id).first()

    def create_for_user(self, user_id: int, hashed_password: str) -> LoginData:
        """Create login data for user"""
        return self.create({
            "user_id": user_id,
            "hashed_password": hashed_password
        })

    def update_password(self, user_id: int, hashed_password: str) -> tp.Optional[LoginData]:
        """Update user password"""
        login_data = self.get_by_user_id(user_id)
        if not login_data:
            return None
        return self.update(login_data.id, {"hashed_password": hashed_password})


class TeacherRepository(BaseRepository[Teacher]):
    """Repository for Teacher operations"""

    def __init__(self, db: Session):
        super().__init__(Teacher, db)

    def get_by_user_id(self, user_id: int) -> tp.Optional[Teacher]:
        """Get teacher by user ID"""
        return self.db.query(Teacher).filter(Teacher.user_id == user_id).first()

    def get_with_user(self, teacher_id: int) -> tp.Optional[Teacher]:
        """Get teacher with user data"""
        return self.db.query(Teacher).options(
            joinedload(Teacher.user)
        ).filter(Teacher.id == teacher_id).first()

    def get_by_subject(self, subject: str, skip: int = 0, limit: int = 100) -> tp.List[Teacher]:
        """Get teachers by subject specialization"""
        return self.db.query(Teacher).filter(
            Teacher.subject_specialization == subject
        ).offset(skip).limit(limit).all()


class StudentRepository(BaseRepository[Student]):
    """Repository for Student operations"""

    def __init__(self, db: Session):
        super().__init__(Student, db)

    def get_by_user_id(self, user_id: int) -> tp.Optional[Student]:
        """Get student by user ID"""
        return self.db.query(Student).filter(Student.user_id == user_id).first()

    def get_with_user(self, student_id: int) -> tp.Optional[Student]:
        """Get student with user data"""
        return self.db.query(Student).options(
            joinedload(Student.user)
        ).filter(Student.id == student_id).first()

    def get_by_grade_level(self, grade_level: int, skip: int = 0, limit: int = 100) -> tp.List[Student]:
        """Get students by grade level"""
        return self.db.query(Student).filter(
            Student.grade_level == grade_level
        ).offset(skip).limit(limit).all()

