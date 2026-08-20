export const APP_NAME = "OPSORA";
export const APP_DESCRIPTION = "Business Management Platform";

/** Every top-level module in the modular monolith. */
export const MODULES = [
  "dashboard",
  "clients",
  "sales",
  "invoices",
  "payments",
  "finance",
  "documents",
  "documentVault",
  "knowledgeBase",
  "businessAlerts",
  "activityHistory",
] as const;

export type ModuleId = (typeof MODULES)[number];

export const ROUTES = {
  dashboard: "/",
  clients: "/clients",
  sales: "/sales",
  invoices: "/invoices",
  payments: "/payments",
  finance: "/finance",
  documents: "/documents",
  documentVault: "/documents/vault",
  knowledgeBase: "/knowledge-base",
  businessAlerts: "/business-alerts",
  activityHistory: "/activity-history",
  login: "/login",
  signup: "/signup",
} as const;

/** Mount path for the Better Auth handler on the API. */
export const AUTH_BASE_PATH = "/api/auth";

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
