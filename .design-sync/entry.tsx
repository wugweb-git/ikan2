/* Sync entry for claude.ai/design.
 *
 * ikan2 is an app, not a published component library, so there is no dist/ to bundle.
 * This barrel is the library surface we sync: every module the in-scope stories import,
 * which is every App/* and Equip/* component plus the data helpers those stories use.
 * The shadcn kit under src/components/ui is deliberately absent - it is unused by the app.
 *
 * Checked at authoring time: no two of these modules export the same name. */

/* the preview wrapper, mirroring the storybook decorator (see cfg.provider) */
export * from "./preview-frame";

export * from "../src/components/about";
export * from "../src/components/add-to-calendar";
export * from "../src/components/art";
export * from "../src/components/auth-ui";
export * from "../src/components/date-text";
export * from "../src/components/ikan-shell";
export * from "../src/components/info-shell";
export * from "../src/components/made-by";
export * from "../src/components/phone-field";
export * from "../src/components/profile-photo";
export * from "../src/components/result-share";
export * from "../src/components/reveal";
export * from "../src/components/skeleton";
export * from "../src/components/splash";

export * from "../src/components/equip/cards";
export * from "../src/components/equip/day-card";
export * from "../src/components/equip/day-check-in";
export * from "../src/components/equip/m3";
export * from "../src/components/equip/program-header";
export * from "../src/components/equip/steps";

/* the generic primitives: chips, badges, cards, disclosures, charts, empty states, search */
export * from "../src/components/kit/badge";
export * from "../src/components/kit/brand";
export * from "../src/components/kit/card";
export * from "../src/components/kit/chart";
export * from "../src/components/kit/chip";
export * from "../src/components/kit/disclosure";
export * from "../src/components/kit/empty";
export * from "../src/components/kit/link";
export * from "../src/components/kit/status";
export * from "../src/components/kit/search-field";

export * from "../src/components/journal/blocks";
export * from "../src/components/journal/entry-card";

/* Data and helpers the stories reach for.
 *
 * equip/programs and equip/storybook-fixtures are deliberately NOT here: they import the
 * programme cover .jpg files, and the converter's bundle loader map has no .jpg entry
 * (bundle.mjs is app-contract surface, so it must not be forked). They are compiled into
 * each preview instead, via cfg.storyImports.bundle + a .jpg loader. */
export * from "../src/lib/equip/store";
export * from "../src/lib/journal";
export * from "../src/lib/resources";
