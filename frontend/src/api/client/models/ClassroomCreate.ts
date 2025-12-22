/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for creating a classroom
 */
export type ClassroomCreate = {
    name: string;
    description?: (string | null);
    subject: string;
    grade_level?: (number | null);
    max_students?: number;
};

