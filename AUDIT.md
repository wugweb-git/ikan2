# iKAN — full audit

28 September 2026, against the live Supabase project `jpfvoevxegnknxoqmwye` and the code.

**Caveat on the code findings.** The audit was run against `cf1cf43`, which turned out to be
**20 commits behind `origin/main`** — the local checkout had never been fetched. That work has
since been merged in, and the findings below were re-checked against it, but anything touching
`auth-ui.tsx`, `settings.tsx`, `profile.tsx`, `delete-account.tsx`, `local-store.ts` or
`supabase/config.toml` deserves a second look before it is acted on. Database, auth and storage
findings are unaffected — they were measured live.

Scope: product code, data architecture, database, auth, storage, privacy, build. **Excludes**
`android/`, version codes and the Play release, which belong to the release window.

Every claim below was checked. Where something could not be verified, it says so.

---

## Summary

| Severity     | Count | Headline                                                                   |
| ------------ | ----: | -------------------------------------------------------------------------- |
| **Critical** |     3 | No backups; scores are recomputed not stored; 5 users' data unmigrated     |
| **High**     |     4 | Old-site coupling, push dead, no score provenance, ₹10.1L unhomed          |
| **Medium**   |     5 | Articles uncrawlable, password protection off, stale SW, `.env` in history |
| **Low**      |     4 | Type escapes, unused indexes, archive bloat, doc drift                     |

What is genuinely healthy: **0 orphaned rows**, RLS on every `ikan2_*` table, account deletion
removes avatars, no `service_role` key ever committed, `console.log` count 0, build and typecheck
clean, 0 lint errors.

---

## Critical

### C1. No database backup, and no recovery path

The org is on the **free plan: no automatic backups, no point-in-time recovery.** 16 accounts,
11 people with journal and assessment history, ~70 kB that cannot be reconstructed from anywhere.

Two scripts exist; **neither has ever run successfully.** `scripts/backup-db.sh` needs the
database password and a pooler host that answers. `scripts/export-data.mjs` needs only the
service_role key and is the easier of the two.

A single mistaken `delete` has no undo today. The real fix is the Pro plan; the stopgap is running
`export-data.mjs` on a schedule.

### C2. Assessment scores are recomputed on read, never stored

`assessments.v1` stores `{ id, slug, completedAt, seconds, answers }`. There is **no `score`, no
band, no severity, no interpretation** — `scoreAll()` recomputes everything at display time from
`src/lib/assessment/instruments.ts`.

Consequences, in order of seriousness:

- **Editing a band boundary silently rewrites history.** A result recorded as "moderate" in
  September displays as "mild" in October with no record that anything changed.
- `weight()` reverses items using the live scale options, so editing an option's `value` shifts
  every past score including reverse-scored items.
- Nothing in the database can answer "how many people scored severe" — severity is not in the
  database.
- Content is edited by Lovable's agent as well as by hand, so the mutation path is not fully
  under human review.

An assessment result is a point-in-time clinical record. The old site got this right and stored
`score`, `section_scores`, `severity_hint`, `interpretation`, `max_score`, `result_version`,
`engine_result` and `scoring_provenance`. iKAN kept the answers and discarded everything derived.

Fix: persist engine output at completion, stamped with the instrument version that produced it.
Per the repo's own convention this is a shape break, so `assessments.v2`, with `.v1` left readable.

### C3. Five people's history has never been migrated, and the score history never has

The sign-in backfill (`legacy-import.ts`) is the only thing that moves old data across, and it
only runs when someone signs in.

|                                                                     |         |
| ------------------------------------------------------------------- | ------: |
| Users with old-site data                                            |       9 |
| Of those, ever seen in iKAN                                         |       4 |
| **Users whose data has never been backfilled**                      |   **5** |
| Rows stranded (93 assessment results, 21 journal, 6 programme days) | **120** |

Separately: `wellness.v1` exists and is the right home for the old `ikan_score` history, but
`legacy-import.ts` **never imports it**. 92 rows have never been carried over for anyone. The
store is there, the data is there, nothing connects them.

Fix: one server-side migration over the same filters, for all 9 users, including `ikan_score`.
Then `legacy-import.ts` has no work left and should be deleted in the same change.

