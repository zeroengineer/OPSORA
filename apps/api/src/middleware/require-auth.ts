import { Elysia } from "elysia";

import { authPlugin } from "@/plugins/auth.ts";
import { HttpError } from "@/lib/response.ts";

/**
 * Guard for routes that require a signed-in user.
 *
 * The hook is `scoped` so it applies to the module that mounts this
 * plugin — an unscoped hook would stay local to this instance and
 * silently let every request through.
 *
 * Usage: `new Elysia().use(requireAuth).get("/me", ({ user }) => user)`
 */
export const requireAuth = new Elysia({ name: "require-auth" })
  .use(authPlugin)
  .onBeforeHandle({ as: "scoped" }, ({ user }) => {
    if (!user) throw HttpError.unauthorized();
  });
