import type { ReactNode } from "react";

import { cn } from "@opsora/utils";

interface CountChipProps {
  children: ReactNode;
  variant?: "index" | "count";
  className?: string;
}

export function CountChip({ children, variant = "index", className }: CountChipProps) {
  if (variant === "count") {
    return (
      <span
        className={cn(
          "inline-flex min-w-[18px] items-center justify-center rounded-pill bg-surface px-1.5 py-0.5 text-[9px] font-medium text-faint",
          className,
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-chip bg-surface text-[9px] font-medium text-mid",
        className,
      )}
    >
      {children}
    </span>
  );
}