---

## High

### H1. Sign-up ran through the old site's edge function

Until the uncommitted change on `dev`, `signUp` POSTed to `make-server-cc205da9/auth/signup` —
the old site's backend. It read as dead code (guarded by `if (usingLovableCloud)`) but the flag
is `const false`, so the guarded branch never ran and the legacy call was the live path for
**every account created**.

Deleting that function would have stopped anyone signing up.

Side effect now visible: the old function created users with the admin API and confirmed their
addresses itself. **2 accounts have ever been sent a confirmation email; 14 never were**, across
8 email-provider accounts. Anyone could sign up with an address they do not own.

Status: fixed on `dev`, **uncommitted**. Still live on `main`.

### H2. Push notifications do not send

The code is deployed and correct — `ikan2-push` routes on `kind` and speaks FCM v1 — but
`FIREBASE_SERVICE_ACCOUNT` is not set in Supabase's edge function secrets, so `sendFcm` returns
`"unconfigured"`. Every mood reminder silently does nothing.

No redeploy and no new bundle needed: Firebase Console → Project settings → Service accounts →
Generate new private key, paste the JSON as the secret value.

### H3. No link between a result and the content that scored it

Related to C2 but distinct. All content is in the repo — questions, scales, bands, programme days,
articles — and **nothing records which version scored a given result**. No content hash, no
instruments version, no build id.

The codebase already conceded this problem once: `equip.*.v2` has a `legacy` field that exists
purely to freeze imported activity titles at import time. The same reasoning was never applied to
iKAN's own data.

| Content                   | Location                            |      Size |
| ------------------------- | ----------------------------------- | --------: |
| Questions, scales, bands  | `src/lib/assessment/instruments.ts` | 917 lines |
| Programme days and blocks | `src/lib/equip/content/*.json`      |    238 kB |
| Articles                  | `src/lib/content/articles.json`     |     61 kB |
| Result write-ups          | `src/lib/content/writeups.json`     |     37 kB |
| About / FAQ / legal       | `src/lib/content/pages.json`        |     19 kB |
| Consultants               | `src/lib/consultants.ts`            | 419 lines |

Content-as-code is a defensible choice — it is why the app works offline and why malformed content
fails `tsc` rather than a user's session. The defect is the missing provenance stamp, not the
location.

### H4. ₹10,13,469 of payment records have no home in iKAN

71 rows under `payment:` in the old store, all `status: completed`, `type: purchase`, INR, across
7 users, latest 14 Sep 2026.

iKAN has **no payments store and no payment code whatsoever** — the only matches in `src/` are
marketing copy and consultation display prices. The import does not touch it.

**Unresolved: whether this is real revenue or seeded demo data.** The rows are well-formed either
way. If real, it is the most critical item in any migration and belongs in a proper table, not a
per-user JSON blob. If demo, it should be explicitly written off. This blocks migration scoping.

---

## Medium

### M1. Articles are invisible to search engines

`resources` is missing from the `PUBLIC` allowlist in `src/components/auth-ui.tsx:11`, so every
article redirects to `/login` for a signed-out visitor. The markup is already correct — real
links, correct headings, a complete `Article` JSON-LD block with `headline`, `datePublished`,
`articleSection`, `inLanguage` and Organization publisher — and none of it is reachable.

The sitemap deliberately lists only the 11 routes a signed-out visitor can load, so it would need
regenerating alongside.

Note `resources.v1` holds `{ saved, opened }` — per-user bookmarks and read state. Making the
route public means signed-out visitors have no such document, so those affordances need to hide
or prompt sign-in rather than write nowhere.

### M2. Leaked-password protection is disabled

Confirmed by the live security advisor (WARN). Supabase can check passwords against
HaveIBeenPwned; it is off. Dashboard → Authentication → Policies.

Given `profile.v1` holds next-of-kin details, this is worth more than its severity label.

### M3. The service worker never invalidates its cache

`public/sw.js:12` hardcodes `VERSION = "ikan-v2"` and uses it as the sole cache key. It is never
bumped between deploys, so "my change isn't showing" usually means a stale cache and requires an
unregister-and-reload. Fix is to derive it at build time.

