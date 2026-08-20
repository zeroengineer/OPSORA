import type { ListTransactionsQuery } from "@opsora/types";
import { useQuery } from "@tanstack/react-query";

import { fetchTransactions } from "@/features/finance/services/finance.service.ts";

export function useTransactions(query: ListTransactionsQuery) {
  return useQuery({
    queryKey: ["finance", "transactions", query],
    queryFn: () => fetchTransactions(query),
  });
}
