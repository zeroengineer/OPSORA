import { AUTH_BASE_PATH } from "@opsora/config";
import { auth } from "@opsora/auth";
import { Elysia } from "elysia";

/**
 * Mounts Better Auth's fetch handler and exposes the resolved session
 * to every downstream route via `derive`.
 */
export const authPlugin = new Elysia({ name: "auth" })
  .all(`${AUTH_BASE_PATH}/*`, ({ request }) => auth.handler(request))
  .derive({ as: "global" }, async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    return {
      session: session?.session ?? null,
      user: session?.user ?? null,
    };
  });
