import type { ApiErrorCode } from "@opsora/types";
import { Elysia } from "elysia";

import { isProduction } from "@/config/env.ts";
import { logger } from "@/lib/logger.ts";
import { HttpError, failure } from "@/lib/response.ts";

/** Elysia's built-in error codes mapped onto the shared API error contract. */
const ELYSIA_ERRORS: Record<string, { status: number; code: ApiErrorCode }> = {
  VALIDATION: { status: 422, code: "VALIDATION_ERROR" },
  NOT_FOUND: { status: 404, code: "NOT_FOUND" },
  PARSE: { status: 400, code: "BAD_REQUEST" },
  INVALID_COOKIE_SIGNATURE: { status: 401, code: "UNAUTHORIZED" },
};

/** Elysia surfaces non-Error values (e.g. validation payloads) on some codes. */
function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  try {
    return JSON.stringify(error) ?? "Unknown error";
  } catch {
    return "Unknown error";
  }
}

export const errorHandler = new Elysia({ name: "error-handler" }).onError(
  { as: "global" },
  ({ code, error, set }) => {
    if (error instanceof HttpError) {
      set.status = error.status;
      return failure({
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      });
    }

    const mapped = ELYSIA_ERRORS[code];
    const message = toMessage(error);

    if (mapped) {
      set.status = mapped.status;
      return failure({ code: mapped.code, message });
    }

    logger.error("Unhandled request error", {
      code,
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });

    set.status = 500;
    return failure({
      code: "INTERNAL_ERROR",
      message: isProduction ? "Internal server error" : message,
    });
  },
);
