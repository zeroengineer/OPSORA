import { t, type TSchema } from "elysia";

/**
 * TypeBox mirrors of the response contracts in `@opsora/types`, so the OpenAPI
 * document at /docs describes what each endpoint returns rather than only what
 * it accepts.
 *
 * Setting `response` on a route also turns on runtime response validation in
 * Elysia: a DTO that drifts from its schema becomes a 500 rather than a silent
 * shape change. That is the point, but it means these must be kept honest —
 * they live next to the routes they describe for exactly that reason.
 */

const apiError = t.Object({
  code: t.Union([
    t.Literal("BAD_REQUEST"),
    t.Literal("UNAUTHORIZED"),
    t.Literal("FORBIDDEN"),
    t.Literal("NOT_FOUND"),
    t.Literal("CONFLICT"),
    t.Literal("VALIDATION_ERROR"),
    t.Literal("INTERNAL_ERROR"),
  ]),
  message: t.String(),
  details: t.Optional(t.Record(t.String(), t.Array(t.String()))),
});

/** Mirrors `ApiFailure`. */
export const apiFailure = t.Object({
  success: t.Literal(false),
  error: apiError,
});

/** Mirrors `ApiSuccess<T>`. */
export function apiSuccess<T extends TSchema>(data: T) {
  return t.Object({ success: t.Literal(true), data });
}

/** Mirrors `PaginationMeta`. */
export const paginationMeta = t.Object({
  page: t.Number(),
  pageSize: t.Number(),
  total: t.Number(),
  totalPages: t.Number(),
  hasNext: t.Boolean(),
  hasPrevious: t.Boolean(),
});

/** Mirrors `Paginated<T>`. */
export function paginated<T extends TSchema>(item: T) {
  return t.Object({ items: t.Array(item), meta: paginationMeta });
}

/**
 * The status map every enveloped route shares: the success shape plus the
 * failures the global error handler can produce for an authenticated route.
 */
export function apiResponse<T extends TSchema>(data: T) {
  return {
    200: apiSuccess(data),
    401: apiFailure,
    404: apiFailure,
    422: apiFailure,
    500: apiFailure,
  };
}
