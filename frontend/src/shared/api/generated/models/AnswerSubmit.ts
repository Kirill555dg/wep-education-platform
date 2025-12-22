/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for submitting an answer
 */
export type AnswerSubmit = {
    homework_id: number;
    problem_id: number;
    answer: string;
    time_spent_minutes?: number;
};

