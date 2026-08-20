import { cn } from "@opsora/utils";

interface PreviewPanelProps {
  html: string;
  unfilledCount: number;
}

export function PreviewPanel({ html, unfilledCount }: PreviewPanelProps) {
  return (
    <div>
      <p
        className={cn(
          "mb-4 text-[10px] uppercase tracking-[0.12em]",
          unfilledCount > 0 ? "text-red" : "text-mid",
        )}
      >
        {unfilledCount > 0
          ? `${unfilledCount} variable${unfilledCount === 1 ? "" : "s"} empty`
          : "All variables filled"}
      </p>

      <div
        className="prose-doc text-sm leading-relaxed text-ink"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
