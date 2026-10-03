import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { pageMeta } from "@/components/equip/program-header";
import { AuthLayout, FormError, PrimaryButton } from "@/components/auth-ui";
import { PhoneField } from "@/components/phone-field";
import { useAuth } from "@/lib/auth";
import * as v from "@/lib/validate";

export const Route = createFileRoute("/phone-login")({
  head: () =>
    pageMeta("Continue with phone", "Sign in or sign up to iKAN with a code sent by SMS."),
  component: PhoneLoginPage,
});

const RESEND_AFTER = 30;

/* One screen for signing in and signing up by phone: a new number creates the account, and the
 * welcome flow asks for the rest. */
function PhoneLoginPage() {
  const { sendPhoneCode, verifyPhoneCode } = useAuth();
  const [phone, setPhone] = useState("+91 ");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [wait, setWait] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(t);
  }, [wait]);

  const phoneError = touched ? v.phone10(phone) : undefined;
  const digits = phone.replace(/[^\d+]/g, "");

  const send = async () => {
    setTouched(true);
    if (v.phone10(phone)) return;
    setBusy(true);
    setError(null);
    try {
      await sendPhoneCode(digits);
      setStep("code");
      setCode("");
      setWait(RESEND_AFTER);
      window.setTimeout(() => codeRef.current?.focus(), 50);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit code.");
    setBusy(true);
    setError(null);
    try {
      await verifyPhoneCode(digits, code);
      // the auth gate moves on once the session lands
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title={step === "phone" ? "Continue with phone" : "Enter your code"}
      subtitle={
        step === "phone"
          ? "We’ll text you a 6-digit code. New here? This creates your account."
          : `We sent it to ${phone.trim()}.`
      }
    >
      {step === "phone" ? (
        <form
          noValidate
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <FormError message={error} />
          <PhoneField label="Phone number" value={phone} onChange={setPhone} error={phoneError} />
          <PrimaryButton busy={busy}>Send code</PrimaryButton>
        </form>
      ) : (
        <form
          noValidate
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void verify();
          }}
        >
          <FormError message={error} />
          <label className="block">
            <span className="type-body-sm font-medium mb-1.5 block text-muted-foreground">
              6-digit code
            </span>
            <input
              ref={codeRef}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(next);
                if (next.length === 6) setError(null);
              }}
              placeholder="••••••"
              className="h-14 w-full rounded-[16px] border border-transparent bg-secondary px-4 text-center font-display text-[24px] tracking-[0.5em] tabular-nums outline-none focus:border-foreground/60 focus:bg-background"
            />
          </label>
          <PrimaryButton busy={busy}>Verify and continue</PrimaryButton>
          <div className="type-body-md flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setError(null);
              }}
              className="font-semibold hover:underline"
            >
              Change number
            </button>
            <button
              type="button"
              disabled={wait > 0 || busy}
              onClick={() => void send()}
              className="font-semibold hover:underline disabled:text-muted-foreground disabled:no-underline"
            >
              {wait > 0 ? `Resend in ${wait}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}
      <div className="type-body-sm my-4 flex items-center gap-3 text-muted-foreground">
        <span className="h-px flex-1 bg-foreground/10" /> or{" "}
        <span className="h-px flex-1 bg-foreground/10" />
      </div>
      <Link
        to="/login"
        className="type-action flex h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/15"
      >
        <Mail className="h-5 w-5" /> Sign in with email
      </Link>
    </AuthLayout>
  );
}
