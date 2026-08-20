export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta extends PaginationParams {
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export type SortDirection = "asc" | "desc";

export interface SortParams<TField extends string = string> {
  field: TField;
  direction: SortDirection;
}
