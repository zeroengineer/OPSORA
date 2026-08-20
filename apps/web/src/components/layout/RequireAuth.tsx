import { Navigate, Outlet } from "react-router";

import { Spinner } from "@/components/common/Spinner.tsx";
import { useSession } from "@/lib/auth-client.ts";

/** Redirects to /login when there is no active session. */
export function RequireAuth() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-faint">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
