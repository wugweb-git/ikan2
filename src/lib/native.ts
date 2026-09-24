import { Capacitor } from "@capacitor/core";

/* Small native capabilities the Android app has and the browser mostly doesn't. Every one of
 * these is called from code that also runs on the web, so each falls back to the web equivalent
 * (or to doing nothing) rather than making callers check the platform. The plugins are imported
 * on use, so the web bundle never loads them. */

export const isNativeApp = () => Capacitor.isNativePlatform();

/* ------------------------------- share ------------------------------- */

/** True when something better than "copy the link" is available. */
export const canShare = () =>
  isNativeApp() || (typeof navigator !== "undefined" && typeof navigator.share === "function");

/**
 * Open the system share sheet. Returns false when the user dismissed it or no sheet exists, so
 * the caller can fall back to copying.
 */
export async function share(opts: { title?: string; text: string; url?: string }) {
  if (isNativeApp()) {
    try {
      const { Share } = await import("@capacitor/share");
      await Share.share({
        ...(opts.title ? { title: opts.title, dialogTitle: opts.title } : {}),
        text: opts.text,
        ...(opts.url ? { url: opts.url } : {}),
      });
      return true;
    } catch {
      return false; // dismissed, or the sheet is unavailable
    }
  }
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({
        ...(opts.title ? { title: opts.title } : {}),
        text: opts.text,
        ...(opts.url ? { url: opts.url } : {}),
      });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/* ------------------------------ haptics ------------------------------ */

type Feel = "light" | "medium" | "success" | "warning" | "error";

/**
 * A short buzz to confirm something landed - saving a check-in, finishing a day. Silent on the
 * web and on a phone with haptics switched off; never awaited by callers.
 */
export function tap(feel: Feel = "light") {
  if (!isNativeApp()) return;
  void (async () => {
    try {
      const { Haptics, ImpactStyle, NotificationType } = await import("@capacitor/haptics");
      if (feel === "light") return Haptics.impact({ style: ImpactStyle.Light });
      if (feel === "medium") return Haptics.impact({ style: ImpactStyle.Medium });
      return Haptics.notification({
        type:
          feel === "success"
            ? NotificationType.Success
            : feel === "warning"
              ? NotificationType.Warning
              : NotificationType.Error,
      });
    } catch {
      /* haptics are a courtesy, never a requirement */
    }
  })();
}

/* ----------------------------- status bar ----------------------------- */

/**
 * Match the status bar to the app's background so the top of the screen doesn't sit in a
 * different colour from the page. Called once at startup and whenever the theme changes.
 */
export async function syncStatusBar(dark: boolean) {
  if (!isNativeApp()) return;
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
    await StatusBar.setBackgroundColor({ color: dark ? "#14161C" : "#FBFBFD" });
  } catch {
    /* not every Android build allows setting it */
  }
}

/* ------------------------------ network ------------------------------ */

/** Whether the device currently has a connection. The web answer is navigator.onLine. */
export async function isOnline() {
  if (isNativeApp()) {
    try {
      const { Network } = await import("@capacitor/network");
      return (await Network.getStatus()).connected;
    } catch {
      /* fall through to the browser's answer */
    }
  }
  return typeof navigator === "undefined" ? true : navigator.onLine;
}
