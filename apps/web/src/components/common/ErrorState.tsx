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
    <div className="rounded-card border border-line bg-red-soft p-4 text-sm text-ink">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-mid">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-control border border-line px-3 py-1.5 font-medium text-ink hover:bg-surface-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}
