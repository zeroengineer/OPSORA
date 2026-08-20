import type { DashboardHero, DashboardMetric, DashboardPeriod } from "@opsora/types";
import { formatCurrency } from "@opsora/utils";

import { Card } from "@/components/common/Card.tsx";
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

interface HeroCardProps {
  hero: DashboardHero;
  metric: DashboardMetric;
  period: DashboardPeriod;
  onMetricChange: (metric: DashboardMetric) => void;
  onPeriodChange: (period: DashboardPeriod) => void;
}

export function HeroCard({ hero, metric, period, onMetricChange, onPeriodChange }: HeroCardProps) {
  return (
    <Card label="Financial year statement" bodyClassName="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SegmentedControl options={METRIC_OPTIONS} value={metric} onChange={onMetricChange} />
        <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} />
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-[62px] font-medium leading-none text-ink">
            {formatCurrency(hero.valueMinor)}
          </p>
          <p className="mt-3 text-xs text-mid">
            {hero.deltaPct === null
              ? "No prior period to compare"
              : `${hero.deltaPct >= 0 ? "+" : ""}${hero.deltaPct}% vs previous period`}
          </p>
        </div>

        <DotMatrixChart series={hero.series} height="lg" className="mb-1" />
      </div>

      {hero.rangeLabel && (
        <p className="mt-6 border-t border-line-2 pt-3 text-[10px] uppercase tracking-[0.14em] text-faint">
          {hero.rangeLabel}
        </p>
      )}
    </Card>
  );
}
