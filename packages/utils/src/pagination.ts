import type { PaginationMeta, PaginationParams } from "@opsora/types";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@opsora/config";

/** Clamp untrusted query parameters into a safe pagination window. */
export function normalizePagination(
  input: Partial<PaginationParams> = {},
): PaginationParams {
  const page = Math.max(1, Math.trunc(input.page ?? 1));
  const requested = Math.trunc(input.pageSize ?? DEFAULT_PAGE_SIZE);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, requested));

  return { page, pageSize };
}

export function buildPaginationMeta(
  params: PaginationParams,
  total: number,
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize));

  return {
    ...params,
    total,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrevious: params.page > 1,
  };
}

export function toOffset(params: PaginationParams): number {
  return (params.page - 1) * params.pageSize;
}
