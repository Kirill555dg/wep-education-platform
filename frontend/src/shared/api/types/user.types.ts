/**
 * User-related types matching backend Pydantic schemas
 */

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string; // ISO 8601 datetime
  updated_at: string; // ISO 8601 datetime
}

export interface Teacher {
  id: number;
  user_id: number;
  rating: number;
  bio: string | null;
  subject_specialization: string | null;
  years_of_experience: number;
  user: User;
}

export interface Student {
  id: number;
  user_id: number;
  grade_level: number | null;
  student_id_number: string | null;
  enrollment_date: string; // ISO 8601 datetime
  user: User;
}

// Auth DTOs
export interface UserCreateDTO {
  username: string;
  email: string;
  password: string;
  full_name: string;
  avatar_url?: string | null;
  is_teacher: boolean;
}

export interface LoginRequestDTO {
  username_or_email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UserUpdateDTO {
  username?: string;
  email?: string;
  full_name?: string;
  avatar_url?: string | null;
  is_active?: boolean;
}

export type UserRole = "teacher" | "student";

export interface UserRoleResponse {
  role: UserRole;
}

