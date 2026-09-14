import { useSyncExternalStore } from "react";
import { assessments } from "@/lib/assessment/instruments";
import { scoreAll, type Answers } from "@/lib/assessment/scoring";
import { mergeResults, type StoredResult } from "@/lib/assessment/store";
import { getProgramme } from "@/lib/equip/programs";
import { readProgramme, updateProgramme } from "@/lib/equip/store";
import { contextTags, mergeJournalEntries, type JournalEntry } from "@/lib/journal";
import { createLocalStore } from "@/lib/local-store";
import { cityName, importProfile } from "@/lib/profile";

/* Brings a signed-in person's history over from the old iKan app (same Supabase account), so
 * nobody starts from zero: journal check-ins, assessment results and Equip progress.
 *
 * Reads the old backend with the person's own session token. Everything is merged by id, so
 * running it on every sign-in is safe and never overwrites what was done in this app.
 * CORS on the old function allows only Content-Type and Authorization, so plain fetch, no apikey. */

const API = "https://jpfvoevxegnknxoqmwye.supabase.co/functions/v1/make-server-cc205da9";

/** Old programme ids → programmes here. Productivity Reset (33eae2e2-…) has no programme yet. */
const PROGRAMMES: [string, string][] = [
  ["68970d31-0ff3-4d73-b137-80e98228d399", "sleep-tight"],
  ["416feb50-e73f-4898-a996-f8a4695a708e", "unburn"],
  ["9117b308-ff8a-4613-90ef-007841ef0b79", "stress-buster"],
];

type Status = { state: "idle" | "running" | "done" | "failed"; imported?: number };
let status: Status = { state: "idle" };
const listeners = new Set<() => void>();
const setStatus = (next: Status) => {
  status = next;
  listeners.forEach((l) => l());
};

/** Whether the import is still running, so screens can show a loader instead of "nothing yet". */
export const useImportStatus = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => status,
    () => status,
  );

async function get<T>(path: string, token: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/** Per account: whether the old profile has been brought over once already. */
const imported = createLocalStore<{ profileAt: string; programmes?: string[] }>(
  "ikan.legacy-import.v1",
  { profileAt: "" },
);

/* ---------- profile ---------- */

type OldProfile = {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  avatar_url?: string;
  created_at?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
};

function importOldProfile(o: OldProfile) {
  const first = !imported.read().profileAt;
  importProfile(
    {
      name: o.name?.trim(),
      email: o.email?.trim(),
      phone: o.phone?.trim(),
      city: o.location ? cityName(o.location) : undefined,
      birthday: o.dateOfBirth?.slice(0, 10),
      gender: o.gender ? o.gender.charAt(0).toUpperCase() + o.gender.slice(1) : undefined,
      bio: o.bio?.trim(),
      emergencyName: o.emergencyContactName?.trim(),
      emergencyPhone: o.emergencyContactPhone?.trim(),
      emergencyRelation: o.emergencyContactRelationship?.trim(),
      memberSince: o.created_at?.slice(0, 10),
      avatar: /^https:\/\//.test(o.avatar_url ?? "") ? o.avatar_url : undefined,
    },
    first,
  );
  imported.update(() => ({ profileAt: new Date().toISOString() }));
}

/* ---------- journal ---------- */

type OldJournal = {
  id: string;
  date: string;
  created_at: string;
  mood_rating: number;
  energy?: number | null;
  stress_level?: number | null;
  freehand_text_content?: string | null;
  context_tags?: string[];
  emotions?: string[];
};

const scale = (n: unknown) =>
  typeof n === "number" && n >= 1 && n <= 5 ? Math.round(n) : undefined;

function journalEntry(o: OldJournal): JournalEntry | null {
  const mood = scale(o.mood_rating);
  if (!o.id || !o.date || !mood) return null;
  const labels = o.context_tags?.length ? o.context_tags : (o.emotions ?? []);
  const tags = [
    ...new Set(
      labels
        .map(
          (l) =>
            contextTags.find((t) => t.label.toLowerCase() === l.toLowerCase() || t.id === l)?.id,
        )
        .filter((t): t is string => Boolean(t)),
    ),
  ];
  const energy = scale(o.energy);
  const stress = scale(o.stress_level);
  return {
    id: o.id,
    date: o.date,
    createdAt: o.created_at || `${o.date}T12:00:00.000Z`,
    mood,
    ...(energy ? { energy } : {}),
    ...(stress ? { stress } : {}),
    ...(o.freehand_text_content ? { note: o.freehand_text_content } : {}),
    tags,
  };
}

/* ---------- assessments ---------- */

type OldResult = {
  id: string;
  assessment_id: string;
  record_type?: string;
  responses?: Record<string, unknown>;
  completed_at: string;
  duration_seconds?: number;
};

/** Only results that score exactly the same here; older answer scales and gaps are left behind. */
function storedResult(o: OldResult): StoredResult | null {
  if (o.record_type === "program_checkin" || o.assessment_id?.startsWith("checkin_")) return null;
  const a = assessments.find((x) => x.id === o.assessment_id);
  if (!a || !o.responses || !o.completed_at) return null;
  const answers: Answers = {};
  for (const q of a.questions) {
    const text = o.responses[q.id];
    const option = a.scales[q.scale]?.options.find((opt) => opt.text === text);
    if (option) answers[q.id] = option.value;
  }
  const scores = scoreAll(a, answers);
  if (!scores.length || scores.some((s) => s.value === null)) return null;
  return {
    id: o.id,
    slug: a.slug,
    completedAt: o.completed_at,
    seconds: o.duration_seconds ?? 0,
    answers,
  };
}

/* ---------- Equip ---------- */

type OldDay = {
  day_number: number;
  completed?: boolean;
  completed_at?: string;
  last_updated?: string;
  block_responses?: Record<string, unknown>;
};
type OldProgram = {
  daily_content?: { day: number; activities?: { id: string; title?: string }[] }[];
};

const clean = (v: unknown) =>
  v === null || v === undefined ? "" : typeof v === "string" ? v.trim() : String(v);

/** One old activity's answer as readable lines. */
function lines(value: unknown): string[] {
  if (typeof value === "string" || typeof value === "number")
    return clean(value) ? [clean(value)] : [];
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => {
      if (typeof row !== "object" || row === null) return clean(row);
      const r = row as Record<string, unknown>;
      if ("Question" in r) {
        const answer = clean(r["Response"]);
        return answer ? `${clean(r["Question"])} ${answer}` : "";
      }
      return Object.entries(r)
        .filter(([, v]) => clean(v))
        .map(([k, v]) => `${k}: ${clean(v)}`)
        .join(" · ");
    })
    .filter(Boolean);
}

