import type { TransactionType } from "@opsora/types";
import { formatCurrency } from "@opsora/utils";
import { useMemo, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState.tsx";
import { Spinner } from "@/components/common/Spinner.tsx";
import { AddTransactionForm } from "@/features/finance/components/AddTransactionForm.tsx";
import { LedgerStatStrip } from "@/features/finance/components/LedgerStatStrip.tsx";
import { TransactionTable } from "@/features/finance/components/TransactionTable.tsx";
import { TransactionToolbar } from "@/features/finance/components/TransactionToolbar.tsx";
import { useLedgerSummary } from "@/features/finance/hooks/use-ledger-summary.ts";
import { useTransactions } from "@/features/finance/hooks/use-transactions.ts";

export function FinancePage() {
  const [type, setType] = useState<TransactionType | "all">("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const summaryQuery = useLedgerSummary();
  const transactionsQuery = useTransactions({
    type: type === "all" ? undefined : type,
    search: search || undefined,
    pageSize: 100,
  });

  const categories = useMemo(() => {
    const items = transactionsQuery.data?.items ?? [];
    return [...new Set(items.map((tx) => tx.category))];
  }, [transactionsQuery.data]);

  if (summaryQuery.isPending || transactionsQuery.isPending) {
    return (
      <div className="flex justify-center py-24 text-faint">
        <Spinner />
      </div>
    );
  }

  if (summaryQuery.isError || transactionsQuery.isError) {
    return (
      <div className="px-[30px] py-[26px]">
        <ErrorState
          message="Failed to load the ledger"
          onRetry={() => {
            void summaryQuery.refetch();
            void transactionsQuery.refetch();
          }}
        />
      </div>
    );
  }

  const summary = summaryQuery.data;
  const transactions = transactionsQuery.data.items;
  const total = transactionsQuery.data.meta.total;

  return (
    <div className="flex flex-col gap-4 px-4 pb-14 pt-[26px] sm:px-[30px]">
      <LedgerStatStrip summary={summary} />

      <div className="rounded-card border border-line bg-surface">
        <TransactionToolbar
          type={type}
          onTypeChange={setType}
          search={search}
          onSearchChange={setSearch}
          addOpen={addOpen}
          onToggleAdd={() => {
            setAddOpen((open) => !open);
          }}
        />

        {addOpen && (
          <AddTransactionForm
            categories={categories}
            onDone={() => {
              setAddOpen(false);
            }}
          />
        )}

        <TransactionTable transactions={transactions} />

        <div className="flex flex-wrap justify-between gap-2 px-[18px] py-3.5 text-[10px] uppercase tracking-[0.08em] text-faint">
          <span>
            {total} transaction{total === 1 ? "" : "s"}
          </span>
          <span>
            Opening {formatCurrency(summary.openingBalanceMinor)} → closing{" "}
            {formatCurrency(summary.closingBalanceMinor)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FinancePage;
