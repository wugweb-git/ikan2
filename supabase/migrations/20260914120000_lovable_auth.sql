-- ikan2 moves sign-in to Lovable Cloud (applied 2026-09-14).
-- Accounts were copied from the old iKan project with their ids and password hashes, so
-- public.user_state rows keep pointing at the same people. The app now reads and writes its own
-- rows with the user's token; the token-checking RPCs from 20260914060000 are gone.

drop function if exists public.ikan_state_pull(text);
drop function if exists public.ikan_state_push(text, jsonb);
drop function if exists public.ikan_state_clear(text);
drop function if exists public.ikan_user_id(text);

grant select, insert, update, delete on public.user_state to authenticated;
create policy "own state read" on public.user_state for select to authenticated using (auth.uid() = user_id);
create policy "own state write" on public.user_state for insert to authenticated with check (auth.uid() = user_id);
create policy "own state update" on public.user_state for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own state delete" on public.user_state for delete to authenticated using (auth.uid() = user_id);

-- One row per account, kept in step with auth.users, so accounts are visible in Cloud → Database.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, full_name text, phone text, avatar_url text, about text,
  birthday date, gender text, marital_status text, city text, zip text,
  emergency_name text, emergency_phone text, emergency_relation text,
  sign_in_provider text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);
alter table public.profiles enable row level security;
grant select, update on public.profiles to authenticated;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone, avatar_url, sign_in_provider, created_at, last_sign_in_at)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    coalesce(new.raw_user_meta_data->>'phone', new.phone),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    new.raw_app_meta_data->>'provider', new.created_at, new.last_sign_in_at)
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    last_sign_in_at = excluded.last_sign_in_at,
    updated_at = now();
  return new;
end; $$;
revoke all on function public.handle_auth_user() from public, anon, authenticated;
create trigger on_auth_user_changed after insert or update of email, last_sign_in_at, raw_user_meta_data on auth.users
  for each row execute function public.handle_auth_user();

-- Content copied from the old iKan app (assessments, programmes, articles, consultants,
-- catalogue, scoring profiles, recommendation rules, site settings). Readable by everyone.
create table if not exists public.assessments (id text primary key, slug text unique not null, title text, category text, data jsonb not null, source text not null default 'ikan', updated_at timestamptz not null default now());
create table if not exists public.programmes (id text primary key, slug text unique not null, title text, data jsonb not null, source text not null default 'ikan', updated_at timestamptz not null default now());
create table if not exists public.resources (id text primary key, slug text, title text, category text, content_type text, data jsonb not null, source text not null default 'ikan', updated_at timestamptz not null default now());
create table if not exists public.consultants (id text primary key, name text, role text, data jsonb not null, source text not null default 'ikan', updated_at timestamptz not null default now());
create table if not exists public.catalog (id text primary key, type text not null, slug text, name text, data jsonb not null, updated_at timestamptz not null default now());
create table if not exists public.scoring_profiles (id text primary key, name text, data jsonb not null, updated_at timestamptz not null default now());
create table if not exists public.recommendation_rules (id text primary key, assessment_category text, data jsonb not null, updated_at timestamptz not null default now());
create table if not exists public.app_config (key text primary key, data jsonb not null, updated_at timestamptz not null default now());
do $$ declare t text; begin
  foreach t in array array['assessments','programmes','resources','consultants','catalog','scoring_profiles','recommendation_rules','app_config'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
  end loop;
end $$;
