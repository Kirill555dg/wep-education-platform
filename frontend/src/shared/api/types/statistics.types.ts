/**
 * Statistics-related types matching backend Pydantic schemas
 */

import { type HomeworkStatus } from "./homework.types";

export interface Statistics {
  id: number;
  student_id: number;
  homework_id: number;
  status: HomeworkStatus;
  score: number;
  max_score: number;
  attempts_count: number;
  time_spent_minutes: number;
  submitted_at: string | null; // ISO 8601 datetime
  graded_at: string | null; // ISO 8601 datetime
  feedback: string | null;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface StudentProgress {
  total_homeworks: number;
  completed: number;
  in_progress: number;
  not_started: number;
  average_score_percentage: number;
  total_attempts: number;
  total_time_spent_minutes: number;
}

export interface ClassroomProgress {
  total_students: number;
  total_homeworks_assigned: number;
  completed_homeworks: number;
  average_completion_rate: number;
}

