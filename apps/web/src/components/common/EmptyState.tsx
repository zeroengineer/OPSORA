import { cn } from "@opsora/utils";
import { StatusDot } from "@/components/common/StatusDot.tsx";

interface EmptyStateProps {
  label: string;
  hint?: string;
  className?: string;
}

/** Genuine "no data yet" state — never replace this with fabricated numbers. */
export function EmptyState({ label, hint, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-5 py-10 text-center",
        className,
      )}
    >
      <StatusDot tone="off" />
      <p className="text-[10px] uppercase tracking-[0.16em] text-faint">{label}</p>
      {hint && (
        <p className="max-w-[240px] text-[11px] leading-relaxed text-mid text-pretty">
          {hint}
        </p>
      )}
    </div>
  );
}
