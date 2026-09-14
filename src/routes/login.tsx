import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { pageMeta } from "@/components/equip/program-header";
import {
  AuthLayout,
  Field,
  FormError,
  PrimaryButton,
  RememberMe,
  SocialButtons,
  TermsNote,
} from "@/components/auth-ui";
import { rememberLogin, setRememberLogin, useAuth } from "@/lib/auth";
import * as v from "@/lib/validate";

type Search = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search =>
    typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
  head: () => pageMeta("Sign in", "Sign in to continue your mental health journey."),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [remember, setRemember] = useState(() =>
    typeof window === "undefined" ? true : rememberLogin(),
  );

  const { errors, ok } = v.validate(
    { email, password },
    { email: v.email, password: v.required("Enter your password.") },
  );
  const emailError = touched["email"] ? errors.email : undefined;
  const passwordError = touched["password"] ? errors.password : undefined;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!ok) return;
    setRememberLogin(remember);
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      // the auth gate moves on once the session lands
    } catch (err) {
      const message = (err as Error).message;
      if (/confirm your email/i.test(message)) {
        navigate({ to: "/verify-email", search: { email: email.trim() } });
        return;
      }
      setError(message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your mental health journey.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          maxLength={254}
          placeholder="you@example.com"
          error={emailError}
        />
        <div>
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            maxLength={72}
            error={passwordError}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <RememberMe checked={remember} onChange={setRemember} />
            <Link
              to="/forgot-password"
              search={email ? { email } : {}}
              className="text-[14px] font-semibold underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <PrimaryButton busy={busy}>Sign in</PrimaryButton>
      </form>
      <SocialButtons onError={setError} />
      <p className="mt-6 text-center text-[15px]">
        New to iKAN?{" "}
        <Link
          to="/signup"
          search={redirect ? { redirect } : {}}
          className="font-semibold underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
      <TermsNote />
    </AuthLayout>
  );
}
