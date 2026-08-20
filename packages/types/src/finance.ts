export type TransactionType = "in" | "out";

export interface TransactionDto {
  id: string;
  type: TransactionType;
  description: string;
  category: string;
  amountMinor: number;
  occurredOn: string;
  runningBalanceMinor: number;
  createdAt: string;
}

export interface ListTransactionsQuery {
  type?: TransactionType;
  search?: string;
  month?: string;
  page?: number;
  pageSize?: number;
}

export interface LedgerSummary {
  openingBalanceMinor: number;
  incomeMinor: number;
  expensesMinor: number;
  netMinor: number;
  closingBalanceMinor: number;
  transactionCount: number;
}

export interface CreateTransactionInput {
  type: TransactionType;
  description: string;
  category: string;
  amountMinor: number;
  occurredOn: string;
}
