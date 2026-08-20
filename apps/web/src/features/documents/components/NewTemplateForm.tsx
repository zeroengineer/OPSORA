import { useState } from "react";

import { useCreateTemplate } from "@/features/documents/hooks/use-save-template.ts";

interface NewTemplateFormProps {
  onCreated: (id: string) => void;
  onCancel: () => void;
}

export function NewTemplateForm({ onCreated, onCancel }: NewTemplateFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [body, setBody] = useState("# {{client_name}}\n\n");
  const [error, setError] = useState<string | null>(null);

  const mutation = useCreateTemplate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !category.trim() || !body.trim()) {
      setError("Name, category and body are required.");
      return;
    }

    try {
      const template = await mutation.mutateAsync({
        name: name.trim(),
        category: category.trim(),
        body,
      });
      onCreated(template.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to create the template");
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-3 p-3">
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="Template name"
        className="rounded-input border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-red"
      />
      <input
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
        placeholder="Category (e.g. Proposals)"
        className="rounded-input border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-red"
      />
      <textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
        }}
        rows={6}
        placeholder="Markdown body with {{variables}}"
        className="rounded-input border border-line bg-surface px-3 py-2 font-mono text-xs text-ink outline-none focus:border-red"
      />

      {error && <p className="text-xs text-red">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 rounded-control bg-ink px-3 py-2 text-xs font-medium text-bg hover:opacity-85 disabled:opacity-50"
        >
          {mutation.isPending ? "Creating…" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-control border border-line px-3 py-2 text-xs text-mid hover:bg-surface-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
