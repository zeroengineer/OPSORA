import { z } from "zod";

/**
 * Server-side environment contract.
 *
 * This module must never be imported from browser code — use
 * `import.meta.env` in `apps/web` instead. Parsing is lazy so that
 * importing the package (for types, or from tooling) does not require
 * a fully configured environment.
 *
 * `DATABASE_URL` accepts three forms:
 *   - `postgres://…` / `postgresql://…` — a real Postgres server
 *   - `file:./.data/pglite`             — embedded PGlite, persisted to disk
 *   - `memory://`                       — embedded PGlite, discarded on exit
 */

/**
 * Embedded PGlite under `packages/database/`. Development-only — the guard
 * below refuses to let it through in production.
 */
export const DEFAULT_DATABASE_URL = "file:./.data/pglite";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(3000),
  WEB_ORIGIN: z.url().default("http://localhost:5173"),

  DATABASE_URL: z.string().min(1).default(DEFAULT_DATABASE_URL),

  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.url(),

  R2_BUCKET_NAME: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_ENDPOINT: z.url().optional(),
}).superRefine((value, ctx) => {
  if (value.NODE_ENV === "production" && value.DATABASE_URL === DEFAULT_DATABASE_URL) {
    ctx.addIssue({
      code: "custom",
      path: ["DATABASE_URL"],
      message:
        "must be set explicitly in production — the embedded PGlite default is development-only",
    });
  }
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Treat empty strings as absent.
 *
 * `.env` files commonly carry placeholder keys with no value (`R2_ENDPOINT=`),
 * which would otherwise fail optional URL validation instead of being skipped.
 */
function readRawEnv(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] =>
        entry[1] !== undefined && entry[1] !== "",
    ),
  );
}

let cached: ServerEnv | undefined;

/** Parse and cache the server environment, failing loudly on misconfiguration. */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse(readRawEnv());

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Invalid server environment configuration:\n${issues}\n\n` +
        "Copy apps/api/.env.example to apps/api/.env and fill in the values.",
    );
  }

  cached = parsed.data;
  return cached;
}

/** True when every Cloudflare R2 variable is present. */
export function hasR2Config(env: ServerEnv = getServerEnv()): boolean {
  return Boolean(
    env.R2_BUCKET_NAME &&
      env.R2_ACCESS_KEY_ID &&
      env.R2_SECRET_ACCESS_KEY &&
      env.R2_ENDPOINT,
  );
}
