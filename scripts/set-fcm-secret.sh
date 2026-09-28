#!/usr/bin/env bash
# Put the Firebase service account into the ikan2-push function's secrets.
#
#   ./scripts/set-fcm-secret.sh ~/Downloads/ikan-fbea9-firebase-adminsdk-....json
#
# Get the file from Firebase Console -> Project settings -> Service accounts ->
# Generate new private key. It downloads once and cannot be retrieved again.
#
# The file is passed by path and never printed, so the private key does not end up in a
# terminal scrollback, a chat, or this repository.
#
# Why a script rather than one `supabase secrets set`: there is more than one Firebase project
# in play on this machine, and a service account for the wrong one would leave push silently
# broken - the function would authenticate happily and send to a project that has never heard
# of these devices. The check below refuses anything that is not iKAN's.

set -euo pipefail

EXPECTED_PROJECT="ikan-fbea9"          # matches android/app/google-services.json
SUPABASE_REF="jpfvoevxegnknxoqmwye"

FILE="${1:-}"
if [ -z "$FILE" ]; then
  echo "Usage: $0 <path-to-firebase-service-account.json>"
  echo "Firebase Console -> Project settings -> Service accounts -> Generate new private key"
  exit 1
fi
[ -f "$FILE" ] || { echo "No such file: $FILE"; exit 1; }

command -v supabase >/dev/null || { echo "supabase CLI not found (brew install supabase/tap/supabase)"; exit 1; }

# Validate before sending: right shape, right project, real key.
python3 - "$FILE" "$EXPECTED_PROJECT" <<'PY'
import json, sys
path, expected = sys.argv[1], sys.argv[2]
try:
    d = json.load(open(path))
except Exception as e:
    sys.exit(f"Not valid json: {e}")
if d.get("type") != "service_account":
    sys.exit('Not a service account file (its "type" is not "service_account").')
missing = [k for k in ("project_id", "client_email", "private_key") if not d.get(k)]
if missing:
    sys.exit(f"Missing fields: {', '.join(missing)}")
if d["project_id"] != expected:
    sys.exit(
        f'Wrong Firebase project.\n'
        f'  this file: {d["project_id"]}\n'
        f'  expected:  {expected}  (the one android/app/google-services.json points at)\n'
        f'Using it would send notifications to a project that has never seen these devices.'
    )
print(f'  project:      {d["project_id"]}')
print(f'  service acct: {d["client_email"]}')
PY

echo "Setting FIREBASE_SERVICE_ACCOUNT on $SUPABASE_REF ..."
supabase secrets set "FIREBASE_SERVICE_ACCOUNT=$(cat "$FILE")" --project-ref "$SUPABASE_REF"

echo
echo "Set. No redeploy needed - the function reads it on the next invocation."
echo "Test from a device: Settings -> send test notification."
