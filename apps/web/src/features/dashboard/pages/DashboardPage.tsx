import { APP_DESCRIPTION, APP_NAME } from "@opsora/config";

import { ApiHealthBadge } from "@/features/dashboard/components/ApiHealthBadge.tsx";

export function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center py-24 text-center">
      <h1 className="text-5xl font-semibold tracking-[0.28em] text-brand-700">
        {APP_NAME}
      </h1>
      <p className="mt-4 text-lg text-slate-600">{APP_DESCRIPTION}</p>

      <div className="mt-10">
        <ApiHealthBadge />
      </div>
    </div>
  );
}

export default DashboardPage;
