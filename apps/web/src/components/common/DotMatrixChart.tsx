import { cn } from "@opsora/utils";

interface DotMatrixChartProps {
  series: number[];
  max?: number;
  rows?: number;
  height?: "sm" | "lg";
  className?: string;
}

/** Pure CSS-grid dot-matrix bar chart — no charting dependency. */
export function DotMatrixChart({
  series,
  max,
  rows = 11,
  height = "lg",
  className,
}: DotMatrixChartProps) {
  const peak = max ?? Math.max(1, ...series);
  const dotSize = height === "lg" ? "size-1.5" : "size-1";
  const gap = height === "lg" ? "gap-1" : "gap-0.5";

  return (
    <div className={cn("flex items-end", gap, className)}>
      {series.map((value, columnIndex) => {
        const filled = Math.round((Math.max(0, value) / peak) * rows);

        return (
          <div key={columnIndex} className={cn("flex flex-col-reverse", gap)}>
            {Array.from({ length: rows }, (_, rowIndex) => (
              <span
                key={rowIndex}
                className={cn(
                  dotSize,
                  "rounded-full",
                  rowIndex < filled
                    ? value < 0
                      ? "bg-red"
                      : "bg-ink"
                    : "bg-dot-off",
                )}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
