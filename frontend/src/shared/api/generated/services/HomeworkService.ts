/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnswerSubmit } from '../models/AnswerSubmit';
import type { HomeworkCreate } from '../models/HomeworkCreate';
import type { HomeworkDetailResponse } from '../models/HomeworkDetailResponse';
import type { HomeworkResponse } from '../models/HomeworkResponse';
import type { HomeworkUpdate } from '../models/HomeworkUpdate';
import type { Page_HomeworkResponse_ } from '../models/Page_HomeworkResponse_';
import type { ProblemFullResponse } from '../models/ProblemFullResponse';
import type { ProblemResponse } from '../models/ProblemResponse';
import type { StatisticsResponse } from '../models/StatisticsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HomeworkService {
    /**
     * Create Homework
     * Create new homework assignment (teachers only)
     *
     * - **lesson_id**: ID of the lesson
     * - **title**: Homework title
     * - **description**: Optional description
     * - **max_score**: Maximum score (default 100)
     * - **deadline**: Optional deadline date/time
     * - **problem_ids**: List of problem IDs to include
     * - **problem_points**: Optional list of points for each problem
     * @param requestBody
     * @returns HomeworkResponse Successful Response
     * @throws ApiError
     */
    public static createHomeworkApiV1HomeworkPost(
        requestBody: HomeworkCreate,
    ): CancelablePromise<HomeworkResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/homework',
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
     * Get Lesson Homework
     * Get all homework for a lesson
     *
     * - Teachers see all homework (including unpublished)
     * - Students see only published homework
     * @param lessonId
     * @param skip
     * @param limit
     * @returns Page_HomeworkResponse_ Successful Response
     * @throws ApiError
     */
    public static getLessonHomeworkApiV1HomeworkLessonLessonIdGet(
        lessonId: number,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_HomeworkResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/homework/lesson/{lesson_id}',
            path: {
                'lesson_id': lessonId,
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
     * Get Homework
     * Get homework details by ID
     *
     * Returns homework information.
     * Students can only see published homework.
     * @param homeworkId
     * @returns HomeworkDetailResponse Successful Response
     * @throws ApiError
     */
    public static getHomeworkApiV1HomeworkHomeworkIdGet(
        homeworkId: number,
    ): CancelablePromise<HomeworkDetailResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/homework/{homework_id}',
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
     * Update Homework
     * Update homework (teachers only, owner only)
     * @param homeworkId
     * @param requestBody
     * @returns HomeworkResponse Successful Response
     * @throws ApiError
     */
    public static updateHomeworkApiV1HomeworkHomeworkIdPatch(
        homeworkId: number,
        requestBody: HomeworkUpdate,
    ): CancelablePromise<HomeworkResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/homework/{homework_id}',
            path: {
                'homework_id': homeworkId,
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
     * Delete Homework
     * Delete homework (teachers only, owner only)
     *
     * Note: This would need to be implemented in HomeworkService
     * @param homeworkId
     * @returns void
     * @throws ApiError
     */
    public static deleteHomeworkApiV1HomeworkHomeworkIdDelete(
        homeworkId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/homework/{homework_id}',
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
     * Get Homework Problems
     * Get all problems for homework
     *
     * - Teachers see problems with correct answers
     * - Students see problems without correct answers
     * @param homeworkId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getHomeworkProblemsApiV1HomeworkHomeworkIdProblemsGet(
        homeworkId: number,
    ): CancelablePromise<Array<(ProblemResponse | ProblemFullResponse)>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/homework/{homework_id}/problems',
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
    public static submitAnswerApiV1HomeworkSubmitAnswerPost(
        requestBody: AnswerSubmit,
    ): CancelablePromise<StatisticsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/homework/submit-answer',
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
    public static submitHomeworkApiV1HomeworkHomeworkIdSubmitPost(
        homeworkId: number,
    ): CancelablePromise<StatisticsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/homework/{homework_id}/submit',
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
    public static getHomeworkStatusApiV1HomeworkHomeworkIdStatusGet(
        homeworkId: number,
    ): CancelablePromise<StatisticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/homework/{homework_id}/status',
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
}
