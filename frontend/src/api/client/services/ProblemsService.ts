/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Page_ProblemFullResponse_ } from '../models/Page_ProblemFullResponse_';
import type { ProblemCreate } from '../models/ProblemCreate';
import type { ProblemFullResponse } from '../models/ProblemFullResponse';
import type { ProblemUpdate } from '../models/ProblemUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProblemsService {
    /**
     * Create Problem
     * Create new problem (teachers only)
     *
     * - **title**: Problem title
     * - **description**: Problem description/text
     * - **problem_type**: Type of problem
     * - **difficulty**: Difficulty level
     * - **correct_answer**: Correct answer
     * - **explanation**: Explanation of solution
     * - **hints**: Hints (optional)
     * @param requestBody
     * @returns ProblemFullResponse Successful Response
     * @throws ApiError
     */
    public static createProblemApiV1ProblemsPost(
        requestBody: ProblemCreate,
    ): CancelablePromise<ProblemFullResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/problems',
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
     * Get Problems
     * Get all problems (teachers only)
     *
     * Teachers can see all problems with correct answers
     * @param skip
     * @param limit
     * @returns Page_ProblemFullResponse_ Successful Response
     * @throws ApiError
     */
    public static getProblemsApiV1ProblemsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_ProblemFullResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/problems',
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
     * Get Problem
     * Get problem by ID (teachers only)
     * @param problemId
     * @returns ProblemFullResponse Successful Response
     * @throws ApiError
     */
    public static getProblemApiV1ProblemsProblemIdGet(
        problemId: number,
    ): CancelablePromise<ProblemFullResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/problems/{problem_id}',
            path: {
                'problem_id': problemId,
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
     * Update Problem
     * Update problem (teachers only)
     * @param problemId
     * @param requestBody
     * @returns ProblemFullResponse Successful Response
     * @throws ApiError
     */
    public static updateProblemApiV1ProblemsProblemIdPatch(
        problemId: number,
        requestBody: ProblemUpdate,
    ): CancelablePromise<ProblemFullResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/problems/{problem_id}',
            path: {
                'problem_id': problemId,
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
     * Delete Problem
     * Delete problem (teachers only)
     * @param problemId
     * @returns void
     * @throws ApiError
     */
    public static deleteProblemApiV1ProblemsProblemIdDelete(
        problemId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/problems/{problem_id}',
            path: {
                'problem_id': problemId,
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
