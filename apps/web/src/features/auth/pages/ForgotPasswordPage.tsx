import { ROUTES } from "@opsora/config";
import { useState } from "react";
import { Link } from "react-router";

import { requestPasswordReset } from "@/lib/auth-client.ts";
import { AuthField } from "@/features/auth/components/AuthField.tsx";
import { AuthLayout } from "@/features/auth/components/AuthLayout.tsx";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: resetError } = await requestPasswordReset({
      email,
      // Where the emailed link lands once the API has validated the token.
      // Checked against the server's trustedOrigins, so it must be this origin.
      redirectTo: `${window.location.origin}${ROUTES.resetPassword}`,
    });

    setSubmitting(false);
    if (resetError) {
      setError(resetError.message ?? "That request could not be sent.");
      return;
    }

    setSent(true);
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a link to choose a new one."
      pitch="Locked out? This takes about a minute."
      points={[
        "The link works once and expires in an hour",
        "Your current password stays active until you change it",
        "Signing in elsewhere ends when the reset completes",
      ]}
    >
      {sent ? (
        /*
         * Deliberately does not confirm whether the address exists — the API
         * returns an identical response either way, and saying more here would
         * turn this form into an account-enumeration oracle.
         */
        <div className="flex flex-col gap-4">
          <p className="rounded-input border border-line bg-surface-2 px-3.5 py-3 text-[11.5px] leading-relaxed text-ink text-pretty">
            If an account exists for {email}, a reset link is on its way. The link
            expires in an hour.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
            }}
            className="text-[11px] text-mid hover:text-ink"
          >
            Use a different address
          </button>
        </div>
      ) : (
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
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="flex justify-center gap-2 text-[11px] text-mid">
        Remembered it?
        <Link to={ROUTES.login} className="text-red hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
