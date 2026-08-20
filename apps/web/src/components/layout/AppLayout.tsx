import { Suspense } from "react";
import { Outlet } from "react-router";

import { Header } from "@/components/layout/Header.tsx";
import { Sidebar } from "@/components/layout/Sidebar.tsx";
import { Spinner } from "@/components/common/Spinner.tsx";
import { useUiStore } from "@/stores/ui-store.ts";

export function AppLayout() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);

  return (
    <div className="flex h-full">
      <Sidebar open={sidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <Suspense
            fallback={
              <div className="flex justify-center p-12 text-slate-400">
                <Spinner />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
