import { createOpsoraAuthClient } from "@opsora/auth/client";

import { env } from "@/lib/env.ts";

/** Shared Better Auth browser client, pointed at the OPSORA API. */
export const authClient = createOpsoraAuthClient({ baseURL: env.apiUrl });

export const { signIn, signOut, signUp, useSession } = authClient;
