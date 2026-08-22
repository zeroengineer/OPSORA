import type { DashboardKpi } from "@opsora/types";
import { cn, formatCurrency } from "@opsora/utils";

import { Sparkline } from "@/components/common/Sparkline.tsx";

/**
 * Which direction of movement is worth flagging per metric: revenue and cash
 * flow falling is adverse, expenses and outstanding money rising is adverse.
 * The accent marks the adverse case only — everything else stays quiet.
 */
const ADVERSE_WHEN_RISING: Record<string, boolean> = {
  income: false,
  netProfit: false,
  expenses: true,
  receivables: true,
};

export function KpiCard({ kpi }: { kpi: DashboardKpi }) {
  const adverse =
    kpi.deltaPct !== null &&
    kpi.deltaPct !== 0 &&
    kpi.deltaPct > 0 === (ADVERSE_WHEN_RISING[kpi.key] ?? false);

  return (
    <div className="flex flex-col gap-[11px] rounded-card border border-line bg-surface-2 px-[18px] pb-3.5 pt-4">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[9px] uppercase tracking-[0.16em] text-mid">
          {kpi.label}
        </span>
        {kpi.deltaPct !== null && (
          <span className={cn("text-[9.5px]", adverse ? "text-red" : "text-mid")}>
            {kpi.deltaPct >= 0 ? "+" : ""}
            {kpi.deltaPct}%
          </span>
        )}
      </div>

      <p
        className={cn(
          "text-[25px] font-medium tracking-[-0.03em]",
          kpi.valueMinor < 0 ? "text-red" : "text-ink",
        )}
      >
        {formatCurrency(kpi.valueMinor)}
      </p>

      <Sparkline series={kpi.sparkline} accent={kpi.key === "netProfit"} />
    </div>
  );
}
