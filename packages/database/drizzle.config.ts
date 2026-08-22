import { defineConfig } from "drizzle-kit";

import { resolveDatabaseTarget } from "./src/target.ts";

/** Matches the runtime default in `@opsora/config/server`. */
const DEFAULT_DATABASE_URL = "file:./.data/pglite";

/*
 * `process.cwd()` is passed explicitly rather than relying on the resolver's
 * package-root default: drizzle-kit bundles this config, which can rewrite
 * `import.meta.url`. The db:* scripts always run from `packages/database`, so
 * cwd and the package root are the same directory here.
 */
const target = resolveDatabaseTarget(
  process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
  process.cwd(),
);

const common = {
  schema: "./src/schema/index.ts",
  out: "./migrations",
  strict: true,
  verbose: true,
} as const;

/*
 * Two separate `defineConfig` calls, not one call with a ternary argument:
 * drizzle-kit's `Config` is a discriminated union and will not narrow through
 * a ternary in argument position.
 */
export default target.kind === "pglite"
  ? defineConfig({
      ...common,
      dialect: "postgresql",
      driver: "pglite",
      dbCredentials: { url: target.dataDir },
    })
  : defineConfig({
      ...common,
      dialect: "postgresql",
      dbCredentials: { url: target.connectionString },
    });
