-- Messages from the app's Contact us form, in ikan2's own table.
--
-- Until now the form posted to the old iKan edge function (make-server-cc205da9 /contact/submit),
-- which only wrote the message into its KV store: its Brevo emails never ran (no API key), and
-- Brevo is no longer used. ikanhealth.in's form is to post here too, with source 'website'.
--
-- Anyone may send a message, signed in or not. Nobody can read, change or delete one through the
-- API: there are no select/update/delete policies, so only the service role sees the table.

create table if not exists public.ikan2_contact_messages (
  id         uuid        primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- set when the sender was signed in; a signed-in sender can only file under their own id
  user_id    uuid        references auth.users(id) on delete set null,
  name       text        not null check (char_length(name) between 1 and 120),
  email      text        not null check (char_length(email) between 3 and 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  subject    text        not null default 'General enquiry' check (char_length(subject) between 1 and 200),
  message    text        not null check (char_length(message) between 10 and 2000),
  status     text        not null default 'new' check (status in ('new', 'read', 'replied')),
  -- which form it came from: this app, or the ikanhealth.in website
  source     text        not null default 'app' check (source in ('app', 'website'))
);

create index if not exists ikan2_contact_messages_created_idx
  on public.ikan2_contact_messages (created_at desc);

alter table public.ikan2_contact_messages enable row level security;

drop policy if exists "anyone can send a message" on public.ikan2_contact_messages;
create policy "anyone can send a message"
  on public.ikan2_contact_messages
  for insert
  to anon, authenticated
  with check (
    status = 'new'
    and (user_id is null or user_id = auth.uid())
  );

grant insert on public.ikan2_contact_messages to anon, authenticated;
