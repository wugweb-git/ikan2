# The iKAN database, end to end

Captured 25 September 2026 from the live project.

**Project:** `jpfvoevxegnknxoqmwye` — "Ikan - App", ap-south-1, Postgres 17.6, org `wugweb`, **free plan**.

The single most useful fact about this database: **two different applications share it.**

|                                         | Built on                   | Writes to                               | Last write  |
| --------------------------------------- | -------------------------- | --------------------------------------- | ----------- |
| **iKAN** (this repo, app.ikanhealth.in) | TanStack Start + Capacitor | 3 `ikan2_*` tables                      | today       |
| **The old site** (ikanhealth.in)        | Lovable / React            | `kv_store_cc205da9` + 6 `user_*` tables | 14 Sep 2026 |

They do not read each other's tables. Nothing in `kv_store_cc205da9` is used by iKAN, and nothing
in `ikan2_user_state` is used by the old site. Both hang off the same `auth.users`, which is the
only real coupling between them — and the reason the two cannot simply be split apart without
thought.

Sizes tell the same story more bluntly:

|                                      |   Rows |       Data |
| ------------------------------------ | -----: | ---------: |
| iKAN, everything it has ever stored  |     83 | **~70 kB** |
| Old site                             | ~4,700 |    ~1.5 MB |
| `archive` schema, superseded backups |      — |      ~9 MB |

---

## 1. iKAN

### `ikan2_user_state` — the whole app, in one table

Everything iKAN saves lives here. There is no assessments table, no programme table, no diary
table. One row per (user, key), with a JSON document as the value.

```sql
create table public.ikan2_user_state (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  key        text        not null check (char_length(key) between 1 and 80),
  value      jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
```

This shape is deliberate: the client is offline-first, so each store is written whole and synced
as a blob (see `src/lib/cloud-sync.ts`). The cost is that the real schema lives in the JSON, not
in the DDL — which is what the rest of this section documents.

**77 rows, 11 users.** Keys, and what each holds:

