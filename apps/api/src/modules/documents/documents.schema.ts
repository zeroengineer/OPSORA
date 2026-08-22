import { t } from "elysia";

/** Runtime/OpenAPI mirrors of the contracts re-exported by documents.types.ts. */

/** Mirrors `TemplateDto`. */
export const templateSchema = t.Object({
  id: t.String(),
  name: t.String(),
  category: t.String(),
  version: t.Number(),
  body: t.String(),
  createdAt: t.String(),
  updatedAt: t.String(),
});

/** Mirrors `VaultFileVersionDto`. */
const vaultVersionSchema = t.Object({
  id: t.String(),
  version: t.Number(),
  description: t.String(),
  sizeBytes: t.Number(),
  createdAt: t.String(),
});

/** Mirrors `VaultFileDto`. */
export const vaultFileSchema = t.Object({
  id: t.String(),
  name: t.String(),
  category: t.String(),
  source: t.Union([t.Literal("generated"), t.Literal("uploaded")]),
  clientName: t.Union([t.String(), t.Null()]),
  linkedTo: t.Union([t.String(), t.Null()]),
  mimeType: t.String(),
  sizeBytes: t.Number(),
  currentVersion: t.Number(),
  sourceTemplateId: t.Union([t.String(), t.Null()]),
  variablesUsed: t.Union([t.Record(t.String(), t.String()), t.Null()]),
  createdAt: t.String(),
  updatedAt: t.String(),
  versions: t.Array(vaultVersionSchema),
});
