import { Elysia, t } from "elysia";

import { apiResponse } from "@/lib/api-schema.ts";
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
      response: apiResponse(
        t.Object({
          groups: t.Array(
            t.Object({
              category: t.Union([
                t.Literal("Finance Ledger"),
                t.Literal("Templates"),
                t.Literal("Document Vault"),
              ]),
              results: t.Array(
                t.Object({
                  id: t.String(),
                  label: t.String(),
                  sublabel: t.Optional(t.String()),
                  href: t.String(),
                }),
              ),
            }),
          ),
        }),
      ),
      detail: { tags: ["Search"], summary: "Unified search across finance and documents" },
    },
  );
