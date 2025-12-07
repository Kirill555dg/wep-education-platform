/**
 * Homework entity types
 */

export type HomeworkStatus = "not_started" | "in_progress" | "submitted" | "graded";
export type ProblemType = "multiple_choice" | "true_false" | "short_answer" | "essay";
export type ProblemDifficulty = "easy" | "medium" | "hard";

export interface Homework {
  id: number;
  lessonId: number;
  title: string;
  description: string | null;
  maxScore: number;
  deadline: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  problemsCount: number;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  problemType: ProblemType;
  difficulty: ProblemDifficulty;
  explanation: string | null;
  hints: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProblemFull extends Problem {
  correctAnswer: string | null;
}

export interface Statistics {
  id: number;
  studentId: number;
  homeworkId: number;
  status: HomeworkStatus;
  score: number;
  maxScore: number;
  attemptsCount: number;
  timeSpentMinutes: number;
  submittedAt: string | null;
  gradedAt: string | null;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
}

