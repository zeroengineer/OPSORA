import { t } from "elysia";

/** Runtime/OpenAPI mirrors of the contracts re-exported by finance.types.ts. */

export const transactionTypeSchema = t.Union([t.Literal("in"), t.Literal("out")]);

/** Mirrors `TransactionDto`. */
export const transactionSchema = t.Object({
  id: t.String(),
  type: transactionTypeSchema,
  description: t.String(),
  category: t.String(),
  amountMinor: t.Number(),
  occurredOn: t.String(),
  runningBalanceMinor: t.Number(),
  createdAt: t.String(),
});

/** Mirrors `LedgerSummary`. */
export const ledgerSummarySchema = t.Object({
  openingBalanceMinor: t.Number(),
  incomeMinor: t.Number(),
  expensesMinor: t.Number(),
  netMinor: t.Number(),
  closingBalanceMinor: t.Number(),
  transactionCount: t.Number(),
});
