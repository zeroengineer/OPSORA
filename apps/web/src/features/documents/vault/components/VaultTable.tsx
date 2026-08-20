import type { VaultFileDto } from "@opsora/types";
import { cn, formatDate } from "@opsora/utils";

import { Badge } from "@/components/common/Badge.tsx";
import { EmptyState } from "@/components/common/EmptyState.tsx";
import { StatusDot } from "@/components/common/StatusDot.tsx";

interface VaultTableProps {
  documents: VaultFileDto[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function VaultTable({ documents, selectedId, onSelect }: VaultTableProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-card border border-line bg-surface-2">
        <EmptyState label="No documents yet" hint="Generate or upload one to see it here." />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface-2">
      <div className="grid min-w-[560px] grid-cols-[1fr_140px_120px_100px] gap-2 border-b border-line-2 px-4 py-2.5 text-[10px] uppercase tracking-[0.12em] text-faint">
        <span>Document</span>
        <span>Client</span>
        <span>Category</span>
        <span>Date</span>
      </div>

      <div className="divide-y divide-line-2">
        {documents.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => {
              onSelect(doc.id);
            }}
            className={cn(
              "grid min-w-[560px] grid-cols-[1fr_140px_120px_100px] items-center gap-2 px-4 py-3 text-left text-sm",
              doc.id === selectedId ? "bg-surface" : "hover:bg-surface",
            )}
          >
            <span className="flex items-center gap-2 text-ink">
              <StatusDot tone={doc.source === "generated" ? "red" : "off"} />
              {doc.name}
              {doc.source === "generated" && <Badge tone="red">Generated</Badge>}
            </span>
            <span className="truncate text-xs text-mid">{doc.clientName ?? "—"}</span>
            <span className="text-xs text-mid">{doc.category}</span>
            <span className="text-xs text-faint">{formatDate(doc.createdAt)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
