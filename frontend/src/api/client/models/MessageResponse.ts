/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserPublic } from './UserPublic';
export type MessageResponse = {
    id: number;
    chat_id: number;
    sender_id: number;
    sender?: (UserPublic | null);
    content: string;
    is_edited: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
};

