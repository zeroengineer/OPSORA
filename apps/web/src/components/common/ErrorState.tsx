import { StatusDot } from "@/components/common/StatusDot.tsx";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-card border border-red bg-red-soft px-4 py-3.5">
      <div className="flex items-center gap-2.5">
        <StatusDot tone="red" size={6} />
        <p className="text-[9px] uppercase tracking-[0.16em] text-red">{title}</p>
      </div>

      <p className="text-[12.5px] text-ink text-pretty">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-control border border-line px-3 py-1.5 text-[9.5px] uppercase tracking-[0.14em] text-ink transition-colors hover:border-red"
        >
          Try again
        </button>
      )}
    </div>
  );
}
