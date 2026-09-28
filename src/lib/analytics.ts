import { Capacitor } from "@capacitor/core";

/* Google Analytics 4, on the same property the old iKAN site uses (G-ZD4D5LZBQG), so the two
 * are comparable while people move across.
 *
 * What is sent, and what deliberately is not. A path in this app says what someone is dealing
 * with: /assessments/feeling-depressed-and-hopeless, /result/struggling-with-quality-sleep,
 * /program/sleep-tight/day/12. Sending those verbatim would hand a third party a named device's
 * mental health by inference, so what goes out is the ROUTE PATTERN the router matched -
 * "/assessments/$slug" - never the filled-in slug. That still gives funnels, drop-off and
 * retention per area; it does not say which condition anyone screened for.
 *
 * The tag is off in development and off when no measurement id is set, so previews and local
 * runs never reach the property. */

const ID = (import.meta.env["VITE_GA_ID"] as string | undefined) ?? "G-ZD4D5LZBQG";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const enabled = () =>
  typeof window !== "undefined" && Boolean(ID) && !import.meta.env.DEV && !navigator.webdriver;

let loaded = false;

/** Load gtag.js once. Automatic page views are off - they would only ever fire on first load. */
function load() {
  if (loaded || !enabled()) return;
  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", ID, {
    send_page_view: false,
    // Tells the two apart in one property: the Android build loads this same site in a WebView.
    platform: Capacitor.isNativePlatform() ? "android-app" : "web",
  });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  document.head.appendChild(s);
}

/**
 * Record a screen view.
 *
 * `pattern` must be the router's matched route id ("/program/$slug/day/$day"), not the real
 * path - see the note at the top of this file.
 */
export function pageView(pattern: string, title?: string) {
  if (!enabled()) return;
  load();
  window.gtag?.("event", "page_view", {
    page_path: pattern,
    page_location: `${window.location.origin}${pattern}`,
    ...(title ? { page_title: title } : {}),
  });
}

/**
 * Record something a person did. Keep params free of anything that identifies a person or a
 * condition - a programme slug is fine, a journal entry is not.
 */
export function track(event: string, params: Record<string, string | number | boolean> = {}) {
  if (!enabled()) return;
  load();
  window.gtag?.("event", event, params);
}
