import { useEffect, useMemo, useState } from "react";

import { ErrorState } from "@/components/common/ErrorState.tsx";
import { Spinner } from "@/components/common/Spinner.tsx";
import { VaultFilters } from "@/features/documents/vault/components/VaultFilters.tsx";
import { VaultPreview } from "@/features/documents/vault/components/VaultPreview.tsx";
import { VaultTable } from "@/features/documents/vault/components/VaultTable.tsx";
import { useVaultDetail } from "@/features/documents/vault/hooks/use-vault-detail.ts";
import { useVaultList } from "@/features/documents/vault/hooks/use-vault-list.ts";

export function DocumentVaultPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const listQuery = useVaultList({
    search: search || undefined,
    category: category || undefined,
  });

  /* Filter chips are the categories the vault actually holds, so this second
     query stays unfiltered — a filtered list would hide the way back out. */
  const allQuery = useVaultList({});
  const categories = useMemo(
    () => [...new Set((allQuery.data ?? []).map((doc) => doc.category))].sort(),
    [allQuery.data],
  );

  const documents = useMemo(() => listQuery.data ?? [], [listQuery.data]);
  const detailQuery = useVaultDetail(selectedId);

  // Keep a document selected as filters narrow the list under the selection.
  useEffect(() => {
    if (documents.length === 0) {
      setSelectedId(null);
      return;
    }
    setSelectedId((current) =>
      current && documents.some((doc) => doc.id === current)
        ? current
        : documents[0]!.id,
    );
  }, [documents]);

  if (listQuery.isPending) {
    return (
      <div className="flex flex-1 items-center justify-center text-faint">
        <Spinner />
      </div>
    );
  }

  if (listQuery.isError) {
    return (
      <div className="p-6">
        <ErrorState
          message="Failed to load the vault"
          onRetry={() => void listQuery.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_380px]">
      <div className="flex min-h-0 flex-col border-b border-line lg:border-b-0 lg:border-r">
        <VaultFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
        />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <VaultTable
            documents={documents}
            selectedId={selectedId}
            onSelect={setSelectedId}
            filtered={search !== "" || category !== ""}
          />
        </div>
      </div>

      {detailQuery.data ? (
        <VaultPreview document={detailQuery.data} />
      ) : (
        <div className="flex min-h-0 flex-col bg-surface">
          <div className="border-b border-line-2 px-[22px] pb-4 pt-5 text-[9px] uppercase tracking-[0.18em] text-mid">
            File preview
          </div>
          <p className="px-[22px] py-5 text-[11px] text-faint">
            {detailQuery.isPending && selectedId
              ? "Loading…"
              : "Select a document to see its details and version history."}
          </p>
        </div>
      )}
    </div>
  );
}

export default DocumentVaultPage;
