/**
 * Configure generated OpenAPI client.
 *
 * This module is imported for side-effects by API wrappers.
 */

import { OpenAPI } from "@/api/client";

OpenAPI.BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.TOKEN = async () => localStorage.getItem("access_token") || "";

