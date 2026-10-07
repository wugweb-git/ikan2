import { journeyOf } from "./journey";
import { programmes } from "./programs";
import { sealRuns, type ArchivedRun, type RunSnapshot } from "./store";
import { programmeHighlights, programmeSummary } from "./summary";
import type { Programme } from "./types";

/* A finished programme is a record. Its result is computed once, when the run is finished (or the
 * first time this device sees a finished run without one), and stored on the run as its snapshot.
 * From then on the result screen and history show the snapshot and never recompute it. */

export const snapshotOf = (p: Programme, run: ArchivedRun): RunSnapshot => ({
  at: new Date().toISOString(),
  journey: journeyOf(p, run),
  summary: programmeSummary(p, run),
  highlights: programmeHighlights(p, run),
});

/** Seal this programme's finished runs that have no snapshot yet. */
export const sealProgramme = (p: Programme) => sealRuns(p.slug, (run) => snapshotOf(p, run));

/** Seal every programme's finished runs that have no snapshot yet. */
export const sealAllProgrammes = () => programmes.forEach(sealProgramme);
