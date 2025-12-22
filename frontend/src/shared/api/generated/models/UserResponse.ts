/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
/**
 * Schema for user response
 */
export type UserResponse = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: (string | null);
    role: UserRole;
    username?: (string | null);
    full_name?: (string | null);
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

