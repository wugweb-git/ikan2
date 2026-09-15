import { useSyncExternalStore } from "react";
import type { DiaryEntry } from "./metrics";
import type { EntryValues } from "./types";
import { onScopeChange, reportWrite, scopedKey } from "@/lib/storage-scope";

/* Per-programme progress, kept in localStorage (no accounts yet).
 * Hydration-safe: the server and first client render see EMPTY. */

export type Entry = { id: string; day: number; createdAt: string; values: EntryValues };

export type SessionFeedback = {
  helpful?: number;
  feel?: number;
  tags?: string[];
  note?: string;
  at: string;
};

/** A finished run, kept whole so history, results and diaries can show it after the programme
 * goes back to its default state. */
export type ArchivedRun = Omit<ProgrammeState, "runs"> & { archivedAt: string };

export type ProgrammeState = {
  /** finished runs, newest first */
  runs?: ArchivedRun[];
  completed: number[];
  /** day → ISO time it was completed (days finished before this field existed have none) */
  completedAt?: Record<string, string>;
  /** choice, scale and reflect answers, keyed by step key (reflections are per day: `${key}@${day}`) */
  answers: Record<string, string | string[] | number>;
  collections: Record<string, Entry[]>;
  /** sleep diary per programme day */
  diary: Record<string, DiaryEntry>;
  /** habit tracker: day → entry id → done */
  tracker: Record<string, Record<string, boolean>>;
  /** active time, in seconds: day → total and per step (step id → seconds) */
  time?: Record<string, { total: number; steps: Record<string, number> }>;
  /** end-of-day check: how helpful the session was and how the person feels after it (both 1–5) */
  feedback?: Record<string, SessionFeedback>;
  /** answers imported from the old iKan app, which can't be matched to today's steps: day → blocks */
  legacy?: Record<string, { title: string; lines: string[] }[]>;
};

const EMPTY: ProgrammeState = {
  completed: [],
  answers: {},
  collections: {},
  diary: {},
  tracker: {},
};

const keyFor = (slug: string) => scopedKey(`ikan.equip.${slug}.v2`);
const cache = new Map<string, ProgrammeState>();
const listeners = new Set<() => void>();

/* Each programme's day numbers, registered by programs.ts, so a finished run can be recognised
 * here without importing the programme content. */
const programmeDays = new Map<string, number[]>();
export const registerProgrammeDays = (slug: string, days: number[]) =>
  programmeDays.set(slug, days);

/** When every day is done, the run moves into `runs` and the programme starts fresh. */
function archiveIfFinished(slug: string, s: ProgrammeState): ProgrammeState {
  const days = programmeDays.get(slug);
  if (!days?.length || !days.every((d) => s.completed.includes(d))) return s;
  const { runs = [], ...run } = s;
  const archivedAt =
    Object.values(s.completedAt ?? {})
      .sort()
      .at(-1) ?? new Date().toISOString();
  return { ...EMPTY, runs: [{ ...run, archivedAt }, ...runs] };
}

function read(slug: string): ProgrammeState {
  const hit = cache.get(keyFor(slug));
  if (hit) return hit;
  if (typeof window === "undefined") return EMPTY;
  let state = EMPTY;
  try {
    const raw = window.localStorage.getItem(keyFor(slug));
    if (raw) state = { ...EMPTY, ...(JSON.parse(raw) as Partial<ProgrammeState>) };
  } catch {
    /* unreadable storage — start fresh */
  }
  const normalised = archiveIfFinished(slug, state);
  if (normalised !== state) {
    try {
      window.localStorage.setItem(keyFor(slug), JSON.stringify(normalised));
      reportWrite(keyFor(slug));
    } catch {
      /* keep in memory */
    }
  }
  cache.set(keyFor(slug), normalised);
  return normalised;
}

