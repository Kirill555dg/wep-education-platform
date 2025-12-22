import { describe, expect, it } from "bun:test";

import { getErrorMessage } from "./errors";

describe("shared/api/errors", () => {
  it("returns message for regular Error", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns fallback for unknown error", () => {
    expect(getErrorMessage({})).toBe("Unexpected error");
  });
});


