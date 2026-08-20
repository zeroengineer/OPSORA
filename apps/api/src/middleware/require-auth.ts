import { Elysia } from "elysia";

import { authPlugin } from "@/plugins/auth.ts";
import { HttpError } from "@/lib/response.ts";

/**
 * Guard for routes that require a signed-in user.
 *
 * Usage: `new Elysia().use(requireAuth).get("/me", ({ user }) => user)`
 */
export const requireAuth = new Elysia({ name: "require-auth" })
  .use(authPlugin)
  .onBeforeHandle(({ user }) => {
    if (!user) throw HttpError.unauthorized();
  });
