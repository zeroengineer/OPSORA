import { Elysia } from "elysia";

import { sessionPlugin } from "@/plugins/auth.ts";
import { HttpError } from "@/lib/response.ts";

/**
 * Guard for routes that require a signed-in user.
 *
 * `.as("scoped")` lifts both the session derive and the guard out of this
 * instance so they reach whichever module mounts it. Without it the hook stays
 * local and every request passes, and `user` never appears on the route
 * context. `scoped` rather than `global` keeps /health and /docs out of it.
 *
 * Usage: `new Elysia().use(requireAuth).get("/me", ({ user }) => user)`
 */
export const requireAuth = new Elysia({ name: "require-auth" })
  .use(sessionPlugin)
  .onBeforeHandle(({ user }) => {
    if (!user) throw HttpError.unauthorized();
  })
  .as("scoped");
