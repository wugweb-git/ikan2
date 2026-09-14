// ikan2 ↔ Google Health API.
//
//   POST /start       (signed-in user) → { url } to send the person to Google's consent screen
//   GET  /callback    (from Google)    → stores the refresh token, first sync, back to the app
//   POST /sync        (signed-in user) → refreshes the last 30 days into ikan2_health_daily
//   POST /status      (signed-in user) → { connected, lastSyncedAt, lastError }
//   POST /disconnect  (signed-in user) → revokes access and deletes stored health data
//
// Secrets: GOOGLE_HEALTH_CLIENT_ID, GOOGLE_HEALTH_CLIENT_SECRET. SUPABASE_URL,
// SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided by the platform.

import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CLIENT_ID = Deno.env.get("GOOGLE_HEALTH_CLIENT_ID") ?? "";
const CLIENT_SECRET = Deno.env.get("GOOGLE_HEALTH_CLIENT_SECRET") ?? "";

const FN_URL = `${SUPABASE_URL}/functions/v1/ikan2-google-health`;
const REDIRECT_URI = `${FN_URL}/callback`;
const API = "https://health.googleapis.com/v4/users/me";
const SCOPES = [
  "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
  "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
  "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
];
const ALLOWED_RETURN = [
  /^https:\/\/app\.ikanhealth\.in$/,
  /^https:\/\/ikanhealth\.in$/,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/,
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
];
const DAYS = 30;

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin":
    origin && ALLOWED_RETURN.some((r) => r.test(origin)) ? origin : "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  Vary: "Origin",
});

const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), "Content-Type": "application/json" },
  });

/* ---------------------------- signed state ---------------------------- */

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const fromB64url = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(`${SERVICE_KEY}:google-health-state`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

async function signState(payload: { uid: string; ret: string; exp: number }) {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  return `${body}.${await hmac(body)}`;
}

async function readState(state: string) {
  const [body, sig] = state.split(".");
  if (!body || !sig || (await hmac(body)) !== sig) return null;
  const p = JSON.parse(new TextDecoder().decode(fromB64url(body))) as {
    uid: string;
    ret: string;
    exp: number;
  };
  return p.exp > Date.now() ? p : null;
}

/* ------------------------------- helpers ------------------------------- */

async function userFrom(req: Request) {
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
  const { data } = await client.auth.getUser(token);
  return data.user ?? null;
}

async function tokenRequest(params: Record<string, string>) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, ...params }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`google_token_${body.error ?? res.status}`);
  return body as {
    access_token: string;
    refresh_token?: string;
    scope?: string;
    expires_in: number;
  };
}

async function api(path: string, accessToken: string, init: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`google_health_${res.status}_${path.split("/")[2] ?? path}`);
  return await res.json();
}

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const civil = (d: Date) => ({
  date: { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() },
  time: { hours: 0, minutes: 0, seconds: 0 },
});
const civilYmd = (c?: { date?: { year: number; month: number; day: number } }) =>
  c?.date
    ? `${c.date.year}-${String(c.date.month).padStart(2, "0")}-${String(c.date.day).padStart(2, "0")}`
    : null;
const num = (v: unknown) => (v === undefined || v === null || v === "" ? null : Number(v));

type Day = {
  steps?: number | null;
  sleep_minutes?: number | null;
  awake_minutes?: number | null;
  resting_heart_rate?: number | null;
  hrv_ms?: number | null;
  active_minutes?: number | null;
};

