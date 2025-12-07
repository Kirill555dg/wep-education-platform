"""
User models: User, LoginData, Teacher, Student
"""
import typing as tp
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class User(Base):
    """Base user model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    login_data = relationship("LoginData", back_populates="user", uselist=False, cascade="all, delete-orphan")
    teacher = relationship("Teacher", back_populates="user", uselist=False, cascade="all, delete-orphan")
    student = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"


class LoginData(Base):
    """Login credentials for users"""
    __tablename__ = "login_data"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="login_data")
    
    def __repr__(self) -> str:
        return f"<LoginData(user_id={self.user_id})>"


class Teacher(Base):
    """Teacher profile extending User"""
    __tablename__ = "teachers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    subject_specialization = Column(String(255), nullable=True)
    years_of_experience = Column(Integer, default=0)
    rating = Column(Integer, default=0)  # можно использовать для рейтинга преподавателя
    
    # Relationships
    user = relationship("User", back_populates="teacher")
    classrooms = relationship("Classroom", back_populates="teacher", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Teacher(id={self.id}, user_id={self.user_id})>"


class Student(Base):
    """Student profile extending User"""
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    grade_level = Column(Integer, nullable=True)  # класс обучения (7, 8, 9 и т.д.)
    student_id_number = Column(String(50), unique=True, nullable=True)  # студенческий билет
    enrollment_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="student")
    classroom_memberships = relationship("StudentClassroom", back_populates="student", cascade="all, delete-orphan")
    statistics = relationship("Statistics", back_populates="student", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Student(id={self.id}, user_id={self.user_id}, grade_level={self.grade_level})>"

