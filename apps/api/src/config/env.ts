import { getServerEnv } from "@opsora/config/server";

/** Validated server environment, parsed once at startup. */
export const env = getServerEnv();

export const isProduction = env.NODE_ENV === "production";
