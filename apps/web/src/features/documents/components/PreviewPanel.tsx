interface PreviewPanelProps {
  html: string;
}

/**
 * The generated document, shown as a sheet floating on the panel ground —
 * the one place in the app where the surface reads as paper rather than UI.
 */
export function PreviewPanel({ html }: PreviewPanelProps) {
  return (
    <div
      className="prose-doc min-h-[420px] rounded-badge border border-line bg-surface px-8 py-[34px] shadow-[0_1px_0_var(--color-line)]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
