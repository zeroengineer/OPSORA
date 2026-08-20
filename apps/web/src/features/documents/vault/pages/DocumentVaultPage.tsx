import { useState } from "react";

import { Card } from "@/components/common/Card.tsx";
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

  const listQuery = useVaultList({ search: search || undefined, category: category || undefined });
  const detailQuery = useVaultDetail(selectedId);

  if (listQuery.isPending) {
    return (
      <div className="flex justify-center py-24 text-faint">
        <Spinner />
      </div>
    );
  }

  if (listQuery.isError) {
    return <ErrorState message="Failed to load the vault" onRetry={() => void listQuery.refetch()} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-4">
        <VaultFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
        />
        <VaultTable
          documents={listQuery.data}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {detailQuery.data ? (
        <VaultPreview document={detailQuery.data} />
      ) : (
        <Card label="File preview" bodyClassName="p-4">
          <p className="text-xs text-faint">Select a document to preview it.</p>
        </Card>
      )}
    </div>
  );
}

export default DocumentVaultPage;
