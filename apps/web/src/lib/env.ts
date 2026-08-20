/**
 * Frontend environment access.
 *
 * Vite statically replaces `import.meta.env.*` at build time, so these
 * must be read as literal property accesses rather than dynamically.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  appUrl: import.meta.env.VITE_APP_URL || "http://localhost:5173",
} as const;
