/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for statistics response
 */
export type StatisticsResponse = {
    status?: string;
    score?: number;
    max_score: number;
    time_spent_minutes?: number;
    id: number;
    student_id: number;
    homework_id: number;
    attempts_count: number;
    submitted_at: (string | null);
    graded_at: (string | null);
    feedback: (string | null);
    created_at: string;
    updated_at: string;
};

