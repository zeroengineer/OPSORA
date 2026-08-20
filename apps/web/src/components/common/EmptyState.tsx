interface EmptyStateProps {
  label: string;
  hint?: string;
}

/** Genuine "no data yet" state — never replace this with fabricated numbers. */
export function EmptyState({ label, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-4 py-8 text-center">
      <p className="text-[11px] uppercase tracking-[0.12em] text-faint">{label}</p>
      {hint && <p className="max-w-[220px] text-xs text-mid">{hint}</p>}
    </div>
  );
}
