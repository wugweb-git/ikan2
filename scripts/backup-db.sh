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
# Needs pg_dump, which is in libpq:   brew install libpq && brew link --force libpq
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

if [ -z "${SUPABASE_DB_PASSWORD:-}" ]; then
  echo "SUPABASE_DB_PASSWORD is not set."
  echo "Find it in Supabase -> Project settings -> Database -> Database password."
  echo "Then:  SUPABASE_DB_PASSWORD='your-password' $0"
  exit 1
fi

if ! command -v pg_dump >/dev/null; then
  echo "pg_dump not found. Install the postgres client tools:"
  echo "  brew install libpq && brew link --force libpq"
  exit 1
fi

# Percent-encode the characters that would otherwise break the connection url.
enc () { printf %s "$1" | sed -e 's/%/%25/g' -e 's/:/%3A/g' -e 's/@/%40/g' -e 's|/|%2F|g' -e 's/?/%3F/g' -e 's/#/%23/g'; }

# Port 5432 is the SESSION pooler. 6543 is the transaction pooler and cannot serve pg_dump.
DB_URL="postgresql://postgres.$PROJECT_REF:$(enc "$SUPABASE_DB_PASSWORD")@aws-0-$REGION.pooler.supabase.com:5432/postgres"

mkdir -p "$OUT_DIR"
chmod 700 "$OUT_DIR"

echo "Backing up $PROJECT_REF to $OUT_DIR ..."

# Structure and data separately: a schema diff stays readable, and restoring into a fresh
# project is then two ordered steps rather than one opaque file.
pg_dump "$DB_URL" --schema-only --no-owner --no-privileges \
  --schema=public --schema=archive -f "$OUT_DIR/ikan-schema-$STAMP.sql"

pg_dump "$DB_URL" --data-only --no-owner --no-privileges \
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
