import type { HealthStatus } from "@opsora/types";

import { apiClient } from "@/services/api-client.ts";

/** `/health` returns a flat body, so it bypasses the response envelope. */
export function fetchHealth(): Promise<HealthStatus> {
  return apiClient.get<HealthStatus>("/health", { raw: true });
}
