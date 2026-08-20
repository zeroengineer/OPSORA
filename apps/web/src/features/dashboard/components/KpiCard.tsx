import type { DashboardKpi } from "@opsora/types";
import { formatCurrency } from "@opsora/utils";

import { Card } from "@/components/common/Card.tsx";
import { DotMatrixChart } from "@/components/common/DotMatrixChart.tsx";

export function KpiCard({ kpi }: { kpi: DashboardKpi }) {
  return (
    <Card bodyClassName="p-4">
      <div className="flex items-start justify-between">
        <p className="text-[10px] uppercase tracking-[0.14em] text-faint">{kpi.label}</p>
        {kpi.deltaPct !== null && (
          <span className="text-[10px] font-medium text-mid">
            {kpi.deltaPct >= 0 ? "+" : ""}
            {kpi.deltaPct}%
          </span>
        )}
      </div>

      <p className="mt-3 text-[25px] font-medium text-ink">{formatCurrency(kpi.valueMinor)}</p>

      <DotMatrixChart series={kpi.sparkline} height="sm" rows={7} className="mt-3" />
    </Card>
  );
}
