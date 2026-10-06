-- 1. A contact message only has to be non-empty.
--
-- The app's form asks for 10+ characters, and that rule stays in the form. In the table it
-- would reject messages from any form with a looser rule - ikanhealth.in's old route had no
-- minimum at all - and a rejected message is a lost one.

alter table public.ikan2_contact_messages
  drop constraint if exists ikan2_contact_messages_message_check;
alter table public.ikan2_contact_messages
  add constraint ikan2_contact_messages_message_check
  check (char_length(message) between 1 and 2000);

-- 2. Newsletter sign-ups, in ikan2's own table.
--
-- ikanhealth.in's newsletter form posted to the old iKan edge function (/newsletter/signup),
-- which stored the address in its KV store; its Brevo sync never ran, and Brevo is no longer
-- used. One row per address, case-insensitively: signing up again is a 409 (unique violation),
-- which a form should show as "you're already subscribed".
--
-- Insert only, as with contact messages: nobody can read the list through the API.

create table if not exists public.ikan2_newsletter_subscribers (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email      text        not null check (char_length(email) between 3 and 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  name       text        check (char_length(name) <= 120),
  status     text        not null default 'active' check (status in ('active', 'unsubscribed')),
  source     text        not null default 'website' check (source in ('app', 'website'))
);

create unique index if not exists ikan2_newsletter_subscribers_email_key
  on public.ikan2_newsletter_subscribers (lower(email));

alter table public.ikan2_newsletter_subscribers enable row level security;

drop policy if exists "anyone can subscribe" on public.ikan2_newsletter_subscribers;
create policy "anyone can subscribe"
  on public.ikan2_newsletter_subscribers
  for insert
  to anon, authenticated
  with check (status = 'active');

grant insert on public.ikan2_newsletter_subscribers to anon, authenticated;
