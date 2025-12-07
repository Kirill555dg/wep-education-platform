"""
Homework Pydantic schemas (DTOs)
"""
import typing as tp
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class HomeworkBase(BaseModel):
    """Base homework fields"""
    title: str = Field(..., min_length=1, max_length=255)
    description: tp.Optional[str] = None
    max_score: float = Field(default=100.0, gt=0)
    deadline: tp.Optional[datetime] = None


class HomeworkCreate(HomeworkBase):
    """Schema for creating homework"""
    lesson_id: int
    problem_ids: tp.List[int] = Field(default_factory=list)
    problem_points: tp.Optional[tp.List[float]] = None  # Points for each problem


class HomeworkUpdate(BaseModel):
    """Schema for updating homework"""
    title: tp.Optional[str] = Field(None, min_length=1, max_length=255)
    description: tp.Optional[str] = None
    max_score: tp.Optional[float] = Field(None, gt=0)
    deadline: tp.Optional[datetime] = None
    is_published: tp.Optional[bool] = None


class HomeworkResponse(HomeworkBase):
    """Schema for homework response"""
    id: int
    lesson_id: int
    is_published: bool
    created_at: datetime
    updated_at: datetime
    problems_count: int = 0
    
    model_config = ConfigDict(from_attributes=True)


class HomeworkDetailResponse(HomeworkResponse):
    """Detailed homework response with problems"""
    pass  # Can include problems list


# Problem schemas
class ProblemBase(BaseModel):
    """Base problem fields"""
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    problem_type: str  # Enum: multiple_choice, true_false, etc.
    difficulty: str = Field(default="medium")  # Enum: easy, medium, hard
    correct_answer: tp.Optional[str] = None
    explanation: tp.Optional[str] = None
    hints: tp.Optional[str] = None  # JSON string


class ProblemCreate(ProblemBase):
    """Schema for creating a problem"""
    pass


class ProblemUpdate(BaseModel):
    """Schema for updating a problem"""
    title: tp.Optional[str] = Field(None, min_length=1, max_length=255)
    description: tp.Optional[str] = Field(None, min_length=1)
    problem_type: tp.Optional[str] = None
    difficulty: tp.Optional[str] = None
    correct_answer: tp.Optional[str] = None
    explanation: tp.Optional[str] = None
    hints: tp.Optional[str] = None
    is_published: tp.Optional[bool] = None


class ProblemResponse(ProblemBase):
    """Schema for problem response (without correct answer for students)"""
    id: int
    is_published: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ProblemFullResponse(ProblemResponse):
    """Full problem response with correct answer (for teachers)"""
    correct_answer: tp.Optional[str]
    explanation: tp.Optional[str]


# Statistics schemas
class StatisticsBase(BaseModel):
    """Base statistics fields"""
    status: str = Field(default="not_started")
    score: float = Field(default=0.0, ge=0)
    max_score: float
    time_spent_minutes: int = Field(default=0, ge=0)


class StatisticsCreate(BaseModel):
    """Schema for creating statistics (internal)"""
    student_id: int
    homework_id: int
    max_score: float


class StatisticsUpdate(BaseModel):
    """Schema for updating statistics"""
    status: tp.Optional[str] = None
    score: tp.Optional[float] = Field(None, ge=0)
    time_spent_minutes: tp.Optional[int] = Field(None, ge=0)
    feedback: tp.Optional[str] = None


class StatisticsResponse(StatisticsBase):
    """Schema for statistics response"""
    id: int
    student_id: int
    homework_id: int
    attempts_count: int
    submitted_at: tp.Optional[datetime]
    graded_at: tp.Optional[datetime]
    feedback: tp.Optional[str]
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# Answer submission
class AnswerSubmit(BaseModel):
    """Schema for submitting an answer"""
    homework_id: int
    problem_id: int
    answer: str
    time_spent_minutes: int = Field(default=0, ge=0)

