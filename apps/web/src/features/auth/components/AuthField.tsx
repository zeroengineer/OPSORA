import type { InputHTMLAttributes } from "react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function AuthField({ label, id, ...inputProps }: AuthFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.14em] text-faint">{label}</span>
      <input
        id={id}
        {...inputProps}
        className="rounded-input border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-red"
      />
    </label>
  );
}
