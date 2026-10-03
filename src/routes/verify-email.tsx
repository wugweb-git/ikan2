import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MailCheck } from "lucide-react";
import { pageMeta } from "@/components/equip/program-header";
import { AuthLayout, FormError } from "@/components/auth-ui";
import { useAuth } from "@/lib/auth";

type Search = { email?: string };

export const Route = createFileRoute("/verify-email")({
  validateSearch: (s: Record<string, unknown>): Search =>
    typeof s["email"] === "string" ? { email: s["email"] } : {},
  head: () =>
    pageMeta(
      "Verify your email",
      "Confirm your email address to finish creating your iKAN account.",
    ),
  component: VerifyPage,
});

function VerifyPage() {
  const { email } = Route.useSearch();
  const { resendConfirmation } = useAuth();
  const [wait, setWait] = useState(60);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(t);
  }, [wait]);

  return (
    <AuthLayout title="Verify your email" art="checkup">
      <div className="flex flex-col items-center rounded-[28px] bg-secondary px-6 py-8 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-[#DDF1E5] text-[#1E6644]">
          <MailCheck className="h-8 w-8" />
        </span>
        <p className="mt-4 text-[16px] leading-6">
          We sent a confirmation link to{" "}
          <span className="font-semibold">{email || "your email"}</span>. Open it on this device,
          then sign in.
        </p>
        <p className="type-body-md mt-2 text-muted-foreground">
          Can’t find it? Check spam or promotions.
        </p>
      </div>
      <div className="mt-6 space-y-3">
        <FormError message={error} />
        {sent ? (
          <p className="type-body-md text-center text-[#1E6644]">
            Sent again. It can take a minute to arrive.
          </p>
        ) : null}
        <button
          type="button"
          disabled={!email || wait > 0}
          onClick={async () => {
            if (!email) return;
            setError(null);
            try {
              await resendConfirmation(email);
              setSent(true);
              setWait(60);
            } catch (e) {
              setError((e as Error).message);
            }
          }}
          className="type-action flex h-14 w-full items-center justify-center rounded-full border border-foreground/20 disabled:opacity-50"
        >
          {wait > 0 ? `Resend link in ${wait}s` : "Resend link"}
        </button>
        <Link
          to="/login"
          className="type-body-lg font-semibold flex h-14 w-full items-center justify-center rounded-full bg-foreground text-background"
        >
          I’ve confirmed, sign in
        </Link>
        <Link to="/signup" className="type-body-md font-semibold block pt-2 text-center underline">
          Use a different email
        </Link>
      </div>
    </AuthLayout>
  );
}
