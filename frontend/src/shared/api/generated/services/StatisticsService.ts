/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClassroomProgressResponse } from '../models/ClassroomProgressResponse';
import type { Page_StatisticsResponse_ } from '../models/Page_StatisticsResponse_';
import type { StudentProgressResponse } from '../models/StudentProgressResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatisticsService {
    /**
     * Get My Statistics
     * Get all statistics for current student
     *
     * Returns all homework attempts with scores and status
     * @param skip
     * @param limit
     * @returns Page_StatisticsResponse_ Successful Response
     * @throws ApiError
     */
    public static getMyStatisticsApiV1StatisticsMeGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_StatisticsResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/statistics/me',
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
     * Get My Progress
     * Get overall progress for current student
     *
     * Returns:
     * - total_homeworks: Total number of assigned homeworks
     * - completed: Number of completed homeworks
     * - in_progress: Number of homeworks in progress
     * - not_started: Number of not started homeworks
     * - average_score_percentage: Average score percentage
     * - total_attempts: Total number of attempts
     * - total_time_spent_minutes: Total time spent
     * @returns StudentProgressResponse Successful Response
     * @throws ApiError
     */
    public static getMyProgressApiV1StatisticsMeProgressGet(): CancelablePromise<StudentProgressResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/statistics/me/progress',
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
     * Get Homework Statistics
     * Get statistics for all students for a specific homework (teachers only)
     *
     * Returns all student attempts for the homework
     * @param homeworkId
     * @param skip
     * @param limit
     * @returns Page_StatisticsResponse_ Successful Response
     * @throws ApiError
     */
    public static getHomeworkStatisticsApiV1StatisticsHomeworkHomeworkIdGet(
        homeworkId: number,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_StatisticsResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/statistics/homework/{homework_id}',
            path: {
                'homework_id': homeworkId,
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
     * Get Classroom Progress
     * Get overall progress for a classroom (teachers only)
     *
     * Returns:
     * - total_students: Number of students in classroom
     * - total_homeworks_assigned: Total homeworks assigned
     * - completed_homeworks: Number of completed homeworks
     * - average_completion_rate: Average completion rate (%)
     * @param classroomId
     * @returns ClassroomProgressResponse Successful Response
     * @throws ApiError
     */
    public static getClassroomProgressApiV1StatisticsClassroomClassroomIdProgressGet(
        classroomId: number,
    ): CancelablePromise<ClassroomProgressResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/statistics/classroom/{classroom_id}/progress',
            path: {
                'classroom_id': classroomId,
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
     * Get Student Statistics By Teacher
     * Get statistics for a specific student (teachers only)
     *
     * Teachers can view any student's statistics
     * @param studentUserId
     * @param skip
     * @param limit
     * @returns Page_StatisticsResponse_ Successful Response
     * @throws ApiError
     */
    public static getStudentStatisticsByTeacherApiV1StatisticsStudentStudentUserIdGet(
        studentUserId: number,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_StatisticsResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/statistics/student/{student_user_id}',
            path: {
                'student_user_id': studentUserId,
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
}
