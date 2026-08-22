import { Elysia, t } from "elysia";

import { requireAuth } from "@/middleware/require-auth.ts";
import { apiResponse } from "@/lib/api-schema.ts";
import { success } from "@/lib/response.ts";

export const salesRoutes = new Elysia({ prefix: "/sales" })
  .use(requireAuth)
  .get(
    "/",
    () =>
      success({ module: "sales" as const, status: "not-implemented" as const }),
    {
      response: apiResponse(
        t.Object({
          module: t.Literal("sales"),
          status: t.Literal("not-implemented"),
        }),
      ),
      detail: { tags: ["Sales"], summary: "Not yet implemented" },
    },
  );
