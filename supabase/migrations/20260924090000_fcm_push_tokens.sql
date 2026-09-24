-- Let ikan2_push_subscriptions hold Android FCM tokens alongside web push subscriptions.
--
-- Web push identifies a device by an endpoint url plus two keys (p256dh, auth) used to encrypt
-- the payload. An FCM token is a single opaque string with no equivalent of those keys, so the
-- two columns cannot stay NOT NULL if both kinds are to live in one table. `kind` tells a sender
-- which protocol to use: the Web Push protocol for 'webpush', the FCM API for 'fcm'.
--
-- Additive and non-destructive: existing rows keep their keys and are labelled 'webpush'.

alter table public.ikan2_push_subscriptions
  add column if not exists kind text not null default 'webpush';

alter table public.ikan2_push_subscriptions
  alter column p256dh drop not null,
  alter column auth drop not null;

-- A web push row is only usable with both keys; an fcm row must not pretend to have them.
alter table public.ikan2_push_subscriptions
  drop constraint if exists ikan2_push_subscriptions_kind_keys;
alter table public.ikan2_push_subscriptions
  add constraint ikan2_push_subscriptions_kind_keys check (
    (kind = 'webpush' and p256dh is not null and auth is not null)
    or (kind = 'fcm' and p256dh is null and auth is null)
  );

create index if not exists ikan2_push_subscriptions_kind_idx
  on public.ikan2_push_subscriptions (kind);
