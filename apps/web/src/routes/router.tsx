/* eslint-disable react-refresh/only-export-components --
   This is a route manifest, not a component module: the lazy() consts are
   route targets rather than exported components, so fast refresh is unaffected. */
import { ROUTES } from "@opsora/config";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import { AppLayout } from "@/components/layout/AppLayout.tsx";
import { DashboardPage } from "@/features/dashboard/index.ts";

// Feature routes are code-split; the dashboard ships in the initial bundle.
const ClientsPage = lazy(() => import("@/features/clients/pages/ClientsPage.tsx"));
const SalesPage = lazy(() => import("@/features/sales/pages/SalesPage.tsx"));
const FinancePage = lazy(() => import("@/features/finance/pages/FinancePage.tsx"));
const DocumentsPage = lazy(
  () => import("@/features/documents/pages/DocumentsPage.tsx"),
);
const KnowledgeBasePage = lazy(
  () => import("@/features/knowledge-base/pages/KnowledgeBasePage.tsx"),
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: ROUTES.clients, Component: ClientsPage },
      { path: ROUTES.sales, Component: SalesPage },
      { path: ROUTES.finance, Component: FinancePage },
      { path: ROUTES.documents, Component: DocumentsPage },
      { path: ROUTES.knowledgeBase, Component: KnowledgeBasePage },
    ],
  },
]);
