import type { DashboardQuery, DashboardResponse } from "@opsora/types";

import { apiClient } from "@/services/api-client.ts";

export function fetchDashboard(query: DashboardQuery): Promise<DashboardResponse> {
  const params = new URLSearchParams();
  if (query.metric) params.set("metric", query.metric);
  if (query.period) params.set("period", query.period);

  const qs = params.toString();
  return apiClient.get<DashboardResponse>(`/api/dashboard${qs ? `?${qs}` : ""}`);
}
