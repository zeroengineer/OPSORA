import { useQuery } from "@tanstack/react-query";

import { fetchLedgerSummary } from "@/features/finance/services/finance.service.ts";

export function useLedgerSummary() {
  return useQuery({
    queryKey: ["finance", "summary"],
    queryFn: () => fetchLedgerSummary(),
  });
}
