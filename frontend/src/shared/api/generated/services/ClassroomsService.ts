/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClassroomCreate } from '../models/ClassroomCreate';
import type { ClassroomResponse } from '../models/ClassroomResponse';
import type { ClassroomUpdate } from '../models/ClassroomUpdate';
import type { JoinClassroomRequest } from '../models/JoinClassroomRequest';
import type { MessageCreate } from '../models/MessageCreate';
import type { MessageResponse } from '../models/MessageResponse';
import type { Page_ClassroomResponse_ } from '../models/Page_ClassroomResponse_';
import type { Page_ClassroomStudentResponse_ } from '../models/Page_ClassroomStudentResponse_';
import type { Page_MessageResponse_ } from '../models/Page_MessageResponse_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClassroomsService {
    /**
     * Create Classroom
     * Create new classroom (teachers only)
     *
     * - **name**: Classroom name
     * - **subject**: Subject (e.g., Mathematics, Physics)
     * - **grade_level**: Grade level (1-12)
     * - **description**: Optional description
     * @param requestBody
     * @returns ClassroomResponse Successful Response
     * @throws ApiError
     */
    public static createClassroomApiV1ClassroomsPost(
        requestBody: ClassroomCreate,
    ): CancelablePromise<ClassroomResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/classrooms',
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
     * Get My Classrooms
     * Get classrooms for current user
     *
     * - Teachers: classrooms they created
     * - Students: classrooms they joined
     * @param skip
     * @param limit
     * @returns Page_ClassroomResponse_ Successful Response
     * @throws ApiError
     */
    public static getMyClassroomsApiV1ClassroomsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_ClassroomResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/classrooms',
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
     * Get Classroom
     * Get classroom details by ID
     * @param classroomId
     * @returns ClassroomResponse Successful Response
     * @throws ApiError
     */
    public static getClassroomApiV1ClassroomsClassroomIdGet(
        classroomId: number,
    ): CancelablePromise<ClassroomResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/classrooms/{classroom_id}',
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
     * Update Classroom
     * Update classroom (teachers only, owner only)
     * @param classroomId
     * @param requestBody
     * @returns ClassroomResponse Successful Response
     * @throws ApiError
     */
    public static updateClassroomApiV1ClassroomsClassroomIdPatch(
        classroomId: number,
        requestBody: ClassroomUpdate,
    ): CancelablePromise<ClassroomResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/classrooms/{classroom_id}',
            path: {
                'classroom_id': classroomId,
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
     * Join Classroom
     * Join classroom via invite code (students only)
     *
     * - **invite_code**: Unique invite code from teacher
     * @param requestBody
     * @returns ClassroomResponse Successful Response
     * @throws ApiError
     */
    public static joinClassroomApiV1ClassroomsJoinPost(
        requestBody: JoinClassroomRequest,
    ): CancelablePromise<ClassroomResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/classrooms/join',
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
     * Get Classroom Students
     * Get list of students in classroom (teachers only)
     *
     * Returns student information with enrollment dates
     * @param classroomId
     * @param skip
     * @param limit
     * @returns Page_ClassroomStudentResponse_ Successful Response
     * @throws ApiError
     */
    public static getClassroomStudentsApiV1ClassroomsClassroomIdStudentsGet(
        classroomId: number,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_ClassroomStudentResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/classrooms/{classroom_id}/students',
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
     * List Chat Messages
     * @param classroomId
     * @param beforeId
     * @param tail
     * @param skip
     * @param limit
     * @returns Page_MessageResponse_ Successful Response
     * @throws ApiError
     */
    public static listChatMessagesApiV1ClassroomsClassroomIdChatMessagesGet(
        classroomId: number,
        beforeId?: (number | null),
        tail: boolean = false,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_MessageResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/classrooms/{classroom_id}/chat/messages',
            path: {
                'classroom_id': classroomId,
            },
            query: {
                'before_id': beforeId,
                'tail': tail,
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
     * Post Chat Message
     * @param classroomId
     * @param requestBody
     * @returns MessageResponse Successful Response
     * @throws ApiError
     */
    public static postChatMessageApiV1ClassroomsClassroomIdChatMessagesPost(
        classroomId: number,
        requestBody: MessageCreate,
    ): CancelablePromise<MessageResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/classrooms/{classroom_id}/chat/messages',
            path: {
                'classroom_id': classroomId,
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
}
