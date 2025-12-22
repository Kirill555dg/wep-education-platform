import type { UserResponse } from "@/shared/api/generated";

export type SessionStatus = "unknown" | "authenticated" | "guest";

export type SessionUser = UserResponse;


