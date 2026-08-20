import { Pill } from "@/components/common/Pill.tsx";

const CATEGORIES = [
  "All",
  "Proposals",
  "Quotations",
  "Invoices",
  "Agreements",
  "MOUs",
  "Certificates",
  "Policies",
  "Internal",
];

interface VaultFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}

export function VaultFilters({ search, onSearchChange, category, onCategoryChange }: VaultFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        value={search}
        onChange={(e) => {
          onSearchChange(e.target.value);
        }}
        placeholder="Search by document name or client"
        className="rounded-input border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none placeholder:text-faint focus:border-red"
      />

      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <Pill
            key={c}
            active={c === "All" ? category === "" : category === c}
            onClick={() => {
              onCategoryChange(c === "All" ? "" : c);
            }}
          >
            {c}
          </Pill>
        ))}
      </div>
    </div>
  );
}
