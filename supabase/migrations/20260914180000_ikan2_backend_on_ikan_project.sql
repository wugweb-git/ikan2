-- Applied to the "Ikan - App" project (jpfvoevxegnknxoqmwye) on 2026-09-14 as "ikan2_backend".
-- ikan2 app backend: per-account app data, Google Health, web push. Additive only.

create table if not exists public.ikan2_user_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null check (char_length(key) between 1 and 80),
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.ikan2_user_state enable row level security;
create policy "own state select" on public.ikan2_user_state for select to authenticated using ((select auth.uid()) = user_id);
create policy "own state insert" on public.ikan2_user_state for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own state update" on public.ikan2_user_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own state delete" on public.ikan2_user_state for delete to authenticated using ((select auth.uid()) = user_id);

-- Google Health: tokens are server-only (no client policies at all).
create table if not exists public.ikan2_health_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'google_health',
  refresh_token text not null,
  scopes text[] not null default '{}',
  health_user_id text,
  connected_at timestamptz not null default now(),
  last_synced_at timestamptz,
  last_error text
);
alter table public.ikan2_health_connections enable row level security;
revoke all on public.ikan2_health_connections from anon, authenticated;

create table if not exists public.ikan2_health_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  steps integer,
  sleep_minutes integer,
  awake_minutes integer,
  resting_heart_rate numeric,
  hrv_ms numeric,
  active_minutes integer,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);
alter table public.ikan2_health_daily enable row level security;
create policy "own health select" on public.ikan2_health_daily for select to authenticated using ((select auth.uid()) = user_id);
revoke insert, update, delete on public.ikan2_health_daily from anon, authenticated;

create table if not exists public.ikan2_push_subscriptions (
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  mood_reminder boolean not null default true,
  reminder_time time not null default '20:30',
  time_zone text not null default 'Asia/Kolkata',
  last_reminded_on date,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists ikan2_push_subscriptions_user on public.ikan2_push_subscriptions(user_id);
alter table public.ikan2_push_subscriptions enable row level security;
create policy "own push select" on public.ikan2_push_subscriptions for select to authenticated using ((select auth.uid()) = user_id);
create policy "own push insert" on public.ikan2_push_subscriptions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own push update" on public.ikan2_push_subscriptions for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own push delete" on public.ikan2_push_subscriptions for delete to authenticated using ((select auth.uid()) = user_id);

-- Also applied: pg_cron + pg_net, and a job "ikan2-mood-reminders" every 15 minutes that POSTs to
-- functions/v1/ikan2-push/reminders with the x-cron-secret header (secret kept out of the repo).
