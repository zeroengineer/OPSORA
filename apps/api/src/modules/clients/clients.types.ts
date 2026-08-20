import type { Entity } from "@opsora/types";

/**
 * Placeholder domain shape. Replace with types derived from the
 * `clients` Drizzle schema once it is defined.
 */
export interface Client extends Entity {
  name: string;
  email: string | null;
}

export interface ListClientsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}
