import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./users.ts";

export const documentSourceEnum = pgEnum("document_source", [
  "generated",
  "uploaded",
]);

/** A reusable markdown document template with {{variable}} tokens. */
export const documentTemplate = pgTable("document_template", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  version: integer("version").notNull().default(1),
  body: text("body").notNull(),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * A vault entry — either generated from a template or manually uploaded.
 * `storageKey`/`currentVersion` always mirror the latest version; prior
 * versions are snapshotted into `documentFileVersion`.
 */
export const documentFile = pgTable(
  "document_file",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    source: documentSourceEnum("source").notNull(),
    clientName: text("client_name"),
    linkedTo: text("linked_to"),
    storageKey: text("storage_key").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    sourceTemplateId: uuid("source_template_id").references(
      () => documentTemplate.id,
      { onDelete: "set null" },
    ),
    variablesUsed: jsonb("variables_used").$type<Record<string, string>>(),
    currentVersion: integer("current_version").notNull().default(1),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("document_file_category_idx").on(table.category),
    index("document_file_source_idx").on(table.source),
  ],
);

export const documentFileVersion = pgTable(
  "document_file_version",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentFileId: uuid("document_file_id")
      .notNull()
      .references(() => documentFile.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    description: text("description").notNull(),
    storageKey: text("storage_key").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("document_file_version_file_idx").on(table.documentFileId)],
);

export type DocumentTemplate = typeof documentTemplate.$inferSelect;
export type NewDocumentTemplate = typeof documentTemplate.$inferInsert;
export type DocumentFile = typeof documentFile.$inferSelect;
export type NewDocumentFile = typeof documentFile.$inferInsert;
export type DocumentFileVersion = typeof documentFileVersion.$inferSelect;
