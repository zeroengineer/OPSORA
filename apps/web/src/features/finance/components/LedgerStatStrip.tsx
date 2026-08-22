import type { LedgerSummary } from "@opsora/types";
import { cn, formatCurrency } from "@opsora/utils";

/**
 * Five figures, hairline-separated. Only the two that matter for a solvency
 * read — what left the account, and what is left — carry the accent.
 */
const STATS: { key: keyof LedgerSummary; label: string; tone: "ink" | "mid" | "red" }[] = [
  { key: "openingBalanceMinor", label: "Opening balance", tone: "mid" },
  { key: "incomeMinor", label: "Income", tone: "ink" },
  { key: "expensesMinor", label: "Expenses", tone: "red" },
  { key: "netMinor", label: "Net cash flow", tone: "ink" },
  { key: "closingBalanceMinor", label: "Closing balance", tone: "red" },
];

const TONE_CLASS = { ink: "text-ink", mid: "text-mid", red: "text-red" };

export function LedgerStatStrip({ summary }: { summary: LedgerSummary }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3 xl:grid-cols-5">
      {STATS.map((stat) => (
        <div key={stat.key} className="flex flex-col gap-2 bg-surface px-[18px] py-4">
          <span className="text-[9px] uppercase tracking-[0.16em] text-mid">
            {stat.label}
          </span>
          <span className={cn("text-xl", TONE_CLASS[stat.tone])}>
            {formatCurrency(summary[stat.key])}
          </span>
        </div>
      ))}
    </div>
  );
}
