/* eslint-disable react-refresh/only-export-components --
   This is a route manifest, not a component module: the lazy() consts are
   route targets rather than exported components, so fast refresh is unaffected. */
import { ROUTES } from "@opsora/config";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/layout/AppLayout.tsx";
import { RequireAuth } from "@/components/layout/RequireAuth.tsx";
import { DashboardPage } from "@/features/dashboard/index.ts";
import { LoginPage, SignupPage } from "@/features/auth/index.ts";

// Feature routes are code-split; the dashboard and auth pages ship eagerly.
const ClientsPage = lazy(() => import("@/features/clients/pages/ClientsPage.tsx"));
const SalesPage = lazy(() => import("@/features/sales/pages/SalesPage.tsx"));
const InvoicesPage = lazy(() => import("@/features/invoices/pages/InvoicesPage.tsx"));
const PaymentsPage = lazy(() => import("@/features/payments/pages/PaymentsPage.tsx"));
const FinancePage = lazy(() => import("@/features/finance/pages/FinancePage.tsx"));
const DocumentsGeneratorPage = lazy(
  () => import("@/features/documents/pages/DocumentsGeneratorPage.tsx"),
);
const DocumentVaultPage = lazy(
  () => import("@/features/documents/vault/pages/DocumentVaultPage.tsx"),
);
const KnowledgeBasePage = lazy(
  () => import("@/features/knowledge-base/pages/KnowledgeBasePage.tsx"),
);
const BusinessAlertsPage = lazy(
  () => import("@/features/business-alerts/pages/BusinessAlertsPage.tsx"),
);
const ActivityHistoryPage = lazy(
  () => import("@/features/activity-history/pages/ActivityHistoryPage.tsx"),
);

export const router = createBrowserRouter([
  { path: ROUTES.login, Component: LoginPage },
  { path: ROUTES.signup, Component: SignupPage },
  {
    Component: RequireAuth,
    children: [
      {
        path: "/",
        Component: AppLayout,
        children: [
          { index: true, Component: DashboardPage },
          { path: ROUTES.clients, Component: ClientsPage },
          { path: ROUTES.sales, Component: SalesPage },
          { path: ROUTES.invoices, Component: InvoicesPage },
          { path: ROUTES.payments, Component: PaymentsPage },
          { path: ROUTES.finance, Component: FinancePage },
          { path: ROUTES.documents, Component: DocumentsGeneratorPage },
          { path: ROUTES.documentVault, Component: DocumentVaultPage },
          { path: ROUTES.knowledgeBase, Component: KnowledgeBasePage },
          { path: ROUTES.businessAlerts, Component: BusinessAlertsPage },
          { path: ROUTES.activityHistory, Component: ActivityHistoryPage },
        ],
      },
    ],
  },
]);
