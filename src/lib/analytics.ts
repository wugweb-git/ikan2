import { Capacitor } from "@capacitor/core";

/* Google Analytics 4, on the same property the old iKAN site uses (G-ZD4D5LZBQG), so the two
 * are comparable while people move across.
 *
 * What is sent, and what deliberately is not. A path in this app says what someone is dealing
 * with: /assessments/feeling-depressed-and-hopeless, /result/struggling-with-quality-sleep,
 * /program/sleep-tight/day/12. Sending those verbatim would hand a third party a named device's
 * mental health by inference, so what goes out is the ROUTE PATTERN the router matched -
 * "/assessments/$slug" - never the filled-in slug.
 *
 * The same applies to the page TITLE, which is the trap this file fell into once: on exactly
 * those routes the title IS the condition ("Feeling depressed and hopeless - iKAN"), so sending
 * document.title scrubbed the path and then leaked the answer anyway. Titles now come from
 * ROUTE_LABELS below - written by hand, one per pattern, and never read from the document.
 *
 * The tag is off in development and off when no measurement id is set, so previews and local
 * runs never reach the property. */

const ID = (import.meta.env["VITE_GA_ID"] as string | undefined) ?? "G-ZD4D5LZBQG";

/**
 * A human label for each route pattern. Anything missing falls back to the pattern itself,
 * which is already safe - so a new route leaks nothing by being forgotten here.
 *
 * The rule for adding one: it describes the KIND of screen, never its subject. "Assessment",
 * not the assessment's name.
 */
const ROUTE_LABELS: Record<string, string> = {
  "/": "Home",
  "/welcome": "Welcome",
  "/login": "Sign in",
  "/signup": "Sign up",
  "/phone-login": "Sign in with phone",
  "/forgot-password": "Forgot password",
  "/reset-password": "Reset password",
  "/verify-email": "Verify email",
  "/journal": "Journal",
  "/wellness": "Wellness",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/profile": "Profile",
  "/delete-account": "Delete account",
  "/about": "About",
  "/contact": "Contact",
  "/support": "Support",
  "/faq": "FAQ",
  "/legal/$slug": "Legal page",
  // Assessments - the slug is the condition, so every label here is deliberately generic.
  "/assessments": "Assessments",
  "/assessments/$slug/": "Assessment",
  "/assessments/$slug/result/$id": "Assessment result",
  "/assessment/$slug": "Assessment",
  "/assessment": "Assessments",
  "/result/$slug": "Assessment result",
  // Programmes - the slug is a programme name, which is allowed, but keep labels uniform.
  "/program": "Programmes",
  "/program/$slug/": "Programme",
  "/program/$slug/day/$day": "Programme day",
  "/program/$slug/journal": "Programme journal",
  "/program/$slug/result": "Programme result",
  "/program/$slug/tool/$step": "Programme tool",
  "/program/history": "Programme history",
  "/diaries": "Diaries",
  "/diaries/$slug": "Diary",
  // History
  "/history": "History",
  "/history/journal": "Journal history",
  "/history/assessments": "Assessment history",
  "/history/assessments/$slug": "Assessment history detail",
  "/history/program": "Programme history",
  "/history/program/$slug": "Programme history detail",
  // Content
  "/resources": "Resources",
  "/resources/$slug": "Article",
  "/consult": "Consultations",
  "/consult/$id": "Consultation",
};

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

/* The pattern of the screen currently open. track() needs it: gtag otherwise attaches the real
 * document.location to every event, which is the very thing pageView goes out of its way not
 * to send. */
let currentPattern = "/";

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
 * path - see the note at the top of this file. The title is looked up, never passed in.
 */
export function pageView(pattern: string) {
  currentPattern = pattern;
  if (!enabled()) return;
  load();
  window.gtag?.("event", "page_view", {
    page_path: pattern,
    page_location: `${window.location.origin}${pattern}`,
    page_title: ROUTE_LABELS[pattern] ?? pattern,
  });
}

/**
 * Record something a person did. Keep params free of anything that identifies a person or a
 * condition - a programme slug is fine, an assessment slug is not, and journal text never is.
 *
 * page_location is set explicitly because gtag would otherwise fill it in from the address
 * bar, putting the filled-in slug on every event.
 */
export function track(event: string, params: Record<string, string | number | boolean> = {}) {
  if (!enabled()) return;
  load();
  window.gtag?.("event", event, {
    ...params,
    page_path: currentPattern,
    page_location: `${window.location.origin}${currentPattern}`,
  });
}
