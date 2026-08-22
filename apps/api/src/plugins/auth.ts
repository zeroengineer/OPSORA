import { AUTH_BASE_PATH } from "@opsora/config";
import { auth } from "@opsora/auth";
import { Elysia } from "elysia";

const handle = ({ request }: { request: Request }) => auth.handler(request);

/*
 * `parse: "none"` hands the untouched Request to Better Auth — Elysia must not
 * consume the body first. `detail.hide` keeps the catch-alls out of the OpenAPI
 * document; the real auth paths are injected from `lib/openapi.ts` instead.
 */
const options = { parse: "none", detail: { hide: true } } as const;

/**
 * Mounts Better Auth's fetch handler.
 *
 * Two routes rather than one: Elysia's `/*` does not match the bare mount path,
 * so `/api/auth` on its own would 404.
 *
 * `.mount()` is deliberately not used — it strips the mount prefix from the
 * forwarded request, which would break Better Auth's own `basePath`.
 *
 * No session derive here: Better Auth resolves its own session internally, so
 * deriving one would double the cost of every sign-in.
 */
export const authHandler = new Elysia({ name: "auth-handler" })
  .all(AUTH_BASE_PATH, handle, options)
  .all(`${AUTH_BASE_PATH}/*`, handle, options);

/**
 * Resolves the session for routes that opt in through `requireAuth`.
 *
 * `scoped`, not `global`: /health and /docs have no reason to touch the
 * session, and the Better Auth routes above resolve their own.
 *
 * `set-cookie` is forwarded because `getSession` refreshes the session cookie
 * cache whenever it falls back to the database — dropping the header would
 * mean re-querying on every request once the cache lapses. Only `set-cookie`:
 * `getSession` also emits `cache-control: no-store`, which must not leak onto
 * API responses.
 */
export const sessionPlugin = new Elysia({ name: "auth-session" }).derive(
  { as: "scoped" },
  async ({ request, set }) => {
    const { headers, response } = await auth.api.getSession({
      headers: request.headers,
      returnHeaders: true,
    });

    const setCookie = headers.getSetCookie();
    if (setCookie.length > 0) set.headers["set-cookie"] = setCookie;

    return {
      session: response?.session ?? null,
      user: response?.user ?? null,
    };
  },
);
