import type { TransactionDto } from "@opsora/types";
import { formatCurrency, formatDate } from "@opsora/utils";

import { EmptyState } from "@/components/common/EmptyState.tsx";
import { StatusDot } from "@/components/common/StatusDot.tsx";

export function TransactionTable({ transactions }: { transactions: TransactionDto[] }) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-card border border-line bg-surface-2">
        <EmptyState
          label="No transactions yet"
          hint="Use “+ Record entry” to add the first one."
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface-2">
      <div className="grid min-w-[640px] grid-cols-[100px_1fr_140px_120px_140px] gap-2 border-b border-line-2 px-4 py-2.5 text-[10px] uppercase tracking-[0.12em] text-faint">
        <span>Date</span>
        <span>Description</span>
        <span>Category</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Balance</span>
      </div>

      <div className="divide-y divide-line-2">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="grid min-w-[640px] grid-cols-[100px_1fr_140px_120px_140px] items-center gap-2 px-4 py-3 text-sm hover:bg-surface"
          >
            <span className="text-xs text-faint">{formatDate(tx.occurredOn)}</span>
            <span className="flex items-center gap-2 text-ink">
              <StatusDot tone={tx.type === "in" ? "ink" : "red"} />
              {tx.description}
            </span>
            <span className="text-xs text-mid">{tx.category}</span>
            <span className={`text-right ${tx.type === "in" ? "text-ink" : "text-red"}`}>
              {tx.type === "in" ? "+" : "-"}
              {formatCurrency(tx.amountMinor)}
            </span>
            <span className="text-right text-faint">{formatCurrency(tx.runningBalanceMinor)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
