import { Elysia, t } from "elysia";

import { success } from "@/lib/response.ts";
import { requireAuth } from "@/middleware/require-auth.ts";

import { dashboardService } from "./dashboard.service.ts";

export const dashboardRoutes = new Elysia({ prefix: "/dashboard" })
  .use(requireAuth)
  .get(
    "/",
    async ({ query }) => success(await dashboardService.build(query)),
    {
      query: t.Object({
        metric: t.Optional(
          t.Union([
            t.Literal("income"),
            t.Literal("netProfit"),
            t.Literal("expenses"),
            t.Literal("receivables"),
          ]),
        ),
        period: t.Optional(
          t.Union([t.Literal("daily"), t.Literal("weekly"), t.Literal("monthly")]),
        ),
      }),
      detail: { tags: ["Dashboard"], summary: "Aggregated dashboard data" },
    },
  );
