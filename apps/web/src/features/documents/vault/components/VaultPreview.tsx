import type { VaultFileDto } from "@opsora/types";
import { cn, formatDate, formatDateTime } from "@opsora/utils";
import { useEffect, useState } from "react";

import { useRegenerateDocument } from "@/features/documents/vault/hooks/use-regenerate-document.ts";
import { vaultDownloadUrl } from "@/features/documents/vault/services/vault.service.ts";

const SECTION_LABEL = "text-[9px] uppercase tracking-[0.18em] text-mid";

function fileSize(bytes: number): string {
  if (bytes < 1024) return `${String(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function VaultPreview({ document }: { document: VaultFileDto }) {
  const regenerate = useRegenerateDocument(document.id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [editingVariables, setEditingVariables] = useState(false);

  useEffect(() => {
    setValues(document.variablesUsed ?? {});
    setEditingVariables(false);
  }, [document.id, document.variablesUsed]);

  const variableKeys = Object.keys(document.variablesUsed ?? {});
  const generated = document.source === "generated";

  const fields: { key: string; value: string; accent?: boolean }[] = [
    { key: "Client", value: document.clientName ?? "Internal" },
    { key: "Category", value: document.category },
    { key: "Date", value: formatDate(document.createdAt) },
    { key: "Source", value: generated ? "Generated from template" : "Manual upload" },
    { key: "Size", value: fileSize(document.sizeBytes) },
    { key: "Version", value: `V${document.currentVersion}`, accent: true },
  ];

  return (
    <div className="flex min-h-0 flex-col overflow-y-auto bg-surface">
      <div className="flex flex-col gap-2 border-b border-line-2 px-[22px] pb-4 pt-5">
        <span className={SECTION_LABEL}>File preview</span>
        <span className="text-base font-semibold leading-[1.3] text-ink text-pretty">
          {document.name}
        </span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-faint">
          {document.category} · {generated ? "Generated" : "Uploaded"} ·{" "}
          {document.mimeType.split("/").pop()}
        </span>
      </div>

      <dl className="flex flex-col gap-2.5 border-b border-line-2 px-[22px] py-4">
        {fields.map((field) => (
          <div key={field.key} className="flex justify-between gap-3">
            <dt className="text-[9.5px] uppercase tracking-[0.12em] text-faint">
              {field.key}
            </dt>
            <dd
              className={cn(
                "text-right text-[11px]",
                field.accent ? "text-red" : "text-ink",
              )}
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-1 flex-col gap-2.5 px-[22px] py-[18px]">
        <span className={SECTION_LABEL}>Version history</span>

        {document.versions.length === 0 ? (
          <p className="text-[11px] text-faint">No versions recorded.</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {document.versions.map((version) => (
              <li
                key={version.id}
                className="flex items-baseline gap-3 border-b border-line-2 pb-[9px]"
              >
                <span className="w-[26px] shrink-0 text-[10px] text-red">
                  V{version.version}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11.5px] text-ink">{version.description}</span>
                  <span className="text-[9px] text-faint">
                    {formatDateTime(version.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {editingVariables && (
          <div className="mt-2 flex flex-col gap-2 rounded-input border border-line bg-surface-2 p-3">
            <span className="text-[9px] uppercase tracking-[0.12em] text-faint">
              Values for the new version
            </span>
            {variableKeys.map((key) => (
              <label key={key} className="flex flex-col gap-1">
                <span className="text-[9px] text-red">
                  {"{{"}
                  {key}
                  {"}}"}
                </span>
                <input
                  value={values[key] ?? ""}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, [key]: e.target.value }));
                  }}
                  className="rounded-control border border-line bg-surface px-2.5 py-1.5 text-[11.5px] text-ink outline-none focus:border-red"
                />
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 px-[22px] pb-[22px] pt-4">
        <a
          href={vaultDownloadUrl(document.id)}
          className="flex-1 rounded-control bg-ink py-2.5 text-center text-[9.5px] uppercase tracking-[0.14em] text-bg transition-opacity hover:opacity-85"
        >
          Download
        </a>

        {generated &&
          (editingVariables ? (
            <button
              type="button"
              onClick={() => void regenerate.mutateAsync({ variables: values })}
              disabled={regenerate.isPending}
              className="flex-1 rounded-control border border-red py-2.5 text-[9.5px] uppercase tracking-[0.14em] text-red hover:bg-red-soft disabled:opacity-50"
            >
              {regenerate.isPending ? "Regenerating…" : "Confirm"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingVariables(true);
              }}
              className="flex-1 rounded-control border border-line py-2.5 text-[9.5px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-red"
            >
              Regenerate
            </button>
          ))}
      </div>
    </div>
  );
}
