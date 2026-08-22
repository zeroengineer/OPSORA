import type { DashboardHero, DashboardMetric, DashboardPeriod } from "@opsora/types";
import { cn, formatCurrency } from "@opsora/utils";

import { DotMatrixChart } from "@/components/common/DotMatrixChart.tsx";
import { SegmentedControl } from "@/components/common/SegmentedControl.tsx";

const METRIC_OPTIONS: { value: DashboardMetric; label: string }[] = [
  { value: "income", label: "Income" },
  { value: "netProfit", label: "Net profit" },
  { value: "expenses", label: "Expenses" },
  { value: "receivables", label: "Receivables" },
];

const PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const CAPTIONS: Record<DashboardMetric, string> = {
  income: "Income",
  netProfit: "Net cash flow",
  expenses: "Expenses",
  receivables: "Outstanding receivables",
};

interface HeroCardProps {
  hero: DashboardHero;
  metric: DashboardMetric;
  period: DashboardPeriod;
  onMetricChange: (metric: DashboardMetric) => void;
  onPeriodChange: (period: DashboardPeriod) => void;
}

export function HeroCard({
  hero,
  metric,
  period,
  onMetricChange,
  onPeriodChange,
}: HeroCardProps) {
  const [from, to] = hero.rangeLabel.split(" → ");

  return (
    <section className="flex flex-col gap-3.5 rounded-panel border border-line bg-surface-2 px-6 pb-4 pt-[22px]">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex flex-col gap-[11px]">
          <span className="text-[9px] uppercase tracking-[0.18em] text-faint">
            Financial year statement
          </span>

          <div className="flex flex-wrap items-center gap-4">
            {METRIC_OPTIONS.map((option) => {
              const active = option.value === metric;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    onMetricChange(option.value);
                  }}
                  className={cn(
                    "flex items-center gap-[7px] text-[11px] transition-colors",
                    active ? "text-ink" : "text-mid hover:text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "size-[9px] shrink-0 rounded-full",
                      active
                        ? "bg-red shadow-[inset_0_0_0_1px_var(--color-red)]"
                        : "shadow-[inset_0_0_0_1px_var(--color-faint)]",
                    )}
                  />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-end gap-[11px]">
          <span className="text-[9px] uppercase tracking-[0.18em] text-faint">
            {period}
          </span>
          <SegmentedControl
            label="Chart period"
            options={PERIOD_OPTIONS}
            value={period}
            onChange={onPeriodChange}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 pb-0.5 pt-1.5">
        <span className="text-[clamp(38px,7vw,62px)] font-medium leading-none tracking-[-0.045em] text-ink">
          {formatCurrency(hero.valueMinor)}
        </span>
        <div className="flex items-center gap-2.5">
          <span className="text-[10.5px] text-mid">{CAPTIONS[metric]}</span>
          {hero.deltaPct !== null && (
            <span className="text-[10.5px] text-red">
              {hero.deltaPct >= 0 ? "+" : ""}
              {hero.deltaPct}%
            </span>
          )}
        </div>
      </div>

      {hero.series.length > 0 ? (
        <>
          <DotMatrixChart series={hero.series} className="h-[150px]" />
          <div className="flex justify-between border-t border-line-2 pt-2.5 text-[9.5px] text-faint">
            <span>{from}</span>
            <span className="text-ink">{to}</span>
          </div>
        </>
      ) : (
        <p className="flex h-[150px] items-center justify-center text-[11px] uppercase tracking-[0.12em] text-faint">
          No transactions in this range yet
        </p>
      )}
    </section>
  );
}
