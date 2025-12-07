"""
Pydantic schemas (DTOs - Data Transfer Objects)
"""
from app.schemas.users import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserResponse,
    UserInDB,
    TeacherBase,
    TeacherCreate,
    TeacherUpdate,
    TeacherResponse,
    StudentBase,
    StudentCreate,
    StudentUpdate,
    StudentResponse,
    LoginRequest,
    TokenResponse,
)

from app.schemas.classrooms import (
    ClassroomBase,
    ClassroomCreate,
    ClassroomUpdate,
    ClassroomResponse,
    ClassroomDetailResponse,
    InviteCreate,
    InviteResponse,
    JoinClassroomRequest,
)

from app.schemas.lessons import (
    LessonBase,
    LessonCreate,
    LessonUpdate,
    LessonResponse,
    LessonDetailResponse,
    TheoryMaterialBase,
    TheoryMaterialCreate,
    TheoryMaterialUpdate,
    TheoryMaterialResponse,
)

from app.schemas.homework import (
    HomeworkBase,
    HomeworkCreate,
    HomeworkUpdate,
    HomeworkResponse,
    HomeworkDetailResponse,
    ProblemBase,
    ProblemCreate,
    ProblemUpdate,
    ProblemResponse,
    ProblemFullResponse,
    StatisticsBase,
    StatisticsCreate,
    StatisticsUpdate,
    StatisticsResponse,
    AnswerSubmit,
)

__all__ = [
    # Users
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserInDB",
    "TeacherBase",
    "TeacherCreate",
    "TeacherUpdate",
    "TeacherResponse",
    "StudentBase",
    "StudentCreate",
    "StudentUpdate",
    "StudentResponse",
    "LoginRequest",
    "TokenResponse",
    
    # Classrooms
    "ClassroomBase",
    "ClassroomCreate",
    "ClassroomUpdate",
    "ClassroomResponse",
    "ClassroomDetailResponse",
    "InviteCreate",
    "InviteResponse",
    "JoinClassroomRequest",
    
    # Lessons
    "LessonBase",
    "LessonCreate",
    "LessonUpdate",
    "LessonResponse",
    "LessonDetailResponse",
    "TheoryMaterialBase",
    "TheoryMaterialCreate",
    "TheoryMaterialUpdate",
    "TheoryMaterialResponse",
    
    # Homework
    "HomeworkBase",
    "HomeworkCreate",
    "HomeworkUpdate",
    "HomeworkResponse",
    "HomeworkDetailResponse",
    "ProblemBase",
    "ProblemCreate",
    "ProblemUpdate",
    "ProblemResponse",
    "ProblemFullResponse",
    "StatisticsBase",
    "StatisticsCreate",
    "StatisticsUpdate",
    "StatisticsResponse",
    "AnswerSubmit",
]
