/**
 * Non-blocking bridge from ikan2 (app.ikanhealth.in) to wp-admin (ikanhealth.in).
 * Mirrors auth, contact, and user_state updates into WordPress (Fluent Forms,
 * FluentCRM, and wp_ikan_* tables) without ever blocking offline-first UX.
 */

const WP_INGEST_URL = "https://ikanhealth.in/wp-json/ikan/v1/ingest";

export function deviceMeta() {
  if (typeof window === "undefined") return {};
  let time_zone = "Asia/Kolkata";
  try {
    time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone || time_zone;
  } catch {
    /* ignore */
  }
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isCapacitor =
    typeof (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
      ?.isNativePlatform === "function" &&
    Boolean(
      (
        window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }
      ).Capacitor?.isNativePlatform?.(),
    );
  const platform = isCapacitor
    ? "android"
    : typeof window.matchMedia === "function" &&
        window.matchMedia("(display-mode: standalone)").matches
      ? "pwa"
      : "web";
  return { time_zone, user_agent: ua, platform };
}

export function postToWpAdmin(payload: Record<string, unknown>): void {
  if (typeof fetch === "undefined") return;
  try {
    void fetch(WP_INGEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* wp-admin sync is best-effort and must not block offline-first flows */
    });
  } catch {
    /* ignore */
  }
}
