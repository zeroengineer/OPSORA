import { cn } from "@opsora/utils";

interface DotMatrixChartProps {
  series: number[];
  rows?: number;
  className?: string;
}

/**
 * The dashboard's signature chart: each period is a stack of dots rather than
 * a bar, so the reader counts magnitude instead of estimating a height. The
 * top three lit dots in every column carry the accent, which makes the shape
 * of the peaks legible at a glance without a second colour scale.
 *
 * Pure CSS grid — no charting dependency.
 */
export function DotMatrixChart({ series, rows = 11, className }: DotMatrixChartProps) {
  const peak = Math.max(1, ...series.map(Math.abs));

  return (
    <div className={cn("flex items-end gap-[5px] px-0.5", className)}>
      {series.map((value, columnIndex) => {
        const lit = Math.max(
          value === 0 ? 0 : 1,
          Math.round((Math.abs(value) / peak) * rows),
        );
        const negative = value < 0;

        return (
          <div
            key={columnIndex}
            className="flex flex-1 flex-col-reverse items-center gap-1"
          >
            {Array.from({ length: rows }, (_, rowIndex) => (
              <span
                key={rowIndex}
                className={cn(
                  "size-[5px] rounded-full",
                  rowIndex >= lit
                    ? "bg-dot-off"
                    : negative || rowIndex > lit - 3
                      ? "bg-red"
                      : "bg-ink",
                )}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
