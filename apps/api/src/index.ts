import { closeDatabase, databaseTarget, migrateDatabase } from "@opsora/database";

import { app } from "@/app.ts";
import { env } from "@/config/env.ts";
import { logger } from "@/lib/logger.ts";

/*
 * The embedded database migrates itself on boot, so a fresh clone is
 * `bun install && bun dev` with no setup step. A real Postgres does not: it is
 * shared, and auto-migrating one on process start is how deploys corrupt data.
 * That case keeps the explicit `bun run db:migrate`.
 */
if (databaseTarget.kind === "pglite") {
  await migrateDatabase();
  logger.info("Database migrations applied", { dataDir: databaseTarget.dataDir });
}

app.listen({ port: env.PORT, hostname: "0.0.0.0" });

logger.info("OPSORA API started", {
  url: `http://localhost:${String(env.PORT)}`,
  env: env.NODE_ENV,
  webOrigin: env.WEB_ORIGIN,
});

async function shutdown(signal: string): Promise<void> {
  logger.info("Shutting down", { signal });
  await app.stop();
  await closeDatabase();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
