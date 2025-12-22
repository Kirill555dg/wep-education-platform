/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerSubmit } from '../models/AnswerSubmit';
import type { StatisticsResponse } from '../models/StatisticsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TestingService {
    /**
     * Submit Answer
     * Submit answer for a problem (students only)
     *
     * - **homework_id**: ID of the homework
     * - **problem_id**: ID of the problem
     * - **answer**: Student's answer (string)
     * - **time_spent_minutes**: Time spent on this problem
     *
     * Returns updated statistics with score
     * @param requestBody
     * @returns StatisticsResponse Successful Response
     * @throws ApiError
     */
    public static submitAnswerApiV1TestingSubmitAnswerPost(
        requestBody: AnswerSubmit,
    ): CancelablePromise<StatisticsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/testing/submit-answer',
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
     * Submit Homework
     * Submit homework for final grading (students only)
     *
     * Marks homework as submitted. No more answers can be submitted after this.
     * @param homeworkId
     * @returns StatisticsResponse Successful Response
     * @throws ApiError
     */
    public static submitHomeworkApiV1TestingHomeworkHomeworkIdSubmitPost(
        homeworkId: number,
    ): CancelablePromise<StatisticsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/testing/homework/{homework_id}/submit',
            path: {
                'homework_id': homeworkId,
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
     * Get Homework Status
     * Get current status/progress for homework (students only)
     *
     * Returns statistics including score, attempts, time spent
     * @param homeworkId
     * @returns StatisticsResponse Successful Response
     * @throws ApiError
     */
    public static getHomeworkStatusApiV1TestingHomeworkHomeworkIdStatusGet(
        homeworkId: number,
    ): CancelablePromise<StatisticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/testing/homework/{homework_id}/status',
            path: {
                'homework_id': homeworkId,
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
     * Dev Seed Info
     * Helper endpoint for frontend development.
     *
     * Returns seed credentials and IDs (DEBUG-only).
     * @returns any Successful Response
     * @throws ApiError
     */
    public static devSeedInfoApiV1TestingDevSeedInfoGet(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/testing/dev-seed-info',
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
