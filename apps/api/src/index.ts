import { closeDatabase } from "@opsora/database";

import { app } from "@/app.ts";
import { env } from "@/config/env.ts";
import { logger } from "@/lib/logger.ts";

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
