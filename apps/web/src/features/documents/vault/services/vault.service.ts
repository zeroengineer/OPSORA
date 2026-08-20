import type { ListVaultQuery, RegenerateInput, VaultFileDto } from "@opsora/types";

import { apiClient } from "@/services/api-client.ts";
import { env } from "@/lib/env.ts";

function toQueryString(query: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchVaultList(query: ListVaultQuery): Promise<VaultFileDto[]> {
  return apiClient.get<VaultFileDto[]>(
    `/api/documents/vault${toQueryString({ search: query.search, category: query.category })}`,
  );
}

export function fetchVaultDetail(id: string): Promise<VaultFileDto> {
  return apiClient.get<VaultFileDto>(`/api/documents/vault/${id}`);
}

export function regenerateDocument(id: string, input: RegenerateInput): Promise<VaultFileDto> {
  return apiClient.post<VaultFileDto>(`/api/documents/vault/${id}/regenerate`, input);
}

/** Authenticated download route — the session cookie travels with a same-site navigation. */
export function vaultDownloadUrl(id: string): string {
  return `${env.apiUrl}/api/documents/vault/${id}/download`;
}
