import type { ReactNode } from "react";

import { cn } from "@opsora/utils";

interface CardProps {
  label?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Surface-2 panel with the recurring accent-dot + uppercase-label header row. */
export function Card({ label, actions, children, className, bodyClassName }: CardProps) {
  return (
    <div className={cn("rounded-card border border-line bg-surface-2", className)}>
      {label && (
        <div className="flex items-center gap-2 border-b border-line-2 px-4 py-3">
          <span className="size-[5px] rounded-full bg-red" />
          <span className="text-[10px] uppercase tracking-[0.14em] text-faint">
            {label}
          </span>
          {actions && <div className="ml-auto">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
