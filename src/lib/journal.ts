import { createLocalStore, newId } from "@/lib/local-store";

/* The daily mood check-in, carried over from the old iKan Mood Journal
 * (template default-daily-checkin: five steps, mood required). */

export type ScalePoint = { value: number; emoji: string; label: string };

export const moodScale: ScalePoint[] = [
  { value: 1, emoji: "😫", label: "Awful" },
  { value: 2, emoji: "😕", label: "Bad" },
  { value: 3, emoji: "😐", label: "Meh" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

export const energyScale: ScalePoint[] = [
  { value: 1, emoji: "🪫", label: "Exhausted" },
  { value: 2, emoji: "😴", label: "Tired" },
  { value: 3, emoji: "⚡", label: "Moderate" },
  { value: 4, emoji: "💪", label: "Energetic" },
  { value: 5, emoji: "🔥", label: "Charged!" },
];

export const stressScale: ScalePoint[] = [
  { value: 1, emoji: "😌", label: "Chill" },
  { value: 2, emoji: "🤔", label: "Mild" },
  { value: 3, emoji: "😤", label: "Medium" },
  { value: 4, emoji: "😰", label: "High" },
  { value: 5, emoji: "🤯", label: "Yikes!" },
];

export const contextTags = [
  { id: "work", emoji: "💼", label: "Work" },
  { id: "sleep", emoji: "😴", label: "Sleep" },
  { id: "health", emoji: "🏃", label: "Health" },
  { id: "relationships", emoji: "❤️", label: "Relationships" },
  { id: "studies", emoji: "📚", label: "Studies" },
  { id: "finances", emoji: "💰", label: "Finances" },
  { id: "fun", emoji: "🎉", label: "Fun" },
  { id: "other", emoji: "✨", label: "Other" },
];

export const checkinSteps = [
  {
    key: "mood",
    title: "How are you feeling?",
    subtitle: "Tap the emoji that matches your vibe",
    required: true,
  },
  {
    key: "energy",
    title: "What's your energy like?",
    subtitle: "From drained to fully charged",
    required: false,
  },
  {
    key: "stress",
    title: "Stress level?",
    subtitle: "Be honest — there's no wrong answer",
    required: false,
  },
  {
    key: "note",
    title: "Anything on your mind?",
    subtitle: "A quick note to capture this moment",
    required: false,
  },
  {
    key: "tags",
    title: "What shaped your day?",
    subtitle: "Pick whatever applies — or skip to save",
    required: false,
  },
] as const;

export type JournalEntry = {
  id: string;
  /** local calendar day, YYYY-MM-DD */
  date: string;
  createdAt: string;
  mood: number;
  energy?: number;
  stress?: number;
  note?: string;
  tags: string[];
};

export type Draft = Omit<JournalEntry, "id" | "date" | "createdAt">;

const store = createLocalStore<{ entries: JournalEntry[] }>("ikan.journal.v1", { entries: [] });

/** Add entries that aren't here yet (matched by id); used by the import from the old iKan app. */
export const mergeJournalEntries = (incoming: JournalEntry[]) =>
  store.update((s) => {
    const have = new Set(s.entries.map((e) => e.id));
    const fresh = incoming.filter((e) => !have.has(e.id));
    return fresh.length ? { entries: [...s.entries, ...fresh] } : s;
  });

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export function streaks(dates: Set<string>, today = new Date()) {
  let current = 0;
  let cursor = dates.has(dayKey(today)) ? today : addDays(today, -1);
  while (dates.has(dayKey(cursor))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const key of [...dates].sort()) {
    run = prev !== null && key === dayKey(addDays(fromKey(prev), 1)) ? run + 1 : 1;
    best = Math.max(best, run);
    prev = key;
  }
  return { current, best: Math.max(best, current) };
}

export const fromKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
};

export function useJournal() {
  const { entries } = store.use();
  return {
    entries,
    on: (date: string) =>
      entries.filter((e) => e.date === date).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    add: (draft: Draft) => {
      const now = new Date();
      const entry: JournalEntry = {
        id: newId("j"),
        date: dayKey(now),
        createdAt: now.toISOString(),
        ...draft,
      };
      store.update((s) => ({ entries: [...s.entries, entry] }));
      return entry;
    },
    remove: (id: string) =>
      store.update((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
    restore: (entry: JournalEntry) => store.update((s) => ({ entries: [...s.entries, entry] })),
  };
}
