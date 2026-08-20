import { and, db, desc, eq, ilike, or, schema } from "@opsora/database";
import type { ListVaultQuery } from "@opsora/types";

const { documentFile, documentFileVersion } = schema;
type VaultRow = typeof documentFile.$inferSelect;
type VaultVersionRow = typeof documentFileVersion.$inferSelect;

function buildFilters(filters: Pick<ListVaultQuery, "search" | "category">) {
  const clauses = [];

  if (filters.search) {
    const term = `%${filters.search}%`;
    clauses.push(
      or(ilike(documentFile.name, term), ilike(documentFile.clientName, term)),
    );
  }

  if (filters.category) clauses.push(eq(documentFile.category, filters.category));

  return clauses.length > 0 ? and(...clauses) : undefined;
}

export const documentVaultRepository = {
  async findAll(
    filters: Pick<ListVaultQuery, "search" | "category"> = {},
  ): Promise<VaultRow[]> {
    return db
      .select()
      .from(documentFile)
      .where(buildFilters(filters))
      .orderBy(desc(documentFile.createdAt));
  },

  async findById(id: string): Promise<VaultRow | null> {
    const [row] = await db.select().from(documentFile).where(eq(documentFile.id, id)).limit(1);
    return row ?? null;
  },

  async versionsFor(documentFileId: string): Promise<VaultVersionRow[]> {
    return db
      .select()
      .from(documentFileVersion)
      .where(eq(documentFileVersion.documentFileId, documentFileId))
      .orderBy(desc(documentFileVersion.version));
  },

  async insert(data: typeof documentFile.$inferInsert): Promise<VaultRow> {
    const [row] = await db.insert(documentFile).values(data).returning();
    if (!row) throw new Error("Failed to insert document file");
    return row;
  },

  async insertVersion(
    data: typeof documentFileVersion.$inferInsert,
  ): Promise<VaultVersionRow> {
    const [row] = await db.insert(documentFileVersion).values(data).returning();
    if (!row) throw new Error("Failed to insert document file version");
    return row;
  },

  async updateCurrent(
    id: string,
    data: Partial<typeof documentFile.$inferInsert>,
  ): Promise<VaultRow | null> {
    const [row] = await db
      .update(documentFile)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(documentFile.id, id))
      .returning();
    return row ?? null;
  },

  async recentGenerated(limit: number): Promise<VaultRow[]> {
    return db
      .select()
      .from(documentFile)
      .where(eq(documentFile.source, "generated"))
      .orderBy(desc(documentFile.createdAt))
      .limit(limit);
  },
};
