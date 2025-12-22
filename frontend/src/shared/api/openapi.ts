/**
 * Configure generated OpenAPI client.
 *
 * This module is imported for side-effects by API wrappers.
 */

import { OpenAPI } from "@/shared/api/generated";
import { env } from "@/shared/config/env";

OpenAPI.BASE = env.apiBaseUrl;
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.TOKEN = async () => localStorage.getItem("access_token") || "";

OpenAPI.HEADERS = async () => {
  // Correlate backend logs with frontend actions.
  // Backend will also generate request_id if not provided.
  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return { "X-Request-ID": requestId };
};

