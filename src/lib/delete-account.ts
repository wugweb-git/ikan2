import { clearAllMirrored } from "@/lib/durable";
import { functionUrl } from "@/lib/backend";
import { supabase } from "@/lib/auth";

/* Deleting an account, from wherever it is asked for.
 *
 * Two places offer it - Settings, and the public /delete-account page that Google requires and
 * that someone who has already uninstalled can still reach - and they must do exactly the same
 * thing. Keeping the sequence here rather than in a component is what makes that true.
 *
 * The order matters. The server removes the rows and then the auth user, and only once it has
 * confirmed that do we touch the device: clearing local storage first would leave someone
 * signed out of an account that still exists if the request failed.
 *
 * The native mirror has to be cleared too, and awaited. Android keeps a copy of every key
 * (durable.ts) and restores anything missing on the next launch, so skipping it would bring the
 * whole journal back for an account that no longer exists. */
export async function deleteAccount(): Promise<void> {
  const { data } = await supabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired. Sign in again.");

  const res = await fetch(functionUrl("ikan2-delete-account"), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(body.error ?? "Deletion failed. Please try again.");

  try {
    localStorage.clear();
  } catch {
    /* storage unavailable */
  }
  await clearAllMirrored();
  await supabase()
    .auth.signOut()
    .catch(() => {});
}
