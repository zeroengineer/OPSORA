import { Elysia } from "elysia";

import { clientsRoutes } from "./clients/index.ts";
import { dashboardRoutes } from "./dashboard/index.ts";
import { documentsRoutes } from "./documents/index.ts";
import { financeRoutes } from "./finance/index.ts";
import { knowledgeBaseRoutes } from "./knowledge-base/index.ts";
import { salesRoutes } from "./sales/index.ts";
import { searchRoutes } from "./search/index.ts";

/**
 * Every domain module of the modular monolith, mounted under `/api`.
 * Adding a module means adding one line here.
 */
export const modules = new Elysia({ prefix: "/api" })
  .use(clientsRoutes)
  .use(salesRoutes)
  .use(financeRoutes)
  .use(documentsRoutes)
  .use(knowledgeBaseRoutes)
  .use(dashboardRoutes)
  .use(searchRoutes);
