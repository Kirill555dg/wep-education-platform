/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for creating homework
 */
export type HomeworkCreate = {
    title: string;
    description?: (string | null);
    max_score?: number;
    deadline?: (string | null);
    lesson_id: number;
    problem_ids?: Array<number>;
    problem_points?: (Array<number> | null);
};

