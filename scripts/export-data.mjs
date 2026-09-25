/* Export every table to JSON, through the REST API rather than a Postgres connection.
 *
 * Why this exists alongside backup-db.sh: pg_dump needs the database password and the right
 * pooler hostname, and Supabase hands out different pooler hosts per project - which is exactly
 * where the dump kept failing. This path needs only the service role key, which is one copy from
 * the dashboard, and works over plain https.
 *
 * What it is not: a pg_dump replacement. It captures ROWS, not schema, constraints, policies or
 * the auth schema. Restoring means applying supabase/schema.sql first and then loading these.
 * For a database this size that is a fair trade for a backup that actually runs.
 *
 * Usage:
 *   SUPABASE_SERVICE_KEY='eyJ...' node scripts/export-data.mjs
 *
 * The key is in Supabase -> Project settings -> API keys -> service_role. It bypasses row level
 * security, so treat it like a password: never commit it, never paste it into a chat.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const URL_BASE = "https://jpfvoevxegnknxoqmwye.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_KEY;

const TABLES = [
  "ikan2_user_state",
  "ikan2_health_daily",
  "ikan2_push_subscriptions",
  "kv_store_cc205da9",
  "user_assessment_results",
  "user_enrollments",
  "user_journal_entries",
  "user_program_progress",
  "user_ikan_scores",
  "UserConnectCheck",
];

/* Check the key looks like a key before doing anything. Pasting the placeholder from an
 * example is an easy slip, and without this the script fires one request per table and prints
 * ten identical 401s - which buries the one fact that matters. */
function keyProblem(k) {
  if (!k) return "is not set";
  if (/^(eyJ\.\.\.|<.*>|your-.*|\.\.\.)$/i.test(k.trim())) return "is still the placeholder from the example";
  const jwt = k.split(".").length === 3 && k.startsWith("eyJ");
  const modern = k.startsWith("sb_secret_") || k.startsWith("sb_publishable_");
  if (!jwt && !modern) return "does not look like a Supabase key (expected eyJ... with two dots, or sb_secret_...)";
  if (k.startsWith("sb_publishable_")) return "is the PUBLISHABLE key, which row level security will block. Use service_role";
  if (jwt) {
    try {
      const role = JSON.parse(Buffer.from(k.split(".")[1], "base64").toString()).role;
      if (role && role !== "service_role") return `is the ${role} key. Use service_role, or row level security returns almost nothing`;
    } catch { /* unreadable payload; let the request decide */ }
  }
  return null;
}

const problem = keyProblem(KEY);
if (problem) {
  console.error(`SUPABASE_SERVICE_KEY ${problem}.`);
  console.error("Get it from Supabase -> Project settings -> API keys -> service_role.");
  console.error("It bypasses row level security, so treat it like a password.");
  console.error("Then:  SUPABASE_SERVICE_KEY='<the real key>' node scripts/export-data.mjs");
  process.exit(1);
}

const OUT = join(homedir(), "ikan-backups", new Date().toISOString().slice(0, 19).replace(/[:T]/g, ""));
mkdirSync(OUT, { recursive: true });

/* PostgREST caps a response at 1000 rows by default, so page rather than trusting one request -
 * kv_store_cc205da9 alone is 4,397 and would silently come back truncated. */
async function fetchAll(table) {
  const rows = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const res = await fetch(`${URL_BASE}/rest/v1/${encodeURIComponent(table)}?select=*`, {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        Range: `${from}-${from + PAGE - 1}`,
        Prefer: "count=exact",
      },
    });
    if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < PAGE) break;
  }
  return rows;
}

let total = 0;
const manifest = { exportedAt: new Date().toISOString(), project: "jpfvoevxegnknxoqmwye", tables: {} };

for (const table of TABLES) {
  try {
    const rows = await fetchAll(table);
    writeFileSync(join(OUT, `${table}.json`), JSON.stringify(rows, null, 2), { mode: 0o600 });
    manifest.tables[table] = rows.length;
    total += rows.length;
    console.log(`  ${String(rows.length).padStart(6)}  ${table}`);
  } catch (e) {
    manifest.tables[table] = `FAILED: ${e.message}`;
    console.error(`  FAILED  ${table}: ${e.message}`);
    if (/401|Invalid API key/i.test(e.message)) {
      console.error("\nThe key was rejected, so every remaining table would fail the same way.");
      console.error("Supabase -> Project settings -> API keys -> service_role.");
      process.exit(1);
    }
  }
}

writeFileSync(join(OUT, "_manifest.json"), JSON.stringify(manifest, null, 2), { mode: 0o600 });

console.log(`\n${total} rows -> ${OUT}`);
console.log("\nThese files hold real journals and health data. They are written 0600 and sit");
console.log("outside the repo. To restore: apply supabase/schema.sql, then load these rows.");
