# Resources: the style map

Every resource (article, video, audio) is built from the same parts, and every part has one
style. This is the map from each part to its markup and to the CSS that draws it, so a new piece
looks like the rest without anyone choosing a font size.

- **Content** lives in `src/lib/content/articles.json` (body, author, standfirst) and
  `src/lib/resources.ts` (title, category, date, length, cover, links into the app).
- **Styles** live in `src/styles.css` under `.prose-ikan`, and every text style there is one of
  the app's type roles (`@utility type-*` in the same file), applied with `@apply`. No font size
  is written by hand.
- **The checker**, `bun run check:resources` (`scripts/check-resources.ts`), fails CI when a body
  uses anything not in this map. Content questions (read time, standfirst) are reported for the
  author, never changed by it.

## The page around the article (`src/routes/resources.$slug.tsx`)

| Part                                   | Comes from                                                      | Style                                                                                   |
| -------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Category eyebrow                       | `resource.category`                                             | `type-body-sm` semibold, accent strong                                                  |
| Title (h1)                             | `resource.title`, Title Case, no closing full stop              | `type-headline-md`                                                                      |
| Standfirst                             | `article.description`, one or two sentences                     | `type-title-lg` medium, muted                                                           |
| Meta row: author, date, medium, length | `article.author`, `resource.date`, `resource.minutes`           | `type-label-lg`, muted, lucide icons                                                    |
| Cover                                  | `resource.art`, one scene per resource, in `components/art.tsx` | `Illustration`; a webp copy at `public/resources/covers/<slug>.webp`                    |
| Player (video, audio)                  | `resource.src`, `resource.poster`                               | `MediaPlayer`                                                                           |
| Source of a video or audio piece       | `resource.source`                                               | `SourceCard`: 20px secondary card, `type-title-md` name                                 |
| Keep reading                           | same category or cover                                          | `type-title-lg` heading; each item is `ResourceRow`, the same row as the Resources list |

## A resource on a card: row and block (`src/routes/resources.index.tsx`)

Every card that lists a resource has the same schema: a cover, the category eyebrow
(`type-label-md` semibold, accent strong), the title (15/20 semibold), then `ResourceMeta`, one
line in `type-label-md`, muted. Two views of it:

| View                                                     | Where                        | Cover                                                                                                               |
| -------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Row (`ResourceRow`, stacked beside the cover, with save) | Resources list, Keep reading | 84px square, 16px corners                                                                                           |
| Block (cover on top, 240px wide)                         | Home, From the library       | 132px tall, 20px card                                                                                               |
| Featured (text over the cover)                           | Resources carousel           | full card; the first card carries a top-left "Latest" or "Featured" badge, beside its category, never instead of it |

`ResourceMeta`, the one meta line, never wraps:

| State                   | Meta line                                                            |
| ----------------------- | -------------------------------------------------------------------- |
| Not started             | 📅 date · type (Read / Watch / Listen) · length                      |
| Part way (video, audio) | 📅 date · type · **time left** in an accent pill                     |
| Finished                | 📅 date · **✓ Read / Watched / Listened** in an accent pill · length |

- Dates are `cardDate`: **12 Oct '26** on every card (fixed month names, so September is "Sep").
- On a narrow phone the type word gives way with an ellipsis, down to its icon; the date and the
  length always show in full.
- An article is finished when someone scrolls down to its end; a piece that fits on one screen
  when its end has stayed in view for 1.5s (`markRead`). Files and YouTube embeds report how far
  they have played (`markPlayed`); finished stays finished.
- Analytics (GA4, `src/lib/analytics.ts`): `resource_open`, `resource_scroll` at 25/50/75/100%
  of the text, `resource_read` once finished, each with the medium and length. The piece itself
  (`resource`, its slug) is sent only for General and Work-Life: what someone reads about a
  condition is health information.
- Saved is a filled bookmark in the accent, unsaved an outline.
- The carousel and Home both open on the newest piece, then the featured ones.

## The article body (`.prose-ikan`, from `articles.json`)

