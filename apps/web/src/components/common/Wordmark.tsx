import { cn } from "@opsora/utils";

/**
 * The OPSORA mark: a single accent dot held inside a hairline ring — the
 * same "one signal, contained" idea the alert dots use throughout the app.
 */
export function Wordmark({
  size = 28,
  className,
}: {
  size?: 26 | 28;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full border border-line",
        size === 28 ? "size-7" : "size-[26px]",
        className,
      )}
    >
      <span className="size-2 rounded-full bg-red" />
    </span>
  );
}
