import { APP_NAME } from "@opsora/config";
import { initials } from "@opsora/utils";
import { useMemo } from "react";
import { useLocation } from "react-router";

import { moduleByRoute } from "@/lib/modules.ts";
import { useUiStore } from "@/stores/ui-store.ts";
import { useSession } from "@/lib/auth-client.ts";

export function Header() {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const openSearch = useUiStore((state) => state.openSearch);
  const { data: session } = useSession();
  const location = useLocation();

  const title = useMemo(
    () => moduleByRoute(location.pathname)?.title ?? "Dashboard",
    [location.pathname],
  );

  return (
    <header className="flex h-[66px] shrink-0 items-center gap-6 border-b border-line bg-surface px-4 sm:px-[30px]">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
        className="-ml-1 rounded-control p-2 text-mid hover:bg-surface-2 hover:text-ink lg:hidden"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
          <path
            fillRule="evenodd"
            d="M3 5.5A.75.75 0 0 1 3.75 4.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.5Zm0 4.5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Zm0 4.5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="flex min-w-0 flex-col gap-[3px]">
        <span className="truncate text-[9px] uppercase tracking-[0.2em] text-faint">
          {APP_NAME} / {title}
        </span>
        <span className="truncate text-base font-semibold tracking-[-0.01em] text-ink">
          {title}
        </span>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={openSearch}
        className="hidden w-[280px] items-center gap-2.5 rounded-control border border-line bg-surface-2 px-3 py-2.5 transition-colors hover:border-red md:flex"
      >
        <span className="text-[11px] text-faint">Search everything</span>
        <span className="flex-1" />
        <span className="rounded-chip border border-line px-1.5 py-0.5 text-[9px] text-faint">
          ⌘K
        </span>
      </button>

      <button
        type="button"
        onClick={openSearch}
        aria-label="Search everything"
        className="rounded-control p-2 text-mid hover:bg-surface-2 hover:text-ink md:hidden"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-[18px]">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 3.472 9.772l3.128 3.128a.75.75 0 1 0 1.06-1.06l-3.128-3.128A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {session?.user && (
        <div className="flex items-center gap-2.5 border-l border-line pl-4">
          <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-ink text-[11px] font-medium text-bg">
            {initials(session.user.name)}
          </span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-[11.5px] font-medium text-ink">
              {session.user.name}
            </span>
            <span className="text-[9px] text-faint">{session.user.email}</span>
          </div>
        </div>
      )}
    </header>
  );
}
