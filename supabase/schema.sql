-- Live structure of the public schema on the "Ikan - App" Supabase project
-- (jpfvoevxegnknxoqmwye), captured 25 Sep 2026.
--
-- This is a record, not a migration. The files in supabase/migrations/ remain the source of
-- truth for how the database got here; this is here so the current shape can be read in one
-- place without opening the dashboard, and so a future change shows up as a reviewable diff.
--
-- STRUCTURE ONLY. No rows, ever. These tables hold journals, assessment answers and health
-- data, and none of that belongs in a git repository that gets cloned and zipped.
--
-- Regenerate by re-reading the catalog, not by hand.
--
-- Two things worth knowing when reading this:
--
--   * ikan2_* are the tables this app uses. The user_* tables and kv_store_cc205da9 predate it
--     and are still read by the old site.
--   * Every table carrying personal data enables RLS and scopes rows to auth.uid(), so the
--     publishable key shipped in the client can only ever reach the signed-in person's rows.


-- ============================================================ tables

create table public."UserConnectCheck" (
  id bigint not null,
  "Json" json,
  constraint "User ConnectCheck_pkey" PRIMARY KEY (id),
  constraint "User ConnectCheck_id_key" UNIQUE (id)
);

create table public.ikan2_user_state (
  user_id uuid not null,
  key text not null,
  value jsonb not null,
  updated_at timestamp with time zone not null default now(),
  constraint ikan2_user_state_pkey PRIMARY KEY (user_id, key),
  constraint ikan2_user_state_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  constraint ikan2_user_state_key_check CHECK (((char_length(key) >= 1) AND (char_length(key) <= 80)))
);

