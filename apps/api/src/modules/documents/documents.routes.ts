import { Elysia } from "elysia";

import { requireAuth } from "@/middleware/require-auth.ts";
import { success } from "@/lib/response.ts";

export const documentsRoutes = new Elysia({ prefix: "/documents" })
  .use(requireAuth)
  .get("/", () => success({ module: "documents", status: "not-implemented" }));
