import { getServerEnv } from "@opsora/config/server";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema/index.ts";

/**
 * A single connection pool is shared for the lifetime of the process.
 * The modular monolith runs as one service, so one pool is correct.
 */
const pool = new Pool({
  connectionString: getServerEnv().DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;

/** Close the pool during graceful shutdown. */
export async function closeDatabase(): Promise<void> {
  await pool.end();
}
