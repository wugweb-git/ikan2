import { useSyncExternalStore } from "react";
import type { DiaryEntry } from "./metrics";
import type { EntryValues } from "./types";

/* Per-programme progress, kept in localStorage (no accounts yet).
 * Hydration-safe: the server and first client render see EMPTY. */

export type Entry = { id: string; day: number; createdAt: string; values: EntryValues };

export type ProgrammeState = {
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
};

const EMPTY: ProgrammeState = {
  completed: [],
  answers: {},
  collections: {},
  diary: {},
  tracker: {},
};

const keyFor = (slug: string) => `ikan.equip.${slug}.v2`;
const cache = new Map<string, ProgrammeState>();
const listeners = new Set<() => void>();

function read(slug: string): ProgrammeState {
  const hit = cache.get(slug);
  if (hit) return hit;
  if (typeof window === "undefined") return EMPTY;
  let state = EMPTY;
  try {
    const raw = window.localStorage.getItem(keyFor(slug));
    if (raw) state = { ...EMPTY, ...(JSON.parse(raw) as Partial<ProgrammeState>) };
  } catch {
    /* unreadable storage — start fresh */
  }
  cache.set(slug, state);
  return state;
}

function write(slug: string, next: ProgrammeState) {
  cache.set(slug, next);
  try {
    window.localStorage.setItem(keyFor(slug), JSON.stringify(next));
  } catch {
    /* storage unavailable — keep in memory for this session */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key?.startsWith("ikan.equip.")) {
      cache.clear();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

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
    reset: () => write(slug, EMPTY),
  };
}
