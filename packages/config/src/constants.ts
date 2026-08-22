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
  /** Public marketing page. Everything below it sits behind a session. */
  home: "/",
  dashboard: "/dashboard",
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
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
} as const;

/** Mount path for the Better Auth handler on the API. */
export const AUTH_BASE_PATH = "/api/auth";

/**
 * Shared by the Better Auth server config, the signup form and the reset form,
 * so the three cannot disagree about what a valid password is.
 */
export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 128;

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
