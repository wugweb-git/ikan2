#!/usr/bin/env bash
# Rescue the user data stranded in the dormant Lovable Cloud database.
#
# Why this exists: when iKAN's backend moved to the "Ikan - App" Supabase project, eight
# people's accounts came across but four of them arrived empty. Their journals, assessments
# and programme progress stayed behind in the Lovable Cloud project and exist nowhere else.
# Deleting that project - which the cleanup plan proposed - would destroy them.
#
# Both halves run here rather than through an assistant on purpose: the rows are journals,
# assessment answers and emergency contacts, and neither the data nor your credentials
# should pass through a conversation.
#
#   ./scripts/rescue-lovable-cloud.sh backup    # dump the old project, verify, stop
#   ./scripts/rescue-lovable-cloud.sh migrate   # copy stranded rows into the live project
#
# Connection strings come from each project's dashboard: Settings -> Database -> Connection
# string -> URI, SESSION mode (port 5432; the 6543 pooler cannot run these).
#
#   export OLD_DB_URL=...   # Lovable Cloud project (cfsnyzcrekchvzrulpvl)
#   export IKAN_DB_URL=...  # live project (jpfvoevxegnknxoqmwye)
#
# migrate never overwrites: a key the live account already has is left exactly as it is.

set -euo pipefail

OUT="${HOME}/ikan-backups"
STAMP="$(date +%Y%m%d-%H%M%S)"

# libpq is keg-only on macOS, so the tools are not necessarily on PATH.
find_pg() {
  local name="$1" p
  if command -v "$name" >/dev/null 2>&1; then command -v "$name"; return; fi
  for p in /opt/homebrew/opt/libpq/bin /usr/local/opt/libpq/bin /opt/homebrew/bin /usr/local/bin; do
    [ -x "$p/$name" ] && { echo "$p/$name"; return; }
  done
  echo "error: $name not found. brew install libpq" >&2; exit 1
}
PSQL="$(find_pg psql)"
PG_DUMP="$(find_pg pg_dump)"

require() {
  local name="$1" v="${!1:-}"
  case "$v" in
    "")            echo "error: \$$name is not set. See the header of this script." >&2; exit 1 ;;
    postgres*|postgresql*) ;;
    *)             echo "error: \$$name is not a postgres:// URI (did you paste a placeholder?)" >&2; exit 1 ;;
  esac
  case "$v" in
    *:6543/*) echo "error: \$$name uses the transaction pooler (6543). Use session mode, port 5432." >&2; exit 1 ;;
  esac
}

backup() {
  require OLD_DB_URL
  mkdir -p "$OUT"
  local f="$OUT/lovable-cloud-$STAMP.dump"
  echo "Dumping the Lovable Cloud project to $f"
  "$PG_DUMP" --format=custom --no-owner --no-privileges \
    --schema=public --schema=auth "$OLD_DB_URL" --file="$f"
  # A dump that cannot be listed is not a backup. Prove it before anyone deletes anything.
  local tables
  tables="$("$PG_DUMP" --list "$f" 2>/dev/null | grep -c 'TABLE DATA' || true)"
  echo "Wrote $(du -h "$f" | cut -f1), $tables tables with data."
  [ "$tables" -ge 10 ] || { echo "error: that dump looks too thin to trust. Stopping." >&2; exit 1; }
  echo "OK. The Lovable Cloud project can be deleted only after a restore test of this file."
}

migrate() {
  require OLD_DB_URL
  require IKAN_DB_URL
  mkdir -p "$OUT"
  local csv="$OUT/stranded-$STAMP.csv"

  # Email is the only identifier the two projects share: auth user ids were reissued.
  echo "Reading the old project..."
  "$PSQL" "$OLD_DB_URL" -v ON_ERROR_STOP=1 --csv -q -c \
    "select lower(u.email), s.key, s.value, s.updated_at
       from auth.users u join public.user_state s on s.user_id = u.id" > "$csv"
  echo "$(( $(wc -l < "$csv") - 1 )) rows read into $csv"

  echo "Writing into the live project (existing rows are never touched)..."
  "$PSQL" "$IKAN_DB_URL" -v ON_ERROR_STOP=1 -q <<SQL
begin;
create temporary table incoming (email text, key text, value jsonb, updated_at timestamptz)
  on commit drop;
\\copy incoming from '$csv' with (format csv, header true)

with restored as (
  insert into public.ikan2_user_state (user_id, key, value, updated_at)
  select u.id, i.key, i.value, i.updated_at
    from incoming i join auth.users u on lower(u.email) = i.email
   on conflict (user_id, key) do nothing
  returning 1
)
select (select count(*) from restored) || ' rows restored, '
    || ((select count(*) from incoming) - (select count(*) from restored))
    || ' skipped (already present, or no live account with that email)' as result;
commit;
SQL
  echo "Done. The CSV holds real journals - delete it once you have checked the result:"
  echo "  rm $csv"
}

case "${1:-}" in
  backup)  backup ;;
  migrate) migrate ;;
  *) echo "usage: $0 backup|migrate" >&2; exit 2 ;;
esac
