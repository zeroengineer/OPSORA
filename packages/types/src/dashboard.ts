import type { TransactionType } from "./finance.ts";

export type DashboardMetric = "income" | "netProfit" | "expenses" | "receivables";
export type DashboardPeriod = "daily" | "weekly" | "monthly";

export interface DashboardHero {
  metric: DashboardMetric;
  period: DashboardPeriod;
  valueMinor: number;
  deltaPct: number | null;
  series: number[];
  rangeLabel: string;
}

export interface DashboardKpi {
  key: string;
  label: string;
  valueMinor: number;
  deltaPct: number | null;
  sparkline: number[];
}

export interface RecentActivityItem {
  id: string;
  kind: "finance_transaction" | "document_generated";
  text: string;
  occurredAt: string;
}

export interface DashboardResponse {
  hero: DashboardHero;
  kpis: DashboardKpi[];
  alerts: [];
  receivablesPayables: [];
  upcomingDates: [];
  recentActivity: RecentActivityItem[];
}

export interface DashboardQuery {
  metric?: DashboardMetric;
  period?: DashboardPeriod;
}

// Re-exported so consumers don't need a separate import for the shared type.
export type { TransactionType };
