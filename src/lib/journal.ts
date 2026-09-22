import { useEffect } from "react";
import { createLocalStore, newId } from "@/lib/local-store";

/* The daily Mood Journal check-in: one template of 8 blocks built on 7 scales, following the
 * iKan backend's config (kv_store_cc205da9). Mood is 5 separate rows there (`mood:{id}`); every
 * other scale is one array row (`checkin_scale:<key>`). Answers are saved under the template's
 * "saved as" names. */

export type ScalePoint = { value: number; emoji: string; label: string };
export type Tag = { id: string; emoji: string; label: string };

/** `mood:{id}` × 5, one object row each */
export const moodScale: ScalePoint[] = [
  { value: 1, emoji: "😫", label: "Awful" },
  { value: 2, emoji: "😕", label: "Bad" },
  { value: 3, emoji: "😐", label: "Meh" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

/** `checkin_scale:sleep` */
export const sleepScale: ScalePoint[] = [
  { value: 1, emoji: "😩", label: "Terrible" },
  { value: 2, emoji: "😴", label: "Poor" },
  { value: 3, emoji: "😶‍🌫️", label: "Fair" },
  { value: 4, emoji: "😌", label: "Good" },
  { value: 5, emoji: "🌟", label: "Excellent" },
];

/** `checkin_scale:stress` */
export const stressScale: ScalePoint[] = [
  { value: 1, emoji: "😌", label: "Chill" },
  { value: 2, emoji: "🤔", label: "Mild" },
  { value: 3, emoji: "😤", label: "Medium" },
  { value: 4, emoji: "😰", label: "High" },
  { value: 5, emoji: "🤯", label: "Yikes!" },
];

/** `checkin_scale:pain` */
export const painScale = [
  { value: true, emoji: "✅", label: "Yes" },
  { value: false, emoji: "❌", label: "No" },
] as const;

/** `checkin_scale:pain_experience` */
export const painExperienceScale: ScalePoint[] = [
  { value: 1, emoji: "😊", label: "None" },
  { value: 2, emoji: "😐", label: "Mild" },
  { value: 3, emoji: "😕", label: "Moderate" },
  { value: 4, emoji: "😧", label: "Severe" },
  { value: 5, emoji: "😭", label: "Extreme" },
];

/** `checkin_scale:pain_impact` */
export const painImpactScale: ScalePoint[] = [
  { value: 1, emoji: "😊", label: "None" },
  { value: 2, emoji: "😐", label: "A Little" },
  { value: 3, emoji: "😕", label: "Somewhat" },
  { value: 4, emoji: "😧", label: "A Lot" },
  { value: 5, emoji: "😭", label: "Completely" },
];

/** `checkin_scale:context_tags` */
export const contextTags: Tag[] = [
  { id: "work", emoji: "💼", label: "Work" },
  { id: "sleep", emoji: "😴", label: "Sleep" },
  { id: "health", emoji: "🏃", label: "Health" },
  { id: "relationships", emoji: "❤️", label: "Relationships" },
  { id: "studies", emoji: "📚", label: "Studies" },
  { id: "finances", emoji: "💰", label: "Finances" },
  { id: "fun", emoji: "🎉", label: "Fun" },
  { id: "other", emoji: "✨", label: "Other" },
];

/** No longer asked; kept so check-ins from before the new template still show their energy. */
export const energyScale: ScalePoint[] = [
  { value: 1, emoji: "🪫", label: "Exhausted" },
  { value: 2, emoji: "😴", label: "Tired" },
  { value: 3, emoji: "⚡", label: "Moderate" },
  { value: 4, emoji: "💪", label: "Energetic" },
  { value: 5, emoji: "🔥", label: "Charged!" },
];

/** The answers of one check-in, under the template's "saved as" names. */
export type Answers = {
  mood_rating: number;
  sleep_rating: number;
  stress_level: number;
  pain_exist: boolean;
  pain_experience?: number;
  pain_impact?: number;
  freehand_text_content?: string;
  context_tags: string[];
};

export type Draft = Partial<Answers>;

type Block = {
  order: number;
  id: string;
  type: "emoji_scale" | "yes_no" | "free_text" | "multi_select";
  save_as: keyof Answers;
  question: string;
  subtitle: string;
  required: boolean;
  scale?: ScalePoint[];
  /** shown only when this holds */
  when?: (d: Draft) => boolean;
};

const hasPain = (d: Draft) => d.pain_exist === true;

/** The template: 8 blocks, in order. */
export const checkinTemplate: Block[] = [
  {
    order: 0,
    id: "mood",
    type: "emoji_scale",
    save_as: "mood_rating",
    question: "How are you feeling?",
    subtitle: "Tap the emoji that matches your vibe",
    required: true,
    scale: moodScale,
  },
  {
    order: 1,
    id: "sleep",
    type: "emoji_scale",
    save_as: "sleep_rating",
    question: "How would you rate your sleep?",
    subtitle: "Think about last night",
    required: true,
    scale: sleepScale,
  },
  {
    order: 2,
    id: "stress",
    type: "emoji_scale",
    save_as: "stress_level",
    question: "Are you under any stress?",
    subtitle: "Be honest, there's no wrong answer",
    required: true,
    scale: stressScale,
  },
  {
    order: 3,
    id: "pain",
    type: "yes_no",
    save_as: "pain_exist",
    question: "Are you in any pain?",
    subtitle: "Any kind, physical or otherwise",
    required: true,
  },
  {
    order: 4,
    id: "pain_experience",
    type: "emoji_scale",
    save_as: "pain_experience",
    question: "How would you describe your pain?",
    subtitle: "Pick the closest",
    required: true,
    scale: painExperienceScale,
    when: hasPain,
  },
  {
    order: 5,
    id: "pain_impact",
    type: "emoji_scale",
    save_as: "pain_impact",
    question: "Has pain interfered with your usual activities?",
    subtitle: "Today, so far",
    required: true,
    scale: painImpactScale,
    when: hasPain,
  },
  {
    order: 6,
    id: "note",
    type: "free_text",
    save_as: "freehand_text_content",
    question: "Anything on your mind?",
    subtitle: "A quick note to capture this moment",
    required: false,
  },
  {
    order: 7,
    id: "tags",
    type: "multi_select",
    save_as: "context_tags",
    question: "What shaped your day?",
    subtitle: "Pick whatever applies, or skip to save",
    required: false,
  },
];

/** Blocks this draft will show: 4 and 5 only after a Yes to pain. */
export const blocksFor = (d: Draft) => checkinTemplate.filter((b) => !b.when || b.when(d));

export type JournalEntry = {
  id: string;
  /** local calendar day, YYYY-MM-DD */
  date: string;
  createdAt: string;
  mood_rating: number;
  /** absent on check-ins from before the new template */
  sleep_rating?: number;
  stress_level?: number;
  pain_exist?: boolean;
  pain_experience?: number;
  pain_impact?: number;
  freehand_text_content?: string;
  context_tags: string[];
  /** only on check-ins from before the new template */
  energy?: number;
};

/* Check-ins saved before the new template used short names (mood, stress, note, tags); read
 * both so nothing already saved is lost. */
type Stored = Partial<JournalEntry> & {
  mood?: number;
  stress?: number;
  note?: string;
  tags?: string[];
};

const toEntry = (r: Stored): JournalEntry | null => {
  const mood = r.mood_rating ?? r.mood;
  if (!r.id || !r.date || !r.createdAt || !mood) return null;
  const stress = r.stress_level ?? r.stress;
  const note = r.freehand_text_content ?? r.note;
  return {
    id: r.id,
    date: r.date,
    createdAt: r.createdAt,
    mood_rating: mood,
    ...(r.sleep_rating !== undefined ? { sleep_rating: r.sleep_rating } : {}),
    ...(stress !== undefined ? { stress_level: stress } : {}),
    ...(r.pain_exist !== undefined ? { pain_exist: r.pain_exist } : {}),
    ...(r.pain_experience !== undefined ? { pain_experience: r.pain_experience } : {}),
    ...(r.pain_impact !== undefined ? { pain_impact: r.pain_impact } : {}),
    ...(note ? { freehand_text_content: note } : {}),
    context_tags: r.context_tags ?? r.tags ?? [],
    ...(r.energy !== undefined ? { energy: r.energy } : {}),
  };
};

const store = createLocalStore<{ entries: Stored[] }>("ikan.journal.v1", { entries: [] });

let lastRaw: Stored[] | undefined;
let lastEntries: JournalEntry[] = [];
const entriesOf = (raw: Stored[]) => {
  if (raw !== lastRaw) {
    lastRaw = raw;
    lastEntries = raw.map(toEntry).filter((e): e is JournalEntry => e !== null);
  }
  return lastEntries;
};

const oldShaped = (r: Stored) => "mood" in r || "stress" in r || "note" in r || "tags" in r;

/** Rewrites check-ins saved under the old short names so every stored row uses the template's
 * names. Runs once per account: nothing is written when no entry needs it. The write goes
 * through the store, so the account's cloud copy is rewritten too. */
export function migrateJournal() {
  const { entries } = store.read();
  if (!entries.some(oldShaped)) return;
  store.update((s) => ({
    entries: s.entries.map((r) => (oldShaped(r) ? (toEntry(r) ?? r) : r)),
  }));
}

/** Today's sleep rating from the journal, if one was logged. */
export const sleepRatingOn = (date: string) =>
  entriesOf(store.read().entries)
    .filter((e) => e.date === date && e.sleep_rating !== undefined)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]?.sleep_rating;

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
  const raw = store.use().entries;
  useEffect(() => {
    if (raw.some(oldShaped)) migrateJournal();
  }, [raw]);
  const entries = entriesOf(raw);
  return {
    entries,
    on: (date: string) =>
      entries.filter((e) => e.date === date).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    add: (answers: Answers) => {
      const now = new Date();
      const entry: JournalEntry = {
        id: newId("j"),
        date: dayKey(now),
        createdAt: now.toISOString(),
        ...answers,
      };
      store.update((s) => ({ entries: [...s.entries, entry] }));
      return entry;
    },
    remove: (id: string) =>
      store.update((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
    restore: (entry: JournalEntry) => store.update((s) => ({ entries: [...s.entries, entry] })),
  };
}
