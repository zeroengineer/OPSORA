import type { TransactionType } from "@opsora/types";

import { SegmentedControl } from "@/components/common/SegmentedControl.tsx";

const TYPE_OPTIONS: { value: TransactionType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in", label: "Income" },
  { value: "out", label: "Expenses" },
];

interface TransactionToolbarProps {
  type: TransactionType | "all";
  onTypeChange: (type: TransactionType | "all") => void;
  search: string;
  onSearchChange: (value: string) => void;
  onToggleAdd: () => void;
  addOpen: boolean;
}

export function TransactionToolbar({
  type,
  onTypeChange,
  search,
  onSearchChange,
  onToggleAdd,
  addOpen,
}: TransactionToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 border-b border-line px-[18px] py-3.5">
      <SegmentedControl
        label="Filter by entry type"
        options={TYPE_OPTIONS}
        value={type}
        onChange={onTypeChange}
      />

      <span className="hidden h-5 w-px bg-line sm:block" />

      <label className="flex min-w-[180px] flex-1">
        <span className="sr-only">Filter transactions</span>
        <input
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
          }}
          placeholder="Filter by description or category"
          className="w-full rounded-control border border-line bg-surface-2 px-2.5 py-2 text-[11px] text-ink outline-none placeholder:text-faint focus:border-red"
        />
      </label>

      <button
        type="button"
        onClick={onToggleAdd}
        className="rounded-control bg-red px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-85"
      >
        {addOpen ? "Close" : "+ Record entry"}
      </button>
    </div>
  );
}