| Part                                  | Markup                                                                                                                                                                                           | Style                                                                                                                                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Body copy                             | `<p>`                                                                                                                                                                                            | `type-body-lg` (16/26), foreground at 88%                                                                                                                                                                             |
| Bold                                  | `<strong>`                                                                                                                                                                                       | weight 650, foreground                                                                                                                                                                                                |
| Section heading                       | `<h2>`, sentence case, no full stop                                                                                                                                                              | `type-headline-sm` (24/32)                                                                                                                                                                                            |
| Sub-heading, only under an h2         | `<h3>`                                                                                                                                                                                           | `type-title-md` (16/24, display face)                                                                                                                                                                                 |
| Lists                                 | `<ul>` / `<ol>`; a "Label: text" item leads with `<strong>Label:</strong>`                                                                                                                       | body copy, muted markers                                                                                                                                                                                              |
| Picture (illustration, infographic)   | `<figure><a href><img src width height loading="lazy" alt></a>[<figcaption>]</figure>`                                                                                                           | full width, 16px corners; caption `type-label-md`, muted                                                                                                                                                              |
| Graph                                 | `<figure class="chart">` with `figcaption.chart-title`, `<ol>` of `li[style="--v:share"]` (`.is-key` for the row to look at) holding `.bar-label`, `.bar-value`, `.bar > i`, then `p.chart-note` | 20px secondary card; title `type-title-md`; label `type-label-lg`; value `type-action`; bar = the programme progress bar (`--accent` on `--accent-container`, `--accent-strong` for the key row); note `type-body-sm` |
| Score table                           | `<table>` of three columns: score, band, what next                                                                                                                                               | a card per row: `type-label-md` "Score", `type-label-lg` score, `type-title-md` band, `type-body-md` next steps                                                                                                       |
| Data table                            | `<table class="data-table">` with `<thead>`, `data-label` on every cell after the first                                                                                                          | a card per row: `type-title-md` row name, each cell `type-body-md` under its `type-label-md` column name                                                                                                              |
| Sources (after External, always last) | `<section class="sources"><h2>Sources</h2>[<h3>]<ul><li><strong>Who (year).</strong> <a>Title</a>. Details.</li></ul>[<p>]</section>`                                                            | 20px secondary card like `SourceCard`; eyebrow `type-label-md` caps with the info icon; list `type-body-sm` italic, muted; lead 500 upright foreground; group heading `type-body-sm` semibold                         |
| Link that leaves iKAN                 | `<a href="https://…" target="_blank" rel="noopener noreferrer">Words<span class="sr-only"> (opens in a new tab)</span></a>`                                                                      | underlined, ends in the ↗ arrow (the `ExternalLink` rule in `kit/link.tsx`); words as the link text, never a web address                                                                                              |

## External: links into the app (`src/routes/resources.$slug.tsx`)

After the article body and before Sources, with no heading of its own. Which sections a piece
shows is set on the resource by the editors, never guessed; for now only assessments are set.

**Deferred:** the programme, journal and consult sections are meant to be filled by the
recommendation engine (it worked in the old iKAN and does not yet in ikan2). Until it is fixed
they stay off; the fields and cards are wired so that only the source of the choice changes. Each uses the card that place already uses, with a
`type-body-sm` semibold accent label above it.

| Section         | Set by                                     | Card (reused as is)                            | Label                                                                       |
| --------------- | ------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------- |
| Assessment      | `resource.assessment` (+ `assessmentRole`) | `StackedAssessmentCard`, title `type-title-lg` | "The test this article explains" / "The fuller test this article points to" |
| Equip programme | `resource.programme`                       | `ProgrammeCard` from the Programs list         | "A programme that works on this"                                            |
| Mood journal    | `resource.journal`                         | `MoodCheckinCard`, Home's check-in             | "Keep track of how you feel"                                                |
| Consult         | `resource.consult`                         | `SupportCard`, Home's "Let's talk about it"    | "Talk it through with someone"                                              |

## Adding a resource

1. Body in `articles.json` using only the parts above; listing in `resources.ts` with a new `art`
   scene and its cover webp; the External sections the editors ask for.
2. Graphs are rebuilt as chart cards; only illustrations and infographics stay pictures.
3. `bun run check:resources`, then look at it on a phone width before pushing.
