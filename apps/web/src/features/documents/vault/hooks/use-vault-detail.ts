import { useQuery } from "@tanstack/react-query";

import { fetchVaultDetail } from "@/features/documents/vault/services/vault.service.ts";

export function useVaultDetail(id: string | null) {
  return useQuery({
    queryKey: ["documents", "vault", "detail", id],
    queryFn: () => fetchVaultDetail(id!),
    enabled: id !== null,
  });
}
