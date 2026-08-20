import { AUTH_BASE_PATH } from "@opsora/config";
import { getServerEnv } from "@opsora/config/server";
import { db, schema } from "@opsora/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const env = getServerEnv();

/**
 * Server-side Better Auth instance.
 *
 * Imported by `apps/api` only — it reaches the database and must never
 * be bundled for the browser. Frontend code uses `@opsora/auth/client`.
 */
export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: AUTH_BASE_PATH,
  trustedOrigins: [env.WEB_ORIGIN],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    },
  },
});

export type Auth = typeof auth;
export type Session = Auth["$Infer"]["Session"];
export type SessionUser = Session["user"];
