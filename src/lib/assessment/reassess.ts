import type { StoredResult } from "@/lib/assessment/store";
import type { JournalEntry } from "@/lib/journal";
import type { ProgrammeState } from "@/lib/equip/store";
import { programmes } from "@/lib/equip/programs";
import { scopedKey } from "@/lib/storage-scope";

/* When to ask someone to retake an assessment. Ported from the old iKan app
 * (src/lib/reassessment-triggers.ts), checked in the same order:
 *
 *  1. time     14 days or more since the last assessment
 *  2. mood     the last 5 check-ins all low mood (≤ 2) or all high stress (≥ 4),
 *              or the latest mood 2+ points below the average of the 4 before it
 *  3. program  a programme finished in the last 3 days, with no assessment since
 *
 * Nothing triggers before a first assessment. "Not now" hides the prompt for 24 hours.
 * (The old app's programme check-in trigger has no counterpart here: there are no check-ins.) */

export type ReassessReason = "time" | "mood" | "program";

const DAY = 86_400_000;
export const RETAKE_AFTER_DAYS = 14;

export function reassessReason(
  results: StoredResult[],
  journal: JournalEntry[],
  states: Record<string, ProgrammeState>,
  now = Date.now(),
): ReassessReason | null {
  const last = [...results].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
  if (!last) return null;
  const lastAt = new Date(last.completedAt).getTime();

  if ((now - lastAt) / DAY >= RETAKE_AFTER_DAYS) return "time";

  const moods = [...journal].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (moods.length >= 5) {
    const last5 = moods.slice(0, 5);
    if (last5.every((e) => e.mood_rating <= 2) || last5.every((e) => (e.stress_level ?? 0) >= 4))
      return "mood";
    const baseline = moods.slice(1, 5).reduce((n, e) => n + e.mood_rating, 0) / 4;
    if (moods[0]!.mood_rating <= baseline - 2) return "mood";
  }

  for (const p of programmes) {
    const finished = states[p.slug]?.runs?.[0]?.archivedAt;
    if (!finished) continue;
    const at = new Date(finished).getTime();
    if ((now - at) / DAY < 3 && at > lastAt) return "program";
  }
  return null;
}

export const reassessCopy: Record<ReassessReason, string> = {
  time: "It’s been two weeks since your last assessment. See how things have changed.",
  mood: "Your recent check-ins have been harder. A quick re-check can help you see where you are.",
  program: "You’ve just finished a program. See how things have changed since you started.",
};

/** For one assessment's retake button: whether a retake is due, and from when. */
export function retakeTiming(latest: StoredResult | undefined, now = Date.now()) {
  if (!latest) return { due: true, from: null as Date | null, days: 0 };
  const at = new Date(latest.completedAt).getTime();
  const days = Math.floor((now - at) / DAY);
  return {
    due: days >= RETAKE_AFTER_DAYS,
    from: new Date(at + RETAKE_AFTER_DAYS * DAY),
    days,
  };
}

const DISMISS_KEY = () => scopedKey("ikan.reassess-dismissed");

export const reassessDismissed = (now = Date.now()) => {
  try {
    const v = Number(window.localStorage.getItem(DISMISS_KEY()));
    return Boolean(v) && now - v < DAY;
  } catch {
    return false;
  }
};

export const dismissReassess = () => {
  try {
    window.localStorage.setItem(DISMISS_KEY(), String(Date.now()));
  } catch {
    /* storage unavailable */
  }
};
