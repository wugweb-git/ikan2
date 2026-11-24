<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- `/services` was deleted on 3 October 2026 on the owner's instruction. Do not rebuild it; the
  earlier rule to keep it public no longer applies.
- Keep marketing demonstrations sourced from existing assessment, programme, journal, resource, and consultant data, so published claims remain aligned with the app.
- Write every Resources article from the shared building blocks in `src/lib/content/RESOURCES.md` (enforced by `scripts/check-resources.ts`) (headings, lists, chart cards, data tables, the sources card, pictures, outside links), and run `bun run check:resources` before pushing; CI fails on anything outside that vocabulary.
