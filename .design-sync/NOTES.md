# design-sync notes — ikan2

ikan2 is a private app, not a published component library. Everything below exists because the
converter expects a package with a built `dist/`, and this repo has neither.

## The sync package

`.design-sync/` is its own package boundary (`package.json` with `name: ikan` and a `types`
entry). The app's own `package.json` is untouched. `PKG_DIR` resolves here, which matters:
**`cfg.tsconfig` and `cfg.cssEntry` are resolved relative to `.design-sync/`, not the repo root**
(`cfg.storybookStatic` and `cfg.entry` are cwd-relative — different rule, easy to trip on).

`entry.tsx` is the library surface: the 22 component modules the in-scope stories import, plus
the data helpers they use. Checked at authoring time — no two export the same name.

## Generated, not committed — regenerate after pulling

    ./node_modules/.bin/tsc -p .design-sync/tsconfig.types.json      # types/
    python3 .design-sync/make-asset-shims.py                          # asset-shims/
    npx storybook build -c .storybook -o "$(git rev-parse --show-toplevel)/.design-sync/sb-reference"

## Fixes, and why

- **[GENERAL] `.jpg` has no loader in the converter's bundle map** (it covers svg/png/woff), and
  `bundle.mjs` is app-contract surface that must not be forked. `src/lib/equip/programs.ts`
  imports three programme covers, reached from `equip/cards.tsx` via `earlier.ts`, so the bundle
  cannot avoid them. Fix: `cfg.tsconfig` maps `@/assets/*` to `.design-sync/asset-shims/*`, where
  each `<name>.jpg.ts` exports the real image as a data URI. The path plugin strips a trailing
  `*` and appends extensions itself, so the target must end in `*`, not `*.ts`.
  Worth reporting upstream: `.jpg`/`.jpeg` are missing from `sharedBuildOptions`' loader map.
- **`@/lib/content` is a directory** with an `index.ts`. The path plugin tries the empty extension
  first, matches the directory, and esbuild fails with "is a directory". Fix: an exact (non-glob)
  path entry ahead of `@/*`.
- **No `.d.ts` anywhere** — discovery found 0 components even though the bundle exported 105
  symbols, because `exportedNames()` reads the package's types, not the bundle. Fix: emit
  declarations for the barrel and point `types` at them.
- **Decorators will not bundle**: `.storybook/preview.tsx` imports `src/styles.css`, whose
  `@import "tailwindcss"` esbuild cannot resolve. Fix: `cfg.provider` → `DesignFrame`
  (`.design-sync/preview-frame.tsx`), which mirrors the decorator — phone-width frame, `night`
  accent — without the stylesheet import.
- **No `cfg.cssEntry`, deliberately.** `src/styles.css` is Tailwind *source*; copying it would
  ship unprocessed directives. `[CSS_FROM_STORYBOOK]` scrapes the compiled 125 KB stylesheet out
  of the reference build, which is the real thing.

## Scope

**27 components: 15 M3 primitives and 12 kit primitives.** The user narrowed the sync to
"ikan2's most used and general ones" (3 Oct 2026), measured from imports: `equip/m3` is imported
by 40 modules and `Button` alone appears 260 times, so the M3 layer is the design system in
practice. App-specific compositions (program-header, equip/cards, steps, journal blocks,
auth-ui, about, result-share, the assessment and consult screens) are out — they are screens,
not parts.

### How scope is decided now — NOT titleMap

`cfg.titleMap` is empty. Scope comes from **the sync having its own Storybook**:

- `.design-sync/sb-config/` — globs only `../stories/**`, so the converter never sees the app's
  story files at all.
- `.design-sync/stories/{m3,kit}/` — 27 story files, **one component per title** (`M3/Button`,
  `Kit/Chip`, …), 75 stories.
- `.design-sync/sb-config/preview.tsx` re-exports `.storybook/preview` rather than copying it,
  so the frame and accent cannot drift from the app's.

**Why the switch.** `titleParts()` resolves a title right-to-left to the first segment that is a
bundle export, and `titleMap` keys on that *resolved name*. Two consequences the old approach
could not escape:

1. `UI kit/Badge` and `Kit/Badge` both resolve to `Badge`, so `{Badge: null}` excluded both.
   Same for `Button`, `Avatar`, `Label`, `Switch`, `Card`, `Chart` — the shadcn kit collides
   with M3 and with the new kit on seven names.
2. `Equip/M3 kit` is one title covering twenty components. One title maps to one component, so
   the most-used layer in the app could not be synced at all without splitting the story file.

Narrowing the glob solves both and touches nothing in `src/`. The user has twice said the
shadcn files under `src/components/ui` must never be deleted; this keeps all 46 of them, their
stories, and the app's own Storybook exactly as they were.

### Keeping the sync stories honest

They import the real components, so a story that stops compiling means a prop changed. They are
committed. If a component gains a variant, add it there — the design agent's card is generated
from these stories and nothing else.

## Re-sync risks

- **Asset shims go stale silently.** They inline the bytes of `src/assets/*.jpg`. Replace a cover
  image and the previews keep the old one until the shims are regenerated. Regenerate them
  whenever those files change.
- **`DesignFrame` is a hand-copy of the storybook decorator.** If `.storybook/preview.tsx`
  changes — a different default accent, a different frame width — the previews and the oracle
  drift apart and the compare loop will not flag it, because both sides move only if both are
  edited. Keep them in step by hand.
- **Generated `types/` lags the source.** It is emitted from a standalone tsconfig that does not
  load TanStack Router's route registration, so `tsc` exits non-zero on router-typed props
  (auth-ui, program-header, ikan-shell). Emission still happens and the declarations are correct
  for prop extraction, but a real type error in those files would be indistinguishable from the
  router noise.
