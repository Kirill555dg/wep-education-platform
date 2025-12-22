/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for classroom response
 */
export type ClassroomResponse = {
    name: string;
    description?: (string | null);
    subject: string;
    grade_level?: (number | null);
    max_students?: number;
    id: number;
    teacher_id: number;
    is_active: boolean;
    invite_code: (string | null);
    created_at: string;
    updated_at: string;
    students_count?: number;
};

