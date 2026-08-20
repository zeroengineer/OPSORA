import type { PaginationParams } from "@opsora/types";

import type { Client } from "./clients.types.ts";

/**
 * Data access for the clients module. All Drizzle queries live here so
 * the service layer stays free of persistence details.
 *
 * TODO: implement against the `clients` table once its schema exists.
 */
export const clientsRepository = {
  findMany(_params: PaginationParams & { search?: string }): Promise<Client[]> {
    return Promise.resolve([]);
  },

  count(_search?: string): Promise<number> {
    return Promise.resolve(0);
  },

  findById(_id: string): Promise<Client | null> {
    return Promise.resolve(null);
  },
};
