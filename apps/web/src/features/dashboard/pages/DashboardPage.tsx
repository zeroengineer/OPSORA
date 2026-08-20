import type { DashboardMetric, DashboardPeriod } from "@opsora/types";
import { useState } from "react";

import { ErrorState } from "@/components/common/ErrorState.tsx";
import { Spinner } from "@/components/common/Spinner.tsx";
import { EmptyPanel } from "@/features/dashboard/components/EmptyPanel.tsx";
import { HeroCard } from "@/features/dashboard/components/HeroCard.tsx";
import { KpiCard } from "@/features/dashboard/components/KpiCard.tsx";
import { RecentActivityPanel } from "@/features/dashboard/components/RecentActivityPanel.tsx";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard.ts";

export function DashboardPage() {
  const [metric, setMetric] = useState<DashboardMetric>("income");
  const [period, setPeriod] = useState<DashboardPeriod>("monthly");

  const { data, isPending, isError, error, refetch } = useDashboard({ metric, period });

  if (isPending) {
    return (
      <div className="flex justify-center py-24 text-faint">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Failed to load the dashboard"}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <HeroCard
        hero={data.hero}
        metric={metric}
        period={period}
        onMetricChange={setMetric}
        onPeriodChange={setPeriod}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <EmptyPanel
          label="Business alerts"
          emptyLabel="No alerts yet"
          hint="Alerts surface once invoices and deals are tracked."
        />
        <EmptyPanel
          label="Receivables / payables"
          emptyLabel="Nothing outstanding"
          hint="Populates once invoicing is tracked."
        />
        <EmptyPanel
          label="Upcoming dates"
          emptyLabel="Nothing scheduled"
          hint="Populates once deals and invoices are tracked."
        />
      </div>

      <RecentActivityPanel items={data.recentActivity} />
    </div>
  );
}

export default DashboardPage;
