import { PGlite } from "@electric-sql/pglite";
import { getServerEnv } from "@opsora/config/server";
import { drizzle as drizzleNodePg } from "drizzle-orm/node-postgres";
import { migrate as migrateNodePg } from "drizzle-orm/node-postgres/migrator";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

import * as schema from "./schema/index.ts";
import { resolveDatabaseTarget, type DatabaseTarget } from "./target.ts";

/**
 * The common supertype of `NodePgDatabase` and `PgliteDatabase`, so `db` has
 * one type whichever driver backs it. Widening `TQueryResult` only loosens
 * `execute()`'s return — no application code calls it, and every repository
 * builds queries with `select`/`insert`/`update`/`delete`, none of which are
 * parameterised by the result type.
 */
export type Database = PgDatabase<PgQueryResultHKT, typeof schema>;

const MIGRATIONS_FOLDER = fileURLToPath(new URL("../migrations", import.meta.url));

/** Which database this process is talking to. See `resolveDatabaseTarget`. */
export const databaseTarget: DatabaseTarget = resolveDatabaseTarget(
  getServerEnv().DATABASE_URL,
);

let database: Database;
let close: () => Promise<void>;
let runMigrations: () => Promise<void>;

if (databaseTarget.kind === "pglite") {
  // Embedded Postgres. Single connection, single-threaded — requests serialise,
  // so this is a development target, not something to load-test against.
  //
  // PGlite creates its own data directory but not the parents, so a first run
  // against `.data/pglite` fails on the missing `.data`. Create the tree first.
  if (databaseTarget.dataDir !== "memory://") {
    mkdirSync(databaseTarget.dataDir, { recursive: true });
  }

  const client = new PGlite(databaseTarget.dataDir);
  const pglite = drizzlePglite(client, { schema });

  database = pglite;
  close = () => client.close();
  runMigrations = () => migratePglite(pglite, { migrationsFolder: MIGRATIONS_FOLDER });
} else {
  // One pool for the lifetime of the process — the modular monolith runs as a
  // single service, so a single pool is correct.
  const pool = new Pool({
    connectionString: databaseTarget.connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
  });
  const nodePg = drizzleNodePg(pool, { schema });

  database = nodePg;
  close = () => pool.end();
  runMigrations = () => migrateNodePg(nodePg, { migrationsFolder: MIGRATIONS_FOLDER });
}

export const db = database;

/** Close the connection during graceful shutdown. PGlite flushes to disk here. */
export async function closeDatabase(): Promise<void> {
  await close();
}

/** Idempotent — Drizzle records applied migrations in `__drizzle_migrations`. */
export async function migrateDatabase(): Promise<void> {
  await runMigrations();
}
