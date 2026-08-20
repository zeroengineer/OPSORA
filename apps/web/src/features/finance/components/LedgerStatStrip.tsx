import type { LedgerSummary } from "@opsora/types";
import { formatCurrency } from "@opsora/utils";

const STATS: { key: keyof LedgerSummary; label: string }[] = [
  { key: "openingBalanceMinor", label: "Opening Balance" },
  { key: "incomeMinor", label: "Income" },
  { key: "expensesMinor", label: "Expenses" },
  { key: "netMinor", label: "Net Cash Flow" },
  { key: "closingBalanceMinor", label: "Closing Balance" },
];

export function LedgerStatStrip({ summary }: { summary: LedgerSummary }) {
  return (
    <div className="grid grid-cols-2 divide-x divide-line rounded-card border border-line bg-surface-2 sm:grid-cols-5">
      {STATS.map((stat) => (
        <div key={stat.key} className="px-4 py-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-faint">{stat.label}</p>
          <p className="mt-2 text-lg font-medium text-ink">
            {formatCurrency(summary[stat.key])}
          </p>
        </div>
      ))}
    </div>
  );
}
