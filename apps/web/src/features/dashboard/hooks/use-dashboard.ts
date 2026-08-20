import type { DashboardQuery } from "@opsora/types";
import { useQuery } from "@tanstack/react-query";

import { fetchDashboard } from "@/features/dashboard/services/dashboard.service.ts";

export function useDashboard(query: DashboardQuery) {
  return useQuery({
    queryKey: ["dashboard", query.metric, query.period],
    queryFn: () => fetchDashboard(query),
  });
}
