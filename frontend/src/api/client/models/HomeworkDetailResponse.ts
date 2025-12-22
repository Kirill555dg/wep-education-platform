/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Detailed homework response with problems
 */
export type HomeworkDetailResponse = {
    title: string;
    description?: (string | null);
    max_score?: number;
    deadline?: (string | null);
    id: number;
    lesson_id: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    problems_count?: number;
};

