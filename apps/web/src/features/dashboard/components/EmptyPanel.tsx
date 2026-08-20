import { Card } from "@/components/common/Card.tsx";
import { EmptyState } from "@/components/common/EmptyState.tsx";

interface EmptyPanelProps {
  label: string;
  emptyLabel: string;
  hint: string;
}

/** Shared shell for the Alerts / Receivables-Payables / Upcoming Dates panels. */
export function EmptyPanel({ label, emptyLabel, hint }: EmptyPanelProps) {
  return (
    <Card label={label}>
      <EmptyState label={emptyLabel} hint={hint} />
    </Card>
  );
}
