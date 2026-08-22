import type { HealthStatus } from "@opsora/types";
import { swagger } from "@elysiajs/swagger";
import { Elysia, t } from "elysia";

import { errorHandler } from "@/middleware/error-handler.ts";
import { modules } from "@/modules/index.ts";
import { authHandler } from "@/plugins/auth.ts";
import { buildOpenApiDocumentation } from "@/lib/openapi.ts";
import { scalarTheme } from "@/lib/scalar-theme.ts";
import { corsPlugin } from "@/plugins/cors.ts";

/** Scalar bundle version served from the CDN by the reference page. */
const SCALAR_VERSION = "1.66.1";

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
    swagger({
      path: "/docs",
      documentation: await buildOpenApiDocumentation(),
      /*
       * Pinned rather than the plugin's `latest`: the reference loads Scalar
       * from a CDN at request time, so an unpinned major would change — or
       * break — this page with no change on our side.
       */
      scalarVersion: SCALAR_VERSION,
      scalarConfig: {
        /*
         * The plugin emits a relative `docs/json`, which resolves wrongly if
         * the page is ever reached at `/docs/`. Absolute is unambiguous.
         */
        spec: { url: "/docs/json" },
        customCss: scalarTheme,
        /*
         * Scalar ships its own faces and applies them by default, which would
         * fight the mono stack in `scalarTheme`. One typeface, everywhere.
         */
        withDefaultFonts: false,
        darkMode: true,
        hideDarkModeToggle: true,
        defaultHttpClient: { targetKey: "shell", clientKey: "curl" },
      },
    }),
  );

