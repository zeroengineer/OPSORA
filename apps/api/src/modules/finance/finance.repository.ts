import { and, db, desc, eq, gte, ilike, lt, or, schema } from "@opsora/database";
import type { ListTransactionsQuery } from "@opsora/types";

const { financeTransaction } = schema;
type FinanceTransactionRow = typeof financeTransaction.$inferSelect;

function monthRange(month: string): { start: Date; end: Date } {
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;
  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 1));
  return { start, end };
}

function buildFilters(filters: Pick<ListTransactionsQuery, "type" | "search" | "month">) {
  const clauses = [];

  if (filters.type) clauses.push(eq(financeTransaction.type, filters.type));

  if (filters.search) {
    const term = `%${filters.search}%`;
    clauses.push(
      or(
        ilike(financeTransaction.description, term),
        ilike(financeTransaction.category, term),
      ),
    );
  }

  if (filters.month) {
    const { start, end } = monthRange(filters.month);
    clauses.push(
      and(gte(financeTransaction.occurredOn, start), lt(financeTransaction.occurredOn, end)),
    );
  }

  return clauses.length > 0 ? and(...clauses) : undefined;
}

/** Data access for the finance module. All Drizzle queries live here. */
export const financeRepository = {
  /** All matching rows, ascending by date — callers compute running balance and paginate in-memory. */
  async findAllAscending(
    filters: Pick<ListTransactionsQuery, "type" | "search" | "month"> = {},
  ): Promise<FinanceTransactionRow[]> {
    return db
      .select()
      .from(financeTransaction)
      .where(buildFilters(filters))
      .orderBy(financeTransaction.occurredOn);
  },

  async insert(
    data: typeof financeTransaction.$inferInsert,
  ): Promise<FinanceTransactionRow> {
    const [row] = await db.insert(financeTransaction).values(data).returning();
    if (!row) throw new Error("Failed to insert finance transaction");
    return row;
  },

  async recent(limit: number): Promise<FinanceTransactionRow[]> {
    return db
      .select()
      .from(financeTransaction)
      .orderBy(desc(financeTransaction.createdAt))
      .limit(limit);
  },
};
