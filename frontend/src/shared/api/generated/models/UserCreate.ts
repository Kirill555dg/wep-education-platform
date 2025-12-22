/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserRole } from './UserRole';
/**
 * Schema for creating a user
 */
export type UserCreate = {
    email: string;
    first_name: string;
    last_name: string;
    middle_name?: (string | null);
    role?: UserRole;
    avatar_url?: (string | null);
    username?: (string | null);
    full_name?: (string | null);
    password: string;
};

