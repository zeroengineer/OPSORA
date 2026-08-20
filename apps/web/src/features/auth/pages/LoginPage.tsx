import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { signIn } from "@/lib/auth-client.ts";
import { AuthField } from "@/features/auth/components/AuthField.tsx";
import { AuthLayout } from "@/features/auth/components/AuthLayout.tsx";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: signInError } = await signIn.email({ email, password });

    setSubmitting(false);
    if (signInError) {
      setError(signInError.message ?? "Sign in failed");
      return;
    }

    void navigate("/", { replace: true });
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
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
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

        {error && (
          <p className="rounded-input border border-line bg-red-soft px-3 py-2 text-xs text-ink">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-pill bg-red px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-mid">
        No workspace yet?{" "}
        <Link to="/signup" className="text-red hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
