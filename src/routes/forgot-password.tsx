import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { pageMeta } from "@/components/equip/program-header";
import { AuthLayout, Field, FormError, PrimaryButton } from "@/components/auth-ui";
import { useAuth } from "@/lib/auth";
import * as v from "@/lib/validate";

type Search = { email?: string };

export const Route = createFileRoute("/forgot-password")({
  validateSearch: (s: Record<string, unknown>): Search =>
    typeof s["email"] === "string" ? { email: s["email"] } : {},
  head: () => pageMeta("Reset your password", "Get a link to set a new iKAN password."),
  component: ForgotPage,
});

function ForgotPage() {
  const { sendReset } = useAuth();
  const initial = Route.useSearch().email ?? "";
  const [email, setEmail] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={sent ? undefined : "Enter your email and we’ll send a link to set a new password."}
      art="sleep"
    >
      {sent ? (
        <div className="flex flex-col items-center rounded-[28px] bg-secondary px-6 py-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#DDF1E5] text-[#1E6644]">
            <MailCheck className="h-8 w-8" />
          </span>
          <p className="mt-4 text-[16px] leading-6">
            If an account exists for <span className="font-semibold">{email}</span>, a reset link is
            on its way.
          </p>
        </div>
      ) : (
        <form
          noValidate
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const invalid = v.email(email);
            if (invalid) {
              setError(invalid);
              return;
            }
            setBusy(true);
            setError(null);
            try {
              await sendReset(email);
              setSent(true);
            } catch (err) {
              setError((err as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <FormError message={error} />
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            maxLength={254}
            placeholder="you@example.com"
          />
          <PrimaryButton busy={busy}>Send reset link</PrimaryButton>
        </form>
      )}
      <Link
        to="/login"
        className="mt-6 block text-center text-[15px] font-semibold underline underline-offset-4"
      >
        Back to sign in
      </Link>
    </AuthLayout>
  );
}
