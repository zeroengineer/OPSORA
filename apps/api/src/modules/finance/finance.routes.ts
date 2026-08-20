import { Elysia } from "elysia";

import { requireAuth } from "@/middleware/require-auth.ts";
import { success } from "@/lib/response.ts";

export const financeRoutes = new Elysia({ prefix: "/finance" })
  .use(requireAuth)
  .get("/", () => success({ module: "finance", status: "not-implemented" }));