create table public.ikan2_health_daily (
  user_id uuid not null,
  date date not null,
  steps integer,
  sleep_minutes integer,
  awake_minutes integer,
  resting_heart_rate numeric,
  hrv_ms numeric,
  active_minutes integer,
  updated_at timestamp with time zone not null default now(),
  moods text[],
  heart_rate numeric,
  deep_minutes integer,
  rem_minutes integer,
  exercise_minutes integer,
  source text not null default 'health_connect'::text,
  constraint ikan2_health_daily_pkey PRIMARY KEY (user_id, date),
  constraint ikan2_health_daily_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Holds both browser subscriptions and Android FCM tokens; `kind` says which, and the check
-- constraint stops a row claiming to be one while carrying the other's fields.
create table public.ikan2_push_subscriptions (
  endpoint text not null,
  user_id uuid not null,
  p256dh text,
  auth text,
  mood_reminder boolean not null default true,
  reminder_time time without time zone not null default '20:30:00'::time without time zone,
  time_zone text not null default 'Asia/Kolkata'::text,
  last_reminded_on date,
  user_agent text,
  created_at timestamp with time zone not null default now(),
  kind text not null default 'webpush'::text,
  constraint ikan2_push_subscriptions_pkey PRIMARY KEY (endpoint),
  constraint ikan2_push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  constraint ikan2_push_subscriptions_kind_keys CHECK ((((kind = 'webpush'::text) AND (p256dh IS NOT NULL) AND (auth IS NOT NULL)) OR ((kind = 'fcm'::text) AND (p256dh IS NULL) AND (auth IS NULL))))
);

-- ---- the old site's tables, still live ----

create table public.kv_store_cc205da9 (
  key text not null,
  value jsonb not null,
  constraint kv_store_cc205da9_pkey PRIMARY KEY (key)
);

create table public.user_assessment_results (
  id text not null,
  user_id uuid not null,
  assessment_id text,
  score numeric,
  max_score numeric,
  status text,
  interpretation text,
  severity_hint text,
  responses jsonb,
  completed_at timestamp with time zone,
  data jsonb not null,
  kv_key text,
  constraint user_assessment_results_pkey PRIMARY KEY (id),
  constraint user_assessment_results_kv_key_key UNIQUE (kv_key),
  constraint user_assessment_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

create table public.user_enrollments (
  id text not null,
  user_id uuid not null,
  program_id text,
  program_title text,
  status text,
  current_day integer,
  progress numeric,
  completed_days jsonb,
  start_date timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  data jsonb not null,
  kv_key text,
  constraint user_enrollments_pkey PRIMARY KEY (id),
  constraint user_enrollments_kv_key_key UNIQUE (kv_key),
  constraint user_enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

create table public.user_journal_entries (
  id text not null,
  user_id uuid not null,
  entry_date date,
  mood text,
  mood_rating numeric,
  mood_score numeric,
  energy numeric,
  stress_level numeric,
  sleep_quality numeric,
  pain_level numeric,
  content text,
  emotions jsonb,
  context_tags jsonb,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  data jsonb not null,
  kv_key text,
  constraint user_journal_entries_pkey PRIMARY KEY (id),
  constraint user_journal_entries_kv_key_key UNIQUE (kv_key),
  constraint user_journal_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

create table public.user_program_progress (
  user_id uuid not null,
  equip_id text not null,
  day_number integer not null,
  completed boolean,
  completed_at timestamp with time zone,
  block_responses jsonb,
  last_updated timestamp with time zone,
  data jsonb not null,
  kv_key text,
  constraint user_program_progress_pkey PRIMARY KEY (user_id, equip_id, day_number),
  constraint user_program_progress_kv_key_key UNIQUE (kv_key),
  constraint user_program_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

create table public.user_ikan_scores (
  user_id uuid not null,
  score_date date not null,
  score numeric,
  components jsonb,
  assessment_count integer,
  engagement_days integer,
  mood_entries integer,
  program_count integer,
  created_at timestamp with time zone,
  data jsonb not null,
  kv_key text,
  constraint user_ikan_scores_pkey PRIMARY KEY (user_id, score_date),
  constraint user_ikan_scores_kv_key_key UNIQUE (kv_key),
  constraint user_ikan_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);


-- ============================================================ indexes

CREATE INDEX ikan2_push_subscriptions_kind_idx ON public.ikan2_push_subscriptions USING btree (kind);
CREATE INDEX ikan2_push_subscriptions_user ON public.ikan2_push_subscriptions USING btree (user_id);
CREATE INDEX idx_kv_store_key_prefix ON public.kv_store_cc205da9 USING btree (key text_pattern_ops);
CREATE INDEX kv_store_cc205da9_key_idx294 ON public.kv_store_cc205da9 USING btree (key text_pattern_ops);
CREATE INDEX idx_uar_user ON public.user_assessment_results USING btree (user_id, completed_at DESC);
CREATE INDEX idx_uenr_user ON public.user_enrollments USING btree (user_id);
CREATE INDEX idx_uje_user ON public.user_journal_entries USING btree (user_id, entry_date DESC);


-- ============================================================ row level security

alter table public."UserConnectCheck" enable row level security;
alter table public.ikan2_user_state enable row level security;
alter table public.ikan2_health_daily enable row level security;
alter table public.ikan2_push_subscriptions enable row level security;
alter table public.kv_store_cc205da9 enable row level security;
alter table public.user_assessment_results enable row level security;
alter table public.user_enrollments enable row level security;
alter table public.user_journal_entries enable row level security;
alter table public.user_program_progress enable row level security;
alter table public.user_ikan_scores enable row level security;

-- kv_store_cc205da9 has RLS on and NO policies on purpose: it is reached only through the
-- make-server function with the service role, so nothing with the anon key can touch it.

create policy deny_all on public."UserConnectCheck" as RESTRICTIVE for ALL to anon, authenticated using (false);

create policy "own state select" on public.ikan2_user_state as PERMISSIVE for SELECT to authenticated using ((( SELECT auth.uid() AS uid) = user_id));
create policy "own state insert" on public.ikan2_user_state as PERMISSIVE for INSERT to authenticated with check ((( SELECT auth.uid() AS uid) = user_id));
create policy "own state update" on public.ikan2_user_state as PERMISSIVE for UPDATE to authenticated using ((( SELECT auth.uid() AS uid) = user_id)) with check ((( SELECT auth.uid() AS uid) = user_id));
create policy "own state delete" on public.ikan2_user_state as PERMISSIVE for DELETE to authenticated using ((( SELECT auth.uid() AS uid) = user_id));

create policy "own health select" on public.ikan2_health_daily as PERMISSIVE for SELECT to authenticated using ((( SELECT auth.uid() AS uid) = user_id));
create policy "own health insert" on public.ikan2_health_daily as PERMISSIVE for INSERT to authenticated with check ((( SELECT auth.uid() AS uid) = user_id));
create policy "own health update" on public.ikan2_health_daily as PERMISSIVE for UPDATE to authenticated using ((( SELECT auth.uid() AS uid) = user_id)) with check ((( SELECT auth.uid() AS uid) = user_id));
create policy "own health delete" on public.ikan2_health_daily as PERMISSIVE for DELETE to authenticated using ((( SELECT auth.uid() AS uid) = user_id));

create policy "own push select" on public.ikan2_push_subscriptions as PERMISSIVE for SELECT to authenticated using ((( SELECT auth.uid() AS uid) = user_id));
create policy "own push insert" on public.ikan2_push_subscriptions as PERMISSIVE for INSERT to authenticated with check ((( SELECT auth.uid() AS uid) = user_id));
create policy "own push update" on public.ikan2_push_subscriptions as PERMISSIVE for UPDATE to authenticated using ((( SELECT auth.uid() AS uid) = user_id)) with check ((( SELECT auth.uid() AS uid) = user_id));
create policy "own push delete" on public.ikan2_push_subscriptions as PERMISSIVE for DELETE to authenticated using ((( SELECT auth.uid() AS uid) = user_id));

create policy own_rows on public.user_assessment_results as PERMISSIVE for ALL to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy own_rows on public.user_enrollments as PERMISSIVE for ALL to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy own_rows on public.user_journal_entries as PERMISSIVE for ALL to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy own_rows on public.user_program_progress as PERMISSIVE for ALL to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy own_rows on public.user_ikan_scores as PERMISSIVE for ALL to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));


-- ============================================================ notes
--
-- The `archive` schema holds 40 superseded backup tables (see supabase/archive/). It is not
-- exposed to PostgREST and is deliberately left out of this file.
--
-- The `wrappers` extension was dropped on 25 Sep 2026. It was installed in public, entirely
-- unused - no foreign servers, tables or wrappers - and its wrappers_fdw_stats table sat in
-- public with RLS off, writable by anon. That was the standing critical advisory.
