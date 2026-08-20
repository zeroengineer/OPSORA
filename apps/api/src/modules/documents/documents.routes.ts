import { Elysia, t } from "elysia";

import { success } from "@/lib/response.ts";
import { requireAuth } from "@/middleware/require-auth.ts";

import { documentTemplatesService } from "./document-templates.service.ts";
import { documentVaultService } from "./document-vault.service.ts";

export const documentsRoutes = new Elysia({ prefix: "/documents" })
  .use(requireAuth)

  // Templates
  .get(
    "/templates",
    async () => success(await documentTemplatesService.list()),
    { detail: { tags: ["Documents"], summary: "List document templates" } },
  )
  .get(
    "/templates/:id",
    async ({ params }) => success(await documentTemplatesService.getById(params.id)),
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Documents"], summary: "Get a document template" },
    },
  )
  .post(
    "/templates",
    async ({ body, user }) => success(await documentTemplatesService.create(body, user!.id)),
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 150 }),
        category: t.String({ minLength: 1, maxLength: 100 }),
        body: t.String({ minLength: 1 }),
      }),
      detail: { tags: ["Documents"], summary: "Create a document template" },
    },
  )
  .patch(
    "/templates/:id",
    async ({ params, body }) => success(await documentTemplatesService.update(params.id, body)),
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1, maxLength: 150 })),
        category: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
        body: t.Optional(t.String({ minLength: 1 })),
      }),
      detail: {
        tags: ["Documents"],
        summary: "Update a document template (bumps its version)",
      },
    },
  )

  // Vault
  .get(
    "/vault",
    async ({ query }) => success(await documentVaultService.list(query)),
    {
      query: t.Object({
        search: t.Optional(t.String()),
        category: t.Optional(t.String()),
      }),
      detail: { tags: ["Document Vault"], summary: "List vault documents" },
    },
  )
  .get(
    "/vault/:id",
    async ({ params }) => success(await documentVaultService.getById(params.id)),
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Document Vault"], summary: "Get a vault document with version history" },
    },
  )
  .get(
    "/vault/:id/download",
    async ({ params, set }) => {
      const file = await documentVaultService.download(params.id);
      set.headers["Content-Type"] = file.contentType;
      set.headers["Content-Disposition"] = `attachment; filename="${file.fileName}"`;
      return file.data;
    },
    {
      params: t.Object({ id: t.String() }),
      detail: { tags: ["Document Vault"], summary: "Download a vault document" },
    },
  )
  .post(
    "/vault/generate",
    async ({ body, user }) =>
      success(await documentVaultService.generateFromTemplate(body, user!.id)),
    {
      body: t.Object({
        templateId: t.String(),
        name: t.String({ minLength: 1, maxLength: 200 }),
        clientName: t.Optional(t.String({ maxLength: 200 })),
        variables: t.Record(t.String(), t.String()),
      }),
      detail: { tags: ["Document Vault"], summary: "Generate a document from a template" },
    },
  )
  .post(
    "/vault/:id/regenerate",
    async ({ params, body, user }) =>
      success(await documentVaultService.regenerate(params.id, body, user!.id)),
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({ variables: t.Record(t.String(), t.String()) }),
      detail: { tags: ["Document Vault"], summary: "Regenerate a document with updated variables" },
    },
  )
  .post(
    "/vault/upload",
    async ({ body, user }) => success(await documentVaultService.upload(body, user!.id)),
    {
      body: t.Object({
        file: t.File(),
        name: t.String({ minLength: 1 }),
        category: t.String({ minLength: 1 }),
        clientName: t.Optional(t.String()),
      }),
      detail: { tags: ["Document Vault"], summary: "Upload a document" },
    },
  );
