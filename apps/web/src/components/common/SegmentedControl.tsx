import { Pill } from "@/components/common/Pill.tsx";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex gap-0.5">
      {options.map((option) => (
        <Pill
          key={option.value}
          active={option.value === value}
          onClick={() => {
            onChange(option.value);
          }}
        >
          {option.label}
        </Pill>
      ))}
    </div>
  );
}
