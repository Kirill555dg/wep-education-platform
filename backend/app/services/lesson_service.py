"""
Lesson service
"""
import typing as tp
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repositories.lesson_repository import LessonRepository, LessonMaterialRepository, TheoryMaterialRepository
from app.repositories.classroom_repository import ClassroomRepository
from app.repositories.user_repository import TeacherRepository
from app.schemas.lessons import LessonCreate, LessonUpdate, LessonResponse, LessonDetailResponse


class LessonService:
    """
    Service for lesson management
    
    Handles lessons and their materials
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.lesson_repo = LessonRepository(db)
        self.lesson_material_repo = LessonMaterialRepository(db)
        self.theory_repo = TheoryMaterialRepository(db)
        self.classroom_repo = ClassroomRepository(db)
        self.teacher_repo = TeacherRepository(db)
    
    def create_lesson(self, lesson_data: LessonCreate, teacher_user_id: int) -> LessonResponse:
        """
        Create new lesson
        
        Args:
            lesson_data: Lesson creation data
            teacher_user_id: User ID of teacher
            
        Returns:
            Created lesson
            
        Raises:
            HTTPException: If not authorized or classroom not found
        """
        # Verify classroom exists
        classroom = self.classroom_repo.get_by_id(lesson_data.classroom_id)
        if not classroom:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Classroom not found"
            )
        
        # Verify teacher owns classroom
        teacher = self.teacher_repo.get_by_user_id(teacher_user_id)
        if not teacher or classroom.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only classroom owner can create lessons"
            )
        
        # Create lesson
        lesson_dict = lesson_data.model_dump(exclude={"theory_material_ids"})
        lesson = self.lesson_repo.create(lesson_dict)
        
        # Add theory materials
        for idx, material_id in enumerate(lesson_data.theory_material_ids):
            self.lesson_material_repo.add_material_to_lesson(
                lesson.id, material_id, order_number=idx
            )
        
        return LessonResponse.model_validate(lesson)
    
    def get_lesson(self, lesson_id: int) -> LessonDetailResponse:
        """Get lesson by ID"""
        lesson = self.lesson_repo.get_by_id(lesson_id)
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )
        
        response = LessonDetailResponse.model_validate(lesson)
        response.materials_count = len(self.lesson_material_repo.get_by_lesson(lesson_id))
        response.homeworks_count = self.lesson_repo.count_by_classroom(lesson.classroom_id)
        return response
    
    def get_classroom_lessons(self, classroom_id: int, user_id: int, skip: int = 0, limit: int = 100) -> tp.List[LessonResponse]:
        """
        Get lessons for classroom
        
        Students see only published lessons, teachers see all
        """
        # Check if user is teacher of this classroom
        teacher = self.teacher_repo.get_by_user_id(user_id)
        classroom = self.classroom_repo.get_by_id(classroom_id)
        
        if teacher and classroom and classroom.teacher_id == teacher.id:
            # Teacher sees all lessons
            lessons = self.lesson_repo.get_by_classroom(classroom_id, skip, limit)
        else:
            # Students see only published
            lessons = self.lesson_repo.get_published(classroom_id, skip, limit)
        
        return [LessonResponse.model_validate(l) for l in lessons]
    
    def update_lesson(self, lesson_id: int, lesson_data: LessonUpdate, teacher_user_id: int) -> LessonResponse:
        """Update lesson (teacher only)"""
        lesson = self.lesson_repo.get_by_id(lesson_id)
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )
        
        # Verify teacher owns classroom
        classroom = self.classroom_repo.get_by_id(lesson.classroom_id)
        teacher = self.teacher_repo.get_by_user_id(teacher_user_id)
        
        if not teacher or not classroom or classroom.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only classroom owner can update lessons"
            )
        
        updated = self.lesson_repo.update(lesson_id, lesson_data.model_dump(exclude_unset=True))
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update lesson"
            )
        
        return LessonResponse.model_validate(updated)
    
    def delete_lesson(self, lesson_id: int, teacher_user_id: int) -> bool:
        """Delete lesson (teacher only)"""
        lesson = self.lesson_repo.get_by_id(lesson_id)
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )
        
        # Verify teacher owns classroom
        classroom = self.classroom_repo.get_by_id(lesson.classroom_id)
        teacher = self.teacher_repo.get_by_user_id(teacher_user_id)
        
        if not teacher or not classroom or classroom.teacher_id != teacher.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only classroom owner can delete lessons"
            )
        
        return self.lesson_repo.delete(lesson_id)

