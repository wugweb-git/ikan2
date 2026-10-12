import type { Assessment } from "./instruments";
import {
  recommendationsFor,
  riskEndorsed,
  scoreAll,
  type Answers,
  type ScoreResult,
} from "./scoring";
import type { StoredResult } from "./store";

/* A finished assessment is a record. Its scores, bands, wording, recommendations and risk flag are
 * worked out once, when it is saved (or, for results saved before this existed, the first time
 * this device sees them), and stored on the result as its snapshot. From then on every screen
 * reads the snapshot: changing an instrument's bands, labels or recommendations later never
 * changes a result someone already has. */

export type ResultSnapshot = {
  at: string;
  /** every score as it was worked out, with its profile and band copied in */
  scores: ScoreResult[];
  /** the score shown as the result; null when the assessment has none */
  headline: string | null;
  /** Equip programmes recommended, strongest first */
  recommends: string[];
  /** a self-harm item answered above its lowest option */
  risk: boolean;
};

export function snapshotOf(a: Assessment, answers: Answers): ResultSnapshot {
  const scores = scoreAll(a, answers);
  return {
    at: new Date().toISOString(),
    // a deep copy, so later edits to the instrument objects can't reach into it
    scores: JSON.parse(JSON.stringify(scores)) as ScoreResult[],
    headline: a.headline ?? null,
    recommends: recommendationsFor(a, scores),
    risk: riskEndorsed(a, answers),
  };
}

export type Frozen = {
  scores: ScoreResult[];
  head: ScoreResult | null;
  recommends: string[];
  risk: boolean;
};

/** A result as it was when it was finished. A result not sealed yet is worked out the same way
 * once, until the store seals it. */
export function frozen(a: Assessment, r: StoredResult): Frozen {
  const s = r.snapshot ?? snapshotOf(a, r.answers);
  return {
    scores: s.scores,
    head: s.headline ? (s.scores.find((x) => x.score.id === s.headline) ?? null) : null,
    recommends: s.recommends,
    risk: s.risk,
  };
}
