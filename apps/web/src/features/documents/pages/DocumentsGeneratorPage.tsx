import { ROUTES } from "@opsora/config";
import { extractTemplateVariables, renderMarkdownToHtml, renderTemplate } from "@opsora/utils";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { Card } from "@/components/common/Card.tsx";
import { ErrorState } from "@/components/common/ErrorState.tsx";
import { Spinner } from "@/components/common/Spinner.tsx";
import { PreviewPanel } from "@/features/documents/components/PreviewPanel.tsx";
import { NewTemplateForm } from "@/features/documents/components/NewTemplateForm.tsx";
import { TemplateList } from "@/features/documents/components/TemplateList.tsx";
import { VariablesPanel } from "@/features/documents/components/VariablesPanel.tsx";
import { useGenerateDocument } from "@/features/documents/hooks/use-generate-document.ts";
import { useUpdateTemplate } from "@/features/documents/hooks/use-save-template.ts";
import { useTemplates } from "@/features/documents/hooks/use-templates.ts";

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

  const variables = useMemo(
    () => extractTemplateVariables(bodyDraft),
    [bodyDraft],
  );

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
  const unfilledCount = variables.filter((key) => !values[key]?.trim()).length;

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
      <div className="flex justify-center py-24 text-faint">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="Failed to load templates" onRetry={() => void refetch()} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr_1fr]">
      <Card
        label="Templates"
        bodyClassName="p-2"
        actions={
          <button
            type="button"
            onClick={() => {
              setCreating((value) => !value);
            }}
            className="text-[10px] uppercase tracking-[0.12em] text-red hover:underline"
          >
            {creating ? "Cancel" : "+ New"}
          </button>
        }
      >
        {creating ? (
          <NewTemplateForm
            onCreated={(id) => {
              setSelectedId(id);
              setCreating(false);
            }}
            onCancel={() => {
              setCreating(false);
            }}
          />
        ) : (
          <TemplateList
            templates={templates}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
            }}
          />
        )}
      </Card>

      <Card label="Markdown editor" bodyClassName="flex flex-col gap-4 p-4">
        {template ? (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.1em] text-faint">
                Document name
              </span>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="rounded-input border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-red"
              />
            </label>

            <textarea
              value={bodyDraft}
              onChange={(e) => {
                setBodyDraft(e.target.value);
              }}
              rows={14}
              className="rounded-input border border-line bg-surface px-3 py-2 font-mono text-xs text-ink outline-none focus:border-red"
            />

            {bodyDirty && (
              <button
                type="button"
                onClick={() =>
                  void updateTemplate.mutateAsync({ id: template.id, body: bodyDraft })
                }
                disabled={updateTemplate.isPending}
                className="self-start rounded-control border border-line px-3 py-1.5 text-xs text-ink hover:bg-surface-2 disabled:opacity-50"
              >
                {updateTemplate.isPending ? "Saving…" : "Save changes (bumps version)"}
              </button>
            )}

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.14em] text-faint">
                Dynamic variables
              </p>
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
          <p className="text-xs text-faint">No template selected.</p>
        )}
      </Card>

      <Card label="Preview" bodyClassName="flex flex-col gap-4 p-4">
        {template ? (
          <>
            <PreviewPanel html={html} unfilledCount={unfilledCount} />

            {generatedFor && (
              <div className="rounded-input border border-line bg-red-soft p-3 text-xs text-ink">
                <p>
                  “{name}” generated{generatedFor ? ` for ${generatedFor}` : ""} and saved to the
                  vault.
                </p>
                <button
                  type="button"
                  onClick={() => void navigate(ROUTES.documentVault)}
                  className="mt-2 rounded-control border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-2"
                >
                  Open vault
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={generate.isPending}
              className="mt-auto rounded-control bg-red px-4 py-2.5 text-sm font-medium text-white hover:opacity-85 disabled:opacity-50"
            >
              {generate.isPending ? "Generating…" : "Generate"}
            </button>
          </>
        ) : (
          <p className="text-xs text-faint">Select a template to preview it.</p>
        )}
      </Card>
    </div>
  );
}

export default DocumentsGeneratorPage;
