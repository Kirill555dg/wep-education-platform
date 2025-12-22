/**
 * Centralized export of all API clients and types
 */

// Export API clients
export { authApi } from "./auth.api";
export { classroomsApi } from "./classrooms.api";
export { lessonsApi } from "./lessons.api";
export { homeworkApi } from "./homework.api";
export { problemsApi } from "./problems.api";
export { statisticsApi } from "./statistics.api";

// Re-export OpenAPI enums as values
export { UserRole } from "@/api/client";

// Re-export selected OpenAPI-generated types (as "DTO" aliases to minimize churn)
export type {
  AnswerSubmit as AnswerSubmitDTO,
  ClassroomCreate as ClassroomCreateDTO,
  ClassroomResponse as Classroom,
  ClassroomUpdate as ClassroomUpdateDTO,
  ErrorResponse,
  HomeworkCreate as HomeworkCreateDTO,
  HomeworkDetailResponse as HomeworkDetail,
  HomeworkResponse as Homework,
  HomeworkUpdate as HomeworkUpdateDTO,
  JoinClassroomRequest as JoinClassroomDTO,
  LessonCreate as LessonCreateDTO,
  LessonDetailResponse as LessonDetail,
  LessonResponse as Lesson,
  LessonUpdate as LessonUpdateDTO,
  LoginRequest as LoginRequestDTO,
  ProblemCreate as ProblemCreateDTO,
  ProblemFullResponse as ProblemFull,
  ProblemResponse as Problem,
  ProblemUpdate as ProblemUpdateDTO,
  StatisticsResponse as Statistics,
  TokenResponse,
  UserCreate as UserCreateDTO,
  UserResponse as ApiUser,
  UserRolesResponse,
} from "@/api/client";

