import { t } from "elysia";

/** Runtime/OpenAPI mirrors of the contracts re-exported by dashboard.types.ts. */

const metricSchema = t.Union([
  t.Literal("income"),
  t.Literal("netProfit"),
  t.Literal("expenses"),
  t.Literal("receivables"),
]);

const periodSchema = t.Union([
  t.Literal("daily"),
  t.Literal("weekly"),
  t.Literal("monthly"),
]);

/** Mirrors `DashboardResponse`. */
export const dashboardSchema = t.Object({
  hero: t.Object({
    metric: metricSchema,
    period: periodSchema,
    valueMinor: t.Number(),
    deltaPct: t.Union([t.Number(), t.Null()]),
    series: t.Array(t.Number()),
    rangeLabel: t.String(),
  }),
  kpis: t.Array(
    t.Object({
      key: t.String(),
      label: t.String(),
      valueMinor: t.Number(),
      deltaPct: t.Union([t.Number(), t.Null()]),
      sparkline: t.Array(t.Number()),
    }),
  ),
  /*
   * Typed as empty arrays in `@opsora/types` and always returned empty: the
   * Invoices, Payments and Alerts modules do not exist yet, and fabricating
   * rows here would be worse than an honest empty panel.
   */
  alerts: t.Array(t.Never()),
  receivablesPayables: t.Array(t.Never()),
  upcomingDates: t.Array(t.Never()),
  recentActivity: t.Array(
    t.Object({
      id: t.String(),
      kind: t.Union([
        t.Literal("finance_transaction"),
        t.Literal("document_generated"),
      ]),
      text: t.String(),
      occurredAt: t.String(),
    }),
  ),
});
