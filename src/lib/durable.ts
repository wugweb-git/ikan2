import { Capacitor } from "@capacitor/core";

/* A second copy of the app's saved data, in native storage, for the Android app only.
 *
 * Why: everything the app saves lives in localStorage, and Android can evict a WebView's
 * localStorage when the device is short of space - without warning and without asking. On the
 * web that costs a browser tab's cache; here it would throw away a mood journal that had not
 * reached the backend yet, which is exactly the entry made offline first thing in the morning.
 *
 * localStorage stays the working copy: it is synchronous, which the stores and server rendering
 * need, and @capacitor/preferences is not. Every write is mirrored across afterwards, and on
 * startup any key that has vanished from localStorage is restored. Only missing keys are
 * restored - a key still present in localStorage is the newer one by definition, since the
 * mirror is only ever written from it. */

const active = () => Capacitor.isNativePlatform();

/* Writes still on their way to native storage, and whether a wipe has started. "Clear
 * everything" waits for the first and sets the second, so a backup write that was already in
 * flight when the person tapped Clear cannot land after the wipe and bring the data back on
 * the next launch. */
const pending = new Set<Promise<unknown>>();
let wiping = false;
/** True from the moment "Clear everything" starts until the page reloads. */
export const isWiping = () => wiping;
/** Start a wipe: from here nothing is saved, to localStorage or to the native copy. */
export const beginWipe = () => {
  wiping = true;
};

/** Copy one saved value into native storage. Fire-and-forget: never blocks a save. */
export function mirrorWrite(key: string, value: string) {
  if (!active() || wiping) return;
  const write = import("@capacitor/preferences")
    .then(({ Preferences }) => Preferences.set({ key, value }))
    .catch(() => {
      /* the backup is best-effort - a failure must never fail the save itself */
    });
  pending.add(write);
  void write.finally(() => pending.delete(write));
}

/**
 * Drop one saved value from native storage.
 *
 * This has to be called wherever localStorage is cleared, or restoreEvicted below puts the
 * value straight back on the next launch - which for a deleted account means its journal
 * reappearing on a phone that was told nothing was kept.
 */
export function mirrorRemove(key: string) {
  if (!active()) return;
  void import("@capacitor/preferences")
    .then(({ Preferences }) => Preferences.remove({ key }))
    .catch(() => {});
}

/**
 * Drop every value this app has mirrored, for "clear all data" and account deletion, where the
 * caller wipes localStorage wholesale rather than key by key.
 *
 * Only `ikan.` keys are touched: the mirror is shared with anything else the WebView stores.
 * Awaitable, because a caller that navigates away immediately afterwards must not race it.
 */
export async function clearAllMirrored(): Promise<void> {
  /* Hold saves while the wipe runs, so a write already on its way cannot land after it. A
   * caller that reloads afterwards ("Clear everything") has called beginWipe and stays held;
   * account deletion on its own page does not reload, so saving resumes once this is done. */
  const held = wiping;
  wiping = true;
  try {
    if (!active()) return;
    await Promise.allSettled([...pending]);
    const { Preferences } = await import("@capacitor/preferences");
    const { keys } = await Preferences.keys();
    await Promise.all(
      keys.filter((k) => k.startsWith("ikan.")).map((key) => Preferences.remove({ key })),
    );
  } catch {
    /* best-effort, as everywhere else in this file */
  } finally {
    wiping = held;
  }
}

/**
 * Put back anything Android has evicted. Returns the number of keys restored, so the caller can
 * refresh the stores only when something actually came back.
 */
export async function restoreEvicted(): Promise<number> {
  if (!active() || typeof window === "undefined") return 0;
  try {
    const { Preferences } = await import("@capacitor/preferences");
    const { keys } = await Preferences.keys();
    let restored = 0;
    for (const key of keys) {
      if (!key.startsWith("ikan.")) continue;
      if (window.localStorage.getItem(key) !== null) continue; // still there, and newer
      const { value } = await Preferences.get({ key });
      if (value === null) continue;
      window.localStorage.setItem(key, value);
      restored++;
    }
    return restored;
  } catch {
    return 0;
  }
}
