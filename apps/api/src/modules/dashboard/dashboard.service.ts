import type {
  DashboardKpi,
  DashboardMetric,
  DashboardPeriod,
  DashboardQuery,
  DashboardResponse,
  RecentActivityItem,
} from "@opsora/types";
import { formatCurrency } from "@opsora/utils";

import { financeService } from "@/modules/finance/index.ts";
import type { RangeBucket } from "@/modules/finance/finance.service.ts";
import { documentVaultService } from "@/modules/documents/index.ts";

function metricValue(bucket: RangeBucket, metric: DashboardMetric): number {
  switch (metric) {
    case "income":
      return bucket.incomeMinor;
    case "expenses":
      return bucket.expensesMinor;
    case "netProfit":
      return bucket.incomeMinor - bucket.expensesMinor;
    case "receivables":
      // No invoices domain yet — always real zero, never fabricated.
      return 0;
  }
}

function deltaPct(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}

/**
 * Thin composing module — no schema, no repository. Calls finance/documents
 * services directly, in-process (no HTTP self-call).
 */
export const dashboardService = {
  async build(query: DashboardQuery): Promise<DashboardResponse> {
    const metric: DashboardMetric = query.metric ?? "income";
    const period: DashboardPeriod = query.period ?? "monthly";

    const [heroBuckets, monthlyBuckets, recentTransactions, recentDocuments] =
      await Promise.all([
        financeService.seriesForRange(period),
        financeService.seriesForRange("monthly"),
        financeService.recentActivity(5),
        documentVaultService.recentGenerated(5),
      ]);

    const heroSeries = heroBuckets.map((bucket) => metricValue(bucket, metric));
    const heroValue = heroSeries.at(-1) ?? 0;
    const heroPrevious = heroSeries.at(-2) ?? 0;

    const hero = {
      metric,
      period,
      valueMinor: heroValue,
      deltaPct: deltaPct(heroValue, heroPrevious),
      series: heroSeries,
      rangeLabel:
        heroBuckets.length > 0
          ? `${heroBuckets[0]?.label} → ${heroBuckets.at(-1)?.label}`
          : "",
    };

    const kpis: DashboardKpi[] = (
      [
        ["income", "Revenue"],
        ["expenses", "Expenses"],
        ["netProfit", "Net Cash Flow"],
        ["receivables", "Outstanding"],
      ] as const
    ).map(([key, label]) => {
      const sparkline = monthlyBuckets.map((bucket) => metricValue(bucket, key));
      const value = sparkline.at(-1) ?? 0;
      const previous = sparkline.at(-2) ?? 0;

      return { key, label, valueMinor: value, deltaPct: deltaPct(value, previous), sparkline };
    });

    const recentActivity: RecentActivityItem[] = [
      ...recentTransactions.map(
        (row): RecentActivityItem => ({
          id: row.id,
          kind: "finance_transaction",
          text: `${row.type === "in" ? "Income" : "Expense"} recorded: ${row.description} (${formatCurrency(row.amountMinor)})`,
          occurredAt: row.createdAt.toISOString(),
        }),
      ),
      ...recentDocuments.map(
        (row): RecentActivityItem => ({
          id: row.id,
          kind: "document_generated",
          text: `${row.name} generated${row.clientName ? ` for ${row.clientName}` : ""}`,
          occurredAt: row.createdAt.toISOString(),
        }),
      ),
    ]
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
      .slice(0, 5);

    return {
      hero,
      kpis,
      // No Invoices/Deals/Alerts domains yet — real empty arrays, not fabricated data.
      alerts: [],
      receivablesPayables: [],
      upcomingDates: [],
      recentActivity,
    };
  },
};
