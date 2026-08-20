import type { VaultFileDto } from "@opsora/types";
import { formatDate, formatDateTime } from "@opsora/utils";
import { useEffect, useState } from "react";

import { Card } from "@/components/common/Card.tsx";
import { useRegenerateDocument } from "@/features/documents/vault/hooks/use-regenerate-document.ts";
import { vaultDownloadUrl } from "@/features/documents/vault/services/vault.service.ts";

export function VaultPreview({ document }: { document: VaultFileDto }) {
  const regenerate = useRegenerateDocument(document.id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [editingVariables, setEditingVariables] = useState(false);

  useEffect(() => {
    setValues(document.variablesUsed ?? {});
    setEditingVariables(false);
  }, [document.id, document.variablesUsed]);

  const variableKeys = Object.keys(document.variablesUsed ?? {});

  return (
    <Card label="File preview" bodyClassName="flex flex-col gap-5 p-4">
      <div>
        <p className="text-sm font-medium text-ink">{document.name}</p>
        <p className="mt-1 text-xs text-faint">
          {document.category} · {formatDate(document.createdAt)}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-xs">
        <Field label="Client" value={document.clientName ?? "—"} />
        <Field label="Category" value={document.category} />
        <Field label="Date" value={formatDate(document.createdAt)} />
        <Field label="Source" value={document.source} />
        <Field label="Size" value={`${(document.sizeBytes / 1024).toFixed(1)} KB`} />
        <Field label="Linked to" value={document.linkedTo ?? "—"} />
      </dl>

      {document.versions.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.12em] text-faint">
            Version history
          </p>
          <ul className="flex flex-col gap-2">
            {document.versions.map((version) => (
              <li key={version.id} className="text-xs text-mid">
                <span className="font-medium text-ink">V{version.version}</span>{" "}
                {version.description} ·{" "}
                <span className="text-faint">{formatDateTime(version.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {editingVariables && variableKeys.length > 0 && (
        <div className="flex flex-col gap-2 rounded-input border border-line bg-surface p-3">
          {variableKeys.map((key) => (
            <label key={key} className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.1em] text-faint">
                {"{{"}
                {key}
                {"}}"}
              </span>
              <input
                value={values[key] ?? ""}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, [key]: e.target.value }));
                }}
                className="rounded-control border border-line bg-surface-2 px-2.5 py-1.5 text-xs text-ink outline-none focus:border-red"
              />
            </label>
          ))}
        </div>
      )}

      <div className="mt-auto flex gap-2">
        <a
          href={vaultDownloadUrl(document.id)}
          className="flex-1 rounded-control bg-ink px-3 py-2 text-center text-xs font-medium text-bg hover:opacity-85"
        >
          Download
        </a>

        {document.source === "generated" &&
          (editingVariables ? (
            <button
              type="button"
              onClick={() => void regenerate.mutateAsync({ variables: values })}
              disabled={regenerate.isPending}
              className="flex-1 rounded-control border border-line px-3 py-2 text-xs font-medium text-ink hover:bg-surface-2 disabled:opacity-50"
            >
              {regenerate.isPending ? "Regenerating…" : "Confirm regenerate"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingVariables(true);
              }}
              className="flex-1 rounded-control border border-line px-3 py-2 text-xs font-medium text-ink hover:bg-surface-2"
            >
              Regenerate
            </button>
          ))}
      </div>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.1em] text-faint">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
