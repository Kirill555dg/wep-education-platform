import { loggingConfig, type LogLevel } from "@/shared/config/logging";

type LogContext = Record<string, unknown>;
type LogFn = (message: string, ctx?: LogContext) => void;

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 50,
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[loggingConfig.level] && loggingConfig.level !== "silent";
}

function nowIso(): string {
  return new Date().toISOString();
}

function fmt(message: string, ctx?: LogContext) {
  const base = { ts: nowIso(), msg: message, ...ctx };
  return base;
}

function logToConsole(level: LogLevel, message: string, ctx?: LogContext) {
  if (!shouldLog(level)) return;

  const payload = fmt(message, ctx);
  if (loggingConfig.json) {
    const line = JSON.stringify({ level, ...payload });
    // eslint-disable-next-line no-console
    if (level === "debug") console.log(line);
    // eslint-disable-next-line no-console
    else if (level === "info") console.info(line);
    // eslint-disable-next-line no-console
    else if (level === "warn") console.warn(line);
    // eslint-disable-next-line no-console
    else console.error(line);
    return;
  }

  const label = `[${level.toUpperCase()}]`;
  const color =
    !loggingConfig.color
      ? ""
      : level === "debug"
        ? "color:#06b6d4"
        : level === "info"
          ? "color:#22c55e"
          : level === "warn"
            ? "color:#f59e0b"
            : "color:#ef4444";

  // eslint-disable-next-line no-console
  const fn =
    level === "debug"
      ? console.log
      : level === "info"
        ? console.info
        : level === "warn"
          ? console.warn
          : console.error;
  if (loggingConfig.color) {
    fn(`%c${label}%c ${message}`, color, "color:inherit", ctx || {});
  } else {
    fn(`${label} ${message}`, ctx || {});
  }
}

export const logger = {
  debug: ((message: string, ctx?: LogContext) => logToConsole("debug", message, ctx)) as LogFn,
  info: ((message: string, ctx?: LogContext) => logToConsole("info", message, ctx)) as LogFn,
  warn: ((message: string, ctx?: LogContext) => logToConsole("warn", message, ctx)) as LogFn,
  error: ((message: string, ctx?: LogContext) => logToConsole("error", message, ctx)) as LogFn,
} as const;

