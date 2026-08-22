import { isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * `packages/database/` — relative data directories resolve against this rather
 * than `process.cwd()`, which differs by caller: `bun run db:studio` runs from
 * this package, but `turbo run dev` runs the API from `apps/api`. Resolving
 * against the package root means both open the same database.
 */
const PACKAGE_ROOT = fileURLToPath(new URL("../", import.meta.url));

export type DatabaseTarget =
  | { kind: "pglite"; dataDir: string }
  | { kind: "postgres"; connectionString: string };

const POSTGRES_SCHEMES = ["postgres://", "postgresql://"];
const IN_MEMORY = "memory://";

/**
 * Interprets `DATABASE_URL`. Three accepted forms:
 *
 * - `postgres://…` / `postgresql://…` — a real server, passed through untouched.
 * - `memory://` — PGlite held in memory, discarded on exit. Useful for tests.
 * - anything else (`file:./.data/pglite`, `pglite:/tmp/db`, `./.data/pglite`)
 *   — PGlite persisted to that directory.
 *
 * Shared by the runtime client and `drizzle.config.ts` so the two can never
 * disagree about which database they are pointed at.
 */
export function resolveDatabaseTarget(
  url: string,
  baseDir: string = PACKAGE_ROOT,
): DatabaseTarget {
  const trimmed = url.trim();

  if (POSTGRES_SCHEMES.some((scheme) => trimmed.startsWith(scheme))) {
    return { kind: "postgres", connectionString: trimmed };
  }

  if (trimmed === IN_MEMORY) {
    return { kind: "pglite", dataDir: IN_MEMORY };
  }

  // Tolerate `file:./x`, `file:///abs/x`, `pglite://./x` and a bare path alike.
  const withoutScheme = trimmed.replace(/^(?:pglite|file):/, "");
  const path = withoutScheme.replace(/^\/\//, "");

  return {
    kind: "pglite",
    dataDir: isAbsolute(path) ? path : resolve(baseDir, path),
  };
}
