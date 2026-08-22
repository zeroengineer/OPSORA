import type { ReactNode } from "react";

import { cn } from "@opsora/utils";

interface PillProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

/** Filter and segmented-control button: filled ink when active. */
export function Pill({ active = false, onClick, children, className }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-pill border px-[11px] py-1.5 text-[9px] uppercase tracking-[0.14em] transition-colors",
        active
          ? "border-ink bg-ink text-bg"
          : "border-line text-mid hover:border-faint hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}
