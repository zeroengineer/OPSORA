import { useUiStore } from "@/stores/ui-store.ts";

export function Header() {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border-subtle bg-surface px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
          <path
            fillRule="evenodd"
            d="M3 5.5A.75.75 0 0 1 3.75 4.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 5.5Zm0 4.5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Zm0 4.5a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-slate-500">Signed out</span>
      </div>
    </header>
  );
}
