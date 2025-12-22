/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Detailed lesson response with materials
 */
export type LessonDetailResponse = {
    title: string;
    description?: (string | null);
    order_number?: (number | null);
    scheduled_at?: (string | null);
    id: number;
    classroom_id: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    materials_count?: number;
    homeworks_count?: number;
};

