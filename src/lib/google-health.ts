import { useCallback, useEffect, useState } from "react";
import { functionUrl } from "@/lib/backend";
import { supabase } from "@/lib/auth";

/* Google Health: steps, sleep, resting heart rate, HRV and active minutes from Fitbit and
 * Google devices. The connection and the Google tokens live on the server
 * (ikan2-google-health); the app only reads the daily summaries it saved. */

export type HealthDay = {
  date: string;
  steps: number | null;
  sleep_minutes: number | null;
  awake_minutes: number | null;
  resting_heart_rate: number | null;
  hrv_ms: number | null;
  active_minutes: number | null;
  moods: string[] | null;
};

export type HealthStatus = {
  configured: boolean;
  connected: boolean;
  connectedAt: string | null;
  lastSyncedAt: string | null;
  lastError: string | null;
};

const FN = functionUrl("ikan2-google-health");

async function call<T>(route: string, body: unknown = {}): Promise<T> {
  const { data } = await supabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Sign in again to connect Google Health.");
  const res = await fetch(`${FN}/${route}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {
    throw new Error("Can’t reach iKAN. Check your connection and try again.");
  });
  const json = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    const code = json.error;
    throw new Error(
      code === "not_configured"
        ? "Google Health isn’t available yet."
        : code === "reconnect_required"
          ? "Google Health access ended. Connect again to keep syncing."
          : code === "not_connected"
            ? "Google Health isn’t connected."
            : "Google Health didn’t sync. Try again in a moment.",
    );
  }
  return json;
}

/** Opens Google's consent screen; Google returns to /settings?health=connected. */
export async function connectGoogleHealth() {
  const { url } = await call<{ url: string }>("start", { returnTo: window.location.origin });
  window.location.assign(url);
}
export const syncGoogleHealth = () => call<{ days: number; errors: string[] }>("sync");
export const disconnectGoogleHealth = () => call("disconnect");
export const googleHealthStatus = () => call<HealthStatus>("status");

export async function healthDays(days = 30): Promise<HealthDay[]> {
  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
  const { data, error } = await supabase()
    .from("ikan2_health_daily")
    .select("date,steps,sleep_minutes,awake_minutes,resting_heart_rate,hrv_ms,active_minutes,moods")
    .gte("date", since)
    .order("date", { ascending: true });
  if (error) throw new Error("Couldn’t load your health data.");
  return (data ?? []) as HealthDay[];
}

/** Connection state plus the last 30 days, refreshed after connect/sync/disconnect. */
export function useGoogleHealth() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [days, setDays] = useState<HealthDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const s = await googleHealthStatus();
      setStatus(s);
      setDays(s.connected ? await healthDays() : []);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

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
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return {
    status,
    days,
    error,
    busy,
    refresh,
    connect: () => run(connectGoogleHealth),
    sync: () => run(syncGoogleHealth),
    disconnect: () => run(disconnectGoogleHealth),
  };
}

/** Averages over the most recent `n` days that have a value. */
export function recentAverage(
  days: HealthDay[],
  key: keyof Omit<HealthDay, "date" | "moods">,
  n = 7,
) {
  const values = days
    .map((d) => d[key])
    .filter((v): v is number => typeof v === "number" && v > 0)
    .slice(-n);
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}
