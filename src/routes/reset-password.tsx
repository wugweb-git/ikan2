import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { pageMeta } from "@/components/equip/program-header";
import { AuthLayout, Field, FormError, PrimaryButton } from "@/components/auth-ui";
import { useAuth } from "@/lib/auth";
import * as v from "@/lib/validate";

export const Route = createFileRoute("/reset-password")({
  head: () => pageMeta("Set a new password", "Choose a new password for your iKAN account."),
  component: ResetPage,
});

function ResetPage() {
  const { status, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <AuthLayout title="Set a new password" art="sleep">
        {null}
      </AuthLayout>
    );
  }

  if (status === "signedOut") {
    return (
      <AuthLayout
        title="This link has expired"
        subtitle="Reset links work once and expire after a while. Ask for a new one."
        art="sleep"
      >
        <Link
          to="/forgot-password"
          className="flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[16px] font-semibold text-background"
        >
          Send a new link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Use at least 8 characters with letters and a number. You’ll stay signed in on this device."
      art="sleep"
    >
      <form
        noValidate
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const weak = v.password(password);
          if (weak) return setError(weak);
          if (password !== confirm) return setError("The two passwords don’t match.");
          setBusy(true);
          setError(null);
          try {
            await updatePassword(password);
            navigate({ to: "/", replace: true });
          } catch (err) {
            setError((err as Error).message);
            setBusy(false);
          }
        }}
      >
        <FormError message={error} />
        <Field
          label="New password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <Field
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
        />
        <PrimaryButton busy={busy}>Save password</PrimaryButton>
      </form>
    </AuthLayout>
  );
}
