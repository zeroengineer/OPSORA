import type { HealthStatus } from "@opsora/types";
import { Elysia } from "elysia";

import { errorHandler } from "@/middleware/error-handler.ts";
import { modules } from "@/modules/index.ts";
import { authPlugin } from "@/plugins/auth.ts";
import { corsPlugin } from "@/plugins/cors.ts";

/**
 * The OPSORA API: one Elysia instance composing cross-cutting plugins
 * and every domain module. Kept separate from `index.ts` so it can be
 * imported by tests without binding a port.
 */
export const app = new Elysia()
  .use(corsPlugin)
  .use(errorHandler)
  .use(authPlugin)
  // Deliberately outside the ApiResponse envelope: health checks are
  // consumed by Render and uptime probes, which expect a flat body.
  .get("/health", (): HealthStatus => ({ status: "ok" }))
  .use(modules);

export type App = typeof app;
