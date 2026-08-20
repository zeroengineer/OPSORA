# OPSORA

Business management platform — clients, sales, finance, documents and knowledge base.

Built as a **modular monolith** in a Bun + Turborepo monorepo: one React frontend, one
ElysiaJS backend, and shared workspace packages. There are no microservices, and adding a
business domain means adding a module — not a service.

---

## Architecture

```
┌──────────────┐         HTTP + cookies        ┌──────────────┐
│  apps/web    │ ────────────────────────────► │  apps/api    │
│ React + Vite │ ◄──────────────────────────── │Bun + ElysiaJS│
└──────────────┘                               └──────┬───────┘
                                                      │ Drizzle ORM
                                                      ▼
                                               ┌──────────────┐
                                               │  PostgreSQL  │
                                               └──────────────┘
```

**Backend** is domain-driven: every business capability is a self-contained module under
`apps/api/src/modules/<domain>/` owning its routes, service, repository and types. There is
no global `controllers/ services/ repositories/` split — see `modules/clients` for the
reference pattern.

**Frontend** is feature-based: each feature under `apps/web/src/features/<feature>/` owns
its pages and components. Shared UI stays in `apps/web/src/components/`; there is
deliberately no shared UI package.

**Shared packages** are consumed as TypeScript source (no build step), so a change in a
package is picked up by both apps immediately.

### Package boundaries

| Package | Purpose | Safe in browser |
|---|---|---|
| `@opsora/database` | Postgres pool + Drizzle schema | No |
| `@opsora/auth` | Better Auth server config | No |
| `@opsora/auth/client` | Better Auth browser client | Yes |
| `@opsora/config` | Shared constants | Yes |
| `@opsora/config/server` | Validated server env | No |
| `@opsora/types` | Shared API/domain types | Yes |
| `@opsora/utils` | Pure helpers | Yes |

Server-only packages must never be imported from `apps/web` — they would pull `pg` into the
browser bundle.

---

## Monorepo structure

```
opsora/
├── apps/
│   ├── web/                    # React + Vite + Tailwind frontend
│   │   └── src/
│   │       ├── components/     # common/ layout/ modules/
│   │       ├── features/       # dashboard, clients, sales, finance, documents, knowledge-base
│   │       ├── hooks/  lib/  routes/  services/  stores/  types/
│   │       ├── App.tsx
│   │       └── main.tsx
│   └── api/                    # Bun + ElysiaJS backend
│       └── src/
│           ├── modules/        # one folder per business domain
│           ├── middleware/  plugins/  config/  lib/
│           ├── app.ts
│           └── index.ts
├── packages/
│   ├── database/               # PostgreSQL + Drizzle ORM + Drizzle Kit
│   ├── auth/                   # Better Auth configuration
│   ├── types/                  # Shared TypeScript types
│   ├── config/                 # Shared configuration + env validation
│   └── utils/                  # Shared utilities
├── tooling/
│   ├── eslint/                 # Shared flat ESLint configs
│   └── typescript/             # Shared tsconfig bases
├── package.json
├── turbo.json
├── bun.lock
├── bunfig.toml
├── .env.example
└── README.md
```

---

## Prerequisites

- **Bun** ≥ 1.2 (this repo pins `1.3.11`) — <https://bun.sh>
- **PostgreSQL** ≥ 14, reachable locally
- **Node.js** ≥ 20.19 (Vite 8 requires it for some tooling paths)

> This repo uses Bun exclusively. Do not use npm, pnpm or Yarn — they will produce a
> conflicting lockfile.

---

## Installation

```bash
git clone <repository-url> opsora
cd opsora
bun install
```

---

## Environment setup

Environment variables are **scoped per app**. The root `.env.example` documents everything;
each app reads its own file.

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

**`apps/api/.env`**

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | `postgresql://user:pass@localhost:5432/opsora` |
| `BETTER_AUTH_SECRET` | yes | ≥ 32 chars — generate with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | yes | Public URL of the API, e.g. `http://localhost:3000` |
| `PORT` | no | Defaults to `3000` |
| `WEB_ORIGIN` | no | CORS origin, defaults to `http://localhost:5173` |
| `R2_BUCKET_NAME` | no | Cloudflare R2 — required once file storage is implemented |
| `R2_ACCESS_KEY_ID` | no | |
| `R2_SECRET_ACCESS_KEY` | no | |
| `R2_ENDPOINT` | no | |

**`apps/web/.env`**

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | yes | Base URL of the API |
| `VITE_APP_URL` | yes | Public URL of this app |

The API validates its environment at startup and exits with a readable message listing every
missing or malformed variable. Empty values (`R2_ENDPOINT=`) are treated as unset.

Drizzle Kit reads `DATABASE_URL` from `apps/api/.env`, so the database connection string has
a single source of truth.

