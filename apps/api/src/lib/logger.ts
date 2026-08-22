/**
 * Re-exported from `@opsora/utils` so `packages/auth` can log through the same
 * format. Kept as a local module because every call site in this app imports
 * `@/lib/logger.ts`.
 */
export { logger } from "@opsora/utils";
