import { Elysia, t } from "elysia";

import { requireAuth } from "@/middleware/require-auth.ts";
import { apiResponse, paginated } from "@/lib/api-schema.ts";
import { success } from "@/lib/response.ts";

import { clientsService } from "./clients.service.ts";

/** Mirrors the placeholder `Client` shape in clients.types.ts. */
const clientSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.Union([t.String(), t.Null()]),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

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
      response: apiResponse(paginated(clientSchema)),
      detail: { tags: ["Clients"], summary: "List clients" },
    },
  )
  .get(
    "/:id",
    async ({ params }) => success(await clientsService.getById(params.id)),
    {
      params: t.Object({ id: t.String() }),
      response: apiResponse(clientSchema),
      detail: { tags: ["Clients"], summary: "Get a client" },
    },
  );
