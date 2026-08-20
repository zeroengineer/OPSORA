import type { RecentActivityItem } from "@opsora/types";
import { formatDateTime } from "@opsora/utils";

import { Card } from "@/components/common/Card.tsx";
import { EmptyState } from "@/components/common/EmptyState.tsx";

export function RecentActivityPanel({ items }: { items: RecentActivityItem[] }) {
  return (
    <Card label="Recent activity">
      {items.length === 0 ? (
        <EmptyState
          label="No activity yet"
          hint="Record a transaction or generate a document to see it here."
        />
      ) : (
        <ul className="divide-y divide-line-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-baseline gap-4 px-4 py-3">
              <span className="w-32 shrink-0 text-[10px] uppercase tracking-[0.1em] text-faint">
                {formatDateTime(item.occurredAt)}
              </span>
              <span className="text-sm text-ink">{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
