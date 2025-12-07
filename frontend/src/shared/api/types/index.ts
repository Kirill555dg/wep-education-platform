/**
 * Centralized export of all API types
 */

// User types
export type {
  User,
  Teacher,
  Student,
  UserCreateDTO,
  LoginRequestDTO,
  TokenResponse,
  UserUpdateDTO,
  UserRole,
  UserRoleResponse,
} from "./user.types";

// Classroom types
export type {
  Classroom,
  ClassroomCreateDTO,
  ClassroomUpdateDTO,
  JoinClassroomDTO,
  Invite,
  InviteCreateDTO,
} from "./classroom.types";

// Lesson types
export type {
  Lesson,
  LessonDetail,
  LessonCreateDTO,
  LessonUpdateDTO,
  TheoryMaterial,
  TheoryMaterialCreateDTO,
  TheoryMaterialUpdateDTO,
} from "./lesson.types";

// Homework types
export type {
  Homework,
  HomeworkDetail,
  HomeworkCreateDTO,
  HomeworkUpdateDTO,
  Problem,
  ProblemFull,
  ProblemCreateDTO,
  ProblemUpdateDTO,
  AnswerSubmitDTO,
  ProblemType,
  ProblemDifficulty,
  HomeworkStatus,
} from "./homework.types";

// Statistics types
export type {
  Statistics,
  StudentProgress,
  ClassroomProgress,
} from "./statistics.types";

