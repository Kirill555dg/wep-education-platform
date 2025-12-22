"""
Homework Pydantic schemas (DTOs)
"""

import typing as tp
import datetime as dt

import pydantic


class HomeworkBase(pydantic.BaseModel):
    """Base homework fields"""

    title: str = pydantic.Field(..., min_length=1, max_length=255)
    description: tp.Optional[str] = None
    max_score: float = pydantic.Field(default=100.0, gt=0)
    deadline: tp.Optional[dt.datetime] = None


class HomeworkCreate(HomeworkBase):
    """Schema for creating homework"""

    lesson_id: int
    problem_ids: tp.List[int] = pydantic.Field(default_factory=list)
    problem_points: tp.Optional[tp.List[float]] = None  # Points for each problem


class HomeworkUpdate(pydantic.BaseModel):
    """Schema for updating homework"""

    title: tp.Optional[str] = pydantic.Field(None, min_length=1, max_length=255)
    description: tp.Optional[str] = None
    max_score: tp.Optional[float] = pydantic.Field(None, gt=0)
    deadline: tp.Optional[dt.datetime] = None
    is_published: tp.Optional[bool] = None


class HomeworkResponse(HomeworkBase):
    """Schema for homework response"""

    id: int
    lesson_id: int
    is_published: bool
    created_at: dt.datetime
    updated_at: dt.datetime
    problems_count: int = 0

    model_config = pydantic.ConfigDict(from_attributes=True)


class HomeworkDetailResponse(HomeworkResponse):
    """Detailed homework response with problems"""

    pass  # Can include problems list


# Problem schemas
class ProblemBase(pydantic.BaseModel):
    """Base problem fields"""

    title: str = pydantic.Field(..., min_length=1, max_length=255)
    description: str = pydantic.Field(..., min_length=1)
    problem_type: str  # Free-form type (e.g., text, multiple_choice)
    difficulty: tp.Union[int, str] = pydantic.Field(default=1)
    correct_answer: tp.Optional[str] = None
    explanation: tp.Optional[str] = None
    hints: tp.Optional[str] = None  # JSON string


class ProblemCreate(ProblemBase):
    """Schema for creating a problem"""

    pass


class ProblemUpdate(pydantic.BaseModel):
    """Schema for updating a problem"""

    title: tp.Optional[str] = pydantic.Field(None, min_length=1, max_length=255)
    description: tp.Optional[str] = pydantic.Field(None, min_length=1)
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
    created_at: dt.datetime
    updated_at: dt.datetime

    model_config = pydantic.ConfigDict(from_attributes=True)


class ProblemFullResponse(ProblemResponse):
    """Full problem response with correct answer (for teachers)"""

    correct_answer: tp.Optional[str]
    explanation: tp.Optional[str]


# Statistics schemas
class StatisticsBase(pydantic.BaseModel):
    """Base statistics fields"""

    status: str = pydantic.Field(default="not_started")
    score: float = pydantic.Field(default=0.0, ge=0)
    max_score: float
    time_spent_minutes: int = pydantic.Field(default=0, ge=0)


class StatisticsCreate(pydantic.BaseModel):
    """Schema for creating statistics (internal)"""

    student_id: int
    homework_id: int
    max_score: float


class StatisticsUpdate(pydantic.BaseModel):
    """Schema for updating statistics"""

    status: tp.Optional[str] = None
    score: tp.Optional[float] = pydantic.Field(None, ge=0)
    time_spent_minutes: tp.Optional[int] = pydantic.Field(None, ge=0)
    feedback: tp.Optional[str] = None


class StatisticsResponse(StatisticsBase):
    """Schema for statistics response"""

    id: int
    student_id: int
    homework_id: int
    attempts_count: int
    submitted_at: tp.Optional[dt.datetime]
    graded_at: tp.Optional[dt.datetime]
    feedback: tp.Optional[str]
    created_at: dt.datetime
    updated_at: dt.datetime

    model_config = pydantic.ConfigDict(from_attributes=True)


# Answer submission
class AnswerSubmit(pydantic.BaseModel):
    """Schema for submitting an answer"""

    homework_id: int
    problem_id: int
    answer: str
    time_spent_minutes: int = pydantic.Field(default=0, ge=0)