async function importProgramme(oldId: string, slug: string, token: string) {
  const p = getProgramme(slug);
  // once per account: a finished import moves into the programme's runs, so re-importing would duplicate it
  if (!p || imported.read().programmes?.includes(slug)) return 0;
  const existing = readProgramme(slug);
  if (existing.completed.length || existing.runs?.length) {
    imported.update((x) => ({ ...x, programmes: [...(x.programmes ?? []), slug] }));
    return 0;
  }
  const [progress, program] = await Promise.all([
    get<{ progress: { days?: OldDay[] } | null }>(`/user/equip/${oldId}/progress`, token),
    get<{ program: OldProgram }>(`/equip/programs/${oldId}`, token),
  ]);
  const valid = new Set(p.days.map((d) => d.day));
  const days = (progress?.progress?.days ?? []).filter(
    (d) => d.completed && valid.has(d.day_number),
  );
  if (!days.length) return 0;

  const titleOf = (day: number, id: string) =>
    program?.program?.daily_content
      ?.find((d) => d.day === day)
      ?.activities?.find((a) => a.id === id)?.title ?? "Your answer";

  updateProgramme(slug, (s) => {
    const completed = new Set(s.completed);
    const completedAt = { ...s.completedAt };
    const legacy = { ...s.legacy };
    const first = [...days].sort((a, b) =>
      (a.completed_at ?? "").localeCompare(b.completed_at ?? ""),
    )[0];
    // day 0 (the intro) was never recorded in the old app; opening day 1 means it was seen
    if (valid.has(0) && !completed.has(0)) {
      completed.add(0);
      if (first?.completed_at) completedAt["0"] = first.completed_at;
    }
    for (const d of days) {
      const key = String(d.day_number);
      completed.add(d.day_number);
      if (!completedAt[key] && d.completed_at) completedAt[key] = d.completed_at;
      if (!legacy[key]) {
        const blocks = Object.entries(d.block_responses ?? {})
          .map(([id, v]) => ({ title: titleOf(d.day_number, id), lines: lines(v) }))
          .filter((b) => b.lines.length);
        if (blocks.length) legacy[key] = blocks;
      }
    }
    return {
      ...s,
      completed: [...completed].sort((a, b) => a - b),
      completedAt,
      legacy,
    };
  });
  imported.update((x) => ({ ...x, programmes: [...(x.programmes ?? []), slug] }));
  return days.length;
}

/* ---------- run ---------- */

let running: Promise<void> | null = null;
let doneFor = "";

export function importLegacyData(userId: string, token: () => Promise<string | null>) {
  if (doneFor === userId) return Promise.resolve();
  if (running) return running;
  setStatus({ state: "running" });
  running = (async () => {
    const t = await token();
    if (!t) {
      setStatus({ state: "failed" });
      return;
    }
    let imported = 0;
    const [journal, history, profile] = await Promise.all([
      get<{ entries: OldJournal[] }>("/user/journal?limit=1000", t),
      get<{ history: OldResult[] }>("/user/assessments/history", t),
      get<{ profile: OldProfile }>("/users/profile", t),
    ]);
    if (profile?.profile) importOldProfile(profile.profile);
    const entries = (journal?.entries ?? []).map(journalEntry).filter((e) => e !== null);
    if (entries.length) mergeJournalEntries(entries);
    const results = (history?.history ?? []).map(storedResult).filter((r) => r !== null);
    if (results.length) mergeResults(results);
    imported += entries.length + results.length;
    for (const [oldId, slug] of PROGRAMMES) imported += await importProgramme(oldId, slug, t);
    doneFor = userId;
    setStatus({ state: journal || history ? "done" : "failed", imported });
  })().finally(() => {
    running = null;
  });
  return running;
}

export function resetLegacyImport() {
  doneFor = "";
  setStatus({ state: "idle" });
}
