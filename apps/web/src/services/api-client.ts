import type { ApiResponse } from "@opsora/types";

import { env } from "@/lib/env.ts";

/** Error thrown for any non-successful API response. */
export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Response is a bare JSON body rather than the ApiResponse envelope. */
  raw?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, raw = false, headers, ...init } = options;

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const payload: unknown = await response.json().catch(() => null);

  if (raw) {
    if (!response.ok) {
      throw new ApiRequestError(
        response.status,
        "INTERNAL_ERROR",
        `Request to ${path} failed`,
      );
    }
    return payload as T;
  }

  const envelope = payload as ApiResponse<T> | null;

  if (!response.ok || !envelope?.success) {
    const error = envelope && !envelope.success ? envelope.error : undefined;
    throw new ApiRequestError(
      response.status,
      error?.code ?? "INTERNAL_ERROR",
      error?.message ?? `Request to ${path} failed`,
      error?.details,
    );
  }

  return envelope.data;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
