import { getProgramme } from "@/lib/equip/programs";
import type { Entry, ProgrammeState } from "@/lib/equip/store";
import type { Step } from "@/lib/equip/types";

/* What the person answered before, so later days can offer it back as a quick pick. */

const keyOf = (b: Step["block"], day: number) => b.key ?? `${day}.${b.n}`;
const promptOf = (s: Step) => ("prompt" in s.view ? (s.view.prompt ?? "") : "");

/** Answers to the same question (same title and prompt) on earlier days, newest first. */
export function earlierAnswers(
  slug: string,
  state: ProgrammeState,
  step: Step,
  day: number,
  limit = 3,
) {
  const p = getProgramme(slug);
  if (!p) return [];
  const here = keyOf(step.block, day);
  const out: unknown[] = [];
  for (const d of [...p.days].filter((x) => x.day < day).sort((a, b) => b.day - a.day)) {
    for (const s of d.steps) {
      if (s.view.ui !== step.view.ui || s.block.title !== step.block.title) continue;
      if (promptOf(s) !== promptOf(step)) continue;
      const k = keyOf(s.block, d.day);
      if (k === here) continue;
      const v = state.answers[step.view.ui === "conclude" ? `${k}@${d.day}` : k];
      if (v === undefined || v === "" || (Array.isArray(v) && !v.length)) continue;
      if (!out.some((o) => JSON.stringify(o) === JSON.stringify(v))) out.push(v);
    }
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

/** Earlier values typed into one field of a collection, newest first, short ones only. */
export function earlierFieldValues(entries: Entry[], field: string, limit = 3) {
  return [...entries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((e) => e.values[field])
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0 && v.length <= 80)
    .filter((v, i, all) => all.indexOf(v) === i)
    .slice(0, limit);
}