/** Pull the last DAYS days. Each data type is read on its own so one failure doesn't stop the rest. */
async function syncUser(uid: string) {
  const { data: conn } = await admin
    .from("ikan2_health_connections")
    .select("refresh_token")
    .eq("user_id", uid)
    .maybeSingle();
  if (!conn) throw new Error("not_connected");

  const { access_token } = await tokenRequest({
    grant_type: "refresh_token",
    refresh_token: conn.refresh_token,
  });

  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  end.setUTCDate(end.getUTCDate() + 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - DAYS);

  const days = new Map<string, Day>();
  const put = (date: string | null, patch: Day) => {
    if (!date) return;
    days.set(date, { ...days.get(date), ...patch });
  };
  const errors: string[] = [];
  const attempt = async (label: string, fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (e) {
      errors.push(`${label}: ${(e as Error).message}`);
    }
  };

  const rollUp = (type: string) =>
    api(`/dataTypes/${type}/dataPoints:dailyRollUp`, access_token, {
      method: "POST",
      body: JSON.stringify({
        range: { start: civil(start), end: civil(end) },
        windowSizeDays: 1,
        dataSourceFamily: "users/me/dataSourceFamilies/all-sources",
      }),
    });

  await attempt("steps", async () => {
    const r = await rollUp("steps");
    for (const p of r.rollupDataPoints ?? [])
      put(civilYmd(p.civilStartTime), { steps: num(p.steps?.countSum) });
  });

  await attempt("active-minutes", async () => {
    const r = await rollUp("active-minutes");
    for (const p of r.rollupDataPoints ?? []) {
      const levels = (p.activeMinutes?.activeMinutesRollupByActivityLevel ?? []) as {
        activeMinutesSum?: string;
      }[];
      const total = levels.reduce((n, l) => n + Number(l.activeMinutesSum ?? 0), 0);
      put(civilYmd(p.civilStartTime), { active_minutes: levels.length ? total : null });
    }
  });

  await attempt("sleep", async () => {
    let pageToken: string | undefined;
    const since = ymd(start);
    do {
      const q = new URLSearchParams({
        filter: `sleep.interval.civil_end_time >= "${since}"`,
        pageSize: "25",
        ...(pageToken ? { pageToken } : {}),
      });
      const r = await api(`/dataTypes/sleep/dataPoints?${q}`, access_token);
      for (const p of r.dataPoints ?? []) {
        const s = p.sleep;
        if (!s?.interval?.endTime) continue;
        const date = String(s.interval.endTime).slice(0, 10); // the morning the sleep ended
        const prev = days.get(date);
        put(date, {
          sleep_minutes: (prev?.sleep_minutes ?? 0) + (num(s.summary?.minutesAsleep) ?? 0),
          awake_minutes: (prev?.awake_minutes ?? 0) + (num(s.summary?.minutesAwake) ?? 0),
        });
      }
      pageToken = r.nextPageToken || undefined;
    } while (pageToken);
  });

  await attempt("daily-resting-heart-rate", async () => {
    const q = new URLSearchParams({
      filter: `daily_resting_heart_rate.date >= "${ymd(start)}"`,
      pageSize: "100",
    });
    const r = await api(`/dataTypes/daily-resting-heart-rate/dataPoints?${q}`, access_token);
    for (const p of r.dataPoints ?? []) {
      const d = p.dailyRestingHeartRate;
      const date = civilYmd({ date: d?.date });
      if (date && date >= ymd(start)) put(date, { resting_heart_rate: num(d.beatsPerMinute) });
    }
  });

  await attempt("daily-heart-rate-variability", async () => {
    const q = new URLSearchParams({
      filter: `daily_heart_rate_variability.date >= "${ymd(start)}"`,
      pageSize: "100",
    });
    const r = await api(`/dataTypes/daily-heart-rate-variability/dataPoints?${q}`, access_token);
    for (const p of r.dataPoints ?? []) {
      const d = p.dailyHeartRateVariability;
      const date = civilYmd({ date: d?.date });
      if (date && date >= ymd(start))
        put(date, { hrv_ms: num(d.averageHeartRateVariabilityMilliseconds) });
    }
  });

  const rows = [...days.entries()].map(([date, d]) => ({
    user_id: uid,
    date,
    ...d,
    updated_at: new Date().toISOString(),
  }));
  if (rows.length) {
    const { error } = await admin
      .from("ikan2_health_daily")
      .upsert(rows, { onConflict: "user_id,date" });
    if (error) throw new Error(`save_${error.message}`);
  }
  // every type failing means the connection itself is broken
  const allFailed = errors.length === 5;
  await admin
    .from("ikan2_health_connections")
    .update({
      last_synced_at: allFailed ? undefined : new Date().toISOString(),
      last_error: errors.length ? errors.join("; ").slice(0, 500) : null,
    })
    .eq("user_id", uid);
  if (allFailed) throw new Error(errors[0]);
  return { days: rows.length, errors };
}

