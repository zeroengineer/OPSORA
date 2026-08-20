import type { ApiError, ApiErrorCode, ApiFailure, ApiSuccess } from "@opsora/types";

export function success<T>(data: T): ApiSuccess<T> {
  return { success: true, data };
}

export function failure(error: ApiError): ApiFailure {
  return { success: false, error };
}

/** Errors thrown with this class are mapped to their status by the error handler. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "HttpError";
  }

  static badRequest(message: string, details?: Record<string, string[]>) {
    return new HttpError(400, "BAD_REQUEST", message, details);
  }

  static unauthorized(message = "Authentication required") {
    return new HttpError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message = "Insufficient permissions") {
    return new HttpError(403, "FORBIDDEN", message);
  }

  static notFound(message = "Resource not found") {
    return new HttpError(404, "NOT_FOUND", message);
  }

  static conflict(message: string) {
    return new HttpError(409, "CONFLICT", message);
  }
}
