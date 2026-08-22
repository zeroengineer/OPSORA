import { ROUTES } from "@opsora/config";
import { cn } from "@opsora/utils";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { signIn } from "@/lib/auth-client.ts";
import { AuthField } from "@/features/auth/components/AuthField.tsx";
import { AuthLayout } from "@/features/auth/components/AuthLayout.tsx";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Set by RequireAuth when it bounced an authenticated-only path.
  const from = (location.state as { from?: string } | null)?.from;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: signInError } = await signIn.email({ email, password, rememberMe });

    setSubmitting(false);
    if (signInError) {
      setError(signInError.message ?? "That email and password did not match.");
      return;
    }

    void navigate(from ?? ROUTES.dashboard, { replace: true });
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Pick up where you left off."
      pitch="Everything the company runs on, behind one login."
      points={[
        "Finance ledger and generated documents in one view",
        "Documents kept versioned automatically",
        "Built to expand as new modules ship",
      ]}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-3">
        <AuthField
          id="email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            aria-pressed={rememberMe}
            onClick={() => {
              setRememberMe((value) => !value);
            }}
            className="flex w-fit items-center gap-2.5 py-1 text-mid hover:text-ink"
          >
            <span
              className={cn(
                "size-3.5 shrink-0 rounded-[5px]",
                rememberMe
                  ? "bg-red shadow-[inset_0_0_0_1px_var(--color-red)]"
                  : "shadow-[inset_0_0_0_1px_var(--color-faint)]",
              )}
            />
            <span className="text-[11px]">Keep me signed in</span>
          </button>

          <Link
            to={ROUTES.forgotPassword}
            className="text-[11px] text-mid hover:text-ink"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="rounded-input border border-red bg-red-soft px-3 py-2 text-[11px] text-ink">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 rounded-pill bg-red py-3.5 text-[11.5px] uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="flex justify-center gap-2 text-[11px] text-mid">
        No workspace yet?
        <Link to={ROUTES.signup} className="text-red hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
