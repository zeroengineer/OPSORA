import { Elysia } from "elysia";

import { requireAuth } from "@/middleware/require-auth.ts";
import { success } from "@/lib/response.ts";

export const salesRoutes = new Elysia({ prefix: "/sales" })
  .use(requireAuth)
  .get("/", () => success({ module: "sales", status: "not-implemented" }));
