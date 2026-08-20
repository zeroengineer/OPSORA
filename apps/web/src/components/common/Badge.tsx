import type { ReactNode } from "react";

import { cn } from "@opsora/utils";

interface BadgeProps {
  tone?: "red" | "ink" | "mid";
  children: ReactNode;
  className?: string;
}

const TONE_CLASS: Record<NonNullable<BadgeProps["tone"]>, string> = {
  red: "text-red border-red/40 bg-red-soft",
  ink: "text-ink border-line bg-surface",
  mid: "text-mid border-line bg-surface",
};

export function Badge({ tone = "mid", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em]",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
