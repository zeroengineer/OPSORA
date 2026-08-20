import { cn } from "@opsora/utils";

interface StatusDotProps {
  tone: "red" | "ink" | "off";
  size?: 5 | 6;
  className?: string;
}

const TONE_CLASS: Record<StatusDotProps["tone"], string> = {
  red: "bg-red",
  ink: "bg-ink",
  off: "bg-dot-off",
};

export function StatusDot({ tone, size = 5, className }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full",
        size === 5 ? "size-[5px]" : "size-1.5",
        TONE_CLASS[tone],
        className,
      )}
    />
  );
}
