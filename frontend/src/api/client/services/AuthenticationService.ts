/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { RoleSwitchRequest } from '../models/RoleSwitchRequest';
import type { TokenResponse } from '../models/TokenResponse';
import type { UserCreate } from '../models/UserCreate';
import type { UserResponse } from '../models/UserResponse';
import type { UserRolesResponse } from '../models/UserRolesResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Register
     * Register new user (student or teacher)
     *
     * - **username**: Unique username (3-100 characters)
     * - **email**: Valid email address
     * - **password**: Password (min 8 characters)
     * - **full_name**: User's full name
     * - **is_teacher**: False for student, True for teacher
     * @param requestBody
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static registerApiV1AuthRegisterPost(
        requestBody: UserCreate,
    ): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register',
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
     * Login
     * Authenticate user and get JWT token
     *
     * - **username_or_email**: Username or email
     * - **password**: User password
     *
     * Returns JWT access token and user data
     * @param requestBody
     * @returns TokenResponse Successful Response
     * @throws ApiError
     */
    public static loginApiV1AuthLoginPost(
        requestBody: LoginRequest,
    ): CancelablePromise<TokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login',
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
     * Get Current User Profile
     * Get current authenticated user profile
     *
     * Requires valid JWT token in Authorization header
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static getCurrentUserProfileApiV1AuthMeGet(): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/me',
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
     * Get Current User Role
     * Get current user's role (teacher or student)
     *
     * Returns: {"role": "teacher"} or {"role": "student"}
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getCurrentUserRoleApiV1AuthMeRoleGet(): CancelablePromise<Record<string, (string | null)>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/me/role',
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
     * Switch My Role
     * Switch active role for current user.
     *
     * If target role profile does not exist, it will be created.
     * @param requestBody
     * @returns UserRolesResponse Successful Response
     * @throws ApiError
     */
    public static switchMyRoleApiV1AuthMeRolePost(
        requestBody: RoleSwitchRequest,
    ): CancelablePromise<UserRolesResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/me/role',
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
     * Get Current User Roles
     * Get active role + enabled roles for current user.
     * @returns UserRolesResponse Successful Response
     * @throws ApiError
     */
    public static getCurrentUserRolesApiV1AuthMeRolesGet(): CancelablePromise<UserRolesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/me/roles',
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
