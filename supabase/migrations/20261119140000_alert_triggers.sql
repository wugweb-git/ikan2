-- Email the team when something new arrives: a pilot lead or contact message, a newsletter
-- sign-up, a partner application, or a new app account. Each AFTER INSERT trigger posts
-- { kind, record } to the ikan2-alerts edge function, which renders the iKAN-branded email and
-- sends it through the ikanhealth.in mailbox (see supabase/functions/ikan2-alerts/index.ts).
--
-- The call goes through pg_net, which queues the request and returns at once, so a slow or
-- failing mail server never holds up or fails the insert. Any error building the request is
-- swallowed for the same reason: losing an alert is better than losing a form submission.
--
-- The function only accepts calls carrying x-cron-secret, the same secret the
-- ikan2-mood-reminders cron job sends to ikan2-push. Triggers read it from private.settings,
-- which nothing outside the database can reach.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.settings (
  key   text primary key,
  value text not null
);
revoke all on private.settings from public, anon, authenticated;

-- Copy the cron secret from the existing reminders job, so it is never written into this file.
insert into private.settings (key, value)
select 'cron_secret', substring(command from $re$'x-cron-secret'\s*,\s*'([^']+)'$re$)
from cron.job
where jobname = 'ikan2-mood-reminders'
  and substring(command from $re$'x-cron-secret'\s*,\s*'([^']+)'$re$) is not null
on conflict (key) do update set value = excluded.value;

create or replace function private.send_alert(kind text, record jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  secret text;
begin
  select value into secret from private.settings where key = 'cron_secret';
  if secret is null then
    return;
  end if;
  perform net.http_post(
    url     := 'https://jpfvoevxegnknxoqmwye.supabase.co/functions/v1/ikan2-alerts',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-secret', secret),
    body    := jsonb_build_object('kind', kind, 'record', record)
  );
exception when others then
  raise warning 'ikan2 alert (%) not queued: %', kind, sqlerrm;
end;
$$;
revoke all on function private.send_alert(text, jsonb) from public, anon, authenticated;

-- Contact form and the burnout calculator's pilot form share ikan2_contact_messages; the
-- calculator's subject always starts "Pilot enquiry".
create or replace function private.alert_contact_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.send_alert(
    case when new.subject ilike 'Pilot enquiry%' then 'pilot_lead' else 'contact' end,
    jsonb_build_object('name', new.name, 'email', new.email, 'subject', new.subject,
                       'message', new.message, 'source', new.source, 'created_at', new.created_at));
  return null;
end;
$$;

create or replace function private.alert_newsletter()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.send_alert('newsletter',
    jsonb_build_object('name', new.name, 'email', new.email, 'source', new.source,
                       'created_at', new.created_at));
  return null;
end;
$$;

-- Leaves out `answers`: it holds verification details (registration numbers, document links)
-- that don't belong in an email. The admin page has them.
create or replace function private.alert_partner_application()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.send_alert('partner_application',
    jsonb_build_object('name', new.name, 'email', new.email, 'phone', new.phone,
                       'category', new.category, 'credentials', new.credentials,
                       'location', new.location, 'pincode', new.pincode,
                       'years_experience', new.years_experience, 'languages', to_jsonb(new.languages),
                       'created_at', new.created_at));
  return null;
end;
$$;

create or replace function private.alert_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.send_alert('new_user',
    jsonb_build_object(
      'name', coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
      'email', new.email,
      'provider', new.raw_app_meta_data->>'provider',
      'created_at', new.created_at));
  return null;
end;
$$;

revoke all on function private.alert_contact_message()     from public, anon, authenticated;
revoke all on function private.alert_newsletter()          from public, anon, authenticated;
revoke all on function private.alert_partner_application() from public, anon, authenticated;
revoke all on function private.alert_new_user()            from public, anon, authenticated;

drop trigger if exists ikan2_alert on public.ikan2_contact_messages;
create trigger ikan2_alert after insert on public.ikan2_contact_messages
  for each row execute function private.alert_contact_message();

drop trigger if exists ikan2_alert on public.ikan2_newsletter_subscribers;
create trigger ikan2_alert after insert on public.ikan2_newsletter_subscribers
  for each row execute function private.alert_newsletter();

drop trigger if exists ikan2_alert on public.ikan2_partner_applications;
create trigger ikan2_alert after insert on public.ikan2_partner_applications
  for each row execute function private.alert_partner_application();

drop trigger if exists ikan2_alert_new_user on auth.users;
create trigger ikan2_alert_new_user after insert on auth.users
  for each row execute function private.alert_new_user();
