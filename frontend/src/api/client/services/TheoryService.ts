/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Page_SectionResponse_ } from '../models/Page_SectionResponse_';
import type { Page_SubjectResponse_ } from '../models/Page_SubjectResponse_';
import type { Page_SubsectionResponse_ } from '../models/Page_SubsectionResponse_';
import type { Page_TheoryMaterialResponse_ } from '../models/Page_TheoryMaterialResponse_';
import type { SubjectResponse } from '../models/SubjectResponse';
import type { TheoryMaterialResponse } from '../models/TheoryMaterialResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TheoryService {
    /**
     * List Subjects
     * @param skip
     * @param limit
     * @returns Page_SubjectResponse_ Successful Response
     * @throws ApiError
     */
    public static listSubjectsApiV1TheorySubjectsGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_SubjectResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/theory/subjects',
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
     * Get Subject
     * @param subjectId
     * @returns SubjectResponse Successful Response
     * @throws ApiError
     */
    public static getSubjectApiV1TheorySubjectsSubjectIdGet(
        subjectId: number,
    ): CancelablePromise<SubjectResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/theory/subjects/{subject_id}',
            path: {
                'subject_id': subjectId,
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
     * List Sections
     * @param subjectId
     * @param skip
     * @param limit
     * @returns Page_SectionResponse_ Successful Response
     * @throws ApiError
     */
    public static listSectionsApiV1TheorySubjectsSubjectIdSectionsGet(
        subjectId: number,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_SectionResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/theory/subjects/{subject_id}/sections',
            path: {
                'subject_id': subjectId,
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
     * List Subsections
     * @param sectionId
     * @param skip
     * @param limit
     * @returns Page_SubsectionResponse_ Successful Response
     * @throws ApiError
     */
    public static listSubsectionsApiV1TheorySectionsSectionIdSubsectionsGet(
        sectionId: number,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_SubsectionResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/theory/sections/{section_id}/subsections',
            path: {
                'section_id': sectionId,
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
     * List Materials
     * @param subsectionId
     * @param skip
     * @param limit
     * @returns Page_TheoryMaterialResponse_ Successful Response
     * @throws ApiError
     */
    public static listMaterialsApiV1TheorySubsectionsSubsectionIdMaterialsGet(
        subsectionId: number,
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Page_TheoryMaterialResponse_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/theory/subsections/{subsection_id}/materials',
            path: {
                'subsection_id': subsectionId,
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
     * Get Material
     * @param materialId
     * @returns TheoryMaterialResponse Successful Response
     * @throws ApiError
     */
    public static getMaterialApiV1TheoryMaterialsMaterialIdGet(
        materialId: number,
    ): CancelablePromise<TheoryMaterialResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/theory/materials/{material_id}',
            path: {
                'material_id': materialId,
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
