/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for problem response (without correct answer for students)
 */
export type ProblemResponse = {
    title: string;
    description: string;
    problem_type: string;
    difficulty?: (number | string);
    correct_answer?: (string | null);
    explanation?: (string | null);
    hints?: (string | null);
    id: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
};

