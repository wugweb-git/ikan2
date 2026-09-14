-- ikan2 account data, applied to the Lovable Cloud database on 2026-09-14.
-- Sign-in lives on the "Ikan - App" Supabase project, so these functions check the caller's
-- token against that project's auth API and only ever touch that account's rows.
-- To move to the main database later: copy public.user_state rows (user_id is already the
-- Ikan - App account id) and point the app's VITE_IKAN2_DB_* settings at the new project.

create table if not exists public.user_state (
  user_id uuid not null,
  key text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);
alter table public.user_state enable row level security;
revoke all on public.user_state from anon, authenticated;

create extension if not exists http with schema extensions;

create or replace function public.ikan_user_id(token text)
returns uuid language plpgsql security definer set search_path = public, extensions as $$
declare res extensions.http_response; uid uuid;
begin
  if token is null or length(token) < 20 then raise exception 'Sign in first' using errcode = '28000'; end if;
  select * into res from extensions.http((
    'GET', 'https://jpfvoevxegnknxoqmwye.supabase.co/auth/v1/user',
    array[
      extensions.http_header('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZnZvZXZ4ZWdua254b3Ftd3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjIyNDIsImV4cCI6MjA3MzY5ODI0Mn0.VGYSE8LqBEggrQcUHJH9NcvursaoNfQK9K8-ESCo-rc'),
      extensions.http_header('Authorization', 'Bearer ' || token)
    ], null, null)::extensions.http_request);
  if res.status <> 200 then raise exception 'Your session has expired. Sign in again.' using errcode = '28000'; end if;
  uid := nullif(res.content::jsonb ->> 'id', '')::uuid;
  if uid is null then raise exception 'Sign in first' using errcode = '28000'; end if;
  return uid;
end; $$;
revoke all on function public.ikan_user_id(text) from public, anon, authenticated;

create or replace function public.ikan_state_pull(token text)
returns table (key text, value jsonb, updated_at timestamptz)
language plpgsql security definer set search_path = public as $$
declare uid uuid := public.ikan_user_id(token);
begin
  return query select s.key, s.value, s.updated_at from public.user_state s where s.user_id = uid;
end; $$;

create or replace function public.ikan_state_push(token text, items jsonb)
returns integer language plpgsql security definer set search_path = public as $$
declare uid uuid := public.ikan_user_id(token); n integer;
begin
  if jsonb_typeof(items) <> 'array' then raise exception 'items must be an array' using errcode = '22023'; end if;
  if length(items::text) > 512000 then raise exception 'Too much data in one save' using errcode = '54000'; end if;
  insert into public.user_state (user_id, key, value, updated_at)
  select uid, i ->> 'key', coalesce(i -> 'value', 'null'::jsonb), coalesce((i ->> 'updated_at')::timestamptz, now())
  from jsonb_array_elements(items) as i
  where (i ->> 'key') ~ '^[a-z0-9][a-z0-9._-]{0,80}$'
  on conflict (user_id, key) do update set value = excluded.value, updated_at = excluded.updated_at
    where public.user_state.updated_at <= excluded.updated_at;
  get diagnostics n = row_count;
  return n;
end; $$;

create or replace function public.ikan_state_clear(token text)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid := public.ikan_user_id(token);
begin
  delete from public.user_state where user_id = uid;
end; $$;

revoke all on function public.ikan_state_pull(text), public.ikan_state_push(text, jsonb), public.ikan_state_clear(text) from public;
grant execute on function public.ikan_state_pull(text), public.ikan_state_push(text, jsonb), public.ikan_state_clear(text) to anon, authenticated;
