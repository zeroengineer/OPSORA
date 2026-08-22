import { MIN_PASSWORD_LENGTH, ROUTES } from "@opsora/config";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { signUp } from "@/lib/auth-client.ts";
import { AuthField } from "@/features/auth/components/AuthField.tsx";
import { AuthLayout } from "@/features/auth/components/AuthLayout.tsx";

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${String(MIN_PASSWORD_LENGTH)} characters for the password.`);
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await signUp.email({ name, email, password });

    setSubmitting(false);
    if (signUpError) {
      setError(signUpError.message ?? "That account could not be created.");
      return;
    }

    void navigate(ROUTES.dashboard, { replace: true });
  }

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Free while you set things up. No card needed."
      pitch="Set up your workspace once. Run the whole company from it."
      points={[
        "Finance ledger ready from day one",
        "Your document templates, your categories",
        "New modules ship into the same workspace",
      ]}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-3">
        <AuthField
          id="name"
          label="Your name"
          autoComplete="name"
          placeholder="Jordan Lee"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          required
        />

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
          autoComplete="new-password"
          placeholder={`At least ${String(MIN_PASSWORD_LENGTH)} characters`}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
          minLength={MIN_PASSWORD_LENGTH}
        />

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
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="flex justify-center gap-2 text-[11px] text-mid">
        Already have a workspace?
        <Link to={ROUTES.login} className="text-red hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default SignupPage;
