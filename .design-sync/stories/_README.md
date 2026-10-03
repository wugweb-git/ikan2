# Sync stories

One story file per component, each with its own Storybook title, used **only** by the sync's
Storybook (`.design-sync/sb-config`) and never by the app's.

They exist because the converter resolves a story title right-to-left to the first segment that
is a bundle export. The app's own stories group many components under one title — `Equip/M3 kit`
covers twenty — so the converter can only ever map one component per title, and `cfg.titleMap`
keys on the resolved name, which cannot tell `UI kit/Badge` apart from `Kit/Badge`.

Giving the sync its own glob solves both: it sees one title per component, and nothing under
`src/components/ui` at all. The app's `.storybook/` is untouched.

Keep these in step with the component APIs. A story here that no longer compiles is a real
signal — the component's props changed.
