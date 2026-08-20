import type {
  CreateTransactionInput,
  LedgerSummary,
  ListTransactionsQuery,
  TransactionDto,
} from "@opsora/types";
import type { Paginated } from "@opsora/types";
import { buildPaginationMeta, normalizePagination } from "@opsora/utils";

import { HttpError } from "@/lib/response.ts";

import { financeRepository } from "./finance.repository.ts";

type Period = "daily" | "weekly" | "monthly";

const BUCKET_COUNT: Record<Period, number> = { daily: 14, weekly: 8, monthly: 12 };

export interface RangeBucket {
  label: string;
  incomeMinor: number;
  expensesMinor: number;
}

/** Opening balance is fixed at 0 — there is no prior financial history to seed it from. */
const OPENING_BALANCE_MINOR = 0;

function toDto(
  row: Awaited<ReturnType<typeof financeRepository.findAllAscending>>[number],
  runningBalanceMinor: number,
): TransactionDto {
  return {
    id: row.id,
    type: row.type,
    description: row.description,
    category: row.category,
    amountMinor: row.amountMinor,
    occurredOn: row.occurredOn.toISOString(),
    runningBalanceMinor,
    createdAt: row.createdAt.toISOString(),
  };
}

/** Business logic for the finance module. */
export const financeService = {
  async list(query: ListTransactionsQuery): Promise<Paginated<TransactionDto>> {
    const pagination = normalizePagination(query);
    const rows = await financeRepository.findAllAscending(query);

    let balance = OPENING_BALANCE_MINOR;
    const decorated = rows.map((row) => {
      balance += row.type === "in" ? row.amountMinor : -row.amountMinor;
      return toDto(row, balance);
    });

    // Newest-first for the table; running balance on each row still reflects
    // its position in chronological order, computed above.
    const newestFirst = [...decorated].reverse();
    const start = (pagination.page - 1) * pagination.pageSize;
    const page = newestFirst.slice(start, start + pagination.pageSize);

    return { items: page, meta: buildPaginationMeta(pagination, newestFirst.length) };
  },

  async summary(filters: Pick<ListTransactionsQuery, "month"> = {}): Promise<LedgerSummary> {
    const rows = await financeRepository.findAllAscending(filters);

    let incomeMinor = 0;
    let expensesMinor = 0;
    for (const row of rows) {
      if (row.type === "in") incomeMinor += row.amountMinor;
      else expensesMinor += row.amountMinor;
    }

    const netMinor = incomeMinor - expensesMinor;

    return {
      openingBalanceMinor: OPENING_BALANCE_MINOR,
      incomeMinor,
      expensesMinor,
      netMinor,
      closingBalanceMinor: OPENING_BALANCE_MINOR + netMinor,
      transactionCount: rows.length,
    };
  },

  async create(input: CreateTransactionInput, userId: string): Promise<TransactionDto> {
    if (input.amountMinor <= 0) {
      throw HttpError.badRequest("amountMinor must be greater than zero");
    }

    const row = await financeRepository.insert({
      type: input.type,
      description: input.description,
      category: input.category,
      amountMinor: input.amountMinor,
      occurredOn: new Date(input.occurredOn),
      createdBy: userId,
    });

    const summary = await financeService.summary({});
    return toDto(row, summary.closingBalanceMinor);
  },

  /**
   * Bucketed income/expenses for the dashboard hero chart, oldest to newest.
   * Exported for the dashboard module to call in-process — no HTTP self-call.
   */
  async seriesForRange(period: Period): Promise<RangeBucket[]> {
    const bucketCount = BUCKET_COUNT[period];
    const now = new Date();
    const rows = await financeRepository.findAllAscending({});

    const buckets: RangeBucket[] = [];
    for (let i = bucketCount - 1; i >= 0; i--) {
      const { start, end, label } = bucketWindow(now, period, i);
      const inWindow = rows.filter(
        (row) => row.occurredOn >= start && row.occurredOn < end,
      );

      buckets.push({
        label,
        incomeMinor: inWindow
          .filter((r) => r.type === "in")
          .reduce((sum, r) => sum + r.amountMinor, 0),
        expensesMinor: inWindow
          .filter((r) => r.type === "out")
          .reduce((sum, r) => sum + r.amountMinor, 0),
      });
    }

    return buckets;
  },

  async recentActivity(limit: number) {
    return financeRepository.recent(limit);
  },
};

function bucketWindow(
  now: Date,
  period: Period,
  offsetFromNow: number,
): { start: Date; end: Date; label: string } {
  if (period === "daily") {
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offsetFromNow + 1));
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 1);
    return { start, end, label: start.toLocaleDateString("en-US", { weekday: "short" }) };
  }

  if (period === "weekly") {
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offsetFromNow * 7 + 1));
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 7);
    return { start, end, label: `W${String(offsetFromNow + 1).padStart(2, "0")}` };
  }

  const monthIndex = now.getUTCMonth() - offsetFromNow;
  const start = new Date(Date.UTC(now.getUTCFullYear(), monthIndex, 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), monthIndex + 1, 1));
  return { start, end, label: start.toLocaleDateString("en-US", { month: "short" }) };
}
