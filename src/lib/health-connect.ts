import { useCallback, useEffect, useState } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { supabase } from "@/lib/auth";

/* Health Connect, read in the iKAN Android app (see android/.../IkanHealthPlugin.kt).
 * The phone reads a daily summary and saves it to the account, so the same numbers show on the
 * website too. Nothing leaves the phone until the person connects. */

export type HealthDay = {
  date: string;
  steps: number | null;
  sleep_minutes: number | null;
  awake_minutes: number | null;
  deep_minutes: number | null;
  rem_minutes: number | null;
  heart_rate: number | null;
  resting_heart_rate: number | null;
  hrv_ms: number | null;
  exercise_minutes: number | null;
};

type Availability = "available" | "update_required" | "unavailable";
type Granted = { granted: string[]; all: boolean };

type IkanHealthPlugin = {
  availability(): Promise<{ status: Availability }>;
  granted(): Promise<Granted>;
  connect(): Promise<Granted>;
  openSettings(): Promise<void>;
  install(): Promise<void>;
  readDaily(o: { days: number }): Promise<{ days: Partial<HealthDay>[]; errors: string[] }>;
};

const IkanHealth = registerPlugin<IkanHealthPlugin>("IkanHealth");

/** true inside the iKAN Android app */
export const inAndroidApp = () =>
  Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";

export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.ikan.wugweb";

const COLUMNS =
  "date,steps,sleep_minutes,awake_minutes,deep_minutes,rem_minutes,heart_rate,resting_heart_rate,hrv_ms,exercise_minutes";
const LAST_SYNC = "ikan.health-connect.synced";

/** Read the phone and save to the account. Returns how many days were saved. */
export async function syncHealthConnect(days = 30) {
  const { data } = await supabase().auth.getSession();
  const user = data.session?.user;
  if (!user) throw new Error("Sign in again to sync health data.");
  const res = await IkanHealth.readDaily({ days });
  const rows = res.days.map((d) => ({
    user_id: user.id,
    date: d.date!,
    steps: d.steps ?? null,
    sleep_minutes: d.sleep_minutes ?? null,
    awake_minutes: d.awake_minutes ?? null,
    deep_minutes: d.deep_minutes ?? null,
    rem_minutes: d.rem_minutes ?? null,
    heart_rate: d.heart_rate ?? null,
    resting_heart_rate: d.resting_heart_rate ?? null,
    hrv_ms: d.hrv_ms ?? null,
    exercise_minutes: d.exercise_minutes ?? null,
    source: "health_connect",
    updated_at: new Date().toISOString(),
  }));
  if (rows.length) {
    const { error } = await supabase()
      .from("ikan2_health_daily")
      .upsert(rows, { onConflict: "user_id,date" });
    if (error) throw new Error("Couldn’t save your health data. Try again.");
  }
  try {
    localStorage.setItem(LAST_SYNC, new Date().toISOString());
  } catch {
    /* storage unavailable */
  }
  return rows.length;
}

/** Quietly refresh when the app opens, at most every 3 hours, if access was already given. */
export async function autoSyncHealthConnect() {
  if (!inAndroidApp()) return;
  try {
    const last = localStorage.getItem(LAST_SYNC);
    if (last && Date.now() - new Date(last).getTime() < 3 * 3_600_000) return;
    const { status } = await IkanHealth.availability();
    if (status !== "available") return;
    const { granted } = await IkanHealth.granted();
    if (granted.length) await syncHealthConnect();
  } catch {
    /* try again next time the app opens */
  }
}

export async function healthDays(days = 30): Promise<HealthDay[]> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  const { data, error } = await supabase()
    .from("ikan2_health_daily")
    .select(COLUMNS)
    .gte("date", since)
    .order("date", { ascending: true });
  if (error) return [];
  return (data ?? []) as HealthDay[];
}

/** Remove the health data iKAN saved (access itself is managed in Health Connect). */
export async function deleteHealthData() {
  const { data } = await supabase().auth.getSession();
  if (!data.session) return;
  await supabase().from("ikan2_health_daily").delete().eq("user_id", data.session.user.id);
}

export function useHealthConnect() {
  const native = typeof window !== "undefined" && inAndroidApp();
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [granted, setGranted] = useState<string[]>([]);
  const [days, setDays] = useState<HealthDay[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setDays(await healthDays());
    if (!native) return;
    try {
      const { status } = await IkanHealth.availability();
      setAvailability(status);
      if (status === "available") setGranted((await IkanHealth.granted()).granted);
    } catch {
      setAvailability("unavailable");
    }
  }, [native]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError((e as Error).message || "Health Connect didn’t respond. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return {
    native,
    availability,
    granted,
    connected: granted.length > 0,
    days,
    busy,
    error,
    connect: () =>
      run(async () => {
        const r = await IkanHealth.connect();
        if (r.granted.length) await syncHealthConnect();
      }),
    sync: () => run(() => syncHealthConnect()),
    manage: () => run(() => IkanHealth.openSettings()),
    install: () => run(() => IkanHealth.install()),
    removeData: () => run(deleteHealthData),
  };
}

/** Average of the most recent `n` days that have a value. */
export function recentAverage(days: HealthDay[], key: keyof Omit<HealthDay, "date">, n = 7) {
  const values = days
    .map((d) => d[key])
    .filter((v): v is number => typeof v === "number" && v > 0)
    .slice(-n);
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}
