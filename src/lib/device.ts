import { useEffect, useState, useSyncExternalStore } from "react";
import { createLocalStore } from "@/lib/local-store";

/* What the phone lets iKAN use: notifications, location (for city and weather) and motion.
 * Each is asked for only when the person taps to allow it, and the answer is remembered. */

export type Access = "granted" | "denied" | "prompt" | "unsupported";

type DeviceState = {
  location?: { lat: number; lon: number; city: string; at: string } | undefined;
  weather?: { temp: number; code: number; at: string } | undefined;
  motion?: Access | undefined;
  /** yyyy-mm-dd of the last mood reminder shown */
  remindedOn?: string | undefined;
};

const store = createLocalStore<DeviceState>("ikan.device.v1", {});
export const useDevice = () => store.use();

const hasWindow = () => typeof window !== "undefined";

/* ------------------------------ notifications ------------------------------ */

export const notificationAccess = (): Access => {
  if (!hasWindow() || !("Notification" in window)) return "unsupported";
  return Notification.permission === "default" ? "prompt" : Notification.permission;
};

const permissionListeners = new Set<() => void>();
const emitPermissions = () => permissionListeners.forEach((l) => l());
export const useNotificationAccess = () =>
  useSyncExternalStore(
    (l) => {
      permissionListeners.add(l);
      return () => permissionListeners.delete(l);
    },
    notificationAccess,
    () => "prompt" as Access,
  );

export async function requestNotifications(): Promise<Access> {
  if (notificationAccess() === "unsupported") return "unsupported";
  try {
    await Notification.requestPermission();
  } catch {
    /* older Safari takes a callback; the permission is read below either way */
  }
  emitPermissions();
  return notificationAccess();
}

/** Show a notification through the service worker when there is one, so it works installed. */
export async function notify(title: string, body: string, url = "/") {
  if (notificationAccess() !== "granted") return false;
  const options = { body, icon: "/pwa-192x192.png", badge: "/pwa-64x64.png", data: { url } };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) await reg.showNotification(title, options);
    else new Notification(title, options);
    return true;
  } catch {
    return false;
  }
}

/* -------------------------------- location -------------------------------- */

export const locationSupported = () => hasWindow() && "geolocation" in navigator;

export async function locationAccess(): Promise<Access> {
  if (!locationSupported()) return "unsupported";
  try {
    const s = await navigator.permissions?.query({ name: "geolocation" as PermissionName });
    return (s?.state as Access | undefined) ?? "prompt";
  } catch {
    return "prompt";
  }
}

export function useLocationAccess() {
  const [access, setAccess] = useState<Access>("prompt");
  useEffect(() => {
    let alive = true;
    void locationAccess().then((a) => alive && setAccess(a));
    return () => {
      alive = false;
    };
  }, []);
  return [access, setAccess] as const;
}

/** Ask for the position, then name the city and fetch today's weather. */
export function requestLocation(): Promise<DeviceState["location"]> {
  return new Promise((resolve, reject) => {
    if (!locationSupported()) return reject(new Error("Location isn’t available on this device."));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(3));
        const lon = Number(pos.coords.longitude.toFixed(3));
        let city = "";
        try {
          const r = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
          );
          const j = (await r.json()) as { city?: string; locality?: string };
          city = j.city || j.locality || "";
        } catch {
          /* the city stays empty; weather still works */
        }
        const location = { lat, lon, city, at: new Date().toISOString() };
        store.update((s) => ({ ...s, location }));
        void refreshWeather(true);
        resolve(location);
      },
      (err) =>
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? "Location is blocked. Allow it for iKAN in your phone’s settings."
              : "Couldn’t find your location. Try again outside or with Wi-Fi on.",
          ),
        ),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60 * 60 * 1000 },
    );
  });
}

/** Current temperature for the saved location, refreshed at most every 30 minutes. */
export async function refreshWeather(force = false) {
  const { location, weather } = store.read();
  if (!location) return;
  if (!force && weather && Date.now() - new Date(weather.at).getTime() < 30 * 60 * 1000) return;
  try {
    const r = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code`,
    );
    const j = (await r.json()) as { current?: { temperature_2m: number; weather_code: number } };
    if (j.current)
      store.update((s) => ({
        ...s,
        weather: {
          temp: Math.round(j.current!.temperature_2m),
          code: j.current!.weather_code,
          at: new Date().toISOString(),
        },
      }));
  } catch {
    /* offline: keep the last reading */
  }
}

/** WMO weather code → a short word. */
export const weatherWord = (code: number) =>
  code === 0
    ? "Clear"
    : code <= 3
      ? "Cloudy"
      : code <= 48
        ? "Fog"
        : code <= 67
          ? "Rain"
          : code <= 77
            ? "Snow"
            : code <= 82
              ? "Showers"
              : "Storms";

/* --------------------------------- motion --------------------------------- */

type MotionPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

/** Step and activity sensing. iPhone asks explicitly; Android allows it without a prompt. */
export async function requestMotion(): Promise<Access> {
  if (!hasWindow() || !("DeviceMotionEvent" in window)) return "unsupported";
  const DM = window.DeviceMotionEvent as unknown as MotionPermission;
  let access: Access = "granted";
  if (typeof DM.requestPermission === "function") {
    try {
      access = await DM.requestPermission();
    } catch {
      access = "denied";
    }
  }
  store.update((s) => ({ ...s, motion: access }));
  return access;
}

/* ------------------------------ app install ------------------------------ */

export const isInstalled = () =>
  hasWindow() &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true);

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
let installPrompt: InstallPrompt | null = null;
const installListeners = new Set<() => void>();
if (hasWindow()) {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPrompt = e as InstallPrompt;
    installListeners.forEach((l) => l());
  });
}
export const useCanInstall = () =>
  useSyncExternalStore(
    (l) => {
      installListeners.add(l);
      return () => installListeners.delete(l);
    },
    () => Boolean(installPrompt),
    () => false,
  );
export async function installApp() {
  if (!installPrompt) return false;
  await installPrompt.prompt();
  const { outcome } = await installPrompt.userChoice;
  installPrompt = null;
  installListeners.forEach((l) => l());
  return outcome === "accepted";
}

/* ----------------------------- service worker ----------------------------- */

export function registerServiceWorker() {
  if (!hasWindow() || !("serviceWorker" in navigator) || import.meta.env.DEV) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* the app works without it; only offline and installed notifications need it */
    });
  });
}

/** While the app is open: show the daily mood reminder once, after the chosen time,
 * if there is no check-in yet today. */
export function checkMoodReminder(opts: { enabled: boolean; time: string; loggedToday: boolean }) {
  if (!opts.enabled || opts.loggedToday || notificationAccess() !== "granted") return;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const [h, m] = opts.time.split(":").map(Number);
  if (now.getHours() * 60 + now.getMinutes() < (h ?? 20) * 60 + (m ?? 30)) return;
  if (store.read().remindedOn === today) return;
  store.update((s) => ({ ...s, remindedOn: today }));
  void notify(
    "How are you feeling today?",
    "A 30-second check-in keeps your journal up to date.",
    "/journal",
  );
}
