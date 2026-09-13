/* Device storage is kept per signed-in account, so two people sharing a phone never see each
 * other's check-ins or results. `ikan.assessments.v1` is stored as `ikan.u.<userId>.assessments.v1`.
 * Data saved before sign-in existed (unscoped `ikan.*` keys) moves to the first account that
 * signs in on this device. */

let scope = "guest";
const listeners = new Set<() => void>();

export const getScope = () => scope;

export const scopedKey = (key: string) => key.replace(/^ikan\./, `ikan.u.${scope}.`);

export function onScopeChange(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setScope(next: string) {
  if (next === scope) return;
  scope = next;
  listeners.forEach((l) => l());
}

/** Move pre-account data (`ikan.x`) into this account (`ikan.u.<id>.x`) without overwriting. */
export function claimGuestData(userId: string) {
  if (typeof window === "undefined") return;
  try {
    const legacy = Object.keys(window.localStorage).filter(
      (k) => k.startsWith("ikan.") && !k.startsWith("ikan.u.") && k !== "ikan.claimed",
    );
    if (!legacy.length) return;
    for (const k of legacy) {
      const target = k.replace(/^ikan\./, `ikan.u.${userId}.`);
      const value = window.localStorage.getItem(k);
      if (value !== null && window.localStorage.getItem(target) === null) {
        window.localStorage.setItem(target, value);
      }
      window.localStorage.removeItem(k);
    }
  } catch {
    /* storage unavailable */
  }
}
