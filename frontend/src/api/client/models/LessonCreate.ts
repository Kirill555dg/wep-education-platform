/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema for creating a lesson
 */
export type LessonCreate = {
    title: string;
    description?: (string | null);
    order_number?: (number | null);
    scheduled_at?: (string | null);
    classroom_id: number;
    theory_material_ids?: Array<number>;
};

