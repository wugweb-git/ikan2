// iKAN push notifications, to browsers and to the Android app.
//
//   POST /test       (signed-in user) → sends a test notification to that account's devices
//   POST /reminders  (scheduler, x-cron-secret header) → daily mood reminders at each
//                    subscription's chosen local time, once per day
//
// Two protocols, one table. A browser subscription (kind 'webpush') is an endpoint url plus
// two keys, sent with the Web Push protocol. The Android app (kind 'fcm') registers a single
// opaque token that only Firebase can deliver to, because Web Push does not exist inside an
// Android WebView. Sending a web push to an FCM row silently fails, which is what used to
// happen to every Android device.
//
// Secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT, PUSH_CRON_SECRET,
//          FIREBASE_SERVICE_ACCOUNT (the whole service-account json, as one string).

import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CRON_SECRET = Deno.env.get("PUSH_CRON_SECRET") ?? "";

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT") ?? "mailto:hello@ikanhealth.in",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers });

type Sub = {
  endpoint: string;
  user_id: string;
  kind: "webpush" | "fcm";
  p256dh: string | null;
  auth: string | null;
  reminder_time: string;
  time_zone: string;
  last_reminded_on: string | null;
};

type Payload = { title: string; body: string; url: string };

/* ------------------------------ Firebase (Android) ------------------------------ */

type ServiceAccount = { client_email: string; private_key: string; project_id: string };

const serviceAccount = (): ServiceAccount | null => {
  const raw = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ServiceAccount;
  } catch {
    console.error("FIREBASE_SERVICE_ACCOUNT is not valid json");
    return null;
  }
};

