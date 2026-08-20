import type { TemplateDto } from "@opsora/types";

import { cn } from "@opsora/utils";

interface TemplateListProps {
  templates: TemplateDto[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TemplateList({ templates, selectedId, onSelect }: TemplateListProps) {
  if (templates.length === 0) {
    return (
      <p className="px-3 py-6 text-center text-xs text-faint">
        No templates yet — create one to get started.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => {
            onSelect(template.id);
          }}
          className={cn(
            "flex flex-col items-start rounded-control px-3 py-2.5 text-left",
            template.id === selectedId ? "bg-surface-2 text-ink" : "text-mid hover:bg-surface-2",
          )}
        >
          <span className="text-sm font-medium">{template.name}</span>
          <span className="text-[10px] uppercase tracking-[0.1em] text-faint">
            {template.category} · V{template.version}
          </span>
        </button>
      ))}
    </div>
  );
}
