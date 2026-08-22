import {
  AUTH_BASE_PATH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@opsora/config";
import { getServerEnv } from "@opsora/config/server";
import { db, schema } from "@opsora/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { mailer } from "./mailer.ts";

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
  /*
   * Load-bearing for password reset, not just for CORS: this is the list
   * `originCheck` validates the `redirectTo` of a reset request against.
   */
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
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
    resetPasswordTokenExpiresIn: 60 * 60,
    /*
     * A reset means the old password should be treated as compromised, so
     * every other session goes with it. Note the interaction with
     * `session.cookieCache` below: other devices stay signed in until their
     * cached session lapses.
     */
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await mailer.send({
        to: user.email,
        subject: "Reset your OPSORA password",
        body:
          `Open this link to choose a new password. It expires in one hour.\n\n${url}\n\n` +
          "If you did not ask for this, no action is needed — your password has not changed.",
        meta: { kind: "password-reset", userId: user.id },
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    /*
     * Verify a signed cookie instead of querying `session` + `user` on every
     * request. The trade is that revocation is not immediate — a sign-out
     * elsewhere, or a password reset, leaves other tabs authenticated for up
     * to `maxAge`. Pass `disableCookieCache: true` to `getSession` for any
     * call that needs the live answer.
     */
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  advanced: {
    defaultCookieAttributes: {
      /*
       * `lax` is correct while the API and web app share a site (localhost
       * across ports, or one domain in production). Split them across
       * registrable domains and this must become `sameSite: "none"` with
       * `secure: true`.
       */
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    },
  },
  /*
   * Generates the OpenAPI description of the auth endpoints, which
   * `apps/api/src/lib/openapi.ts` folds into the Scalar document at /docs.
   * `disableDefaultReference` suppresses Better Auth's own second reference
   * page — one API reference, not two.
   */
  plugins: [openAPI({ disableDefaultReference: true })],
});

export type Auth = typeof auth;
export type Session = Auth["$Infer"]["Session"];
export type SessionUser = Session["user"];
