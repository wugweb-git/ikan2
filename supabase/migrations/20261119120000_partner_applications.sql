-- Partner applications (ikanhealth.in/join/partner), in an ikan2 table next to contact messages
-- and newsletter sign-ups, so every form iKAN collects lands in one family of tables.
--
-- The form still posts to the old site's edge function (make-server-cc205da9,
-- /public/partner-application), because approving an application publishes the partner into the
-- old site's directory, which lives in its KV store. From now on that function also writes one
-- row here per application and keeps `status` in step when an admin approves or rejects.
--
-- Nobody can read, add, change or delete a row through the API: there are no policies at all, so
-- only the service role (the edge function, the dashboard) sees the table. Applications carry
-- private verification details (registration numbers, document links).

create table if not exists public.ikan2_partner_applications (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  -- the old site's id for the same application ("app-<ms>-<rand>"): the KV keys
  -- professional_application:<id> and professional:pending-<id> use it
  application_id   text        not null unique,
  name             text        not null check (char_length(name) between 1 and 200),
  email            text        not null check (char_length(email) between 3 and 254),
  phone            text,
  -- the partner type: therapist, psychiatrist, counsellor…
  category         text,
  credentials      text,
  location         text,
  pincode          text,
  years_experience integer,
  languages        text[]      not null default '{}',
  status           text        not null default 'pending_review'
                               check (status in ('pending_review', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_at      timestamptz,
  -- everything the form sent, as sent: { contact, verification, profile }
  answers          jsonb       not null default '{}'::jsonb,
  source           text        not null default 'website' check (source in ('app', 'website'))
);

create index if not exists ikan2_partner_applications_created_idx
  on public.ikan2_partner_applications (created_at desc);

alter table public.ikan2_partner_applications enable row level security;

-- Applications already in the old site's KV store, so the table starts complete. The tracker row
-- has the contact details and status; the pending record (if still there) has the full profile.
insert into public.ikan2_partner_applications
  (created_at, application_id, name, email, phone, category, credentials, location, pincode,
   years_experience, languages, status, rejection_reason, answers)
select
  coalesce((t.value->>'submitted_at')::timestamptz, now()),
  t.value->>'id',
  coalesce(nullif(t.value->>'name', ''), 'Unknown'),
  coalesce(nullif(t.value->>'email', ''), 'unknown@unknown.invalid'),
  nullif(t.value->>'phone', ''),
  nullif(t.value->>'category', ''),
  nullif(t.value->>'credentials', ''),
  nullif(t.value->>'location', ''),
  nullif(p.value#>>'{details,pincode}', ''),
  case when (t.value->>'yearsExperience') ~ '^\d+$' then (t.value->>'yearsExperience')::int end,
  coalesce(array(select jsonb_array_elements_text(
    case when jsonb_typeof(t.value->'languages') = 'array' then t.value->'languages' else '[]'::jsonb end)), '{}'),
  case t.value->>'status' when 'approved' then 'approved' when 'rejected' then 'rejected' else 'pending_review' end,
  nullif(t.value->>'rejection_reason', ''),
  jsonb_build_object(
    'contact', jsonb_build_object('email', t.value->'email', 'phone', t.value->'phone'),
    'verification', coalesce(t.value->'verification', '{}'::jsonb),
    'profile', coalesce(p.value, '{}'::jsonb))
from public.kv_store_cc205da9 t
left join public.kv_store_cc205da9 p
  on p.key = 'professional:pending-' || (t.value->>'id')
where t.key like 'professional_application:%'
  and t.value->>'id' is not null
on conflict (application_id) do nothing;
