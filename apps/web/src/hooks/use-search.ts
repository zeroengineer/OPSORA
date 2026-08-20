import type { SearchResponse } from "@opsora/types";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/services/api-client.ts";

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () =>
      apiClient.get<SearchResponse>(`/api/search?q=${encodeURIComponent(query)}`),
    enabled: query.trim().length > 0,
  });
}
