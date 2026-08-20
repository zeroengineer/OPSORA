import { useQuery } from "@tanstack/react-query";

import { fetchHealth } from "@/services/health.service.ts";

/** Polls the API health endpoint — proves end-to-end connectivity. */
export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    refetchInterval: 30_000,
  });
}
