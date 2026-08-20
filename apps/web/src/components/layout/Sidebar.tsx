import { APP_NAME, ROUTES } from "@opsora/config";
import { cn } from "@opsora/utils";
import { NavLink } from "react-router";

import { CountChip } from "@/components/common/CountChip.tsx";

interface NavEntry {
  label: string;
  to: string;
}

interface NavGroup {
  label: string;
  items: NavEntry[];
}

/**
 * Nav grouping is presentation-only — it lives here rather than in
 * @opsora/config, which stays scoped to paths/constants with no UI concerns.
 */
const NAV_GROUPS: NavGroup[] = [
  {
    label: "Navigate",
    items: [
      { label: "Dashboard", to: ROUTES.dashboard },
      { label: "Clients", to: ROUTES.clients },
      { label: "Sales Pipeline", to: ROUTES.sales },
      { label: "Invoices", to: ROUTES.invoices },
      { label: "Payments", to: ROUTES.payments },
      { label: "Finance Ledger", to: ROUTES.finance },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "Documents", to: ROUTES.documents },
      { label: "Document Vault", to: ROUTES.documentVault },
      { label: "Knowledge Base", to: ROUTES.knowledgeBase },
    ],
  },
  {
    label: "Signals",
    items: [
      { label: "Business Alerts", to: ROUTES.businessAlerts },
      { label: "Activity History", to: ROUTES.activityHistory },
    ],
  },
];

let chipIndex = 0;
const NAV_INDEX = new Map<string, number>();
for (const group of NAV_GROUPS) {
  for (const item of group.items) {
    chipIndex += 1;
    NAV_INDEX.set(item.to, chipIndex);
  }
}

export function Sidebar({ open }: { open: boolean }) {
  return (
    <aside
      className={cn(
        "shrink-0 overflow-y-auto border-r border-line bg-surface transition-[width] duration-200",
        open ? "w-[264px]" : "w-0 overflow-hidden",
      )}
    >
      <div className="flex h-16 items-center gap-2 px-5">
        <span className="size-2 rounded-full bg-red" />
        <span className="text-sm font-semibold tracking-[0.24em] text-ink">
          {APP_NAME}
        </span>
      </div>

      <nav className="flex flex-col gap-4 px-3 pb-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1 pt-2 text-[10px] uppercase tracking-[0.18em] text-faint">
              {group.label}
            </p>

            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === ROUTES.dashboard}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center gap-2.5 rounded-control px-3 py-2 text-[13px] font-medium transition-colors",
                      isActive
                        ? "bg-surface-2 text-ink shadow-[inset_3px_0_0_var(--color-red)]"
                        : "text-mid hover:bg-surface-2 hover:text-ink",
                    )
                  }
                >
                  <CountChip>{NAV_INDEX.get(item.to)}</CountChip>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
