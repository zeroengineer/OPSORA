interface VariablesPanelProps {
  variables: string[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export function VariablesPanel({ variables, values, onChange }: VariablesPanelProps) {
  if (variables.length === 0) {
    return <p className="text-xs text-faint">This template has no {"{{variables}}"}.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {variables.map((key) => (
        <label key={key} className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.1em] text-faint">
            {"{{"}
            {key}
            {"}}"}
          </span>
          <input
            value={values[key] ?? ""}
            onChange={(e) => {
              onChange(key, e.target.value);
            }}
            className="rounded-input border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-red"
          />
        </label>
      ))}
    </div>
  );
}
