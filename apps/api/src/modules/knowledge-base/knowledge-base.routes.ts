import { Elysia } from "elysia";

import { requireAuth } from "@/middleware/require-auth.ts";
import { success } from "@/lib/response.ts";

export const knowledgeBaseRoutes = new Elysia({ prefix: "/knowledge-base" })
  .use(requireAuth)
  .get("/", () => success({ module: "knowledge-base", status: "not-implemented" }));
