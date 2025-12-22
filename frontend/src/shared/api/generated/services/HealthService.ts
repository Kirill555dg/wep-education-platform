/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * Health Check
     * Health check endpoint
     *
     * Returns:
     * dict: Application health status
     * @returns any Successful Response
     * @throws ApiError
     */
    public static healthCheckApiV1HealthGet(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/health',
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
     * Ping
     * Simple ping endpoint
     *
     * Returns:
     * dict: Pong response
     * @returns string Successful Response
     * @throws ApiError
     */
    public static pingApiV1PingGet(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/ping',
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
