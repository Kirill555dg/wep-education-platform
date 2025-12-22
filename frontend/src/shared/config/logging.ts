export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

function normalizeLevel(levelRaw: unknown): LogLevel {
  const v = String(levelRaw || "").toLowerCase();
  if (v === "debug" || v === "info" || v === "warn" || v === "error" || v === "silent") return v;
  return import.meta.env.DEV ? "debug" : "info";
}

export const loggingConfig = {
  level: normalizeLevel(import.meta.env.VITE_LOG_LEVEL),
  json: String(import.meta.env.VITE_LOG_JSON || "").toLowerCase() === "true",
  color: String(import.meta.env.VITE_LOG_COLOR || "").toLowerCase() !== "false",
} as const;

