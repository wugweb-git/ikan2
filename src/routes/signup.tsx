import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { pageMeta } from "@/components/equip/program-header";
import {
  AuthLayout,
  Field,
  FormError,
  PrimaryButton,
  SocialButtons,
  TermsNote,
} from "@/components/auth-ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

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
  const [touched, setTouched] = useState(false);

  const checks = [
    { ok: password.length >= 8, label: "At least 8 characters" },
    { ok: /[A-Za-z]/.test(password) && /\d/.test(password), label: "Letters and a number" },
  ];
  const errors = {
    name: touched && !name.trim() ? "Tell us what to call you." : undefined,
    email:
      touched && !/^\S+@\S+\.\S+$/.test(email.trim()) ? "Enter a valid email address." : undefined,
    phone:
      touched && phone && !/^\+?[\d\s-]{8,15}$/.test(phone.trim())
        ? "Enter a valid phone number, or leave it blank."
        : undefined,
    password: touched && password.length < 8 ? "Use at least 8 characters." : undefined,
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || password.length < 8) return;
    if (phone && !/^\+?[\d\s-]{8,15}$/.test(phone.trim())) return;
    setBusy(true);
    setError(null);
    try {
      const outcome = await signUp({
        name,
        email,
        password,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
      });
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
      subtitle="Take assessments, follow programs and track how you feel, all in one place."
      art="checkup"
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={setName}
          error={errors.name}
        />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          error={errors.email}
        />
        <Field
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={setPhone}
          placeholder="+91 98765 43210"
          error={errors.phone}
        />
        <div>
          <Field
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            error={errors.password}
          />
          <ul className="mt-2 flex flex-wrap gap-2">
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
        <PrimaryButton busy={busy}>Create account</PrimaryButton>
      </form>
      <SocialButtons onError={setError} />
      <p className="mt-6 text-center text-[15px]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold underline underline-offset-4">
          Sign in
        </Link>
      </p>
      <TermsNote />
    </AuthLayout>
  );
}
