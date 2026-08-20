import type { TransactionType } from "@opsora/types";
import { useState } from "react";

import { SegmentedControl } from "@/components/common/SegmentedControl.tsx";
import { useCreateTransaction } from "@/features/finance/hooks/use-create-transaction.ts";

interface AddTransactionFormProps {
  categories: string[];
  onDone: () => void;
}

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "in", label: "In" },
  { value: "out", label: "Out" },
];

export function AddTransactionForm({ categories, onDone }: AddTransactionFormProps) {
  const [type, setType] = useState<TransactionType>("in");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  const mutation = useCreateTransaction();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const amountMinor = Math.round(Number.parseFloat(amount) * 100);
    if (!description.trim() || !category.trim() || !Number.isFinite(amountMinor) || amountMinor <= 0) {
      setError("Fill in a description, category, and a positive amount.");
      return;
    }

    try {
      await mutation.mutateAsync({
        type,
        description: description.trim(),
        category: category.trim(),
        amountMinor,
        occurredOn: date,
      });
      onDone();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to record the entry");
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="grid grid-cols-2 gap-3 rounded-card border border-line bg-surface-2 p-4 lg:grid-cols-5 lg:items-end"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.14em] text-faint">Type</span>
        <SegmentedControl options={TYPE_OPTIONS} value={type} onChange={setType} />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.14em] text-faint">Description</span>
        <input
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="rounded-input border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-red"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.14em] text-faint">Category</span>
        <input
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          list="finance-categories"
          className="rounded-input border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-red"
        />
        <datalist id="finance-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.14em] text-faint">Amount</span>
        <input
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          type="number"
          step="0.01"
          min="0"
          className="rounded-input border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-red"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-[0.14em] text-faint">Date</span>
        <input
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
          type="date"
          className="rounded-input border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-red"
        />
      </label>

      {error && (
        <p className="col-span-full text-xs text-red">{error}</p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="col-span-full rounded-control bg-red px-4 py-2 text-xs font-medium text-white hover:opacity-85 disabled:opacity-50 lg:col-span-1"
      >
        {mutation.isPending ? "Recording…" : "Record"}
      </button>
    </form>
  );
}
