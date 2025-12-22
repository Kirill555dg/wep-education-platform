import { describe, expect, it } from "bun:test";

import { ApiError } from "@/shared/api/generated";
import { getErrorCode, getErrorMessage, getRequestId, isRoleChanged } from "./errors";

function makeApiError(body: unknown, status = 400, statusText = "Bad Request"): ApiError {
  return new ApiError(
    { method: "GET", url: "/api/v1/test" },
    { url: "http://127.0.0.1:8023/api/v1/test", ok: false, status, statusText, body },
    "ApiError"
  );
}

describe("shared/api/errors", () => {
  it("returns message for regular Error", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("extracts envelope message/code/request_id from ApiError", () => {
    const err = makeApiError({
      error: { code: "validation_error", message: "Validation error", meta: { field: "email" } },
      request_id: "req_123",
    });

    expect(getErrorMessage(err)).toBe("Validation error");
    expect(getErrorCode(err)).toBe("validation_error");
    expect(getRequestId(err)).toBe("req_123");
    expect(isRoleChanged(err)).toBe(false);
  });

  it("detects role_changed error code", () => {
    const err = makeApiError({ error: { code: "role_changed", message: "Role changed" }, request_id: "req_9" }, 401, "Unauthorized");
    expect(isRoleChanged(err)).toBe(true);
  });

  it("falls back to status/statusText for ApiError without envelope", () => {
    const err = makeApiError({ foo: "bar" }, 500, "Internal Server Error");
    expect(getErrorMessage(err)).toBe("500 Internal Server Error");
    expect(getErrorCode(err)).toBeNull();
    expect(getRequestId(err)).toBeNull();
  });

  it("returns fallback for unknown error", () => {
    expect(getErrorMessage({})).toBe("Unexpected error");
  });
});


