import { getProgramme, diaryRows } from "./programs";
import type { Step, UI } from "./types";
import type { StepCtx } from "@/components/equip/steps";

/* Real, in-context steps pulled from production content, so the Equip block stories show what
 * the programmes actually contain instead of hand-built fakes. Coordinates found once by walking
 * every programme's days; kept as plain slug/day/id lookups so they stay obvious to update if the
 * content changes. */
const FIXTURES: Record<UI["ui"], { slug: string; day: number; id: string }> = {
  lesson: { slug: "sleep-tight", day: 1, id: "1.1" },
  choice: { slug: "sleep-tight", day: 0, id: "0.2" },
  scale: { slug: "sleep-tight", day: 0, id: "0.3" },
  text: { slug: "sleep-tight", day: 1, id: "1.3" },
  diary: { slug: "sleep-tight", day: 1, id: "1.2" },
  conclude: { slug: "sleep-tight", day: 1, id: "1.conclusion" },
  sort: { slug: "stress-buster", day: 11, id: "11.2" },
  entries: { slug: "sleep-tight", day: 11, id: "11.4" },
  review: { slug: "sleep-tight", day: 12, id: "12.5" },
  tracker: { slug: "sleep-tight", day: 18, id: "18.6" },
  statements: { slug: "unburn", day: 23, id: "23.3" },
};

export function fixtureStep<K extends UI["ui"]>(ui: K) {
  const { slug, day, id } = FIXTURES[ui];
  const programme = getProgramme(slug);
  if (!programme) throw new Error(`Storybook fixture: no programme "${slug}"`);
  const dayObj = programme.days.find((d) => d.day === day);
  const step = dayObj?.steps.find((s) => s.id === id);
  if (!step) throw new Error(`Storybook fixture: step ${slug} day ${day} "${id}" not found`);
  return { programme, day: dayObj!, step: step as Step & { view: Extract<UI, { ui: K }> } };
}

/** A no-op StepCtx for a fixture, with a Storybook-only slug so its saved answers never collide
 * with the real app's localStorage. */
export function fixtureCtx(slug: string, day: number, overrides: Partial<StepCtx> = {}): StepCtx {
  return {
    slug: `storybook.${slug}`,
    day,
    isLast: false,
    onNext: () => {},
    onBack: () => {},
    ...overrides,
  };
}

export const fixtureDiaryRows = (slug: string) => diaryRows(getProgramme(slug)!);
