import { Pill } from "@/components/common/Pill.tsx";

interface VaultFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  /** Categories present in the vault, derived from the documents themselves. */
  categories: string[];
}

export function VaultFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
}: VaultFiltersProps) {
  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-line bg-surface px-6 py-4">
      <label>
        <span className="sr-only">Search the vault</span>
        <input
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
          }}
          placeholder="Search by document name, client or category"
          className="w-full rounded-control border border-line bg-surface-2 px-3 py-2.5 text-[11.5px] text-ink outline-none placeholder:text-faint focus:border-red"
        />
      </label>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-0.5">
          <Pill
            active={category === ""}
            onClick={() => {
              onCategoryChange("");
            }}
          >
            All
          </Pill>
          {categories.map((c) => (
            <Pill
              key={c}
              active={category === c}
              onClick={() => {
                onCategoryChange(c);
              }}
            >
              {c}
            </Pill>
          ))}
        </div>
      )}
    </div>
  );
}
