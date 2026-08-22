import { cn } from "@opsora/utils";

interface StatusDotProps {
  /** red = needs attention · ink = settled · faint = inert · off = unlit */
  tone: "red" | "ink" | "faint" | "off";
  size?: 5 | 6;
  className?: string;
}

const TONE_CLASS: Record<StatusDotProps["tone"], string> = {
  red: "bg-red",
  ink: "bg-ink",
  faint: "bg-faint",
  off: "bg-dot-off",
};

/** The app's smallest unit of meaning: one dot, four states. */
export function StatusDot({ tone, size = 5, className }: StatusDotProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0 rounded-full",
        size === 5 ? "size-[5px]" : "size-1.5",
        TONE_CLASS[tone],
        className,
      )}
    />
  );
}
