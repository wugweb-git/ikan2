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
# The password is your database password from
#   Supabase dashboard -> Project settings -> Database -> Database password
# It is read from the environment and never written to disk or into this repo.
#
# Output goes to ~/ikan-backups/, deliberately OUTSIDE the repository: these dumps contain real
# journals, assessment answers and health data, and must never be committed. .gitignore blocks
# the obvious filenames, but the surest guard is keeping them out of the tree entirely.

set -euo pipefail

PROJECT_REF="jpfvoevxegnknxoqmwye"
OUT_DIR="${IKAN_BACKUP_DIR:-$HOME/ikan-backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"

if [ -z "${SUPABASE_DB_PASSWORD:-}" ]; then
  echo "SUPABASE_DB_PASSWORD is not set."
  echo "Find it in Supabase -> Project settings -> Database -> Database password."
  echo "Then:  SUPABASE_DB_PASSWORD='...' $0"
  exit 1
fi

command -v supabase >/dev/null || { echo "supabase CLI not found (brew install supabase/tap/supabase)"; exit 1; }

mkdir -p "$OUT_DIR"
chmod 700 "$OUT_DIR"   # dumps hold personal data; keep them to this account

echo "Backing up $PROJECT_REF to $OUT_DIR ..."

# Structure and data are dumped separately: a schema diff stays readable, and restoring into a
# fresh project is then two ordered steps rather than one opaque file.
supabase db dump --db-url \
  "postgresql://postgres.$PROJECT_REF:$SUPABASE_DB_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres" \
  -f "$OUT_DIR/ikan-schema-$STAMP.sql"

supabase db dump --data-only --db-url \
  "postgresql://postgres.$PROJECT_REF:$SUPABASE_DB_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres" \
  -f "$OUT_DIR/ikan-data-$STAMP.sql"

chmod 600 "$OUT_DIR"/ikan-*-"$STAMP".sql

echo
echo "Done:"
ls -lh "$OUT_DIR"/ikan-*-"$STAMP".sql

# Keep the last 14 of each; older ones are usually worse than useless once the schema moves on.
ls -1t "$OUT_DIR"/ikan-schema-*.sql 2>/dev/null | tail -n +15 | xargs -r rm --
ls -1t "$OUT_DIR"/ikan-data-*.sql   2>/dev/null | tail -n +15 | xargs -r rm --

cat <<'NOTE'

To restore into a fresh project, in this order:
  psql "<new project url>" -f ikan-schema-<stamp>.sql
  psql "<new project url>" -f ikan-data-<stamp>.sql

A backup nobody has restored is a guess. Try it against a scratch project once.
NOTE
