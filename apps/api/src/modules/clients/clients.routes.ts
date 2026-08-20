import { Elysia, t } from "elysia";

import { requireAuth } from "@/middleware/require-auth.ts";
import { success } from "@/lib/response.ts";

import { clientsService } from "./clients.service.ts";

/**
 * Reference module wiring: routes stay thin, delegating to the service,
 * which in turn delegates persistence to the repository.
 */
export const clientsRoutes = new Elysia({ prefix: "/clients" })
  .use(requireAuth)
  .get(
    "/",
    async ({ query }) => success(await clientsService.list(query)),
    {
      query: t.Object({
        page: t.Optional(t.Number({ minimum: 1 })),
        pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
        search: t.Optional(t.String()),
      }),
      detail: { tags: ["Clients"], summary: "List clients" },
    },
  )
  .get(
    "/:id",
    async ({ params }) => success(await clientsService.getById(params.id)),
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Clients"], summary: "Get a client" },
    },
  );
