import type { TransactionType } from "@opsora/types";
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
    return <ErrorState message="Failed to load the ledger" />;
  }

  const transactions = transactionsQuery.data.items;
  const meta = transactionsQuery.data.meta;

  return (
    <div className="flex flex-col gap-4">
      <LedgerStatStrip summary={summaryQuery.data} />

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

      <p className="text-[10px] uppercase tracking-[0.12em] text-faint">
        {meta.total} transaction{meta.total === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export default FinancePage;
