// ikan2 account data: reads and writes public.user_state for the signed-in person.
//
// Sign-in lives on the "Ikan - App" Supabase project, not this one, so the function checks the
// caller's Ikan token against that project's auth API and uses the user id it returns. The table
// has row-level security on with no policies; only this function (service role) touches it.
//
// Request: POST, header `x-ikan-token: <Ikan access token>`, JSON body:
//   { "action": "pull" }                                          -> { rows: [{ key, value, updated_at }] }
//   { "action": "push", "items": [{ key, value, updated_at }] }    -> { saved: n }
//   { "action": "clear" }                                         -> { cleared: true }

import { createClient } from "npm:@supabase/supabase-js@2";

const IKAN_AUTH_USER = "https://jpfvoevxegnknxoqmwye.supabase.co/auth/v1/user";
const IKAN_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZnZvZXZ4ZWdua254b3Ftd3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjIyNDIsImV4cCI6MjA3MzY5ODI0Mn0.VGYSE8LqBEggrQcUHJH9NcvursaoNfQK9K8-ESCo-rc";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-ikan-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const KEY = /^[a-z0-9][a-z0-9.\-_]{0,80}$/;
const MAX_BYTES = 512_000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Use POST" }, 405);

  const token = req.headers.get("x-ikan-token");
  if (!token) return json({ error: "Sign in first" }, 401);

  const who = await fetch(IKAN_AUTH_USER, { headers: { apikey: IKAN_ANON_KEY, Authorization: `Bearer ${token}` } });
  if (!who.ok) return json({ error: "Your session has expired. Sign in again." }, 401);
  const user = (await who.json()) as { id?: string };
  if (!user.id) return json({ error: "Sign in first" }, 401);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });

  let body: { action?: string; items?: { key: string; value: unknown; updated_at: string }[] };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Body must be JSON" }, 400);
  }

  if (body.action === "pull") {
    const { data, error } = await db.from("user_state").select("key, value, updated_at").eq("user_id", user.id);
    if (error) return json({ error: error.message }, 500);
    return json({ rows: data ?? [] });
  }

  if (body.action === "push") {
    const items = (body.items ?? []).filter(
      (i) => i && typeof i.key === "string" && KEY.test(i.key) && typeof i.updated_at === "string",
    );
    if (!items.length) return json({ saved: 0 });
    if (JSON.stringify(items).length > MAX_BYTES) return json({ error: "Too much data in one save" }, 413);
    const rows = items.map((i) => ({ user_id: user.id, key: i.key, value: i.value ?? null, updated_at: i.updated_at }));
    const { error } = await db.from("user_state").upsert(rows, { onConflict: "user_id,key" });
    if (error) return json({ error: error.message }, 500);
    return json({ saved: rows.length });
  }

  if (body.action === "clear") {
    const { error } = await db.from("user_state").delete().eq("user_id", user.id);
    if (error) return json({ error: error.message }, 500);
    return json({ cleared: true });
  }

  return json({ error: "Unknown action" }, 400);
});
