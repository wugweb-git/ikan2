import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/auth";

/* Firebase Cloud Messaging for the Android app.
 *
 * push.ts already does web push, and it works in Chrome and on an iPhone home screen - but not
 * inside an Android WebView, where Web Push simply does not exist. So the installed app has no
 * way to be reached while it is closed, which on a 35-day programme is the whole retention
 * model. FCM is that channel.
 *
 * The token goes in the same ikan2_push_subscriptions table as web push subscriptions, keyed on
 * `endpoint` as they are, with `kind` telling them apart - a sender has to talk FCM for one and
 * the Web Push protocol for the other.
 *
 * Two things must be in place before any of this does anything: android/app/google-services.json
 * (the Gradle plugin applies itself once that file exists), and the migration that lets a row
 * carry no p256dh/auth, which an FCM token has no equivalent of. */

export const nativePushSupported = () => Capacitor.isNativePlatform();

/** Save the device's FCM token against the account, so the server can reach this phone. */
async function saveToken(token: string, prefs: { moodReminder: boolean; time: string }) {
  const { data } = await supabase().auth.getSession();
  const user = data.session?.user;
  if (!user) return;
  await supabase()
    .from("ikan2_push_subscriptions")
    .upsert(
      {
        endpoint: token,
        kind: "fcm",
        user_id: user.id,
        mood_reminder: prefs.moodReminder,
        reminder_time: prefs.time,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
        user_agent: `android-app/${Capacitor.getPlatform()}`,
      },
      { onConflict: "endpoint" },
    );
}

/**
 * Register this device for push and keep its token on the account. Safe to call on every start:
 * FCM hands back the same token until it rotates, and the upsert makes a repeat a no-op.
 *
 * Returns false when push isn't available or the person declined - never throws, because a
 * refused notification permission is a normal answer, not a failure.
 */
export async function enableNativePush(prefs: { moodReminder: boolean; time: string }) {
  if (!nativePushSupported()) return false;
  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    const status = await PushNotifications.checkPermissions();
    const granted =
      status.receive === "granted"
        ? true
        : status.receive === "denied"
          ? false
          : (await PushNotifications.requestPermissions()).receive === "granted";
    if (!granted) return false;

    await new Promise<void>((resolve) => {
      let settled = false;
      const done = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      void PushNotifications.addListener("registration", (t) => {
        void saveToken(t.value, prefs).finally(done);
      });
      void PushNotifications.addListener("registrationError", done);
      void PushNotifications.register();
      // Without google-services.json neither listener ever fires; don't hang the caller.
      setTimeout(done, 10_000);
    });
    return true;
  } catch {
    return false;
  }
}

/** Open the screen a push points at when it is tapped. Call once at startup. */
export async function listenForPushTaps(go: (url: string) => void) {
  if (!nativePushSupported()) return () => {};
  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    const handle = await PushNotifications.addListener("pushNotificationActionPerformed", (e) => {
      const url = (e.notification.data as { url?: string } | undefined)?.url;
      go(url || "/");
    });
    return () => void handle.remove();
  } catch {
    return () => {};
  }
}