/* -------------------------------- routes -------------------------------- */

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(origin) });
  const url = new URL(req.url);
  const route = url.pathname.split("/").pop();

  try {
    if (route === "callback") {
      const state = await readState(url.searchParams.get("state") ?? "");
      if (!state)
        return new Response("This link has expired. Go back to iKAN and try again.", {
          status: 400,
        });
      const back = (result: string) =>
        Response.redirect(`${state.ret}/settings?health=${result}`, 302);
      if (url.searchParams.get("error")) return back("cancelled");
      const code = url.searchParams.get("code");
      if (!code) return back("error");

      const tokens = await tokenRequest({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      });
      if (!tokens.refresh_token) return back("error");
      let healthUserId: string | null = null;
      try {
        healthUserId = (await api("/identity", tokens.access_token)).healthUserId ?? null;
      } catch {
        /* identity is optional */
      }
      const { error } = await admin.from("ikan2_health_connections").upsert({
        user_id: state.uid,
        refresh_token: tokens.refresh_token,
        scopes: (tokens.scope ?? "").split(" ").filter(Boolean),
        health_user_id: healthUserId,
        connected_at: new Date().toISOString(),
        last_error: null,
      });
      if (error) return back("error");
      try {
        await syncUser(state.uid);
      } catch {
        /* first sync can be retried from the app */
      }
      return back("connected");
    }

    if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);
    const user = await userFrom(req);
    if (!user) return json({ error: "sign_in_required" }, 401, origin);

    if (route === "start") {
      if (!CLIENT_ID || !CLIENT_SECRET) return json({ error: "not_configured" }, 503, origin);
      const body = (await req.json().catch(() => ({}))) as { returnTo?: string };
      const ret =
        body.returnTo && ALLOWED_RETURN.some((r) => r.test(body.returnTo!))
          ? body.returnTo
          : "https://app.ikanhealth.in";
      const state = await signState({ uid: user.id, ret, exp: Date.now() + 15 * 60 * 1000 });
      const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      auth.search = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: "code",
        scope: SCOPES.join(" "),
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: "true",
        state,
        ...(user.email ? { login_hint: user.email } : {}),
      }).toString();
      return json({ url: auth.toString() }, 200, origin);
    }

    if (route === "status") {
      const { data } = await admin
        .from("ikan2_health_connections")
        .select("connected_at,last_synced_at,last_error")
        .eq("user_id", user.id)
        .maybeSingle();
      return json(
        {
          configured: Boolean(CLIENT_ID && CLIENT_SECRET),
          connected: Boolean(data),
          connectedAt: data?.connected_at ?? null,
          lastSyncedAt: data?.last_synced_at ?? null,
          lastError: data?.last_error ?? null,
        },
        200,
        origin,
      );
    }

    if (route === "sync") {
      const result = await syncUser(user.id);
      return json({ ok: true, ...result }, 200, origin);
    }

    if (route === "disconnect") {
      const { data } = await admin
        .from("ikan2_health_connections")
        .select("refresh_token")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.refresh_token) {
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(data.refresh_token)}`,
          { method: "POST" },
        ).catch(() => {});
      }
      await admin.from("ikan2_health_connections").delete().eq("user_id", user.id);
      await admin.from("ikan2_health_daily").delete().eq("user_id", user.id);
      return json({ ok: true }, 200, origin);
    }

    return json({ error: "not_found" }, 404, origin);
  } catch (e) {
    const message = (e as Error).message;
    if (message === "not_connected") return json({ error: message }, 409, origin);
    if (message.startsWith("google_token_invalid_grant")) {
      // access was removed on Google's side (or the 7-day testing token expired)
      const user = await userFrom(req).catch(() => null);
      if (user) await admin.from("ikan2_health_connections").delete().eq("user_id", user.id);
      return json({ error: "reconnect_required" }, 409, origin);
    }
    console.error(message);
    return json({ error: "sync_failed", detail: message }, 502, origin);
  }
});
