import type { Programme } from "./types";
import type { ProgrammeState } from "./store";

/* What a person has done in one programme: the numbers behind Equip result and history, and the
 * day-by-day answers behind the Learning diary. Mirrors the old app's EquipProgramCompletion
 * (activities, days active, topics covered, journey status) and LearningDiary (program days with
 * responses, plus the mood and assessments logged while the programme ran). */

const answerKey = (b: { key?: string; n: number }, day: number) => b.key ?? `${day}.${b.n}`;
const INTERACTIVE = (ui: string) => ui !== "lesson" && ui !== "conclude";

export type Journey = {
  started: boolean;
  finished: boolean;
  startedAt?: string;
  finishedAt?: string;
  lastAt?: string;
  daysDone: number;
  totalDays: number;
  activitiesDone: number;
  totalActivities: number;
  responses: number;
  topics: string[];
  nextDay: number;
  /** active seconds across finished days */
  seconds: number;
  /** average end-of-day ratings, 1–5, where given */
  helpful: number | null;
  feel: number | null;
};

export function journeyOf(p: Programme, s: ProgrammeState): Journey {
  const done = new Set(s.completed);
  const doneDays = p.days.filter((d) => done.has(d.day));
  const stamps = Object.values(s.completedAt ?? {}).sort();
  let nextDay = 0;
  while (done.has(nextDay)) nextDay += 1;
  const totalActivities = p.days.reduce(
    (n, d) => n + d.steps.filter((st) => INTERACTIVE(st.view.ui)).length,
    0,
  );
  const activitiesDone = doneDays.reduce(
    (n, d) => n + d.steps.filter((st) => INTERACTIVE(st.view.ui)).length,
    0,
  );
  const responses = doneDays.reduce((n, d) => n + dayResponses(p, s, d.day).length, 0);
  const finished = p.days.every((d) => done.has(d.day));
  return {
    started: done.size > 0,
    finished,
    ...(stamps[0] ? { startedAt: stamps[0] } : {}),
    ...(finished && stamps.at(-1) ? { finishedAt: stamps.at(-1)! } : {}),
    ...(stamps.at(-1) ? { lastAt: stamps.at(-1)! } : {}),
    daysDone: doneDays.length,
    totalDays: p.days.length,
    activitiesDone,
    totalActivities,
    responses,
    topics: [
      ...new Set(
        doneDays.map((d) => d.title).filter((t) => t && !/^(assessment|onboarding)$/i.test(t)),
      ),
    ],
    nextDay,
    seconds: doneDays.reduce((n, d) => n + (s.time?.[String(d.day)]?.total ?? 0), 0),
    helpful: avg(doneDays.map((d) => s.feedback?.[String(d.day)]?.helpful)),
    feel: avg(doneDays.map((d) => s.feedback?.[String(d.day)]?.feel)),
  };
}

const avg = (xs: (number | undefined)[]) => {
  const v = xs.filter((x): x is number => typeof x === "number");
  return v.length ? v.reduce((n, x) => n + x, 0) / v.length : null;
};

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export type DayResponse = { title: string; lines: string[] };

const text = (v: unknown) =>
  Array.isArray(v)
    ? v.join(", ")
    : typeof v === "boolean"
      ? v
        ? "Yes"
        : "No"
      : v === null || v === undefined
        ? ""
        : String(v);

/** Everything written or chosen on one day, block by block, in the order the day runs. */
export function dayResponses(p: Programme, s: ProgrammeState, dayNumber: number): DayResponse[] {
  const day = p.days.find((d) => d.day === dayNumber);
  if (!day) return [];
  const out: DayResponse[] = [];
  const answers = s.answers;
  for (const step of day.steps) {
    const v = step.view;
    const k = answerKey(step.block, dayNumber);
    const lines: string[] = [];
    switch (v.ui) {
      case "choice": {
        const a = text(answers[k]);
        if (a) lines.push(a);
        const other = text(answers[`${k}#other`]);
        if (other) lines.push(other);
        break;
      }
      case "scale":
        if (typeof answers[k] === "number")
          lines.push(`${answers[k]} on a scale of ${v.min} to ${v.max}`);
        break;
      case "text":
        if (text(answers[k])) lines.push(text(answers[k]));
        break;
      case "conclude":
        if (text(answers[`${k}@${dayNumber}`])) lines.push(text(answers[`${k}@${dayNumber}`]));
        break;
      case "statements":
        for (const st of v.statements) {
          const a = text(answers[`${k}:${st}`]);
          if (a) lines.push(`${st}: ${a}`);
        }
        break;
      case "sort":
        for (const item of v.items)
          for (const line of item.lines) {
            const a = text(answers[`${k}:${item.situation}:${line}`]);
            if (a) lines.push(`${line}: ${a}`);
          }
        break;
      case "entries":
      case "review": {
        const fields = v.ui === "entries" ? v.fields : [...(v.addFields ?? []), ...v.fields];
        for (const e of s.collections[v.collection] ?? []) {
          if (e.day !== dayNumber) continue;
          const parts = fields
            .map((f) => {
              const val = text(e.values[f.key]);
              return val ? (f.label ? `${f.label}: ${val}` : val) : "";
            })
            .filter(Boolean);
          if (parts.length) lines.push(parts.join(" · "));
        }
        break;
      }
      case "tracker": {
        const t = s.tracker[String(dayNumber)] ?? {};
        const ticked = Object.values(t).filter(Boolean).length;
        if (ticked) lines.push(`${ticked} ticked off`);
        break;
      }
      case "diary":
        if (s.diary[String(dayNumber)]) lines.push("Sleep diary filled in");
        break;
      default:
        break;
    }
    if (lines.length) out.push({ title: step.block.title, lines });
  }
  return [...out, ...(s.legacy?.[String(dayNumber)] ?? [])];
}

/** The assessment that measures what each programme works on, for "see how things have changed". */
export const relatedAssessment: Record<string, string> = {
  "sleep-tight": "struggling-with-quality-sleep",
  unburn: "feeling-drained-and-burned-out",
  "stress-buster": "feeling-worried-and-stressed",
};

export type Run = Journey & { state: ProgrammeState };

/** Finished runs of a programme, newest first. A run still in progress is never part of history. */
export function completedRuns(p: Programme, s: ProgrammeState): Run[] {
  const current = journeyOf(p, s);
  const archived = (s.runs ?? []).map((r) => ({ ...journeyOf(p, r), state: r }));
  return [...(current.finished ? [{ ...current, state: s }] : []), ...archived];
}

/** The run a result or diary should show: a finished run by index (0 is the latest), else the one
 * in progress, else the latest finished one. */
export function latestRun(p: Programme, s: ProgrammeState, run?: number): ProgrammeState {
  if (run !== undefined && s.runs?.[run]) return s.runs[run]!;
  return s.completed.length ? s : (s.runs?.[0] ?? s);
}

/** Search param for a specific finished run: ?run=0 is the latest. */
export const runParam = (v: unknown) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : undefined;
};
