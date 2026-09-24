# Archived tables — 24 Sep 2026

40 tables were moved out of `public` into the `archive` schema. Nothing was dropped; every
row is intact.

## Why

They were snapshots taken before past migrations (`backup_pre_*`), two KV snapshots
(`kv_backup_*`) and one staging table (`migration_stage_2026_09_08`) — 8.1 MB in total, all
from early September and all superseded.

Sitting in `public` they were reachable through PostgREST and appeared in every security
advisory email. `archive` is not an exposed schema and `anon`/`authenticated` have no rights
on it, so they are now unreachable from the API.

**They still appear in the advisories.** Supabase's linter scans every schema, not just the
exposed ones, so the 40 "RLS enabled, no policy" INFO lines remain. Those tables have RLS on
with no policies, which denies everything — the finding is noise, not risk. Only dropping them
clears the lines, and that is deliberately not done yet: the plan is to replace the old schema
wholesale, and these go with it.

## Restore one

    alter table archive.<name> set schema public;

## Drop them all, once the old schema is replaced

    drop schema archive cascade;

## Not fixed here

- `public.wrappers_fdw_stats` — RLS disabled, and `anon` holds SELECT/INSERT/UPDATE/DELETE on
  it. Confirmed reachable with the publishable key (returns 200). It is an empty statistics
  table, so no personal data is exposed, but it is publicly writable. `alter table ... enable
  row level security` and `revoke` both fail here with "must be owner" — it belongs to the
  `wrappers` extension. Run it from the dashboard SQL editor, which connects as `postgres`.
  Better: the extension has 0 foreign servers and 0 foreign tables, so it is unused —
  `drop extension wrappers cascade` removes this finding and the "extension in public" one.
- Leaked-password protection is off. Auth settings toggle; checks new passwords against
  HaveIBeenPwned.
