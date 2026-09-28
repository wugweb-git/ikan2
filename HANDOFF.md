# iKAN — where things stand

Last updated 28 September 2026.

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

## Open, in rough priority order

1. **No database backup.** The Supabase org is on the **free plan: no automatic backups, no
   point-in-time recovery.** 11 people's journals with no recovery path. Two scripts exist and
   neither has run successfully yet: `scripts/backup-db.sh` (needs the database password and a
   pooler host that answers) and `scripts/export-data.mjs` (needs only the service_role key, and
   is the easier of the two). The real fix is the Pro plan.

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
