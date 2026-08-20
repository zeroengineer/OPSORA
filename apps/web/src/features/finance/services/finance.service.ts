import type {
  CreateTransactionInput,
  LedgerSummary,
  ListTransactionsQuery,
  Paginated,
  TransactionDto,
} from "@opsora/types";

import { apiClient } from "@/services/api-client.ts";

function toQueryString(query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function fetchTransactions(
  query: ListTransactionsQuery,
): Promise<Paginated<TransactionDto>> {
  return apiClient.get<Paginated<TransactionDto>>(
    `/api/finance/transactions${toQueryString(query)}`,
  );
}

export function fetchLedgerSummary(month?: string): Promise<LedgerSummary> {
  return apiClient.get<LedgerSummary>(`/api/finance/summary${toQueryString({ month })}`);
}

export function createTransaction(input: CreateTransactionInput): Promise<TransactionDto> {
  return apiClient.post<TransactionDto>("/api/finance/transactions", input);
}
