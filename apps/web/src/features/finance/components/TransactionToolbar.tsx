import type { TransactionType } from "@opsora/types";

import { Pill } from "@/components/common/Pill.tsx";

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
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        {TYPE_OPTIONS.map((option) => (
          <Pill
            key={option.value}
            active={option.value === type}
            onClick={() => {
              onTypeChange(option.value);
            }}
          >
            {option.label}
          </Pill>
        ))}
      </div>

      <input
        value={search}
        onChange={(e) => {
          onSearchChange(e.target.value);
        }}
        placeholder="Filter by description or category"
        className="min-w-[220px] flex-1 rounded-input border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none placeholder:text-faint focus:border-red"
      />

      <button
        type="button"
        onClick={onToggleAdd}
        className="rounded-control bg-ink px-4 py-2 text-xs font-medium text-bg hover:opacity-85"
      >
        {addOpen ? "Cancel" : "+ Record entry"}
      </button>
    </div>
  );
}
