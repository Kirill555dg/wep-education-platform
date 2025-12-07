"""
Classroom models: Classroom, StudentClassroom, Invite
"""
import typing as tp
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.session import Base


class InviteStatus(str, enum.Enum):
    """Invite status enumeration"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class Classroom(Base):
    """Classroom/Class model"""
    __tablename__ = "classrooms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    subject = Column(String(100), nullable=False)  # предмет (математика, физика и т.д.)
    grade_level = Column(Integer, nullable=True)  # класс (7, 8, 9 и т.д.)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    max_students = Column(Integer, default=30, nullable=True)
    invite_code = Column(String(50), unique=True, nullable=True)  # код для присоединения
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    teacher = relationship("Teacher", back_populates="classrooms")
    student_memberships = relationship("StudentClassroom", back_populates="classroom", cascade="all, delete-orphan")
    lessons = relationship("Lesson", back_populates="classroom", cascade="all, delete-orphan")
    invites = relationship("Invite", back_populates="classroom", cascade="all, delete-orphan")
    chat = relationship("Chat", back_populates="classroom", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Classroom(id={self.id}, name='{self.name}', subject='{self.subject}')>"


class StudentClassroom(Base):
    """Many-to-many relationship between Students and Classrooms"""
    __tablename__ = "student_classrooms"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    student = relationship("Student", back_populates="classroom_memberships")
    classroom = relationship("Classroom", back_populates="student_memberships")
    
    def __repr__(self) -> str:
        return f"<StudentClassroom(student_id={self.student_id}, classroom_id={self.classroom_id})>"


class Invite(Base):
    """Invitation to join classroom"""
    __tablename__ = "invites"
    
    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)
    invite_code = Column(String(100), unique=True, nullable=False, index=True)
    max_uses = Column(Integer, default=1, nullable=True)  # максимальное количество использований
    uses_count = Column(Integer, default=0, nullable=False)
    status = Column(Enum(InviteStatus), default=InviteStatus.PENDING, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    classroom = relationship("Classroom", back_populates="invites")
    
    def __repr__(self) -> str:
        return f"<Invite(id={self.id}, code='{self.invite_code}', status='{self.status}')>"

