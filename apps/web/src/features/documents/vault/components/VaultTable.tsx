import type { VaultFileDto } from "@opsora/types";
import { cn } from "@opsora/utils";

import { EmptyState } from "@/components/common/EmptyState.tsx";
import { StatusDot } from "@/components/common/StatusDot.tsx";

const GRID = "grid grid-cols-[1fr_110px_96px] sm:grid-cols-[1fr_130px_110px_96px]";

/** Vault dates are scanned, not read — day and month only. */
function shortDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-US", { day: "2-digit", month: "short" })
    .toUpperCase();
}

interface VaultTableProps {
  documents: VaultFileDto[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  filtered: boolean;
}

export function VaultTable({
  documents,
  selectedId,
  onSelect,
  filtered,
}: VaultTableProps) {
  if (documents.length === 0) {
    return (
      <EmptyState
        label={filtered ? "No matches" : "Vault is empty"}
        hint={
          filtered
            ? "Try a different search term or clear the category filter."
            : "Generate a document from a template and it lands here, versioned."
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <div
        className={cn(
          GRID,
          "min-w-[520px] gap-2 border-b border-line bg-surface px-6 py-[11px] text-[8.5px] uppercase tracking-[0.16em] text-faint",
        )}
      >
        <span>Document</span>
        <span className="hidden sm:block">Client</span>
        <span>Category</span>
        <span className="text-right">Date</span>
      </div>

      {documents.map((doc) => {
        const active = doc.id === selectedId;

        return (
          <button
            key={doc.id}
            type="button"
            onClick={() => {
              onSelect(doc.id);
            }}
            className={cn(
              GRID,
              "w-full min-w-[520px] items-center gap-2 border-b border-line-2 px-6 py-3.5 text-left transition-colors",
              active
                ? "bg-surface shadow-[inset_2px_0_0_var(--color-red)]"
                : "hover:bg-surface",
            )}
          >
            <span className="flex min-w-0 items-center gap-2.5 pr-3">
              <StatusDot tone={doc.source === "generated" ? "red" : "faint"} />
              <span className="truncate text-[12.5px] text-ink">{doc.name}</span>
              {doc.currentVersion > 1 && (
                <span className="shrink-0 rounded-pill border border-line px-1.5 py-px text-[8px] tracking-[0.08em] text-faint">
                  V{doc.currentVersion}
                </span>
              )}
            </span>

            <span className="hidden truncate pr-2 text-[10.5px] text-mid sm:block">
              {doc.clientName ?? "—"}
            </span>

            <span className="truncate pr-2 text-[9.5px] uppercase tracking-[0.08em] text-mid">
              {doc.category}
            </span>

            <span className="text-right text-[10px] text-faint tabular-nums">
              {shortDate(doc.createdAt)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
