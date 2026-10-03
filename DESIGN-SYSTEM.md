# iKAN design system — type, elements, breakpoints

Measured from `src/styles.css` and the compiled stylesheet, 3 October 2026. Every value below
is what the built CSS actually contains, not what the source intends.

## The headline fact about breakpoints

**There is no responsive typography.** Not one type token, size, line-height or weight changes
at any breakpoint. The columns for sm / md / lg below would be identical, so the table gives
one set of values and the breakpoint section says what _does_ change.

What varies instead is the **measure** — the column the type sits in. That is the lever this
app actually pulls, and it is now pulled at two widths rather than one (see Breakpoints).

The whole codebase contains **two** responsive type utilities, and neither resizes anything:
`sm:text-left` (alignment, 4 uses) and `md:text-sm` (2 uses, both inside unused shadcn files).

This is a defensible choice — iKAN is a phone-shaped PWA inside a Capacitor shell, and on a
laptop it renders as a phone-width column rather than a wide layout. But it means "the scale at
each breakpoint" has one answer, not three.

## Type scale — the 9 defined roles

Named on Material 3's roles. Each fixes size, line-height, weight and tracking together, so a
heading is chosen by what it _is_, not by a pixel value. Identical at every breakpoint.

Every role declares its own `letter-spacing`. That is deliberate: `letter-spacing` inherits, so
a role that omits it picks up whatever an ancestor set. Five of the nine used to omit it, and
`type-title-lg` really did render at `+0.01em` under a heading that had set tracking above it.

| Role       | Class              | Family  | Size | Line-height | Weight | Tracking |
| ---------- | ------------------ | ------- | ---- | ----------- | ------ | -------- |
| Headline L | `type-headline-lg` | Sora    | 32px | 40px        | 600    | −0.01em  |
| Headline M | `type-headline-md` | Sora    | 28px | 36px        | 600    | −0.01em  |
| Headline S | `type-headline-sm` | Sora    | 24px | 32px        | 600    | normal   |
| Title L    | `type-title-lg`    | Sora    | 22px | 28px        | 500    | normal   |
| Title M    | `type-title-md`    | Sora    | 16px | 24px        | 600    | +0.01em  |
| Body L     | `type-body-lg`     | Manrope | 16px | 26px        | 400    | normal   |
| Body M     | `type-body-md`     | Manrope | 14px | 21px        | 400    | normal   |
| Label L    | `type-label-lg`    | Manrope | 14px | 20px        | 500    | normal   |
| Label M    | `type-label-md`    | Manrope | 12px | 16px        | 500    | +0.01em  |

Two deviations from M3, both deliberate: Body L uses a 26px line rather than 24px, because
article text is read at length; Title L is weight 500 rather than 400, because Sora is only
loaded from 500 up.

Faces: `--font-display` = Sora (headlines and titles), `--font-sans` = Manrope (body and
labels). Both served from Google Fonts at runtime.

## HTML elements — what `.prose-ikan` actually sets

`.prose-ikan` is the only place the scale is enforced on elements. It governs all article and
legal long-form content.

These rules live in `@layer base`. They have to: unlayered CSS outranks every layered rule
regardless of specificity, and Tailwind compiles `@utility` into `@layer utilities`. While they
sat outside a layer, `<h2 class="type-headline-lg">` inside an article rendered at **24px, not
32** — the class was silently overridden, with nothing in devtools that looks wrong. Unclassed
prose still gets these defaults; an explicit `type-*` on a prose child now wins.

| Element        | Family  | Size    | Line-height | Weight  | Other                                               |
| -------------- | ------- | ------- | ----------- | ------- | --------------------------------------------------- |
| body text      | Manrope | 16px    | 26px        | 400     | colour `foreground` at 88%                          |
| `h2`           | Sora    | 24px    | 32px        | 600     | `margin-top: 1.9em`                                 |
| `h3`           | Sora    | 16px    | 24px        | 600     | `+0.01em`, `margin-top: 1.6em`                      |
| `h1`           | —       | —       | —           | —       | **not styled here** — page titles are set per route |
| `h4` `h5` `h6` | —       | —       | —           | —       | **not defined anywhere**                            |
| `strong`       | inherit | inherit | inherit     | 650     | colour `foreground`                                 |
| `a`            | inherit | inherit | inherit     | inherit | `underline`, offset 3px                             |
| `ul` `ol`      | —       | —       | —           | —       | `padding-left: 1.3em`; disc / decimal               |
| `li`           | inherit | inherit | inherit     | inherit | `+0.4em` between items; marker `muted-foreground`   |
| block spacing  | —       | —       | —           | —       | `1em` between siblings, 0 on the first              |

