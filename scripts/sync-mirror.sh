#!/usr/bin/env bash
# Copy the live iKAN database into the mirror schema on the old Lovable Cloud project.
#
# What this is for. The Supabase org holding the live data is on the free plan, which has no
# automatic backups and no point-in-time recovery. This keeps a second, current copy of every
# table somewhere else entirely, so a bad day is recoverable.
#
# What it is NOT. Nothing reads the mirror at runtime. The app talks only to the live project.
# The mirror lives in its own `mirror` schema so it never touches the Lovable project's own
# tables, and it carries no foreign keys to auth.users - those ids belong to another project
# and would reject every row.
#
# The data goes straight from one database to the other. It is never written to this machine
# beyond a temp file, and never passes through anything else.
#
# Usage:
#   SOURCE_DB_PASSWORD='...' MIRROR_DB_PASSWORD='...' ./scripts/sync-mirror.sh
#
# Port 5432 is the SESSION pooler; 6543 is transaction mode and cannot serve pg_dump.
# Passwords come from each project's dashboard: Project settings -> Database -> Database
# password. They are read from the environment, never stored, never committed.

set -euo pipefail

SOURCE_REF="jpfvoevxegnknxoqmwye"   # Ikan - App (live)
MIRROR_REF="cfsnyzcrekchvzrulpvl"   # old Lovable Cloud project, used only as a mirror
SOURCE_REGION="ap-south-1"
MIRROR_REGION="ap-south-1"

TABLES=(
  ikan2_user_state
  ikan2_health_daily
  ikan2_push_subscriptions
  kv_store_cc205da9
  user_assessment_results
  user_enrollments
  user_journal_entries
  user_program_progress
  user_ikan_scores
)

for v in SOURCE_DB_PASSWORD MIRROR_DB_PASSWORD; do
  if [ -z "${!v:-}" ]; then
    echo "$v is not set."
    echo "Both come from Supabase -> Project settings -> Database -> Database password."
    echo "  SOURCE_DB_PASSWORD  = $SOURCE_REF (live)"
    echo "  MIRROR_DB_PASSWORD  = $MIRROR_REF (mirror)"
    exit 1
  fi
done

command -v pg_dump >/dev/null || { echo "pg_dump not found (brew install libpq && brew link --force libpq)"; exit 1; }
command -v psql    >/dev/null || { echo "psql not found (brew install libpq && brew link --force libpq)"; exit 1; }

url () { # ref password region
  printf 'postgresql://postgres.%s:%s@aws-0-%s.pooler.supabase.com:5432/postgres' \
    "$1" "$(printf %s "$2" | sed -e 's/:/%3A/g' -e 's/@/%40/g' -e 's|/|%2F|g')" "$3"
}
SRC_URL="$(url "$SOURCE_REF" "$SOURCE_DB_PASSWORD" "$SOURCE_REGION")"
DST_URL="$(url "$MIRROR_REF" "$MIRROR_DB_PASSWORD" "$MIRROR_REGION")"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT     # the dump holds real journals; do not leave it lying around
chmod 700 "$TMP"

echo "Dumping $SOURCE_REF ..."
DUMP_ARGS=(--data-only --no-owner --no-privileges --column-inserts=false)
for t in "${TABLES[@]}"; do DUMP_ARGS+=(--table="public.$t"); done
pg_dump "$SRC_URL" "${DUMP_ARGS[@]}" > "$TMP/data.sql"

# The dump says `COPY public.x`; the mirror keeps everything in its own schema.
sed -i '' -E 's/^COPY public\./COPY mirror./' "$TMP/data.sql" 2>/dev/null \
  || sed -i -E 's/^COPY public\./COPY mirror./' "$TMP/data.sql"

echo "Loading into $MIRROR_REF ..."
{
  echo "begin;"
  # Replace wholesale rather than upsert: this is a mirror, so rows deleted at the source must
  # disappear here too. One transaction, so a failure leaves the previous copy intact.
  for t in "${TABLES[@]}"; do echo "truncate mirror.$t;"; done
  cat "$TMP/data.sql"
  for t in "${TABLES[@]}"; do
    echo "insert into mirror._sync_log (table_name, rows_loaded) select '$t', count(*) from mirror.$t;"
  done
  echo "commit;"
} | psql "$DST_URL" -v ON_ERROR_STOP=1 -q

echo
psql "$DST_URL" -q -c \
  "select table_name, rows_loaded from mirror._sync_log where ran_at > now() - interval '2 minutes' order by table_name;"

echo "Mirror is current."
