import { useState } from "react";

import { useCreateTemplate } from "@/features/documents/hooks/use-save-template.ts";

interface NewTemplateFormProps {
  onCreated: (id: string) => void;
  onCancel: () => void;
}

const FIELD_CLASS =
  "rounded-control border border-line bg-surface-2 px-2.5 py-2 text-[11.5px] text-ink outline-none placeholder:text-faint focus:border-red";

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
      setError("Name, category and body are all required.");
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
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="flex flex-col gap-2.5 border-b border-line-2 p-[18px]"
    >
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="Template name"
        className={FIELD_CLASS}
      />
      <input
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
        placeholder="Category, e.g. Proposals"
        className={FIELD_CLASS}
      />
      <textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
        }}
        rows={6}
        placeholder="Markdown body with {{variables}}"
        className={`${FIELD_CLASS} resize-none leading-[1.7]`}
      />

      {error && <p className="text-[11px] text-red">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 rounded-control bg-ink px-3 py-2 text-[9.5px] uppercase tracking-[0.14em] text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {mutation.isPending ? "Creating…" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-control border border-line px-3 py-2 text-[9.5px] uppercase tracking-[0.14em] text-mid hover:border-red hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
