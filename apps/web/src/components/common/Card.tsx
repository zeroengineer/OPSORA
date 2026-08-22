import type { ReactNode } from "react";

import { cn } from "@opsora/utils";
import { StatusDot } from "@/components/common/StatusDot.tsx";

interface CardProps {
  label?: string;
  /** Prefix the label with the accent dot, marking the panel as a signal. */
  accent?: boolean;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Surface-2 panel with the recurring uppercase-label header row. */
export function Card({
  label,
  accent = false,
  actions,
  children,
  className,
  bodyClassName,
}: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-card border border-line bg-surface-2",
        className,
      )}
    >
      {label && (
        <div className="flex shrink-0 items-center gap-2 border-b border-line-2 px-[18px] pb-[11px] pt-[15px]">
          {accent && <StatusDot tone="red" />}
          <span className="text-[9px] uppercase tracking-[0.16em] text-mid">
            {label}
          </span>
          {actions && <div className="ml-auto">{actions}</div>}
        </div>
      )}
      <div className={cn("min-h-0", bodyClassName)}>{children}</div>
    </div>
  );
}
