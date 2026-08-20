import { createAuthClient } from "better-auth/react";

export interface AuthClientOptions {
  /** Base URL of the OPSORA API, e.g. `http://localhost:3000`. */
  baseURL: string;
}

/**
 * Browser-safe Better Auth client factory.
 *
 * Kept as a factory so the frontend supplies its own `VITE_API_URL`
 * rather than this package reaching for server environment variables.
 */
export function createOpsoraAuthClient({ baseURL }: AuthClientOptions) {
  return createAuthClient({
    baseURL,
    fetchOptions: { credentials: "include" },
  });
}

export type OpsoraAuthClient = ReturnType<typeof createOpsoraAuthClient>;
