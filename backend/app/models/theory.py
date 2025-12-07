"""
Theory materials models: Subject, Section, Subsection, TheoryMaterial, MaterialImage
"""
import typing as tp
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

from app.db.session import Base


class Subject(Base):
    """Subject/Course (Математика, Физика и т.д.)"""
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon_url = Column(String(500), nullable=True)
    order_number = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    sections = relationship("Section", back_populates="subject", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Subject(id={self.id}, name='{self.name}')>"


class Section(Base):
    """Section within a subject (Раздел внутри предмета)"""
    __tablename__ = "sections"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order_number = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    subject = relationship("Subject", back_populates="sections")
    subsections = relationship("Subsection", back_populates="section", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Section(id={self.id}, name='{self.name}', subject_id={self.subject_id})>"


class Subsection(Base):
    """Subsection within a section (Подраздел внутри раздела)"""
    __tablename__ = "subsections"
    
    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order_number = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    section = relationship("Section", back_populates="subsections")
    theory_materials = relationship("TheoryMaterial", back_populates="subsection", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<Subsection(id={self.id}, name='{self.name}', section_id={self.section_id})>"


class TheoryMaterial(Base):
    """Theory material/content"""
    __tablename__ = "theory_materials"
    
    id = Column(Integer, primary_key=True, index=True)
    subsection_id = Column(Integer, ForeignKey("subsections.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)  # основное содержание (может быть Markdown)
    order_number = Column(Integer, default=0, nullable=False)
    estimated_read_time = Column(Integer, nullable=True)  # примерное время чтения в минутах
    is_published = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    subsection = relationship("Subsection", back_populates="theory_materials")
    lesson_materials = relationship("LessonMaterial", back_populates="theory_material", cascade="all, delete-orphan")
    images = relationship("MaterialImage", back_populates="material", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<TheoryMaterial(id={self.id}, title='{self.title}')>"


class MaterialImage(Base):
    """Images attached to theory materials"""
    __tablename__ = "material_images"
    
    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("theory_materials.id", ondelete="CASCADE"), nullable=False, index=True)
    file_id = Column(Integer, ForeignKey("files.id", ondelete="SET NULL"), nullable=True)
    caption = Column(String(255), nullable=True)
    order_number = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    material = relationship("TheoryMaterial", back_populates="images")
    file = relationship("File")
    
    def __repr__(self) -> str:
        return f"<MaterialImage(id={self.id}, material_id={self.material_id})>"

