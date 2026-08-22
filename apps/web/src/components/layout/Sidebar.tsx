import { APP_NAME, ROUTES } from "@opsora/config";
import { cn } from "@opsora/utils";
import { NavLink, useNavigate } from "react-router";

import { Wordmark } from "@/components/common/Wordmark.tsx";
import { StatusDot } from "@/components/common/StatusDot.tsx";
import { NAV_GROUPS } from "@/lib/modules.ts";
import { signOut } from "@/lib/auth-client.ts";
import { useUiStore } from "@/stores/ui-store.ts";

export function Sidebar({ open }: { open: boolean }) {
  const navigate = useNavigate();
  const openSearch = useUiStore((state) => state.openSearch);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  async function handleSignOut() {
    await signOut();
    void navigate(ROUTES.login, { replace: true });
  }

  return (
    <aside
      className={cn(
        "z-40 w-[264px] shrink-0 flex-col overflow-hidden rounded-card border border-line bg-surface",
        "fixed inset-y-2 left-2 lg:static lg:flex",
        open ? "flex" : "hidden",
      )}
    >
      <div className="flex shrink-0 items-center gap-[11px] border-b border-line-2 px-4 pb-3.5 pt-4">
        <Wordmark />
        <span className="flex-1 text-[13px] font-semibold tracking-[0.14em] text-ink">
          {APP_NAME}
        </span>
        <span className="text-[9px] text-faint">MVP</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-3 pt-1.5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="flex items-center justify-between px-2.5 pb-1.5 pt-3">
              <span className="text-[9px] uppercase tracking-[0.18em] text-mid">
                {group.label}
              </span>
              <span className="text-[9px] text-faint tabular-nums">
                {String(group.items.length).padStart(2, "0")}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.route}
                  to={item.route}
                  onClick={() => {
                    setSidebarOpen(false);
                  }}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-[11px] rounded-control px-2.5 py-2 text-xs transition-colors",
                      isActive
                        ? "bg-surface-2 font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-line)]"
                        : "text-mid hover:bg-surface-2",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-chip text-[8.5px] tabular-nums",
                          isActive
                            ? "bg-red text-white"
                            : "bg-surface-2 text-faint group-hover:text-mid",
                        )}
                      >
                        {String(item.ordinal).padStart(2, "0")}
                      </span>

                      <span className="flex-1 truncate text-left">{item.navLabel}</span>

                      {!item.live && (
                        <span title="Specified, not yet built">
                          <StatusDot tone="off" />
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex shrink-0 flex-col gap-0.5 border-t border-line-2 p-2">
        <UtilityButton mark="S" label="Search" hint="⌘K" onClick={openSearch} />
        <UtilityButton
          mark="?"
          label="Help & guides"
          onClick={() => {
            setSidebarOpen(false);
            void navigate(ROUTES.knowledgeBase);
          }}
        />
        <UtilityButton mark="→" label="Sign out" onClick={() => void handleSignOut()} />
      </div>
    </aside>
  );
}

function UtilityButton({
  mark,
  label,
  hint,
  onClick,
}: {
  mark: string;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[11px] rounded-control px-2.5 py-2.5 text-mid transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <span className="flex size-5 shrink-0 items-center justify-center rounded-chip border border-line text-[8.5px]">
        {mark}
      </span>
      <span className="flex-1 text-left text-xs">{label}</span>
      {hint && <span className="text-[9px] text-faint">{hint}</span>}
    </button>
  );
}
