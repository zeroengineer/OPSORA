import type { RecentActivityItem } from "@opsora/types";

import { Card } from "@/components/common/Card.tsx";
import { EmptyState } from "@/components/common/EmptyState.tsx";

/**
 * Activity is stamped relative to now — "09:42" today, "YEST", then the date.
 * The absolute timestamp stays on the element's title for anything older.
 */
function stamp(iso: string): string {
  const at = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayDiff = Math.floor((startOfToday.getTime() - at.getTime()) / 86_400_000);

  if (dayDiff < 0) {
    return at.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  if (dayDiff === 0) return "YEST";

  return at
    .toLocaleDateString("en-US", { day: "2-digit", month: "short" })
    .toUpperCase();
}

export function RecentActivityPanel({ items }: { items: RecentActivityItem[] }) {
  return (
    <Card label="Recent activity">
      {items.length === 0 ? (
        <EmptyState
          label="No activity yet"
          hint="Record a transaction or generate a document to see it here."
        />
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-1.5 border-b border-line-2 px-[18px] py-3.5 last:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <span
                className="text-[9px] tracking-[0.08em] text-red"
                title={new Date(item.occurredAt).toLocaleString("en-US")}
              >
                {stamp(item.occurredAt)}
              </span>
              <span className="text-[11px] leading-[1.45] text-mid text-pretty">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
