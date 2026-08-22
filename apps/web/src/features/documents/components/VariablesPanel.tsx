interface VariablesPanelProps {
  variables: string[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

/** Placeholder copy is derived from the token, so a new variable needs no wiring. */
function hint(key: string): string {
  return key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function VariablesPanel({ variables, values, onChange }: VariablesPanelProps) {
  if (variables.length === 0) {
    return (
      <p className="text-[11px] text-faint">
        This template has no {"{{variables}}"} — it generates as written.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {variables.map((key) => (
        <label key={key} className="flex flex-col gap-1">
          <span className="text-[9px] text-red">
            {"{{"}
            {key}
            {"}}"}
          </span>
          <input
            value={values[key] ?? ""}
            onChange={(e) => {
              onChange(key, e.target.value);
            }}
            placeholder={hint(key)}
            className="rounded-control border border-line bg-surface-2 px-2.5 py-[7px] text-[11.5px] text-ink outline-none placeholder:text-faint focus:border-red"
          />
        </label>
      ))}
    </div>
  );
}
