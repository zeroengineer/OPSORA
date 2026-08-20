export { closeDatabase, db, type Database } from "./client.ts";
export * as schema from "./schema/index.ts";
export * from "./schema/index.ts";

// Re-exported so consumers can build queries without a direct drizzle-orm dependency.
export {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lt,
  lte,
  or,
  sql,
} from "drizzle-orm";
