import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { pageMeta } from "@/components/equip/program-header";
import { AuthLayout, Field, FormError, PrimaryButton, SocialButtons } from "@/components/auth-ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { PhoneField } from "@/components/phone-field";
import { breachError } from "@/lib/pwned";
import * as v from "@/lib/validate";
import { track } from "@/lib/analytics";

type Search = { redirect?: string };

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>): Search =>
    typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
  head: () =>
    pageMeta(
      "Create your account",
      "Join iKAN to take assessments, follow programs and track how you feel.",
    ),
  component: SignupPage,
});

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [agreed, setAgreed] = useState(false);

  const checks = v.passwordRules(password);
  const { errors, ok } = v.validate(
    { name, email, phone, password },
    { name: v.personName, email: v.email, phone: v.optional(v.phone10), password: v.password },
  );
  const show = (k: keyof typeof errors) => (touched[k] || touched["all"] ? errors[k] : undefined);
  const blur = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));
  const agreeError =
    touched["all"] && !agreed ? "Agree to the terms to create an account." : undefined;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ all: true });
    if (!ok || !agreed) return;
    setBusy(true);
    setError(null);
    try {
      // Checked here rather than as they type: it is one network round trip, and telling
      // someone their half-finished password is breached is noise, not help.
      const breached = await breachError(password);
      if (breached) {
        setError(breached);
        setBusy(false);
        return;
      }
      const outcome = await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        ...(v.phoneDigits(phone).length === 10 ? { phone: phone.trim() } : {}),
      });
      track("signup", { verification: outcome === "confirm" ? "email" : "none" });
      if (outcome === "confirm") navigate({ to: "/verify-email", search: { email: email.trim() } });
      // "signedIn": the auth gate takes it from here
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Assessments, programs and mood tracking."
      art="welcome"
    >
      <form onSubmit={submit} noValidate className="space-y-3">
        <FormError message={error} />
        <Field
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={setName}
          onBlur={blur("name")}
          maxLength={60}
          error={show("name")}
        />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          onBlur={blur("email")}
          maxLength={254}
          placeholder="you@example.com"
          error={show("email")}
        />
        <PhoneField
          label="Phone (optional)"
          value={phone}
          onChange={setPhone}
          error={show("phone")}
        />
        <div>
          <Field
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            onBlur={blur("password")}
            maxLength={72}
            error={show("password")}
          />
          <ul
            className={cn("mt-2 flex flex-wrap gap-2", !password && !show("password") && "hidden")}
          >
            {checks.map((c) => (
              <li
                key={c.label}
                className={cn(
                  "inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[12px] font-medium transition-colors",
                  c.ok ? "bg-[#DDF1E5] text-[#1E6644]" : "bg-secondary text-muted-foreground",
                )}
              >
                <Check className={cn("h-3.5 w-3.5", !c.ok && "opacity-30")} /> {c.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="type-label-lg flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              aria-invalid={Boolean(agreeError)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-foreground"
            />
            <span>
              I agree to the{" "}
              <Link to="/legal/$slug" params={{ slug: "terms" }} className="underline">
                Terms of use
              </Link>{" "}
              and{" "}
              <Link to="/legal/$slug" params={{ slug: "privacy-policy" }} className="underline">
                Privacy policy
              </Link>
              , and I’m 13 or older.
            </span>
          </label>
          {agreeError ? (
            <p role="alert" className="mt-1.5 text-[13px] text-error">
              {agreeError}
            </p>
          ) : null}
        </div>
        <PrimaryButton busy={busy}>Create account</PrimaryButton>
      </form>
      <SocialButtons onError={setError} />
      <p className="mt-4 text-center text-[15px]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
