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
      <div className="px-[26px] py-[22px]">
        <ErrorState
          message={error instanceof Error ? error.message : "Failed to load the dashboard"}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5 px-4 pb-14 pt-[22px] sm:px-[26px]">
      <HeroCard
        hero={data.hero}
        metric={metric}
        period={period}
        onMetricChange={setMetric}
        onPeriodChange={setPeriod}
      />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.15fr_1fr_1fr]">
        <EmptyPanel
          label="Business alerts"
          accent
          emptyLabel="No alerts yet"
          hint="Overdue invoices, upcoming due dates and expiring documents surface here once those modules ship."
        />
        <EmptyPanel
          label="Receivables / payables"
          emptyLabel="Nothing outstanding"
          hint="Money owed to you and by you, once invoicing is tracked."
        />
        <EmptyPanel
          label="Upcoming dates"
          emptyLabel="Nothing scheduled"
          hint="Payment dates, expected deal closes and renewal dates."
        />
      </div>

      <RecentActivityPanel items={data.recentActivity} />
    </div>
  );
}

export default DashboardPage;
