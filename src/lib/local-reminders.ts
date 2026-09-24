import { Capacitor } from "@capacitor/core";

/* The daily reminder on Android, scheduled on the phone itself.
 *
 * There are three ways a reminder can reach someone, and only this one works on the installed
 * Android app. checkMoodReminder (device.ts) fires while the app is OPEN, which is no use to a
 * person who hasn't opened it. Web push (push.ts) works in Chrome and on an iPhone home screen,
 * but not inside an Android WebView - the app loads app.ikanhealth.in remotely and Web Push is
 * simply absent there. @capacitor/local-notifications is scheduled by Android and fires whether
 * or not the app is running, with no server and no Firebase.
 *
 * Fixed ids, so re-scheduling replaces rather than stacks: change the time twice and you get one
 * reminder, not three. */

const MOOD_ID = 1001;

const active = () => Capacitor.isNativePlatform();

/** Ask once. Android 13+ needs the runtime permission before anything can be scheduled. */
async function allowed() {
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const status = await LocalNotifications.checkPermissions();
  if (status.display === "granted") return true;
  if (status.display === "denied") return false;
  return (await LocalNotifications.requestPermissions()).display === "granted";
}

/**
 * Put the daily mood reminder in step with the person's settings: scheduled at `time` every day
 * when on, removed when off. Safe to call on every settings change and at startup.
 */
export async function syncMoodReminder(opts: { enabled: boolean; time: string }) {
  if (!active()) return;
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    await LocalNotifications.cancel({ notifications: [{ id: MOOD_ID }] });
    if (!opts.enabled) return;
    if (!(await allowed())) return;
    const [h, m] = opts.time.split(":").map(Number);
    await LocalNotifications.schedule({
      notifications: [
        {
          id: MOOD_ID,
          title: "How are you feeling today?",
          body: "A 30-second check-in keeps your journal up to date.",
          // `on` with no date fields repeats: every day at this hour and minute.
          schedule: { on: { hour: h ?? 20, minute: m ?? 30 }, allowWhileIdle: true },
          extra: { url: "/journal" },
        },
      ],
    });
  } catch {
    /* Notifications are a courtesy. A phone that refuses them still works. */
  }
}

/**
 * Open the screen a reminder points at when it is tapped. Returns a function that stops
 * listening; call once at startup.
 */
export async function listenForReminderTaps(go: (url: string) => void) {
  if (!active()) return () => {};
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    const handle = await LocalNotifications.addListener("localNotificationActionPerformed", (e) => {
      const url = (e.notification.extra as { url?: string } | undefined)?.url;
      if (url) go(url);
    });
    return () => void handle.remove();
  } catch {
    return () => {};
  }
}
