import type { ElysiaSwaggerConfig } from "@elysiajs/swagger";
import { auth } from "@opsora/auth";
import { APP_NAME, AUTH_BASE_PATH } from "@opsora/config";
import { getServerEnv } from "@opsora/config/server";

type Documentation = NonNullable<ElysiaSwaggerConfig["documentation"]>;
type Paths = NonNullable<Documentation["paths"]>;
type Components = NonNullable<Documentation["components"]>;

/*
 * Better Auth generates OpenAPI 3.1 fragments; `@elysiajs/swagger` types its
 * document against `openapi-types`' 3.0 definitions. The two describe the same
 * JSON — 3.1 is simply looser about a few fields (optional `parameters.name`,
 * richer `properties`) — so the objects are structurally valid where they land
 * and Scalar renders them. These two aliases mark the exact boundary where that
 * version gap is crossed, rather than scattering casts through the merge.
 */
type GeneratedPathItem = Paths[string];
type GeneratedSchemas = NonNullable<Components["schemas"]>;
type GeneratedSecuritySchemes = NonNullable<Components["securitySchemes"]>;

const AUTH_TAG = "Auth";

/**
 * Rendered as the reference's introduction, above the endpoint list. Markdown —
 * this is the first thing anyone reads, so it answers "how do I call this?"
 * rather than restating the title.
 */
const INTRODUCTION = `
Business management platform API — a modular monolith covering clients, sales,
finance, documents and knowledge.

## Authentication

Every endpoint except \`/health\` and \`/api/auth/*\` requires a session cookie.

To get one from this page, send **\`POST /api/auth/sign-up/email\`** (or
**\`sign-in/email\`**) below. The browser stores the cookie and every later
request from this tab carries it automatically — there is no token to copy.

Passwords must be at least 10 characters.

## Responses

Business endpoints return a consistent envelope:

\`\`\`jsonc
{ "success": true,  "data": { /* ... */ } }
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
\`\`\`

\`/health\` and the file download sit outside it — probes and binaries expect a
flat body. The \`/api/auth/*\` endpoints use Better Auth's own shapes.

## Modules

Finance, Documents, Document Vault, Dashboard and Search are implemented.
Clients, Sales and Knowledge Base are specified but return
\`not-implemented\` until their schemas land.
`;

const base: Documentation = {
  info: {
    title: `${APP_NAME} API`,
    version: "0.1.0",
    description: INTRODUCTION,
  },
  /*
   * Stated explicitly so the reference shows which host it is calling and the
   * "Test Request" button targets the right origin. Better Auth's own
   * `servers` entry is dropped in the merge below — it points at the auth base
   * path, which would misdirect every other route.
   */
  servers: [
    {
      url: getServerEnv().BETTER_AUTH_URL,
      description: "This deployment",
    },
  ],
  tags: [
    {
      name: AUTH_TAG,
      description:
        "Sessions, registration and password reset, served by Better Auth. " +
        "Social sign-in and email-verification endpoints are part of Better Auth's " +
        "surface and are listed here, but only function once a provider or mail " +
        "transport is configured — this deployment runs email and password only.",
    },
    { name: "Health" },
    { name: "Clients" },
    { name: "Sales" },
    { name: "Finance" },
    { name: "Documents" },
    { name: "Document Vault" },
    { name: "Knowledge Base" },
    { name: "Dashboard" },
    { name: "Search" },
  ],
};

/**
 * Better Auth is mounted as a catch-all route, so Elysia can see no schema for
 * it and it would otherwise be absent from the reference entirely. Its own
 * `openAPI()` plugin describes those endpoints; this folds them into the same
 * document Scalar renders at /docs, so there is one reference rather than two.
 */
export async function buildOpenApiDocumentation(): Promise<Documentation> {
  const authSchema = await auth.api.generateOpenAPISchema();

  const paths: Paths = {};

  for (const [path, item] of Object.entries(authSchema.paths)) {
    for (const operation of Object.values(item)) {
      // Generated operations are all tagged "Default"; regroup them under Auth.
      if (operation && typeof operation === "object" && "tags" in operation) {
        (operation as { tags: string[] }).tags = [AUTH_TAG];
      }
    }

    // Generated paths are relative to Better Auth's basePath.
    paths[`${AUTH_BASE_PATH}${path}`] = item as GeneratedPathItem;
  }

  return {
    ...base,
    paths,
    /*
     * `authSchema.servers` is deliberately dropped: it points at the auth base
     * path, which would make Scalar resolve every other route against it too.
     * With no `servers`, Scalar uses the page origin, which is correct for all
     * of them.
     */
    components: {
      schemas: authSchema.components.schemas as GeneratedSchemas,
      securitySchemes: authSchema.components
        .securitySchemes as GeneratedSecuritySchemes,
    },
  };
}
