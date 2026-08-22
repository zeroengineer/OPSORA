import type { TransactionType } from "@opsora/types";
import { useState } from "react";

import { SegmentedControl } from "@/components/common/SegmentedControl.tsx";
import { useCreateTransaction } from "@/features/finance/hooks/use-create-transaction.ts";

interface AddTransactionFormProps {
  categories: string[];
  onDone: () => void;
}

const FIELD_CLASS =
  "rounded-control border border-line bg-surface px-2.5 py-2 text-xs text-ink outline-none placeholder:text-faint focus:border-red";

const LABEL_CLASS = "text-[8.5px] uppercase tracking-[0.14em] text-mid";

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
    if (
      !description.trim() ||
      !category.trim() ||
      !Number.isFinite(amountMinor) ||
      amountMinor <= 0
    ) {
      setError("Fill in a description, a category, and an amount above zero.");
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
      className="grid grid-cols-2 items-end gap-2.5 border-b border-line bg-surface-2 px-[18px] py-4 lg:grid-cols-[120px_1.6fr_1fr_130px_130px_auto]"
    >
      <div className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>Type</span>
        <SegmentedControl
          label="Entry type"
          options={TYPE_OPTIONS}
          value={type}
          onChange={setType}
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>Description</span>
        <input
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="e.g. Brand sprint — milestone 2"
          className={FIELD_CLASS}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>Category</span>
        <input
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          list="finance-categories"
          placeholder="Project Revenue"
          className={FIELD_CLASS}
        />
        <datalist id="finance-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>Amount</span>
        <input
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          type="number"
          step="0.01"
          min="0"
          placeholder="0"
          className={FIELD_CLASS}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>Date</span>
        <input
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
          type="date"
          className={FIELD_CLASS}
        />
      </label>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-control bg-ink px-[18px] py-2.5 text-[10px] uppercase tracking-[0.14em] text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {mutation.isPending ? "Recording…" : "Record"}
      </button>

      {error && <p className="col-span-full text-[11px] text-red">{error}</p>}
    </form>
  );
}