const b64url = (b: ArrayBuffer | string) => {
  const bytes = typeof b === "string" ? new TextEncoder().encode(b) : new Uint8Array(b);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/** Import the service account's PEM private key for RS256 signing. */
async function signingKey(pem: string) {
  const body = pem.replace(/-----[A-Z ]+-----/g, "").replace(/\s+/g, "");
  const der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

/* One access token serves every message in a run. Google issues them for an hour; we keep a
 * five-minute margin so a long fan-out never sends on a token that expires mid-loop. */
let fcmToken: { value: string; expires: number } | null = null;

async function fcmAccessToken(sa: ServiceAccount): Promise<string | null> {
  if (fcmToken && Date.now() < fcmToken.expires) return fcmToken.value;
  try {
    const now = Math.floor(Date.now() / 1000);
    const claim = {
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };
    const unsigned = `${b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64url(JSON.stringify(claim))}`;
    const sig = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      await signingKey(sa.private_key),
      new TextEncoder().encode(unsigned),
    );
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${unsigned}.${b64url(sig)}`,
      }),
    });
    const body = (await res.json()) as { access_token?: string; error_description?: string };
    if (!res.ok || !body.access_token) {
      console.error("fcm token exchange failed", res.status, body.error_description);
      return null;
    }
    fcmToken = { value: body.access_token, expires: Date.now() + 55 * 60 * 1000 };
    return fcmToken.value;
  } catch (e) {
    console.error("fcm token error", (e as Error).message);
    return null;
  }
}

/** Deliver to one Android device. Tokens Firebase has retired are deleted, as for web push. */
async function sendFcm(sub: Sub, payload: Payload) {
  const sa = serviceAccount();
  if (!sa) return "unconfigured";
  const token = await fcmAccessToken(sa);
  if (!token) return "failed";
  try {
    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            token: sub.endpoint,
            notification: { title: payload.title, body: payload.body },
            // The tap handler reads `url` from data (see native-push.ts).
            data: { url: payload.url },
            android: { priority: "NORMAL", notification: { channel_id: "default" } },
          },
        }),
      },
    );
    if (res.ok) return "sent";
    const err = (await res.json().catch(() => ({}))) as { error?: { status?: string } };
    // UNREGISTERED / INVALID_ARGUMENT mean the app was uninstalled or the token rotated.
    if (res.status === 404 || err.error?.status === "UNREGISTERED") {
      await admin.from("ikan2_push_subscriptions").delete().eq("endpoint", sub.endpoint);
      return "expired";
    }
    console.error("fcm send failed", res.status, err.error?.status);
    return "failed";
  } catch (e) {
    console.error("fcm send error", (e as Error).message);
    return "failed";
  }
}

/** Send one notification by whichever protocol this subscription speaks. */
async function send(sub: Sub, payload: Payload) {
  if (sub.kind === "fcm") return sendFcm(sub, payload);
  if (!sub.p256dh || !sub.auth) return "failed"; // a webpush row without keys cannot be encrypted
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh!, auth: sub.auth! } },
      JSON.stringify(payload),
      { TTL: 60 * 60 * 6, urgency: "normal" },
    );
    return "sent";
  } catch (e) {
    const status = (e as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) {
      await admin.from("ikan2_push_subscriptions").delete().eq("endpoint", sub.endpoint);
      return "expired";
    }
    console.error("push failed", status, (e as Error).message);
    return "failed";
  }
}

/** Local date (yyyy-mm-dd) and minutes past midnight in a time zone. */
function localNow(timeZone: string) {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
  } catch {
    return localNow("Asia/Kolkata");
  }
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const route = new URL(req.url).pathname.split("/").pop();

  if (route === "test") {
    const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    const client = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
    const { data } = token ? await client.auth.getUser(token) : { data: { user: null } };
    if (!data.user) return json({ error: "sign_in_required" }, 401);
    const { data: subs } = await admin
      .from("ikan2_push_subscriptions")
      .select("*")
      .eq("user_id", data.user.id);
    const results = await Promise.all(
      (subs ?? []).map((s) =>
        send(s as Sub, {
          title: "Hello from iKAN",
          body: "This is how reminders will look.",
          url: "/settings",
        }),
      ),
    );
    return json({ devices: results.length, sent: results.filter((r) => r === "sent").length });
  }

  if (route === "reminders") {
    if (!CRON_SECRET || req.headers.get("x-cron-secret") !== CRON_SECRET)
      return json({ error: "forbidden" }, 403);
    const { data: subs, error } = await admin
      .from("ikan2_push_subscriptions")
      .select("endpoint,user_id,kind,p256dh,auth,reminder_time,time_zone,last_reminded_on")
      .eq("mood_reminder", true);
    if (error) return json({ error: error.message }, 500);
    let sent = 0;
    let failed = 0;
    for (const s of (subs ?? []) as Sub[]) {
      /* Per-row, because this loop is the whole day's reminders for everyone. An unexpected
       * throw on one subscription used to take the request down with it, and every person
       * after that row in the list simply never heard from us. */
      try {
        const now = localNow(s.time_zone);
        const [h, m] = (s.reminder_time ?? "20:30").split(":").map(Number);
        const at = (Number.isFinite(h) ? h : 20) * 60 + (Number.isFinite(m) ? m : 30);
        const due = now.minutes >= at;
        // only within 3 hours of the chosen time, so a phone that was off doesn't get a late nudge
        const fresh = now.minutes - at < 180;
        if (!due || !fresh || s.last_reminded_on === now.date) continue;
        const result = await send(s, {
          title: "How are you feeling today?",
          body: "A 30-second check-in keeps your journal up to date.",
          url: "/journal",
        });
        if (result === "sent") {
          sent++;
          await admin
            .from("ikan2_push_subscriptions")
            .update({ last_reminded_on: now.date })
            .eq("endpoint", s.endpoint);
        }
      } catch (e) {
        failed++;
        console.error("reminder failed for one subscription", (e as Error).message);
      }
    }
    return json({ checked: subs?.length ?? 0, sent, failed });
  }

  return json({ error: "not_found" }, 404);
});
