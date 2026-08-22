import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Spinner } from "@/components/common/Spinner.tsx";
import { StatusDot } from "@/components/common/StatusDot.tsx";
import { useSearch } from "@/hooks/use-search.ts";
import { useUiStore } from "@/stores/ui-store.ts";

/** Two-letter code chip standing in for the result's source module. */
function code(category: string): string {
  return category.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase();
}

export function SearchModal() {
  const searchOpen = useUiStore((state) => state.searchOpen);
  const openSearch = useUiStore((state) => state.openSearch);
  const closeSearch = useUiStore((state) => state.closeSearch);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data, isFetching } = useSearch(query);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
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
      role="presentation"
      className="fixed inset-0 z-60 flex justify-center bg-black/45 px-4 pt-[12vh]"
      onClick={closeSearch}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search everything"
        className="h-fit w-full max-w-[520px] overflow-hidden rounded-panel border border-line bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center gap-3 border-b border-line px-[18px] py-3.5">
          <StatusDot tone="red" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-faint"
          />
          {isFetching && <Spinner className="size-3 text-faint" />}
          <span className="rounded-chip border border-line px-[7px] py-[3px] text-[8.5px] tracking-[0.1em] text-faint">
            ESC
          </span>
        </div>

        <div className="max-h-[360px] overflow-y-auto p-1.5">
          {!hasQuery && (
            <p className="px-3 py-[34px] text-center text-[11px] tracking-[0.08em] text-faint">
              Search the finance ledger, templates and the document vault.
            </p>
          )}

          {hasQuery && !isFetching && groups.length === 0 && (
            <p className="px-3 py-[34px] text-center text-[11px] uppercase tracking-[0.08em] text-faint">
              No matches
            </p>
          )}

          {groups.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-2 px-3 pb-1.5 pt-2.5">
                <span className="text-[8.5px] uppercase tracking-[0.16em] text-faint">
                  {group.category}
                </span>
                <span className="h-px flex-1 bg-line-2" />
              </div>

              {group.results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => {
                    closeSearch();
                    void navigate(result.href);
                  }}
                  className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left hover:bg-surface-2"
                >
                  <span className="grid size-[22px] shrink-0 place-items-center rounded-[7px] bg-surface-2 text-[9px] text-red">
                    {code(group.category)}
                  </span>
                  <span className="flex-1 truncate text-[12.5px] text-ink">
                    {result.label}
                  </span>
                  {result.sublabel && (
                    <span className="shrink-0 text-[9.5px] text-faint">
                      {result.sublabel}
                    </span>
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
