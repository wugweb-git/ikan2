import {
  profiles,
  type Assessment,
  type Band,
  type Profile,
  type Question,
  type Score,
  type Severity,
} from "./instruments";

export type Answers = Record<string, number>;

export type ScoreResult = {
  score: Score;
  profile: Profile;
  /** null when an answer is missing: a score with a gap is not shown as a number */
  value: number | null;
  band: Band | null;
  answered: number;
  expected: number;
};

const severityOrder: Severity[] = ["minimal", "mild", "moderate", "moderately-severe", "severe"];

/** Option prefixes ("1 ", "0 - ") are how the spec numbers answers; people see the words. */
export const optionLabel = (text: string) => text.replace(/^\d+\s*(?:-\s+)?/, "");

function weight(a: Assessment, question: Question, value: number) {
  if (!question.reversed) return value;
  const values = a.scales[question.scale]!.options.map((o) => o.value);
  return Math.min(...values) + Math.max(...values) - value;
}

/** `min ≤ x < max`, except the last band, which closes at both ends. */
export function bandFor(profile: Profile, value: number): Band | null {
  const { bands } = profile;
  return (
    bands.find(
      (band, i) =>
        value >= band.min && (i === bands.length - 1 ? value <= band.max : value < band.max),
    ) ?? null
  );
}

export function scoreAll(a: Assessment, answers: Answers): ScoreResult[] {
  return a.scores.map((score) => {
    const profile = profiles[score.profile]!;
    const items = a.questions.filter((qq) => qq.scores.includes(score.id));
    const given = items.filter((qq) => typeof answers[qq.id] === "number");
    let value: number | null = null;
    if (given.length === items.length && items.length > 0) {
      const sum = items.reduce((n, qq) => n + weight(a, qq, answers[qq.id]!), 0);
      value =
        profile.calc === "mean" ? sum / items.length : profile.calc === "sum4" ? sum * 4 : sum;
    }
    return {
      score,
      profile,
      value,
      band: value === null ? null : bandFor(profile, value),
      answered: given.length,
      expected: items.length,
    };
  });
}

/** Where a value sits in its instrument's own range, floor included (sleep 24 of 8–40 is 50%). */
export const percentOfRange = (profile: Profile, value: number) =>
  Math.max(0, Math.min(1, (value - profile.min) / (profile.max - profile.min)));

export const formatValue = (profile: Profile, value: number) =>
  profile.calc === "mean" ? value.toFixed(2) : String(Math.round(value));

export function headlineOf(a: Assessment, results: ScoreResult[]) {
  return a.headline ? (results.find((r) => r.score.id === a.headline) ?? null) : null;
}

/** Equip programmes for this result, strongest first. General recommends Stress Buster
 * whenever any of its five scores lands at mild or above. */
export function recommendationsFor(a: Assessment, results: ScoreResult[]): string[] {
  if (a.category === "general") {
    const any = results.some((r) => r.band && severityOrder.indexOf(r.band.severity) >= 1);
    return any ? ["stress-buster"] : [];
  }
  const head = headlineOf(a, results);
  return head?.band ? (a.recommends[head.band.label] ?? []) : [];
}

/** A self-harm item answered above its own lowest option. */
export function riskEndorsed(a: Assessment, answers: Answers) {
  return a.questions.some((qq) => {
    if (!qq.risk) return false;
    const v = answers[qq.id];
    if (typeof v !== "number") return false;
    const floor = Math.min(...a.scales[qq.scale]!.options.map((o) => o.value));
    return v > floor;
  });
}
