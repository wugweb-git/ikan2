import { Capacitor } from "@capacitor/core";
import type { SupabaseClient } from "@supabase/supabase-js";

/* Google blocks sign-in inside app web views, so the Android app opens Google or LinkedIn in the
 * browser and comes back through com.ikan.wugweb://auth-callback with the session tokens. */

export const NATIVE_REDIRECT = "com.ikan.wugweb://auth-callback";
export const isNativeApp = () => Capacitor.isNativePlatform();

export async function nativeOAuth(sb: SupabaseClient, provider: "google" | "linkedin_oidc") {
  const { data, error } = await sb.auth.signInWithOAuth({
    provider,
    options: { redirectTo: NATIVE_REDIRECT, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data.url) throw new Error("Sign-in didn’t start. Try again.");
  const { Browser } = await import("@capacitor/browser");
  await Browser.open({ url: data.url, presentationStyle: "popover" });
}

/** Finish sign-in when the browser hands control back to the app. */
export async function listenForNativeAuth(sb: SupabaseClient) {
  if (!isNativeApp()) return () => {};
  const { App } = await import("@capacitor/app");
  const handle = await App.addListener("appUrlOpen", async ({ url }) => {
    if (!url.startsWith(NATIVE_REDIRECT)) return;
    const { Browser } = await import("@capacitor/browser");
    void Browser.close().catch(() => {});
    const parsed = new URL(url.replace("#", "?"));
    const p = parsed.searchParams;
    const accessToken = p.get("access_token");
    const refreshToken = p.get("refresh_token");
    const code = p.get("code");
    if (accessToken && refreshToken) {
      await sb.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    } else if (code) {
      await sb.auth.exchangeCodeForSession(code);
    }
  });
  return () => void handle.remove();
}
