import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Spinner } from "@/components/common/Spinner.tsx";
import { useSearch } from "@/hooks/use-search.ts";
import { useUiStore } from "@/stores/ui-store.ts";

export function SearchModal() {
  const searchOpen = useUiStore((state) => state.searchOpen);
  const openSearch = useUiStore((state) => state.openSearch);
  const closeSearch = useUiStore((state) => state.closeSearch);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data, isFetching } = useSearch(query);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        openSearch();
      } else if (event.key === "Escape") {
        closeSearch();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openSearch, closeSearch]);

  useEffect(() => {
    if (!searchOpen) setQuery("");
  }, [searchOpen]);

  if (!searchOpen) return null;

  const groups = data?.groups ?? [];
  const hasQuery = query.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black/45 pt-[12vh]"
      onClick={closeSearch}
    >
      <div
        className="h-fit w-full max-w-lg rounded-panel border border-line bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search everything…"
          className="w-full border-b border-line bg-transparent px-5 py-4 text-sm text-ink outline-none placeholder:text-faint"
        />

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {!hasQuery && (
            <p className="px-3 py-6 text-center text-xs text-faint">
              Start typing to search the finance ledger and documents.
            </p>
          )}

          {hasQuery && isFetching && (
            <div className="flex justify-center py-6 text-faint">
              <Spinner />
            </div>
          )}

          {hasQuery && !isFetching && groups.length === 0 && (
            <p className="px-3 py-6 text-center text-xs uppercase tracking-[0.14em] text-faint">
              No matches
            </p>
          )}

          {groups.map((group) => (
            <div key={group.category} className="mb-2">
              <p className="px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-faint">
                {group.category}
              </p>
              {group.results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => {
                    closeSearch();
                    void navigate(result.href);
                  }}
                  className="flex w-full flex-col items-start rounded-control px-3 py-2 text-left hover:bg-surface-2"
                >
                  <span className="text-sm text-ink">{result.label}</span>
                  {result.sublabel && (
                    <span className="text-xs text-faint">{result.sublabel}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
