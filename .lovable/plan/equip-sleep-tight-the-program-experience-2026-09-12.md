# Equip: Sleep Tight — the program experience

Build the full self-paced program journey from the Equip model document, in the same monochrome iKAN style as the dashboard and assessments. All content and progress stay in the app (no accounts yet); progress is remembered in the browser.

## Screens

1. **Programs list** (`/program`) — Sleep Tight as the lead card with a real photo cover, plus the other Equip programs shown as coming soon.
2. **Program cover** (`/program/sleep-tight`) — About, What to expect, Who can participate, the three "Things to note" bullets verbatim (including the safety line), the unit count, and a Start / Continue button. The disclaimer's third bullet links straight to the support screen.
3. **Onboarding** (`/program/sleep-tight/start`) — the intake form: name/phone/email shown as already-known and read-only, gender and birth date, occupation (using the kinder "Between jobs" wording), therapy history and pre-existing conditions, each with an "I'd prefer not to answer" choice and a follow-up box that only appears on Yes.
4. **Unit list** (`/program/sleep-tight/units`) — the spine as a vertical journey: unit number, title, component tag, beats, duration, and lock state. Only the next unit is open; finished units show a check. Rehearsal stretches (15–20, 24–32) render as a single grouped band rather than nine identical rows.
5. **Unit player** (`/program/sleep-tight/unit/$unit`) — one block per screen with a beat progress rail (teach → rehearse → work → close), swipe/tap through, and a close button back to the unit list.
6. **Unit complete** — the closing line from the content inventory, what was collected this sitting, and Continue.
7. **Support** (`/support`) — crisis contacts (Tele-MANAS 14416, AASRA, Vandrevala, 112) reachable from the disclaimer and from any unit's header.
8. **My instruments** (`/program/sleep-tight/instruments`) — the artifacts the user has built: sleep diary, thought record, distractors, ideation, rituals, habit adherence. Read-only review of past rows.

## Block renderers

Each block is one screen, with role and interaction kept separate:

- **Lesson / teach** — prose with a large heading and image where it helps.
- **Learning / drill** — one prompt at a time with options; never scored; the first item's answer shown as a worked example.
- **Exercise / option pool** — multi-select chips with an optional "other" box and refusal option.
- **Record table** — add-row tables with typed columns; seed rows shaded grey and visibly distinct from the user's own rows.
- **Nested record** — parent disturbance rows each holding up to ten ideas.
- **Timed box** — full-screen writing surface with a countdown (5 min dump, 3 min ideation) and a hard stop; the dump screen states its 48-hour deletion promise.
- **Scale / check-in** — the mood log rating strip.
- **Sleep diary** — the nightly entry form with its derived metrics.
- **Summarise** — trend view of a instrument's rows over recent entries.
- **Conclude / close** — the authored closing line plus completion.

## Projection modes

`collect` (new rows, seeds only), `extend` (re-open earlier rows and fill a newly added column — the "did this affect my sleep" pass), `review` (read-only look back), `summarise` (aggregate/trend). Windows count entries, not days.

## Standing set

Once an instrument enters, it is collected every sitting: sleep diary and mood log from U2, thought record from U4, thought dump from U6, bedtime ritual from U12, wake ritual from U21. In rehearsal units the standing set *is* the unit.

## Content depth in this pass

- Units 0–14 authored in full, using the document's option lists, drill prompts, seed rows, brainstorming rules and closing lines.
- Units 15–20 and 24–32 render as rehearsal sittings driven by the standing set.
- Units 21–23 and 33–34 authored from the source content.
- Sleep Compression's threshold is not specified in the document, so U3 and the compression stretch show the user their sleep window and efficiency without prescribing a restriction. Flagged as needing a clinical decision.
- Copy that says "18 days" / "tomorrow" is kept as written in the front matter, since the document marks it as the content team's to rewrite.

## Technical notes

- `src/lib/equip/` holds the program model: instruments (typed columns, revisions, seed rows), units with their beats and blocks, the standing set, and the content inventory — mirroring the document's vocabulary (unit, beat, block, instrument, projection).
- `src/lib/equip/store.ts` holds per-user entries and unit completion in `localStorage`, hydration-safe, with a `useEquipProgress` hook. Rows dedupe on the instrument's identity columns; revisions add fields as null rather than backfilling.
- Block renderers live in `src/components/equip/blocks/*` behind one `BlockRenderer` that switches on role + interaction.
- New routes under `src/routes/program.*` and `src/routes/support.tsx`, each with its own head metadata. Bottom nav "Programs" tab points at `/program`.
- One new program cover image generated for Sleep Tight; existing assets reused elsewhere.
- Dashboard is left untouched apart from its Programs link resolving to the new route.

## Not in this pass

Accounts, server storage, cohorts/groups, consent enforcement, reminders, and guided audio sessions.
