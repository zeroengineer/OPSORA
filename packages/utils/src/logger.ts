/*
 * `console` is a host API, not part of ES2023, and this package's tsconfig
 * deliberately omits the DOM lib so browser globals cannot leak into shared
 * code. Declaring only the three methods used keeps the logger usable from the
 * API, the browser and any other runtime — all of them provide these.
 */
declare const console: {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
};

type Level = "debug" | "info" | "warn" | "error";

function emit(level: Level, message: string, meta?: unknown): void {
  const entry = {
    level,
    time: new Date().toISOString(),
    message,
    ...(meta === undefined ? {} : { meta }),
  };

  const line = JSON.stringify(entry);

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

/** Structured JSON logging — readable by Render's log drain without extra deps. */
export const logger = {
  debug: (message: string, meta?: unknown) => emit("debug", message, meta),
  info: (message: string, meta?: unknown) => emit("info", message, meta),
  warn: (message: string, meta?: unknown) => emit("warn", message, meta),
  error: (message: string, meta?: unknown) => emit("error", message, meta),
};
