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
      <p className="px-[18px] py-8 text-center text-[11px] leading-relaxed text-faint text-pretty">
        No templates yet. Create one and it becomes the starting point for every
        document generated from it.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {templates.map((template) => {
        const active = template.id === selectedId;

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => {
              onSelect(template.id);
            }}
            className={cn(
              "flex flex-col items-start gap-[5px] border-b border-line-2 px-[18px] py-3.5 text-left transition-colors",
              active
                ? "bg-surface-2 shadow-[inset_2px_0_0_var(--color-red)]"
                : "hover:bg-surface-2",
            )}
          >
            <span className="text-[12.5px] font-medium text-ink">{template.name}</span>
            <span className="text-[9px] uppercase tracking-[0.1em] text-faint">
              {template.category} · V{template.version}
            </span>
          </button>
        );
      })}
    </div>
  );
}
