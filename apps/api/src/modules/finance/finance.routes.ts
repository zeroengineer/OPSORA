import { Elysia, t } from "elysia";

import { success } from "@/lib/response.ts";
import { requireAuth } from "@/middleware/require-auth.ts";

import { financeService } from "./finance.service.ts";

export const financeRoutes = new Elysia({ prefix: "/finance" })
  .use(requireAuth)
  .get(
    "/transactions",
    async ({ query }) => success(await financeService.list(query)),
    {
      query: t.Object({
        type: t.Optional(t.Union([t.Literal("in"), t.Literal("out")])),
        search: t.Optional(t.String()),
        month: t.Optional(t.String({ pattern: "^\\d{4}-\\d{2}$" })),
        page: t.Optional(t.Number({ minimum: 1 })),
        pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
      }),
      detail: { tags: ["Finance"], summary: "List ledger transactions" },
    },
  )
  .get(
    "/summary",
    async ({ query }) => success(await financeService.summary(query)),
    {
      query: t.Object({
        month: t.Optional(t.String({ pattern: "^\\d{4}-\\d{2}$" })),
      }),
      detail: { tags: ["Finance"], summary: "Ledger opening/closing balance summary" },
    },
  )
  .post(
    "/transactions",
    async ({ body, user }) => success(await financeService.create(body, user!.id)),
    {
      body: t.Object({
        type: t.Union([t.Literal("in"), t.Literal("out")]),
        description: t.String({ minLength: 1, maxLength: 200 }),
        category: t.String({ minLength: 1, maxLength: 100 }),
        amountMinor: t.Number({ minimum: 1 }),
        occurredOn: t.String({ format: "date" }),
      }),
      detail: { tags: ["Finance"], summary: "Record a transaction" },
    },
  );