### M4. `.env` is in git history

Committed once in `911b6e2` ("Work in progress"), later untracked. Contents were
`SUPABASE_PROJECT_ID`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and their `VITE_` twins.

**Verified: no `service_role` or secret key has ever been committed** — checked every historical
revision of the file. Publishable keys are designed to be public and are protected by RLS, so
impact is low. It stays worth knowing because this history also syncs to Lovable.

`.gitignore` now covers `.env` and `.env.*` with an exception for `.env.example`.

### M5. Branch protection and secret scanning are off

Not enabled on GitHub. A `.env` reached the repo once already, and Lovable's agent commits to this
repo directly.

---

## Low

### L1. Type escapes and hook-dependency suppressions

46 occurrences of `: any` / `as any` in `src/`, and 14 `eslint-disable-line
react-hooks/exhaustive-deps`. Lint reports 0 errors and 57 `react-refresh/only-export-components`
warnings, all pre-existing. Not urgent; worth not growing.

### L2. Database advisors — mostly benign

- **41 × `rls_enabled_no_policy` (INFO)** — 40 `archive.*` tables plus `kv_store_cc205da9`. This
  is the intended state: RLS on with no policies means unreachable except by the service role.
  It is a safe configuration reported as informational, not a gap.
- **5 × `auth_rls_initplan` (WARN)** — all on the old site's `user_*` tables, none on `ikan2_*`.
  Not iKAN's to fix.
- **2 unused indexes**, one of them `ikan2_push_subscriptions_kind_idx`.
- **1 duplicate index** on `UserConnectCheck`, a 0-row scratch table.

### L3. The `archive` schema is ~9 MB of superseded backups

41 tables, nothing reads them, kept in case a content migration needs unwinding. Droppable once
those migrations are far enough past.

### L4. `supabase/SCHEMA.md` had drifted

Corrected in this session:

- Claimed iKAN used nothing from the old store. It used three live paths.
- Described `ikanhealth.in` as "Lovable / React". It is **Vite/React on Vercel**.
- Gave the old site's last write as 14 Sep. `activity_log` has 66 `login` rows after that, latest
  24 Sep — iKAN's own sign-ins.

Still stale and **not yet corrected**:

- Says account deletion does not remove the avatar file. It does — `ikan2-delete-account`
  calls `deleteAvatars()` before deleting the user.
- Says 14 auth accounts; there are **16**.
- Says 40 assessment results across 9 users; there are **48**.

---

## Verified healthy

| Check                              | Result                                                              |
| ---------------------------------- | ------------------------------------------------------------------- |
| Orphaned `ikan2_user_state` rows   | 0                                                                   |
| Orphaned push subscriptions        | 0                                                                   |
| `ikan2_*` tables without RLS       | 0                                                                   |
| Avatar objects with no owning user | 0 (bucket is empty — nobody has uploaded)                           |
| `service_role` key in git history  | none, ever                                                          |
| `console.log` left in `src/`       | 0                                                                   |
| `bun run build`                    | passes                                                              |
| `tsc --noEmit`                     | passes                                                              |
| `eslint`                           | 0 errors                                                            |
| Account deletion completeness      | removes all 3 `ikan2_*` tables, avatars, then the auth user         |
| Analytics privacy                  | route patterns and hand-written labels only; never `document.title` |

---

## Recommended order

1. **Run `export-data.mjs` once** (C1). Everything else is safer afterwards.
2. **Commit and merge the sign-up cut-over** (H1) — live users are signing up through the old
   function today.
3. **Resolve the payment question** (H4), then run the one-time migration covering the 120
   stranded rows and the 92 `ikan_score` rows (C3), and delete `legacy-import.ts`.
4. **Spec and ship `assessments.v2`** with score and provenance (C2, H3).
5. Set `FIREBASE_SERVICE_ACCOUNT` (H2), enable leaked-password protection (M2) — both dashboard,
   both minutes.
6. Open the resources gate (M1) and fix the service worker version (M3).

Items 2, 4 and 6 are code and mine. Items 1, 3 and 5 need a credential or a decision from you.
