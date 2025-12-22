/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LessonCreate } from '../models/LessonCreate';
import type { LessonDetailResponse } from '../models/LessonDetailResponse';
import type { LessonResponse } from '../models/LessonResponse';
import type { LessonUpdate } from '../models/LessonUpdate';
import type { Page_LessonResponse_ } from '../models/Page_LessonResponse_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LessonsService {
    /**
     * Create Lesson
     * Create new lesson (teachers only)
     *
     * - **classroom_id**: ID of the classroom
     * - **title**: Lesson title
     * - **description**: Optional description
     * - **scheduled_at**: Optional scheduled date/time
     * - **theory_material_ids**: List of theory material IDs to attach
     * @param requestBody
     * @returns LessonResponse Successful Response
     * @throws ApiError
     */
    public static createLessonApiV1LessonsPost(
        requestBody: LessonCreate,
    ): CancelablePromise<LessonResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/lessons',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get Classroom Lessons
     * Get all lessons for a classroom
     *
     * - Teachers see all lessons (including unpublished)
     * - Students see only published lessons
     * @param classroomId
     * @param skip
     * @param limit
     * @returns Page_LessonResponse_ Successful Response
     * @throws ApiError
     */
    public static getClassroomLessonsApiV1LessonsClassroomClassroomIdGet(
        classroomId: number,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_LessonResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/lessons/classroom/{classroom_id}',
            path: {
                'classroom_id': classroomId,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get Lesson
     * Get lesson details by ID
     * @param lessonId
     * @returns LessonDetailResponse Successful Response
     * @throws ApiError
     */
    public static getLessonApiV1LessonsLessonIdGet(
        lessonId: number,
    ): CancelablePromise<LessonDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/lessons/{lesson_id}',
            path: {
                'lesson_id': lessonId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update Lesson
     * Update lesson (teachers only, owner only)
     * @param lessonId
     * @param requestBody
     * @returns LessonResponse Successful Response
     * @throws ApiError
     */
    public static updateLessonApiV1LessonsLessonIdPatch(
        lessonId: number,
        requestBody: LessonUpdate,
    ): CancelablePromise<LessonResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/lessons/{lesson_id}',
            path: {
                'lesson_id': lessonId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete Lesson
     * Delete lesson (teachers only, owner only)
     * @param lessonId
     * @returns void
     * @throws ApiError
     */
    public static deleteLessonApiV1LessonsLessonIdDelete(
        lessonId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/lessons/{lesson_id}',
            path: {
                'lesson_id': lessonId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                422: `Validation Error`,
                500: `Internal Server Error`,
            },
        });
    }
}
