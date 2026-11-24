# iKAN — where things stand

Last updated 24 November 2026. The "In flight" and numbered "Open" items below were last checked
on 28 September; recheck them before acting on them.

Read this first in a new session. It is the current state, not a history; the reasoning behind
each change is in the commit messages, and the database is documented in `supabase/SCHEMA.md`.

## What this is

A TanStack Start app at **app.ikanhealth.in**, hosted by Lovable, with a Capacitor Android shell
that loads that same live URL. **Web changes reach installed apps without a Play release** — only
native changes (plugins, permissions, icon, version bump) need a new bundle.

- Repo: `wugweb-git/ikan2`, one branch (`main`), CI on every push
- Backend: Supabase project `jpfvoevxegnknxoqmwye` ("Ikan - App")
- Android: `com.ikan.wugweb`
- Deploy: push to `main`, then publish the Lovable project — **pushing alone does not publish**

There is a separate, older repo (`wugweb-git/Ikan`) serving ikanhealth.in. Different app,
different code, shares only the Supabase auth users. Do not confuse the two.

## In flight

**Play open testing, release `3 (1.0.2)`, in review since 25 Sep.** Built from tag `v1.0.2`
(commit `7f1f363`). Signed, R8 on, real launcher icon, FCM included, 3.0 MB. The bundle is at
`~/ikan-backups/ikan-1.0.2-vc3.aab`.

Links, live once review clears:
`https://play.google.com/apps/testing/com.ikan.wugweb`
`https://play.google.com/store/apps/details?id=com.ikan.wugweb`

## Shipped since 28 September

- **Equip: four programmes live.** Sleep Tight, Unburn, Stress Buster and Productivity Reset
  (rebuilt as 10 days, with its About page, cover and highlight tiles). Each one's content is in
  `src/lib/equip/content/*.json`.
- **Finished things are records.** Assessment results (`src/lib/assessment/frozen.ts`) and Equip
  summaries, highlights and diaries (`src/lib/equip/seal.ts`) are stored once, when finished, and
  never recomputed. Content edits only reach runs in progress and future runs.
- **Resources: 28 articles**, built from the blocks in `src/lib/content/RESOURCES.md`.
- **iPhone fixes.**
  - The signed-in home page crashed on iPhone Safari and Chrome because `Notification` doesn't
    exist outside a home-screen app (`fdc685e`). Never name a browser global bare; use the
    guards in `src/lib/device.ts`.
  - An older-Safari regex fix (`ac7e341`).
  - Reloading once onto a new build instead of showing the error screen (`917b122`).
- **Others' work on `main`:**
  - partner applications table
  - branded alert emails sent by database triggers
  - cross-domain analytics linker, with optional Microsoft Clarity
  - cross-repo slug routes

## Pending

- **Check on a real iPhone** that the signed-in home page opens in Safari and Chrome. The
  WebKit test passed, but only on an account with no saved data.
- **Content off JSON and into Supabase tables.** Planned, not started. Snapshots carry over as
  stored, and saved-answer keys (`day.n`, block keys) stay the same.
- **Wellness score breakdown.** Next feature, not started.

## On hold

- **Programme 5, "Read Between the Lines"** (kids, two age tracks). Waiting on answers about
  consent and safeguarding. Don't build it until they come back.
- **CRM: HubSpot is dropped.** FluentCRM will do that job. Don't build HubSpot exports or sync.
- **Article "External" sections** wait on a recommendation engine. Assessment-to-programme
  recommendations are set by hand in `src/lib/assessment/instruments.ts` for now.

## Open, in rough priority order

1. **Backups are ours to run.** The Supabase org is on the **free plan and stays there: no
   automatic backups, no point-in-time recovery.** The plan is not the answer here; do not
   propose it again.

   `.github/workflows/backup.yml` takes a nightly `pg_dump`, checks it lists before shipping
   it, encrypts it and keeps it 90 days as a private Actions artifact. It needs two repository
   secrets before it does anything: `IKAN_DB_URL` (session mode, port 5432) and
   `BACKUP_PASSPHRASE`. Lose the passphrase and you lose the backups, so keep it somewhere
   that is itself backed up.

   `scripts/backup-db.sh` is the same dump by hand, for before anything risky.
   `scripts/export-data.mjs` needs only the service_role key.

   Two traps with scheduled workflows: GitHub delays them under load, and disables them after
   60 days of repository inactivity. A restore test has still never been done - an untested
   backup is a hope, not a backup.

