interface ModuleStubProps {
  index: number;
  total: number;
  title: string;
  description: string;
}

/**
 * Restyled version of the mockup's own "not yet designed" placeholder —
 * used for every nav item that isn't one of the four screens actually
 * built out (Dashboard, Finance Ledger, Documents, Document Vault).
 */
export function ModuleStub({ index, total, title, description }: ModuleStubProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={
              "size-1.5 rounded-full " +
              (i === index - 1 ? "bg-red" : "bg-dot-off")
            }
          />
        ))}
      </div>

      <p className="text-[10px] uppercase tracking-[0.2em] text-faint">
        Module {index}/{total} · Specified, not yet designed
      </p>

      <h1 className="text-2xl font-medium text-ink">{title}</h1>

      <p className="max-w-md text-sm leading-relaxed text-mid">{description}</p>
    </div>
  );
}