### Database setup

```bash
createdb opsora          # or point DATABASE_URL at an existing database
bun run db:migrate       # applies migrations/ — creates the Better Auth tables
```

---

## Development

```bash
bun run dev
```

Starts both apps together:

- Web → <http://localhost:5173>
- API → <http://localhost:3000>

The dashboard shows a live API health badge, so you can confirm connectivity at a glance.

Run one app on its own:

```bash
bun run dev:web
bun run dev:api
```

---

## Commands

| Command | Description |
|---|---|
| `bun run dev` | Start web + API in watch mode |
| `bun run dev:web` / `dev:api` | Start a single app |
| `bun run build` | Build both apps (`apps/web/dist`, `apps/api/dist`) |
| `bun run lint` | ESLint across all workspaces |
| `bun run lint:fix` | ESLint with autofix |
| `bun run typecheck` | `tsc --noEmit` across all workspaces |
| `bun run db:generate` | Generate a migration from schema changes |
| `bun run db:migrate` | Apply pending migrations |
| `bun run db:push` | Push schema directly (development only) |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run clean` | Remove build output and `node_modules` |

> `db:push` diffs the schema against the live database and will drop tables it does not know
> about. Only point it at a database dedicated to OPSORA.

---

## API

| Endpoint | Auth | Description |
|---|---|---|
| `GET /health` | public | `{"status":"ok"}` — for uptime probes |
| `ALL /api/auth/*` | public | Better Auth (sign-up, sign-in, session) |
| `GET /api/clients` | required | Reference module; returns an empty page |
| `GET /api/{sales,finance,documents,knowledge-base}` | required | Module placeholders |

Business responses use a consistent envelope:

```jsonc
{ "success": true,  "data": { /* ... */ } }
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

`/health` deliberately sits outside the envelope so probes get a flat body.

---

## Adding a module

1. Add the schema in `packages/database/src/schema/<domain>.ts`, then `bun run db:generate`.
2. Create `apps/api/src/modules/<domain>/` with `routes`, `service`, `repository` and
   `types` files — copy the shape of `modules/clients`.
3. Register it in `apps/api/src/modules/index.ts`.
4. Add the frontend feature under `apps/web/src/features/<domain>/` and a route in
   `apps/web/src/routes/router.tsx`.

Protect routes with the `requireAuth` middleware:

```ts
new Elysia({ prefix: "/invoices" })
  .use(requireAuth)
  .get("/", ({ user }) => success(user));
```

---

## Building

```bash
bun run build
```

- `apps/web/dist` — static assets, deploy to any static host or CDN
- `apps/api/dist` — bundled Bun server

---

## Deployment (Render + Cloudflare)

Deploy as two Render services from this one repository.

**API — Render Web Service**

| Setting | Value |
|---|---|
| Runtime | Bun (or Docker) |
| Root directory | repository root |
| Build command | `bun install && bun run build --filter=@opsora/api` |
| Start command | `cd apps/api && bun run start` |
| Health check path | `/health` |

Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `WEB_ORIGIN` and the `R2_*`
variables in the Render dashboard. Run `bun run db:migrate` as a release step or manually
before the first deploy.

**Web — Render Static Site**

| Setting | Value |
|---|---|
| Build command | `bun install && bun run build --filter=@opsora/web` |
| Publish directory | `apps/web/dist` |
| Rewrite rule | `/*` → `/index.html` (required for client-side routing) |

Set `VITE_API_URL` and `VITE_APP_URL` at build time — Vite inlines them into the bundle.

**Cloudflare** handles DNS, SSL, CDN and WAF in front of both services. Keep `WEB_ORIGIN`
and `BETTER_AUTH_URL` pointed at the public Cloudflare hostnames so CORS and auth cookies
resolve correctly.

**Cloudflare R2** provides file storage for the documents module. Create a bucket, issue an
S3-compatible API token, and fill in the `R2_*` variables.

---

## Tech stack

| Concern | Choice |
|---|---|
| Monorepo | Turborepo 2 |
| Runtime / package manager | Bun 1.3 |
| Frontend | React 19, Vite 8, TypeScript |
| Styling | Tailwind CSS 4 (CSS-first — no `tailwind.config.js`) |
| Routing | React Router 8 |
| Client state | Zustand 5 |
| Server state | TanStack Query 5 |
| Backend | Bun + ElysiaJS 1.4 |
| Auth | Better Auth 1.7 |
| Database | PostgreSQL + Drizzle ORM 0.45 |
| File storage | Cloudflare R2 |
| Hosting | Render |
| DNS / SSL / CDN | Cloudflare |

TypeScript is pinned to **6.0.3**. TypeScript 7 is published as `latest`, but
`typescript-eslint` does not support it yet and type-aware linting would break.
