import { cn } from "@opsora/utils";

import { Spinner } from "@/components/common/Spinner.tsx";
import { useHealth } from "@/hooks/use-health.ts";
import { env } from "@/lib/env.ts";

/** Live connectivity indicator between the web app and the API. */
export function ApiHealthBadge() {
  const { data, isPending, isError, error } = useHealth();

  const state = isPending
    ? { dot: "bg-amber-400", text: "Checking API…" }
    : isError
      ? { dot: "bg-red-500", text: `API unreachable — ${error.message}` }
      : { dot: "bg-emerald-500", text: `API ${data.status} · ${env.apiUrl}` };

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-xs font-medium text-slate-600">
      {isPending ? (
        <Spinner className="size-3 text-amber-500" />
      ) : (
        <span className={cn("size-2 rounded-full", state.dot)} />
      )}
      {state.text}
    </div>
  );
}
