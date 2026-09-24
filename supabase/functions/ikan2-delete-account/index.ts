// ikan2 account deletion.
//
//   POST /   (signed-in user, Authorization: Bearer <access token>)
//     → deletes every row this account owns, then the account itself
//
// Google Play requires an app that creates accounts to offer deletion of the ACCOUNT, not just
// its data, from inside the app and from a web page. Settings' "Clear all data" only ever
// removed ikan2_user_state rows, leaving health data, push tokens and the auth user behind.
//
// Deleting an auth user needs the service role, which must never reach the client - hence a
// function. The caller's own access token is what proves whose account it is: the id comes from
// verifying that token, never from the request body, so nobody can delete someone else's
// account by naming them.
//
// Secrets: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (all provided by default).

import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

/* Every table that holds something belonging to a person. Anything added later must be listed
 * here too, or deletion quietly stops being complete. */
const OWNED_TABLES = ["ikan2_user_state", "ikan2_health_daily", "ikan2_push_subscriptions"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "Use POST." }), { status: 405, headers });

  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer "))
    return new Response(JSON.stringify({ error: "Sign in first." }), { status: 401, headers });

  // Verify the token rather than trusting anything the caller says about who they are.
  const asUser = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false },
    global: { headers: { Authorization: auth } },
  });
  const { data, error } = await asUser.auth.getUser();
  const user = data?.user;
  if (error || !user)
    return new Response(JSON.stringify({ error: "Sign in again." }), { status: 401, headers });

  const failed: string[] = [];
  for (const table of OWNED_TABLES) {
    const { error: e } = await admin.from(table).delete().eq("user_id", user.id);
    if (e) failed.push(`${table}: ${e.message}`);
  }
  // Stop before removing the account if any data survived: an account that is gone while its
  // rows remain is worse than a failed attempt the person can retry.
  if (failed.length)
    return new Response(JSON.stringify({ error: "Some data could not be removed.", failed }), {
      status: 500,
      headers,
    });

  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr)
    return new Response(JSON.stringify({ error: delErr.message }), { status: 500, headers });

  return new Response(JSON.stringify({ deleted: true }), { headers });
});
