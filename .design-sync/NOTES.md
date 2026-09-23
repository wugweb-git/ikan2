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
