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

16 components: 10 App, 5 Equip blocks, 1 journal. 56 title segments are excluded by
`cfg.titleMap` nulls.

Two reasons for exclusion, and they are different:
1. The shadcn kit under `src/components/ui` — the user's call; it is dead code in the app.
   Note that `UI kit/Button`, `Avatar`, `Label` and `Switch` were *silently pairing to the M3
   components of the same name* before they were excluded. Any future re-inclusion must handle
   that collision.
2. Story files covering several components under one title — `Equip/M3 kit`, `Equip/Blocks`,
   `App/Journal/Blocks`, `Equip/Testing fixes`, `App/About`, `App/Art`, `App/AuthUI`,
   `App/ResultShare`. The converter maps one component per title, so these cannot be split
   without splitting the story files. The user chose to leave them out.

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
