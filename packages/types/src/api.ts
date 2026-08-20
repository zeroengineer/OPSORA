/** Envelope returned by every OPSORA API route except `/health`. */
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: ApiError;
}

export interface ApiError {
  /** Stable, machine-readable code such as `NOT_FOUND`. */
  code: ApiErrorCode;
  message: string;
  /** Field-level validation details, keyed by field path. */
  details?: Record<string, string[]>;
}

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export interface HealthStatus {
  status: "ok";
}
