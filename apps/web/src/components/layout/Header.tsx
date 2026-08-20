import { initials } from "@opsora/utils";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

import { useUiStore } from "@/stores/ui-store.ts";
import { signOut, useSession } from "@/lib/auth-client.ts";

/** Path segment → readable breadcrumb label. */
function titleFromPath(pathname: string): string {
  if (pathname === "/") return "Dashboard";

  const last = pathname.split("/").filter(Boolean).pop() ?? "";
  return last
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export function Header() {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const openSearch = useUiStore((state) => state.openSearch);
  const { data: session } = useSession();
  const location = useLocation();
  const navigate = useNavigate();

  const title = useMemo(() => titleFromPath(location.pathname), [location.pathname]);

  async function handleSignOut() {
    await signOut();
    void navigate("/login", { replace: true });
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b border-line bg-surface px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
        className="rounded-control p-2 text-mid hover:bg-surface-2 hover:text-ink"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
          <path
            fillRule="evenodd"
            d="M3 5.5A.75.75 0 0 1 3.75 4.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.5Zm0 4.5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Zm0 4.5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.16em] text-faint">
          OPSORA / {title}
        </span>
        <span className="text-sm font-medium text-ink">{title}</span>
      </div>

      <button
        type="button"
        onClick={openSearch}
        className="ml-auto flex items-center gap-3 rounded-control border border-line px-3 py-1.5 text-xs text-mid hover:border-faint hover:text-ink"
      >
        Search everything
        <span className="rounded-chip bg-surface-2 px-1.5 py-0.5 text-[10px] text-faint">
          ⌘K
        </span>
      </button>

      {session?.user && (
        <div className="flex items-center gap-3 border-l border-line pl-4">
          <span className="flex size-8 items-center justify-center rounded-full bg-surface-2 text-[11px] font-medium text-ink">
            {initials(session.user.name)}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium text-ink">{session.user.name}</span>
            <span className="text-[10px] text-faint">{session.user.email}</span>
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            aria-label="Sign out"
            className="rounded-control p-1.5 text-faint hover:bg-surface-2 hover:text-ink"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
              <path
                fillRule="evenodd"
                d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}
