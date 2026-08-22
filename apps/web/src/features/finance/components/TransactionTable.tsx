import type { TransactionDto } from "@opsora/types";
import { cn, formatCurrency } from "@opsora/utils";

import { EmptyState } from "@/components/common/EmptyState.tsx";
import { StatusDot } from "@/components/common/StatusDot.tsx";

const GRID = "grid grid-cols-[76px_1fr_110px_110px] sm:grid-cols-[96px_1fr_150px_130px_130px]";

/** Ledger dates are read down a column, so they drop the year and the month name. */
function ledgerDate(value: string): string {
  const [, month = "", day = ""] = value.split("-");
  return `${month} / ${day}`;
}

export function TransactionTable({ transactions }: { transactions: TransactionDto[] }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        label="No transactions yet"
        hint="Record the first entry and the running balance starts here."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <div
        className={cn(
          GRID,
          "min-w-[560px] border-b border-line px-[18px] py-[11px] text-[8.5px] uppercase tracking-[0.16em] text-faint",
        )}
      >
        <span>Date</span>
        <span>Description</span>
        <span className="hidden sm:block">Category</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Balance</span>
      </div>

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className={cn(
            GRID,
            "min-w-[560px] items-center border-b border-line-2 px-[18px] py-3.5 hover:bg-surface-2",
          )}
        >
          <span className="text-[11px] text-mid tabular-nums">
            {ledgerDate(tx.occurredOn)}
          </span>

          <span className="flex min-w-0 items-center gap-2.5 pr-4 text-[12.5px] text-ink">
            <StatusDot tone={tx.type === "in" ? "ink" : "red"} />
            <span className="truncate">{tx.description}</span>
          </span>

          <span className="hidden truncate pr-2 text-[10px] uppercase tracking-[0.08em] text-mid sm:block">
            {tx.category}
          </span>

          <span
            className={cn(
              "text-right text-[12.5px] tabular-nums",
              tx.type === "in" ? "text-ink" : "text-red",
            )}
          >
            {tx.type === "in" ? "+" : "−"}
            {formatCurrency(tx.amountMinor)}
          </span>

          <span className="text-right text-xs text-mid tabular-nums">
            {formatCurrency(tx.runningBalanceMinor)}
          </span>
        </div>
      ))}
    </div>
  );
}
