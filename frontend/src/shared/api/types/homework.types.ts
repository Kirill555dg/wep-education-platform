/**
 * Homework and Problem-related types matching backend Pydantic schemas
 */

export type ProblemType = "multiple_choice" | "true_false" | "short_answer" | "essay";
export type ProblemDifficulty = "easy" | "medium" | "hard";
export type HomeworkStatus = "not_started" | "in_progress" | "submitted" | "graded";

export interface Homework {
  id: number;
  lesson_id: number;
  title: string;
  description: string | null;
  max_score: number;
  deadline: string | null; // ISO 8601 datetime
  is_published: boolean;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  problems_count: number;
}

export interface HomeworkDetail extends Homework {
  // Can include additional nested data
}

export interface HomeworkCreateDTO {
  lesson_id: number;
  title: string;
  description?: string | null;
  max_score?: number;
  deadline?: string | null; // ISO 8601 datetime
  problem_ids?: number[];
  problem_points?: number[] | null;
}

export interface HomeworkUpdateDTO {
  title?: string;
  description?: string | null;
  max_score?: number;
  deadline?: string | null; // ISO 8601 datetime
  is_published?: boolean;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  problem_type: ProblemType;
  difficulty: ProblemDifficulty;
  explanation: string | null;
  hints: string | null;
  is_published: boolean;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface ProblemFull extends Problem {
  correct_answer: string | null;
}

export interface ProblemCreateDTO {
  title: string;
  description: string;
  problem_type: ProblemType;
  difficulty?: ProblemDifficulty;
  correct_answer?: string | null;
  explanation?: string | null;
  hints?: string | null;
}

export interface ProblemUpdateDTO {
  title?: string;
  description?: string;
  problem_type?: ProblemType;
  difficulty?: ProblemDifficulty;
  correct_answer?: string | null;
  explanation?: string | null;
  hints?: string | null;
  is_published?: boolean;
}

export interface AnswerSubmitDTO {
  homework_id: number;
  problem_id: number;
  answer: string;
  time_spent_minutes?: number;
}

