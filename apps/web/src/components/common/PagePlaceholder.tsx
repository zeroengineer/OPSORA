interface PagePlaceholderProps {
  title: string;
  description: string;
}

/** Stand-in for modules that have not been implemented yet. */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="rounded-xl border border-border-subtle bg-surface p-8">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-prose text-sm text-slate-600">{description}</p>
      <p className="mt-6 inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
        Module not implemented yet
      </p>
    </section>
  );
}
