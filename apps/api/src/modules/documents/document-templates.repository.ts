import { db, desc, eq, schema } from "@opsora/database";
import type { CreateTemplateInput, UpdateTemplateInput } from "@opsora/types";

const { documentTemplate } = schema;
type TemplateRow = typeof documentTemplate.$inferSelect;

export const documentTemplatesRepository = {
  async findAll(): Promise<TemplateRow[]> {
    return db.select().from(documentTemplate).orderBy(desc(documentTemplate.updatedAt));
  },

  async findById(id: string): Promise<TemplateRow | null> {
    const [row] = await db
      .select()
      .from(documentTemplate)
      .where(eq(documentTemplate.id, id))
      .limit(1);
    return row ?? null;
  },

  async insert(
    input: CreateTemplateInput & { createdBy: string },
  ): Promise<TemplateRow> {
    const [row] = await db
      .insert(documentTemplate)
      .values({
        name: input.name,
        category: input.category,
        body: input.body,
        createdBy: input.createdBy,
      })
      .returning();
    if (!row) throw new Error("Failed to insert document template");
    return row;
  },

  async update(
    id: string,
    input: UpdateTemplateInput,
    nextVersion: number,
  ): Promise<TemplateRow | null> {
    const [row] = await db
      .update(documentTemplate)
      .set({ ...input, version: nextVersion, updatedAt: new Date() })
      .where(eq(documentTemplate.id, id))
      .returning();
    return row ?? null;
  },
};
