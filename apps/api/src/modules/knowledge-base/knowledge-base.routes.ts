import { Elysia, t } from "elysia";

import { requireAuth } from "@/middleware/require-auth.ts";
import { apiResponse } from "@/lib/api-schema.ts";
import { success } from "@/lib/response.ts";

export const knowledgeBaseRoutes = new Elysia({ prefix: "/knowledge-base" })
  .use(requireAuth)
  .get(
    "/",
    () =>
      success({ module: "knowledge-base" as const, status: "not-implemented" as const }),
    {
      response: apiResponse(
        t.Object({
          module: t.Literal("knowledge-base"),
          status: t.Literal("not-implemented"),
        }),
      ),
      detail: { tags: ["Knowledge Base"], summary: "Not yet implemented" },
    },
  );
