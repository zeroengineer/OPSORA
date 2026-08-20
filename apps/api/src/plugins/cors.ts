import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { env } from "@/config/env.ts";

/**
 * Allows the Vite dev server (and the deployed web app) to call the API
 * with cookies attached, which Better Auth sessions require.
 */
export const corsPlugin = new Elysia({ name: "cors" }).use(
  cors({
    origin: [new URL(env.WEB_ORIGIN).host],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
