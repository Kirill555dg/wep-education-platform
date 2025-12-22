/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for creating a problem
 */
export type ProblemCreate = {
    title: string;
    description: string;
    problem_type: string;
    difficulty?: (number | string);
    correct_answer?: (string | null);
    explanation?: (string | null);
    hints?: (string | null);
};

