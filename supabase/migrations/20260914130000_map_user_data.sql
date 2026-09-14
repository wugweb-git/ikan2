-- Tie account data to the account (applied 2026-09-14).
-- user_state rows are removed with their auth user, and profile edits saved by the app
-- (user_state 'profile.v1') are mirrored into public.profiles.

alter table public.user_state drop constraint if exists user_state_user_id_fkey;
alter table public.user_state add constraint user_state_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

create or replace function public.sync_profile_from_state()
returns trigger language plpgsql security definer set search_path = public as $$
declare v jsonb := new.value;
begin
  if new.key <> 'profile.v1' then return new; end if;
  update public.profiles set
    full_name = coalesce(nullif(v->>'name', ''), full_name),
    phone = coalesce(nullif(v->>'phone', ''), phone),
    avatar_url = coalesce(nullif(v->>'avatar', ''), avatar_url),
    about = coalesce(nullif(v->>'bio', ''), about),
    birthday = case when v->>'birthday' ~ '^\d{4}-\d{2}-\d{2}$' then (v->>'birthday')::date else birthday end,
    gender = coalesce(nullif(v->>'gender', ''), gender),
    marital_status = coalesce(nullif(v->>'maritalStatus', ''), marital_status),
    city = coalesce(nullif(v->>'city', ''), city),
    zip = coalesce(nullif(v->>'zip', ''), zip),
    emergency_name = coalesce(nullif(v->>'emergencyName', ''), emergency_name),
    emergency_phone = coalesce(nullif(v->>'emergencyPhone', ''), emergency_phone),
    emergency_relation = coalesce(nullif(v->>'emergencyRelation', ''), emergency_relation),
    updated_at = now()
  where id = new.user_id;
  return new;
end; $$;
revoke all on function public.sync_profile_from_state() from public, anon, authenticated;
drop trigger if exists on_profile_state_saved on public.user_state;
create trigger on_profile_state_saved after insert or update of value on public.user_state
  for each row when (new.key = 'profile.v1') execute function public.sync_profile_from_state();
