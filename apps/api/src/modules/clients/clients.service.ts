import type { Paginated } from "@opsora/types";
import { buildPaginationMeta, normalizePagination } from "@opsora/utils";

import { HttpError } from "@/lib/response.ts";

import { clientsRepository } from "./clients.repository.ts";
import type { Client, ListClientsQuery } from "./clients.types.ts";

/** Business logic for the clients module. */
export const clientsService = {
  async list(query: ListClientsQuery): Promise<Paginated<Client>> {
    const pagination = normalizePagination(query);

    const [items, total] = await Promise.all([
      clientsRepository.findMany({ ...pagination, search: query.search }),
      clientsRepository.count(query.search),
    ]);

    return { items, meta: buildPaginationMeta(pagination, total) };
  },

  async getById(id: string): Promise<Client> {
    const client = await clientsRepository.findById(id);
    if (!client) throw HttpError.notFound(`Client ${id} was not found`);

    return client;
  },
};
