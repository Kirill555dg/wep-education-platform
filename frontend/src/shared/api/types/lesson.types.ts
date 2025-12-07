/**
 * Lesson-related types matching backend Pydantic schemas
 */

export interface Lesson {
  id: number;
  title: string;
  description: string | null;
  classroom_id: number;
  order_number: number | null;
  scheduled_at: string | null; // ISO 8601 datetime
  is_published: boolean;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface LessonDetail extends Lesson {
  materials_count: number;
  homeworks_count: number;
}

export interface LessonCreateDTO {
  classroom_id: number;
  title: string;
  description?: string | null;
  order_number?: number | null;
  scheduled_at?: string | null; // ISO 8601 datetime
  theory_material_ids?: number[];
}

export interface LessonUpdateDTO {
  title?: string;
  description?: string | null;
  order_number?: number | null;
  scheduled_at?: string | null; // ISO 8601 datetime
  is_published?: boolean;
}

export interface TheoryMaterial {
  id: number;
  title: string;
  content: string;
  subsection_id: number;
  order_number: number;
  estimated_read_time: number | null;
  is_published: boolean;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface TheoryMaterialCreateDTO {
  subsection_id: number;
  title: string;
  content: string;
  order_number?: number;
  estimated_read_time?: number | null;
}

export interface TheoryMaterialUpdateDTO {
  title?: string;
  content?: string;
  order_number?: number;
  estimated_read_time?: number | null;
  is_published?: boolean;
}