- **The excluded set is broad.** 56 of 68 discovered titles are off. If someone later splits the
  M3 kit or Blocks story files per component, the new titles inherit no `titleMap` entry and will
  appear automatically — which is the desired behaviour, but it will look like a surprise.

## Where this run stopped (23 Sep 2026)

Setup is complete and working; **verification was paused partway, by choice**. Nothing was
uploaded, so the project `iKAN` (408a3577-7776-4c10-9f1b-572eec699fc2) is empty and
un-anchored — the documented safe state. The next run re-verifies everything from scratch;
it does NOT resume mid-campaign.

Done and reusable:
- build + validate both exit 0 (16 components, 5 non-blocking warnings)
- `DayCard` graded `match` on all 3 stories (`.design-sync/.cache/compare/DayCard.grade.json`,
  gitignored — it will not survive a fresh clone)
- compare sheets captured for IkanShell, ProfilePhoto, StepView — ungraded

### Resume checklist

1. Regenerate the gitignored inputs (commands under "Generated, not committed").
2. Reopen the upload channel — `finalize_plan` again; the old planId is dead.
3. **Fix the capture-height mismatch first — it is global.** Storybook auto-sizes its panel to
   content (e.g. 900x211 for StepView/Lesson) while previews capture a fixed 900x700 viewport.
   Full-height components then behave as they would on a phone: the content area scrolls and the
   sticky footer pins over it, so body text is hidden in the preview and the panels disagree.
   Affects at least StepView, IkanShell, DayCheckIn, Splash. Remedy is
   `cfg.overrides.<Name>.viewport: "WxH"` (tall enough for the story's content) — note this is
   also the size the card renders at in the design tool, and changing it clears grades and needs
   a full rebuild, so batch every viewport decision into ONE cycle.
4. Known per-component work already surfaced by validate:
   - `IkanShell` — `[GRID_OVERFLOW] escape`: stories position content outside their cells.
     Needs `cfg.overrides.IkanShell = {"cardMode": "single", "primaryStory": "Home"}`.
   - `ProfilePhoto` — `[RENDER_THIN]`: its two variants render identically. Needs an owned
     `.design-sync/previews/ProfilePhoto.tsx`.
   - `[STORY_CAP] StepView`: 8 stories, 6 captured. Pass `--max-stories 8` to cover the tail.
5. Then the conventions header (`.design-sync/conventions.md` + `cfg.readmeHeader`) — not yet
   written — and a closing `resync.mjs` run without `--remote` as the receipt.

### Non-issues, so they are not chased again

- `[ASSETS_BLOCKED] this-domain-does-not-exist.example` is a **false positive**. The
  ProfilePhoto "Broken Photo" story uses an unresolvable host deliberately, to exercise the
  fallback. Both panels correctly render the fallback. No sandbox change is needed.
- `[TOKENS_MISSING]` lists 21 vars that are mostly Radix runtime measurements
  (`--radix-*`, `--skeleton-width`): set by the components at runtime, expected to be absent
  from the shipped stylesheets.
- `[FONT_REMOTE] Manrope, Sora` — served from Google Fonts at runtime, same as the app.

---

## 3 October 2026 — what changed

**CSS completeness (the important one).** Tailwind emits a utility only where it sees one used,
so 35 of the 80 `@utility` recipes never reached the compiled stylesheet — including four of the
nine type roles (`type-headline-lg`, `type-body-lg`, `type-body-md`, `type-label-md`). They were
not merely unused, they were **inert**: typing them did nothing, silently, and the design agent
builds from the shipped stylesheet so it could not have used them either.

`src/styles.css` now carries an `@source inline("{…}")` listing every `@utility`. All 80 compile;
the stylesheet went 125 KB → 137 KB (22.6 KB gzipped). **Regenerate that list whenever you add
an `@utility`:**

    node -e 'const fs=require("fs");const s=fs.readFileSync("src/styles.css","utf8");
    console.log([...s.matchAll(/^@utility\s+([a-z0-9-]+)/gm)].map(m=>m[1]).sort().join(","))'

A missing name is invisible — it fails by doing nothing — so this is worth checking on any sync:
compare `@utility` count against the compiled CSS before uploading.

**Error tokens.** `--error`, `--on-error`, `--error-container`, `--on-error-container` added in
oklch with dark overrides, replacing 20 raw hexes (`#B3261E`, `#F9DEDC`, `#8C1D18`, `#5A1410`).
Those had no dark value, so every error state rendered light colours on a dark background.

**New components in scope.** `src/components/kit/` — Chip, Pill, MetricPill, Badge, Disclosure,
Card, Sparkline, ProgressRing, Bars, Dial, EmptyState, SearchField. Added to `entry.tsx`;
checked at authoring time that none of its 32 exports collides with the existing barrel.

**Button grew.** Five sizes (xs–xl), `elevated` and `destructive` variants, `loading`, `full`,
plus a new `Fab`. `lg` stayed the default so no existing call site moved.

**`DesignFrame` drift risk is reduced but not gone.** `sb-config/preview.tsx` re-exports the
app's preview, so the *reference* side can no longer drift. `cfg.provider` → `DesignFrame`
(`preview-frame.tsx`) is still a hand-copy of that decorator, so the *preview* side still can.
If `.storybook/preview.tsx` changes its frame width or default accent, update `preview-frame.tsx`
to match — the compare loop will not catch it, because both panels only move if both are edited.

**Still open at the end of this run.** See the resume checklist above; the capture-height item
(item 3) is still the first thing to settle, and `.design-sync/conventions.md` is still unwritten.
