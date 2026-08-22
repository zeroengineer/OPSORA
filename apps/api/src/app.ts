import type { HealthStatus } from "@opsora/types";
import { swagger } from "@elysiajs/swagger";
import { Elysia, t } from "elysia";

import { errorHandler } from "@/middleware/error-handler.ts";
import { modules } from "@/modules/index.ts";
import { authHandler } from "@/plugins/auth.ts";
import { buildOpenApiDocumentation } from "@/lib/openapi.ts";
import { corsPlugin } from "@/plugins/cors.ts";

/**
 * The OPSORA API: one Elysia instance composing cross-cutting plugins
 * and every domain module. Kept separate from `index.ts` so it can be
 * imported by tests without binding a port.
 */
export const app = new Elysia()
  .use(corsPlugin)
  .use(errorHandler)
  .use(authHandler)
  // Deliberately outside the ApiResponse envelope: health checks are
  // consumed by Render and uptime probes, which expect a flat body.
  .get("/health", (): HealthStatus => ({ status: "ok" }), {
    response: { 200: t.Object({ status: t.Literal("ok") }) },
    detail: { tags: ["Health"], summary: "Liveness probe" },
  })
  .use(modules)
  .use(
    swagger({ path: "/docs", documentation: await buildOpenApiDocumentation() }),
  );

