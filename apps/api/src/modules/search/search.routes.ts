import { Elysia, t } from "elysia";

import { success } from "@/lib/response.ts";
import { requireAuth } from "@/middleware/require-auth.ts";

import { searchService } from "./search.service.ts";

export const searchRoutes = new Elysia()
  .use(requireAuth)
  .get(
    "/search",
    async ({ query }) => success(await searchService.search(query.q)),
    {
      query: t.Object({ q: t.String() }),
      detail: { tags: ["Search"], summary: "Unified search across finance and documents" },
    },
  );
