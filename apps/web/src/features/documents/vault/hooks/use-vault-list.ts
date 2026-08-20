import type { ListVaultQuery } from "@opsora/types";
import { useQuery } from "@tanstack/react-query";

import { fetchVaultList } from "@/features/documents/vault/services/vault.service.ts";

export function useVaultList(query: ListVaultQuery) {
  return useQuery({
    queryKey: ["documents", "vault", query],
    queryFn: () => fetchVaultList(query),
  });
}
