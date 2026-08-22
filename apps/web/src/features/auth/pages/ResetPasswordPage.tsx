import { MIN_PASSWORD_LENGTH, ROUTES } from "@opsora/config";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { resetPassword } from "@/lib/auth-client.ts";
import { AuthField } from "@/features/auth/components/AuthField.tsx";
import { AuthLayout } from "@/features/auth/components/AuthLayout.tsx";

const PITCH = "Choose a new password.";
const POINTS = [
  "At least ten characters",
  "Sessions on your other devices end",
  "You'll sign in again with the new one",
];

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // The API redirects here with either a token or an error, never both.
  const token = searchParams.get("token");
  const linkError = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${String(MIN_PASSWORD_LENGTH)} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Those two passwords don't match.");
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await resetPassword({
      newPassword: password,
      token: token!,
    });

    setSubmitting(false);
    if (resetError) {
      setError(resetError.message ?? "That password could not be set.");
      return;
    }

    // No auto sign-in: the reset revokes every session, so one created here
    // would be killed immediately.
    void navigate(ROUTES.login, { replace: true });
  }

  if (linkError !== null || token === null) {
    return (
      <AuthLayout
        title="This link has expired"
        subtitle="Reset links work once, and only for an hour."
        pitch={PITCH}
        points={POINTS}
      >
        <p className="rounded-input border border-red bg-red-soft px-3.5 py-3 text-[11.5px] leading-relaxed text-ink text-pretty">
          Request a new link and open it from the most recent email.
        </p>

        <Link
          to={ROUTES.forgotPassword}
          className="rounded-pill bg-red py-3.5 text-center text-[11.5px] uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-85"
        >
          Send a new link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="You'll use this the next time you sign in."
      pitch={PITCH}
      points={POINTS}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-3">
        <AuthField
          id="password"
          label="New password"
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

        <AuthField
          id="confirm-password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Type it again"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
          }}
          required
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
          {submitting ? "Saving…" : "Set new password"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
