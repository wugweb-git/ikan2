import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Check, Trash2 } from "lucide-react";
import { InfoShell } from "@/components/info-shell";
import { Button, TextField } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useAuth, supabase } from "@/lib/auth";
import { functionUrl } from "@/lib/backend";
import { clearAllMirrored } from "@/lib/durable";

/* Account deletion, in the app and on the web.
 *
 * Google Play requires an app that creates accounts to let people delete the ACCOUNT - not just
 * clear its data - from inside the app, and from a page anyone can reach without installing it.
 * This route is that page, which is why it sits outside the sign-in gate: a reviewer, or someone
 * who has already uninstalled, has to be able to read it.
 *
 * The deletion itself runs in the ikan2-delete-account function, because removing an auth user
 * needs the service role and that must never reach the client. */

export const Route = createFileRoute("/delete-account")({
  head: () =>
    pageMeta(
      "Delete your account",
      "Permanently delete your iKAN account and everything saved with it.",
      "/delete-account",
    ),
  component: DeleteAccountPage,
});

const REMOVED = [
  "Your mood journal — every check-in, note and tag",
  "Every assessment you have taken, with its answers and scores",
  "Programme progress: answers, diaries, thought logs and habits",
  "Steps and sleep read from Health Connect",
  "Your profile, settings and any consultation bookings",
  "Reminder settings and this device's notification registration",
  "The account itself, and the email or phone it signs in with",
];

function DeleteAccountPage() {
  const { status, user } = useAuth();
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const signedIn = status === "signedIn";

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await supabase().auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Your session has expired. Sign in again.");
      const res = await fetch(functionUrl("ikan2-delete-account"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Deletion failed. Please try again.");
      // The account is gone; clear this device so nothing of it is left lying around. The
      // native mirror has to go too, or restoreEvicted() puts the whole journal back on the
      // next launch - which would make the promise on the next screen a lie.
      try {
        localStorage.clear();
      } catch {
        /* storage unavailable */
      }
      await clearAllMirrored();
      await supabase()
        .auth.signOut()
        .catch(() => {});
      setDone(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (done)
    return (
      <InfoShell title="Account deleted">
        <div className="px-5 pb-16 pt-6">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary">
            <Check className="h-6 w-6" />
          </span>
          <h1 className="type-headline-sm mt-4">Your account is deleted</h1>
          <p className="mt-3 text-[16px] leading-7 text-muted-foreground">
            Everything saved with it has been removed from our servers, and this device has been
            cleared. Nothing is kept.
          </p>
          <Link to="/" className="mt-8 inline-block">
            <Button variant="tonal">Back to start</Button>
          </Link>
        </div>
      </InfoShell>
    );

  return (
    <InfoShell title="Delete your account">
      <div className="px-5 pb-16 pt-6">
        <h1 className="type-headline-sm">Delete your account</h1>
        <p className="mt-3 text-[16px] leading-7 text-muted-foreground">
          This removes your iKAN account and everything saved with it. It cannot be undone, and
          nothing can be recovered afterwards.
        </p>

        <h2 className="type-title-md mt-8">What gets deleted</h2>
        <ul className="mt-3 space-y-2 text-[15px] leading-6 text-muted-foreground">
          {REMOVED.map((r) => (
            <li key={r} className="flex gap-2.5">
              <Trash2 className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>

        {signedIn ? (
          <div className="mt-8 rounded-[20px] border border-foreground/15 p-5">
            <p className="flex items-center gap-2 text-[15px] font-semibold">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Signed in as {user?.email ?? user?.phone ?? "your account"}
            </p>
            <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
              Type <strong>DELETE</strong> to confirm.
            </p>
            <div className="mt-3">
              <TextField label="Confirm" value={confirm} onChange={setConfirm} />
            </div>
            {error ? <p className="mt-3 text-[14px] text-[#B3261E]">{error}</p> : null}
            <Button
              className="mt-4"
              variant="filled"
              disabled={confirm.trim().toUpperCase() !== "DELETE" || busy}
              onClick={() => void run()}
            >
              {busy ? "Deleting…" : "Delete my account permanently"}
            </Button>
          </div>
        ) : (
          <div className="mt-8 rounded-[20px] border border-foreground/15 p-5">
            <p className="text-[15px] font-semibold">Sign in to delete your account</p>
            <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
              We ask you to sign in so that only you can delete your account. If you can no longer
              sign in, email{" "}
              <a
                href="mailto:hello@ikanhealth.in?subject=Delete%20my%20iKAN%20account"
                className="underline"
              >
                hello@ikanhealth.in
              </a>{" "}
              from the address on the account and we will delete it for you within 30 days.
            </p>
            <Link to="/login" className="mt-4 inline-block">
              <Button variant="tonal">Sign in</Button>
            </Link>
          </div>
        )}

        <p className="mt-8 text-[13px] leading-5 text-muted-foreground">
          Anonymised records we are required to keep for legal or safety reasons are not linked to
          you and cannot be traced back. See the{" "}
          <Link to="/legal/$slug" params={{ slug: "privacy-policy" }} className="underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </InfoShell>
  );
}