2. **Push does not send.** The code is deployed and correct — `ikan2-push` routes on `kind` and
   speaks FCM v1 — but `FIREBASE_SERVICE_ACCOUNT` is not set in Supabase's edge function
   secrets, so `sendFcm` returns `"unconfigured"`. Firebase Console → Project settings → Service
   accounts → Generate new private key, paste the whole JSON as the secret value. No redeploy,
   no new bundle.

3. **vc3 has never run on a device.** Two checks nobody has done:
   - Does it get past the splash? R8 is newly enabled. All ten plugin classes were verified
     present in `classes.dex`, but that is static proof. If R8 stripped something the symptom is
     a blank white screen with no crash.
   - Does account deletion stick? Sign in, write a journal entry, delete the account,
     **force-stop**, reopen. The bug only ever existed inside the Android WebView.

4. **Leaked-password protection** is off. Supabase → Authentication → Policies.

5. **Search Console** has no property. Try the Google Analytics verification method first — the
   gtag is already on every page, so it needs no code change. Then submit `sitemap.xml`.

6. **Consultant cards carry Unsplash stock portraits**, hotlinked, under five named
   clinicians. They were removed on 25 Sep and put back on 28 Sep on the owner's instruction;
   do not remove them again. Replace them with real photographs when there are some.

7. **The old Lovable Cloud database** (`cfsnyzcrekchvzrulpvl`) is not disposable, and the
   earlier note here saying it could be deleted was wrong. It holds 8 accounts and 28
   `user_state` rows - journals, assessments and programme progress - frozen since 14 Sep.
   All 8 of those people also have accounts in the live project, which is why it looked
   redundant. But **four of them have no state rows at all in the live project**: about 12 kB
   of their writing exists in that database and nowhere else, and deleting it destroys it.

   `scripts/rescue-lovable-cloud.sh` dumps it and then copies the stranded rows across,
   matching on email because the auth user ids were reissued. It never overwrites a key the
   live account already has. Run `backup`, then `migrate`; delete nothing until a restore
   test of the dump has passed.

8. **Branch protection and secret scanning** are not enabled on GitHub. A `.env` was committed
   once already.

## Things that will bite you

**Alert emails go out from here, not WordPress.** Since 19 Nov, `AFTER INSERT` triggers on the
contact, newsletter and partner-application tables and on `auth.users` call the `ikan2-alerts` edge
function, which emails the team an iKAN-branded alert over Hostinger SMTP (secrets `SMTP_PASS`,
`ALERT_TO`; the trigger secret sits in the `private` schema). Details in `supabase/SCHEMA.md`. The
old site's WordPress sync may also notify on the same rows, so a duplicate is possible; deciding
which one stays is open in the `ikan` repo's `docs/PENDING.md`.

**Articles are behind the sign-in gate.** `resources` is not in the PUBLIC allowlist in
`src/components/auth-ui.tsx`. The article cards are real links with `Article` JSON-LD and correct
headings — all of it invisible to crawlers until that route is made public. The sitemap lists
only the 11 routes a signed-out visitor can actually load, deliberately.

**Lovable's agent edits this repo.** It has committed a `.env`, pinned a dependency without
regenerating `bun.lock`, and generated `src/integrations/supabase/` — which is imported nowhere
and excluded from lint. Expect CI to catch its next lockfile drift; the fix is `bun install` and
commit.

**Never send `document.title` to analytics.** On assessment and programme routes the title *is*
the condition. `src/lib/analytics.ts` maps route patterns to static labels for exactly this
reason. Same rule for any new `track()` params: a programme slug is fine, an assessment slug is
the diagnosis.

**The service worker caches by a hardcoded `VERSION`** (`public/sw.js`). It is never bumped
between deploys, so "my change isn't showing" usually means an unregister-and-reload is needed.

## Where the detail lives

- `supabase/SCHEMA.md` — both applications sharing the database, and the JSON shape of every key
  in `ikan2_user_state`, which is where iKAN's real schema lives
- `supabase/schema.sql` — structure only, no rows
- `~/.claude/plans/robust-swimming-whistle.md` — the pre-release cleanup, closed
- `git log` — the reasoning for every change