function write(slug: string, incoming: ProgrammeState) {
  const next = archiveIfFinished(slug, incoming);
  cache.set(keyFor(slug), next);
  try {
    window.localStorage.setItem(keyFor(slug), JSON.stringify(next));
  } catch {
    /* storage unavailable — keep in memory for this session */
  }
  reportWrite(keyFor(slug));
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key?.includes(".equip.")) {
      cache.clear();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  const offScope = onScopeChange(() => {
    cache.clear();
    listener();
  });
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    offScope();
  };
}

/** Read a programme's state outside React. */
export const readProgramme = (slug: string) => read(slug);

/** Change a programme's state outside React; used by the import from the old iKan app. */
export const updateProgramme = (slug: string, fn: (s: ProgrammeState) => ProgrammeState) =>
  write(slug, fn(read(slug)));

const newId = () => `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export function useProgramme(slug: string) {
  const state = useSyncExternalStore(
    subscribe,
    () => read(slug),
    () => EMPTY,
  );
  const update = (fn: (s: ProgrammeState) => ProgrammeState) => write(slug, fn(read(slug)));

  let next = 0;
  while (state.completed.includes(next)) next += 1;

  return {
    state,
    /** the next day the user can open; every earlier day is complete */
    nextDay: next,
    entries: (collection: string) => state.collections[collection] ?? [],
    setAnswer: (key: string, value: string | string[] | number) =>
      update((s) => ({ ...s, answers: { ...s.answers, [key]: value } })),
    addEntry: (collection: string, values: EntryValues, day: number) => {
      const entry: Entry = { id: newId(), day, createdAt: new Date().toISOString(), values };
      update((s) => ({
        ...s,
        collections: {
          ...s.collections,
          [collection]: [...(s.collections[collection] ?? []), entry],
        },
      }));
      return entry;
    },
    patchEntry: (collection: string, id: string, patch: EntryValues) =>
      update((s) => ({
        ...s,
        collections: {
          ...s.collections,
          [collection]: (s.collections[collection] ?? []).map((e) =>
            e.id === id ? { ...e, values: { ...e.values, ...patch } } : e,
          ),
        },
      })),
    removeEntry: (collection: string, id: string) =>
      update((s) => ({
        ...s,
        collections: {
          ...s.collections,
          [collection]: (s.collections[collection] ?? []).filter((e) => e.id !== id),
        },
      })),
    saveDiary: (day: number, entry: DiaryEntry) =>
      update((s) => ({ ...s, diary: { ...s.diary, [String(day)]: entry } })),
    setTracked: (day: number, id: string, done: boolean) =>
      update((s) => ({
        ...s,
        tracker: { ...s.tracker, [String(day)]: { ...s.tracker[String(day)], [id]: done } },
      })),
    complete: (day: number) =>
      update((s) =>
        s.completed.includes(day)
          ? s
          : {
              ...s,
              completed: [...s.completed, day].sort((a, b) => a - b),
              completedAt: { ...s.completedAt, [String(day)]: new Date().toISOString() },
            },
      ),
    /** add active seconds to a day and one of its steps */
    addTime: (day: number, stepId: string, seconds: number) =>
      seconds > 0 &&
      update((s) => {
        const key = String(day);
        const cur = s.time?.[key] ?? { total: 0, steps: {} };
        return {
          ...s,
          time: {
            ...s.time,
            [key]: {
              total: cur.total + seconds,
              steps: { ...cur.steps, [stepId]: (cur.steps[stepId] ?? 0) + seconds },
            },
          },
        };
      }),
    saveFeedback: (day: number, fb: Omit<SessionFeedback, "at">) =>
      update((s) => ({
        ...s,
        feedback: { ...s.feedback, [String(day)]: { ...fb, at: new Date().toISOString() } },
      })),
    /** cancel the run in progress; finished runs are kept */
    reset: () => write(slug, { ...EMPTY, ...(state.runs ? { runs: state.runs } : {}) }),
  };
}
