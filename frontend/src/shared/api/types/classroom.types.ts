/**
 * Classroom-related types matching backend Pydantic schemas
 */

export interface Classroom {
  id: number;
  name: string;
  description: string | null;
  subject: string;
  grade_level: number | null;
  max_students: number;
  teacher_id: number;
  is_active: boolean;
  invite_code: string | null;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
  students_count: number;
}

export interface ClassroomCreateDTO {
  name: string;
  description?: string | null;
  subject: string;
  grade_level?: number | null;
  max_students?: number;
}

export interface ClassroomUpdateDTO {
  name?: string;
  description?: string | null;
  subject?: string;
  grade_level?: number | null;
  max_students?: number;
  is_active?: boolean;
}

export interface JoinClassroomDTO {
  invite_code: string;
}

export interface Invite {
  id: number;
  classroom_id: number;
  invite_code: string;
  max_uses: number | null;
  uses_count: number;
  status: string;
  expires_at: string | null; // ISO 8601 datetime
  created_at: string; // ISO 8601 datetime
}

export interface InviteCreateDTO {
  classroom_id: number;
  max_uses?: number;
  expires_at?: string | null; // ISO 8601 datetime
}

