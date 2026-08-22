import { ROUTES } from "@opsora/config";
import { Navigate, Outlet, useLocation } from "react-router";

import { Spinner } from "@/components/common/Spinner.tsx";
import { useSession } from "@/lib/auth-client.ts";

/** Redirects to /login when there is no active session. */
export function RequireAuth() {
  const { data: session, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-faint">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    // Carry the attempted path so a sign-in can return the user to it.
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
