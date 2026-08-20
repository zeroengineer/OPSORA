import { z } from "zod";

/**
 * Server-side environment contract.
 *
 * This module must never be imported from browser code — use
 * `import.meta.env` in `apps/web` instead. Parsing is lazy so that
 * importing the package (for types, or from tooling) does not require
 * a fully configured environment.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(3000),
  WEB_ORIGIN: z.url().default("http://localhost:5173"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.url(),

  R2_BUCKET_NAME: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_ENDPOINT: z.url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

/** Parse and cache the server environment, failing loudly on misconfiguration. */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse(process.env);

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