`h4`–`h6` appear nowhere in the app (one use inside an unused shadcn file). If the article
pipeline ever emits them they will render at browser defaults — Times, unstyled. That is a real
gap rather than a decision.

## Links

Three conventions, no component:

| Treatment                           | Uses | Where                                        |
| ----------------------------------- | ---- | -------------------------------------------- |
| `underline underline-offset-4`      | 12   | inline links in app chrome                   |
| `underline-offset-4` (no underline) | 7    | links that get their underline from a parent |
| `underline underline-offset-2`      | 6    | dense/secondary links                        |
| `underline` + offset 3px            | —    | `.prose-ikan a`, article body                |

Four offsets for one idea. Worth collapsing to one.

## Breakpoints — what genuinely changes

Tailwind v4 defaults, none overridden: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px,
`2xl` 1536px.

Nothing typographic responds to width. The **measure** does:

| At                                          | Rule                 | Effect                                                                  |
| ------------------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| base                                        | `max-w-app`          | column fills the screen                                                 |
| **640px** (`sm`)                            | `max-w-app`          | column caps at `36rem` (576px) — about 72 characters a line             |
| **1024px** (`lg`)                           | `max-w-app`          | column narrows to `30rem` (480px)                                       |
| **1024px** (`lg`)                           | `html, body`         | page background switches to `--canvas`, so the column reads as a device |
| **1024px** (`lg`)                           | `lg:shadow-app`      | the column gains its outer shadow                                       |
| **768px** _or any fine pointer_             | `.splash-phone-only` | the launch screen is replaced by a plain background                     |
| `display-mode: standalone` **under 1024px** | `max-w-app`          | back to full width                                                      |

Two things in that table are easy to misread.

**The 640px step is new, and it fixes a real reading problem.** The column used to stay at 100%
until 1024px, so a 1023px-wide browser window ran 16/26 body text at roughly 125 characters a
line, against a 45–75 ideal. Long measures are hard to read because the eye loses its place on
the return sweep. Every tablet and every desktop window under 1024px hit it.

**The `display-mode` exception is why that band was full width in the first place.** When iKAN
is _installed_ — as an Android app or a PWA on a foldable or tablet — filling the device is
correct, exactly as a native app would. Width alone cannot tell an installed tablet from a
half-maximised laptop window; `display-mode: standalone` can, so the installed case is restored
explicitly and only below 1024px.

**30rem above 1024 is narrower than the 36rem below it, deliberately.** At laptop size the app
presents as a phone on a canvas, which is the product's own idea of itself.

## The gap between the scale and the screens

The scale is enforced for content and freehand for app chrome:

- `type-*` roles: **8 uses**, in 3 files (the article renderer, the assessment UI, delete-account).
- Arbitrary `text-[Npx]`: **869 uses**, across **23 distinct sizes** — 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 24, 26, 28, 30, 32, 34, 40, 44, 57, 60.
- `h1` is drawn at 7 different sizes across 36 route-level headings (32, 30, 28, 26, 24, 22,
  and 3 with no size at all).
- `h2` is drawn at 8 (16, 18, 13, 22, 26, 20, 17, 15).

13px, 15px, 17px, 19px, 21px and 26px have no role. Either they should, or they should round to
one that exists.

Until 3 October 2026 this was worse than drift: Tailwind emits a utility only where it sees one
used, so `type-headline-lg`, `type-body-lg`, `type-body-md` and `type-label-md` were **absent
from the compiled stylesheet entirely** — typing them did nothing, silently. `@source inline()`
in `src/styles.css` now forces all 80 utilities out, so a name either works or does not exist.
