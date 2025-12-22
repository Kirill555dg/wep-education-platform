import { ApiError } from "@/shared/api/generated";

export type ErrorEnvelope = {
  error: {
    code: string;
    message: string;
    meta?: Record<string, unknown>;
  };
  request_id?: string;
};

export function isApiError(value: unknown): value is ApiError {
  return value instanceof Error && (value as Error).name === "ApiError";
}

export function getErrorEnvelope(err: unknown): ErrorEnvelope | null {
  if (!isApiError(err)) return null;
  const body = (err as ApiError).body;
  if (body && typeof body === "object" && "error" in body) {
    return body as ErrorEnvelope;
  }
  return null;
}

export function getErrorCode(err: unknown): string | null {
  return getErrorEnvelope(err)?.error?.code ?? null;
}

export function getErrorMessage(err: unknown): string {
  const env = getErrorEnvelope(err);
  if (env?.error?.message) return env.error.message;
  if (isApiError(err)) return `${err.status} ${err.statusText}`;
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

export function isRoleChanged(err: unknown): boolean {
  return getErrorCode(err) === "role_changed";
}


