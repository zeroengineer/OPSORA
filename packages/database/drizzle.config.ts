import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Drizzle Kit scripts load it from apps/api/.env — " +
      "copy apps/api/.env.example to apps/api/.env first.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
});
