import { ROUTES } from "@opsora/config";
import { extractTemplateVariables, renderMarkdownToHtml, renderTemplate } from "@opsora/utils";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { ErrorState } from "@/components/common/ErrorState.tsx";
import { Spinner } from "@/components/common/Spinner.tsx";
import { StatusDot } from "@/components/common/StatusDot.tsx";
import { PreviewPanel } from "@/features/documents/components/PreviewPanel.tsx";
import { NewTemplateForm } from "@/features/documents/components/NewTemplateForm.tsx";
import { TemplateList } from "@/features/documents/components/TemplateList.tsx";
import { VariablesPanel } from "@/features/documents/components/VariablesPanel.tsx";
import { useGenerateDocument } from "@/features/documents/hooks/use-generate-document.ts";
import { useUpdateTemplate } from "@/features/documents/hooks/use-save-template.ts";
import { useTemplates } from "@/features/documents/hooks/use-templates.ts";

const COLUMN_LABEL = "text-[9px] uppercase tracking-[0.18em] text-mid";

/**
 * Three columns, left to right in the order the work happens: pick a
 * template, write it, watch it fill in. Each column scrolls on its own so
 * the editor and the preview stay side by side however long the document is.
 */
export function DocumentsGeneratorPage() {
  const navigate = useNavigate();
  const { data: templates, isPending, isError, refetch } = useTemplates();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [generatedFor, setGeneratedFor] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [bodyDraft, setBodyDraft] = useState("");

  const generate = useGenerateDocument();
  const updateTemplate = useUpdateTemplate();

  useEffect(() => {
    if (!selectedId && templates && templates.length > 0) {
      setSelectedId(templates[0]!.id);
    }
  }, [templates, selectedId]);

  const template = templates?.find((t) => t.id === selectedId) ?? null;

  const variables = useMemo(() => extractTemplateVariables(bodyDraft), [bodyDraft]);

  useEffect(() => {
    setValues({});
    setGeneratedFor(null);
    if (template) {
      setName(template.name);
      setBodyDraft(template.body);
    }
  }, [template]);

  const bodyDirty = template !== null && bodyDraft !== template.body;
  const rendered = template ? renderTemplate(bodyDraft, values) : "";
  const html = renderMarkdownToHtml(rendered);
  const unfilled = variables.filter((key) => !values[key]?.trim()).length;

  async function handleGenerate() {
    if (!template) return;

    const result = await generate.mutateAsync({
      templateId: template.id,
      name: name.trim() || template.name,
      clientName: values.client_name?.trim() || undefined,
      variables: values,
    });

    setGeneratedFor(result.clientName ?? result.name);
  }

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center text-faint">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-[26px]">
        <ErrorState message="Failed to load templates" onRetry={() => void refetch()} />
      </div>
    );
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[250px_1fr_1fr]">
      {/* 1 — pick */}
      <div className="min-h-0 overflow-y-auto border-b border-line bg-surface lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-line-2 px-[18px] pb-3 pt-4">
          <span className={COLUMN_LABEL}>Templates</span>
          <button
            type="button"
            onClick={() => {
              setCreating((value) => !value);
            }}
            className="text-[9px] uppercase tracking-[0.12em] text-red hover:underline"
          >
            {creating ? "Cancel" : "+ New"}
          </button>
        </div>

        {creating && (
          <NewTemplateForm
            onCreated={(id) => {
              setSelectedId(id);
              setCreating(false);
            }}
            onCancel={() => {
              setCreating(false);
            }}
          />
        )}

        <TemplateList
          templates={templates}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* 2 — write */}
      <div className="flex min-h-0 flex-col border-b border-line lg:border-b-0 lg:border-r">
        {template ? (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-line px-[18px] py-3.5">
              <span className={COLUMN_LABEL}>Markdown editor</span>
              {bodyDirty ? (
                <button
                  type="button"
                  onClick={() =>
                    void updateTemplate.mutateAsync({ id: template.id, body: bodyDraft })
                  }
                  disabled={updateTemplate.isPending}
                  className="rounded-control border border-red px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-red hover:bg-red-soft disabled:opacity-50"
                >
                  {updateTemplate.isPending ? "Saving…" : `Save as V${template.version + 1}`}
                </button>
              ) : (
                <span className="text-[9px] uppercase tracking-[0.1em] text-faint">
                  {template.category} · V{template.version}
                </span>
              )}
            </div>

            <label className="flex-1">
              <span className="sr-only">Template body</span>
              <textarea
                value={bodyDraft}
                onChange={(e) => {
                  setBodyDraft(e.target.value);
                }}
                spellCheck={false}
                className="h-full min-h-[280px] w-full resize-none bg-surface p-5 text-[11.5px] leading-[1.75] text-ink outline-none"
              />
            </label>

            <div className="flex flex-col gap-2.5 border-t border-line bg-surface px-[18px] py-3.5">
              <div className="flex items-center justify-between gap-3">
                <span className={COLUMN_LABEL}>Dynamic variables</span>
                <span className="text-[9px] text-faint">
                  {variables.length} token{variables.length === 1 ? "" : "s"}
                </span>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-[0.1em] text-faint">
                  Document name
                </span>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="rounded-control border border-line bg-surface-2 px-2.5 py-[7px] text-[11.5px] text-ink outline-none focus:border-red"
                />
              </label>

              <VariablesPanel
                variables={variables}
                values={values}
                onChange={(key, value) => {
                  setValues((prev) => ({ ...prev, [key]: value }));
                }}
              />
            </div>
          </>
        ) : (
          <p className="p-[18px] text-[11px] text-faint">
            Select a template on the left to edit it.
          </p>
        )}
      </div>

      {/* 3 — watch it fill in */}
      <div className="flex min-h-0 flex-col bg-surface-2">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-[18px] py-3.5">
          <span className={COLUMN_LABEL}>Preview</span>

          {template && (
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] uppercase tracking-[0.1em] ${
                  unfilled > 0 ? "text-red" : "text-mid"
                }`}
              >
                {unfilled > 0
                  ? `${unfilled} variable${unfilled === 1 ? "" : "s"} empty`
                  : "All variables filled"}
              </span>
              <button
                type="button"
                onClick={() => void handleGenerate()}
                disabled={generate.isPending}
                className="rounded-control bg-red px-3.5 py-2 text-[9.5px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-85 disabled:opacity-50"
              >
                {generate.isPending ? "Generating…" : "Generate"}
              </button>
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-[26px]">
          {template ? (
            <>
              <PreviewPanel html={html} />

              {generatedFor && (
                <div className="mt-3.5 flex flex-wrap items-center gap-2.5 rounded-input border border-red bg-red-soft px-4 py-3">
                  <StatusDot tone="red" size={6} />
                  <span className="text-[11.5px] text-ink">
                    {name} generated for {generatedFor} and saved to the vault.
                  </span>
                  <span className="flex-1" />
                  <button
                    type="button"
                    onClick={() => void navigate(ROUTES.documentVault)}
                    className="rounded-control border border-red px-2.5 py-1.5 text-[9px] uppercase tracking-[0.12em] text-red hover:bg-red hover:text-white"
                  >
                    Open vault
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-[11px] text-faint">
              Nothing to preview until a template is selected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentsGeneratorPage;
