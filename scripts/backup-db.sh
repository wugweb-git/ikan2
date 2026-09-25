#!/usr/bin/env bash
# A real backup of the iKAN Supabase database, taken on your machine.
#
# Why this exists: the Supabase org is on the free plan, which has NO automatic backups and no
# point-in-time recovery. Until that changes, this script is the only thing standing between a
# bad day and losing every journal entry in the product.
#
# Usage:
#   SUPABASE_DB_PASSWORD='...' ./scripts/backup-db.sh
#
# The password is the database password from
#   Supabase dashboard -> Project settings -> Database -> Database password
# It is read from the environment and never written to disk or into this repo.
#
# Needs pg_dump, from libpq:   brew install libpq   (no `brew link` required)
# Deliberately NOT `supabase db dump`: that runs pg_dump inside a container and therefore needs
# Docker running, which is a heavy prerequisite for taking a backup.
#
# Output goes to ~/ikan-backups/, outside the repository: these dumps contain real journals,
# assessment answers and health data and must never be committed.

set -euo pipefail

PROJECT_REF="jpfvoevxegnknxoqmwye"
REGION="ap-south-1"
OUT_DIR="${IKAN_BACKUP_DIR:-$HOME/ikan-backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"

if [ -n "${IKAN_DB_URL:-}" ]; then SUPABASE_DB_PASSWORD="${SUPABASE_DB_PASSWORD:-set}"; fi

if [ -z "${SUPABASE_DB_PASSWORD:-}" ]; then
  echo "SUPABASE_DB_PASSWORD is not set."
  echo "Find it in Supabase -> Project settings -> Database -> Database password."
  echo "Then:  SUPABASE_DB_PASSWORD='your-password' $0"
  exit 1
fi

# Homebrew keeps libpq keg-only, so pg_dump is installed but not on PATH. Find it rather than
# asking for `brew link --force libpq`, which shadows the system psql and surprises people later.
find_pg () {
  local name="$1" p
  if command -v "$name" >/dev/null; then command -v "$name"; return; fi
  for p in "$(brew --prefix libpq 2>/dev/null)/bin/$name" \
           /usr/local/opt/libpq/bin/"$name" \
           /opt/homebrew/opt/libpq/bin/"$name" \
           /usr/local/opt/postgresql@16/bin/"$name" \
           /Applications/Postgres.app/Contents/Versions/latest/bin/"$name"; do
    [ -x "$p" ] && { echo "$p"; return; }
  done
  return 1
}

PG_DUMP="$(find_pg pg_dump)" || {
  echo "pg_dump not found. Install the postgres client tools:  brew install libpq"
  exit 1
}
echo "using $PG_DUMP ($("$PG_DUMP" --version))"

# Percent-encode the characters that would otherwise break the connection url.
enc () { printf %s "$1" | sed -e 's/%/%25/g' -e 's/:/%3A/g' -e 's/@/%40/g' -e 's|/|%2F|g' -e 's/?/%3F/g' -e 's/#/%23/g'; }
PW="$(enc "$SUPABASE_DB_PASSWORD")"

# Supabase hands out different pooler hostnames per project, and the direct host only answers
# over IPv6 on the free plan. Rather than hard-code one and fail with a confusing
# "tenant/user not found", try each and keep the first that actually connects.
#
# Port 5432 is SESSION mode. 6543 is the transaction pooler and cannot serve pg_dump.
CANDIDATES=(
  "postgresql://postgres.$PROJECT_REF:$PW@aws-1-$REGION.pooler.supabase.com:5432/postgres"
  "postgresql://postgres.$PROJECT_REF:$PW@aws-0-$REGION.pooler.supabase.com:5432/postgres"
  "postgresql://postgres:$PW@db.$PROJECT_REF.supabase.co:5432/postgres"
)

PSQL="$(find_pg psql)" || true
if [ -n "${IKAN_DB_URL:-}" ]; then CANDIDATES=("$IKAN_DB_URL"); fi
DB_URL=""
for c in "${CANDIDATES[@]}"; do
  host="$(printf %s "$c" | sed -E 's|.*@([^:/]+).*|\1|')"
  printf 'trying %s ... ' "$host"
  if [ -n "$PSQL" ]; then
    if "$PSQL" "$c" -tAc 'select 1' >/dev/null 2>&1; then echo ok; DB_URL="$c"; break; fi
  else
    if "$PG_DUMP" "$c" --schema-only --table=public.ikan2_user_state -f /dev/null >/dev/null 2>&1; then
      echo ok; DB_URL="$c"; break
    fi
  fi
  echo no
done

if [ -z "$DB_URL" ]; then
  cat <<'FAIL'

Could not connect on any known host.

Check the password first - it is the DATABASE password (Project settings ->
Database -> Database password), not your Supabase account password and not
the anon key. Reset it there if you are unsure.

If the password is right, copy the exact connection string from
  Supabase -> Project settings -> Database -> Connection string -> URI
(choose Session mode) and run:
  IKAN_DB_URL='<that string>' ./scripts/backup-db.sh
FAIL
  exit 1
fi

mkdir -p "$OUT_DIR"
chmod 700 "$OUT_DIR"

echo "Backing up $PROJECT_REF to $OUT_DIR ..."

# Structure and data separately: a schema diff stays readable, and restoring into a fresh
# project is then two ordered steps rather than one opaque file.
"$PG_DUMP" "$DB_URL" --schema-only --no-owner --no-privileges \
  --schema=public --schema=archive -f "$OUT_DIR/ikan-schema-$STAMP.sql"

"$PG_DUMP" "$DB_URL" --data-only --no-owner --no-privileges \
  --schema=public --schema=archive -f "$OUT_DIR/ikan-data-$STAMP.sql"

chmod 600 "$OUT_DIR"/ikan-*-"$STAMP".sql

echo
ls -lh "$OUT_DIR"/ikan-*-"$STAMP".sql

# Keep the last 14 of each; older ones are usually worse than useless once the schema moves on.
ls -1t "$OUT_DIR"/ikan-schema-*.sql 2>/dev/null | tail -n +15 | xargs -r rm --
ls -1t "$OUT_DIR"/ikan-data-*.sql   2>/dev/null | tail -n +15 | xargs -r rm --

cat <<'NOTE'

Restore into a fresh project, in this order:
  psql "<new project url>" -f ikan-schema-<stamp>.sql
  psql "<new project url>" -f ikan-data-<stamp>.sql

A backup nobody has restored is a guess. Try it against a scratch project once.
NOTE
