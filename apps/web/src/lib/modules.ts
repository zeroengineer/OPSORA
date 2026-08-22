import { ROUTES } from "@opsora/config";

export interface ModuleDefinition {
  /** Position in the platform, 1-based. Drives the sidebar chip and stub dots. */
  ordinal: number;
  route: string;
  /** Full name, used in the breadcrumb and page title. */
  title: string;
  /** Shortened for the sidebar, where the column is 264px wide. */
  navLabel: string;
  group: "Navigate" | "Library" | "Signals";
  /** False while the module is specified but not built. */
  live: boolean;
  description: string;
}

/**
 * The one ordered list of what OPSORA is made of. The sidebar, the header
 * breadcrumb, the "not yet built" placeholders and the landing page's module
 * index all read from here, so a module can never be numbered two ways.
 */
export const MODULES: ModuleDefinition[] = [
  {
    ordinal: 1,
    route: ROUTES.dashboard,
    title: "Dashboard",
    navLabel: "Dashboard",
    group: "Navigate",
    live: true,
    description:
      "Cash position, movement over time and everything that happened recently, on one screen.",
  },
  {
    ordinal: 2,
    route: ROUTES.clients,
    title: "Client Management",
    navLabel: "Clients",
    group: "Navigate",
    live: false,
    description:
      "Client profiles, multiple contacts, notes, and a complete business view per client — deals, documents, invoices, payments and activity in one place.",
  },
  {
    ordinal: 3,
    route: ROUTES.sales,
    title: "Sales Pipeline",
    navLabel: "Sales Pipeline",
    group: "Navigate",
    live: false,
    description:
      "Deals moving through Lead, Discussion, Proposal, Negotiation, Won and Lost, with pipeline value and conversion metrics.",
  },
  {
    ordinal: 4,
    route: ROUTES.finance,
    title: "Finance Ledger",
    navLabel: "Finance Ledger",
    group: "Navigate",
    live: true,
    description:
      "Income and expenses against a single running balance, categorised and searchable.",
  },
  {
    ordinal: 5,
    route: ROUTES.invoices,
    title: "Invoice Management",
    navLabel: "Invoices",
    group: "Navigate",
    live: false,
    description:
      "Invoices issued and received, linked to clients, moving through draft, sent, partially paid, paid, overdue and cancelled.",
  },
  {
    ordinal: 6,
    route: ROUTES.payments,
    title: "Payments & Receivables",
    navLabel: "Payments",
    group: "Navigate",
    live: false,
    description:
      "Receivables and payables with due dates, partial payments and payment history linked back to invoices.",
  },
  {
    ordinal: 7,
    route: ROUTES.documents,
    title: "Document Management",
    navLabel: "Documents",
    group: "Library",
    live: true,
    description:
      "Markdown templates with dynamic variables — fill the fields, generate the document, keep the template versioned.",
  },
  {
    ordinal: 8,
    route: ROUTES.documentVault,
    title: "Document Vault",
    navLabel: "Document Vault",
    group: "Library",
    live: true,
    description:
      "Every generated and uploaded document, filed by client and category, with its full version history.",
  },
  {
    ordinal: 9,
    route: ROUTES.knowledgeBase,
    title: "Knowledge Base",
    navLabel: "Knowledge Base",
    group: "Library",
    live: false,
    description:
      "Internal articles by category with markdown, search and version history — operations, finance, sales, HR, pricing, SOPs.",
  },
  {
    ordinal: 10,
    route: ROUTES.businessAlerts,
    title: "Business Alerts",
    navLabel: "Business Alerts",
    group: "Signals",
    live: false,
    description:
      "Every configurable business alert in one feed: overdue invoices, due dates, receivables, deal closings, document expiry.",
  },
  {
    ordinal: 11,
    route: ROUTES.activityHistory,
    title: "Activity History",
    navLabel: "Activity History",
    group: "Signals",
    live: false,
    description:
      "A chronological timeline of client, deal, invoice, payment and document activity across the platform.",
  },
];

export const MODULE_COUNT = MODULES.length;
export const LIVE_MODULE_COUNT = MODULES.filter((m) => m.live).length;

const BY_ROUTE = new Map(MODULES.map((module) => [module.route, module]));

export function moduleByRoute(route: string): ModuleDefinition | undefined {
  return BY_ROUTE.get(route);
}

export const NAV_GROUPS = (["Navigate", "Library", "Signals"] as const).map(
  (label) => ({
    label,
    items: MODULES.filter((module) => module.group === label),
  }),
);
