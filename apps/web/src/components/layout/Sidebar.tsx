import { APP_NAME, ROUTES } from "@opsora/config";
import { cn } from "@opsora/utils";
import { NavLink } from "react-router";

import type { NavItem } from "@/types/index.ts";

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: ROUTES.dashboard },
  { label: "Clients", to: ROUTES.clients },
  { label: "Sales", to: ROUTES.sales },
  { label: "Finance", to: ROUTES.finance },
  { label: "Documents", to: ROUTES.documents },
  { label: "Knowledge Base", to: ROUTES.knowledgeBase },
];

export function Sidebar({ open }: { open: boolean }) {
  return (
    <aside
      className={cn(
        "shrink-0 border-r border-border-subtle bg-surface transition-[width] duration-200",
        open ? "w-60" : "w-0 overflow-hidden",
      )}
    >
      <div className="flex h-16 items-center px-6">
        <span className="text-sm font-semibold tracking-[0.2em] text-brand-700">
          {APP_NAME}
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3 pb-6">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === ROUTES.dashboard}
            className={({ isActive }) =>
              cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
