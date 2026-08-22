import { cn } from "@opsora/utils";

interface SparklineProps {
  series: number[];
  /** Draw the bars in the accent instead of the muted rule colour. */
  accent?: boolean;
  className?: string;
}

const TRACK_PX = 10;

/**
 * Ten-pixel bar strip under each KPI value. Deliberately unlabelled: it shows
 * shape only, and the number above it carries the magnitude.
 */
export function Sparkline({ series, accent = false, className }: SparklineProps) {
  const peak = Math.max(1, ...series.map(Math.abs));

  return (
    <div className={cn("flex h-2.5 items-end gap-0.5", className)} aria-hidden>
      {series.map((value, index) => (
        <span
          key={index}
          className={cn(
            "w-1 rounded-pill",
            value < 0 ? "bg-red" : accent ? "bg-red" : "bg-faint",
          )}
          style={{
            height: `${String(Math.max(2, Math.round((Math.abs(value) / peak) * TRACK_PX)))}px`,
          }}
        />
      ))}
    </div>
  );
}