| Key                      | JSON keys                                                                                                                                                              | Holds                                                                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assessments.v1`         | `results`, `drafts`                                                                                                                                                    | Every assessment taken. Each result: `id`, `slug`, `answers`, `completedAt`, `seconds`. `drafts` is the resume state for a half-finished one. **40 results across 9 users.** |
| `journal.v1`             | `entries`                                                                                                                                                              | Daily mood check-ins, one entry per day, answers under the template's "saved as" names (`mood_rating`, `sleep_rating`, `freehand_text_content`, `context_tags` …)            |
| `equip.sleep-tight.v2`   | `answers`, `completed`, `completedAt`, `progress`, `diary`, `tracker`, `collections`, `runs`, `feedback`, `time`                                                       | Sleep Tight: day answers, sleep diary, habit tracker                                                                                                                         |
| `equip.unburn.v2`        | as above                                                                                                                                                               | Unburn                                                                                                                                                                       |
| `equip.stress-buster.v2` | as above, no `progress`                                                                                                                                                | Stress Buster                                                                                                                                                                |
| `profile.v1`             | `name`, `email`, `phone`, `birthday`, `gender`, `maritalStatus`, `city`, `zip`, `bio`, `avatar`, `memberSince`, `emergencyName`, `emergencyPhone`, `emergencyRelation` | **The most sensitive document here** — including next-of-kin details                                                                                                         |
| `wellness.v1`            | `days`                                                                                                                                                                 | The iKAN score history                                                                                                                                                       |
| `settings.v1`            | `moodReminders`, `moodReminderTime`, `assessmentReminders`, `programUpdates`, `newResources`, `weeklyProgress`, `healthConnect`, `shareWithConsultant`, `reduceMotion` |                                                                                                                                                                              |
| `resources.v1`           | `saved`, `opened`                                                                                                                                                      | Bookmarks and read state                                                                                                                                                     |
| `notifications.v1`       | `read`                                                                                                                                                                 |                                                                                                                                                                              |
| `consult.v1`             | `bookings`                                                                                                                                                             |                                                                                                                                                                              |
| `onboarding.v1`          | `done`, `reason`                                                                                                                                                       |                                                                                                                                                                              |

Keys are versioned (`.v1`, `.v2`). A breaking change to a document's shape bumps the version and
leaves the old key in place, so an older client keeps working.

On the device these same keys are stored as `ikan.u.<userId>.<key>` in localStorage, and mirrored
into native Preferences on Android (`src/lib/durable.ts`) because Android evicts WebView storage
without warning.

### `ikan2_health_daily` — Health Connect

One row per user per day, read from Health Connect by the Android app. **0 rows** — nobody has
connected a device yet.

```sql
create table public.ikan2_health_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  steps integer, sleep_minutes integer, awake_minutes integer,
  deep_minutes integer, rem_minutes integer, exercise_minutes integer,
  active_minutes integer, heart_rate numeric, resting_heart_rate numeric, hrv_ms numeric,
  moods text[],
  source text not null default 'health_connect',
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);
```

### `ikan2_push_subscriptions` — notifications, both kinds

**6 rows, 4 users.** Holds browser subscriptions and Android FCM tokens in one table; `kind` says
which, and the check constraint stops a row claiming to be one while carrying the other's fields.

```sql
create table public.ikan2_push_subscriptions (
  endpoint text primary key,              -- web push url, or the FCM token
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'webpush',   -- 'webpush' | 'fcm'
  p256dh text, auth text,                 -- web push only; null for fcm
  mood_reminder boolean not null default true,
  reminder_time time not null default '20:30',
  time_zone text not null default 'Asia/Kolkata',
  last_reminded_on date,
  user_agent text,
  created_at timestamptz not null default now(),
  constraint ikan2_push_subscriptions_kind_keys check (
    (kind = 'webpush' and p256dh is not null and auth is not null)
    or (kind = 'fcm' and p256dh is null and auth is null))
);
```

`last_reminded_on` is what stops a person being reminded twice in one day; the sender compares it
against the local date in their own `time_zone`.

---

## 2. The old site

Not read by iKAN. Documented because it shares `auth.users`, and because it is most of the
database by volume.

### `kv_store_cc205da9`

A key/value store, `key text primary key, value jsonb`. **4,397 rows.** The name is Lovable
scaffolding — the hash suffix matches the `make-server-cc205da9` edge function, which is the only
thing that reads it. RLS is on with no policies, so the anon key cannot reach it at all; the
function uses the service role.

Keys are `prefix:id`. The larger prefixes:

| Prefix                        |  Rows |   Size |
| ----------------------------- | ----: | -----: |
| `activity_log`                | 2,800 | 496 kB |
| `block`                       |   223 |  89 kB |
| `category`                    |   214 |  65 kB |
| `assessment_result`           |   184 | 223 kB |
| `progress`                    |   183 | 101 kB |
| `assessment_response_by_user` |   140 |  20 kB |
| `day`                         |   105 |  33 kB |
| `ikan_score`                  |    92 |  21 kB |
| `enrollment`                  |    72 |  89 kB |
| `payment`                     |    71 |  32 kB |
| `resource`                    |    11 | 261 kB |

plus `journal`, `journal_by_user`, `cms_page`, `professional`, `recommendation_rule`,
`scoring-profile`, `analytics` and others.

`cms_page` is worth knowing about: the legal policies on the old site are served from there.

### Relational tables

Flattened out of the KV store during an earlier migration. Each keeps a `kv_key` back-reference
and a `data jsonb` copy of the original document.

| Table                     | Rows | Users | Notes                                           |
| ------------------------- | ---: | ----: | ----------------------------------------------- |
| `user_assessment_results` |   93 |     5 | score, interpretation, `responses` jsonb        |
| `user_program_progress`   |   84 |     — | per (user, equip, day), `block_responses` jsonb |
| `user_enrollments`        |   49 |     — | programme, status, current day                  |
| `user_ikan_scores`        |   53 |     — | daily score with components                     |
| `user_journal_entries`    |   32 |     8 | mood, energy, stress, sleep, free text          |
| `UserConnectCheck`        |    0 |     — | scratch table. RESTRICTIVE deny-all policy      |

---

## 3. `archive` schema

41 tables, ~9 MB: snapshots taken before earlier content migrations, moved out of `public` on
24 September so they stop appearing in the API surface. `backup_pre_*` (37), `kv_backup_*` (2),
`kv_orphaned_backups_20260924`, `migration_stage_2026_09_08`.

RLS is enabled with no policies on all of them, which means nobody can read them — intentional.
They show as 41 INFO advisories in the Supabase linter; that is the safe state, not a gap.

Nothing reads any of it. It exists in case a content migration needs unwinding, and could be
dropped once those are far enough in the past.

---

## 4. Auth, storage, functions

**`auth.users` — 14 accounts.** The one thing both applications share. Email/password, Google and
LinkedIn OAuth, and phone. Every `user_id` in every table above is a foreign key to this, with
`on delete cascade`.

**Storage:** `ikan2-avatars`, public bucket. Write policies scope a person to a folder named after
their own uid. Read is public, so avatar URLs are guessable-but-unlisted — worth knowing, since
account deletion does not currently remove the file.

**Edge functions:**

| Function               | JWT | Purpose                                                                                                          |
| ---------------------- | --- | ---------------------------------------------------------------------------------------------------------------- |
| `ikan2-push`           | off | `POST /test` (verifies the caller's token) and `POST /reminders` (cron, `x-cron-secret`). Sends Web Push and FCM |
| `ikan2-delete-account` | off | Verifies the caller's token, deletes their rows from the three `ikan2_*` tables, then the auth user              |
| `make-server-cc205da9` | on  | The old site's backend, version 358                                                                              |

Both iKAN functions have `verify_jwt` off because each authenticates itself — the cron route has
no JWT to present.

---

## 5. Row level security

Every table holding personal data has RLS on and scopes rows to `auth.uid()`, so the publishable
key shipped in the client can only ever reach the signed-in person's rows.

```sql
-- the pattern, on all ikan2_* and user_* tables
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id)
```

`kv_store_cc205da9` and the `archive` tables have RLS on with **no** policies: unreachable except
by the service role. `UserConnectCheck` carries an explicit RESTRICTIVE deny-all.

Advisor state as of 25 Sep 2026: **0 errors, 0 warnings** except leaked-password protection, which
is a dashboard toggle. The previous critical advisory — `public.wrappers_fdw_stats`, RLS off and
writable by `anon` — was resolved by dropping the unused `wrappers` extension that created it.

---

## 6. If you ever move iKAN to its own project

The app's footprint is small: **3 tables, 83 rows, ~70 kB**, two edge functions, one storage
bucket, and two constants in `src/lib/backend.ts`.

The hard part is not the data, it is `auth.users`. 14 accounts, and every row keys on `user_id`:

- OAuth users (Google, LinkedIn) re-link by email — they notice nothing
- Email/password users need their hashes imported via the admin API, or one password reset
- **User ids change unless imported deliberately**, so any copy has to remap `user_id` across
  `ikan2_user_state`, `ikan2_health_daily`, `ikan2_push_subscriptions` and the avatar folder names

Everything else is a schema file and a data copy.

---

## 7. Backups

The org is on the **free plan: no automatic backups, no point-in-time recovery.** Two stopgaps
live in this repo, both of which run on a developer machine and read passwords from the
environment:

- `scripts/backup-db.sh` — schema and data dumps to `~/ikan-backups`
- `scripts/sync-mirror.sh` — copies the live tables into a `mirror` schema on the otherwise idle
  Lovable Cloud project

Neither is automatic. The real fix is the Pro plan.
