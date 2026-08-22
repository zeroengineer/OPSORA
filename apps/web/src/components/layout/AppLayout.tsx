import { Suspense } from "react";
import { Outlet } from "react-router";

import { Header } from "@/components/layout/Header.tsx";
import { SearchModal } from "@/components/layout/SearchModal.tsx";
import { Sidebar } from "@/components/layout/Sidebar.tsx";
import { Spinner } from "@/components/common/Spinner.tsx";
import { useUiStore } from "@/stores/ui-store.ts";

/**
 * The shell is two floating panels on the page background rather than a
 * full-bleed chrome: an 8px gutter all round, sidebar and content each a
 * bordered 16px-radius card. Nothing outside those panels ever scrolls.
 */
export function AppLayout() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  return (
    <div className="flex h-screen gap-2 overflow-hidden bg-bg p-2">
      <Sidebar open={sidebarOpen} />

      {/* Below lg the sidebar overlays the content, so it needs a scrim. */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => {
            setSidebarOpen(false);
          }}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-card border border-line bg-surface">
        <Header />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex flex-1 items-center justify-center text-faint">
                <Spinner />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </main>

      <SearchModal />
    </div>
  );
}
