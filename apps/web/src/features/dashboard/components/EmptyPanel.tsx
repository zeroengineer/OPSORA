import { Card } from "@/components/common/Card.tsx";
import { EmptyState } from "@/components/common/EmptyState.tsx";

interface EmptyPanelProps {
  label: string;
  accent?: boolean;
  emptyLabel: string;
  hint: string;
  className?: string;
}

/**
 * Shared shell for the Alerts / Receivables-Payables / Upcoming Dates panels.
 * These modules have no data source yet, so the panels state that plainly
 * rather than standing in for it with sample rows.
 */
export function EmptyPanel({
  label,
  accent,
  emptyLabel,
  hint,
  className,
}: EmptyPanelProps) {
  return (
    <Card label={label} accent={accent} className={className} bodyClassName="flex-1">
      <EmptyState label={emptyLabel} hint={hint} className="h-full" />
    </Card>
  );
}
