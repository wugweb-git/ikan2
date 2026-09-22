import { createLocalStore } from "@/lib/local-store";
import { assessments, getAssessment } from "@/lib/assessment/instruments";
import { headlineOf, percentOfRange, scoreAll } from "@/lib/assessment/scoring";
import { useAssessmentStore } from "@/lib/assessment/store";
import { getConsultant, useBookings } from "@/lib/consultants";
import { programmes } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";
import { addDays, dayKey, moodScale, useJournal } from "@/lib/journal";
import { getResource, useResourceStore } from "@/lib/resources";

export type ActivityType = "assessment" | "mood" | "program" | "consult" | "resource";

export type ActivityEvent = {
  id: string;
  type: ActivityType;
  at: string;
  title: string;
  detail: string;
  emoji?: string;
  tone?: "success" | "warning" | "error";
  link:
    | { to: "/assessments/$slug/result/$id"; params: { slug: string; id: string } }
    | { to: "/journal" }
    | { to: "/program/$slug"; params: { slug: string } }
    | { to: "/program/$slug/result"; params: { slug: string } }
    | { to: "/consult/$id"; params: { id: string } }
    | { to: "/resources" };
};

/* ---------- iKAN Score ----------
 * Follows the iKan prototype's score page: four sources weighted 40/30/15/15 (assessments,
 * check-ins, programme activity, Health Connect), re-weighted over the sources that have data,
 * and five bands. Assessments are read through their scoring profiles, so "higher is better"
 * scales (WHO-5, NGSE, BRS) count the right way round; a part-finished assessment counts for
 * nothing until it is complete. */

export type WellnessPart = {
  key: "assessments" | "checkins" | "programs" | "health";
  label: string;
  weight: number;
  value: number | null;
  detail: string;
};

export const scoreBands = [
  { label: "Low", min: 0, max: 24, tone: "error" as const },
  { label: "Needs attention", min: 25, max: 44, tone: "warning" as const },
  { label: "Fair", min: 45, max: 64, tone: "warning" as const },
  { label: "Good", min: 65, max: 79, tone: "success" as const },
  { label: "Excellent", min: 80, max: 100, tone: "success" as const },
];

export const wellnessBand = (score: number) =>
  scoreBands.find((b) => score >= b.min && score <= b.max) ?? scoreBands[0]!;

const snapshots = createLocalStore<{ days: Record<string, number> }>("ikan.wellness.v1", {
  days: {},
});
export const useWellnessSnapshots = () => snapshots.use().days;
export const saveSnapshot = (score: number) => {
  const key = dayKey(new Date());
  if (snapshots.read().days[key] !== score)
    snapshots.update((s) => ({ days: { ...s.days, [key]: score } }));
};

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long" });

export function useEverything() {
  const { results, drafts: assessmentDrafts } = useAssessmentStore();
  const journal = useJournal();
  const sleep = useProgramme("sleep-tight").state;
  const unburn = useProgramme("unburn").state;
  const stress = useProgramme("stress-buster").state;
  const { bookings } = useBookings();
  const reading = useResourceStore();
  const programmeStates = { "sleep-tight": sleep, unburn, "stress-buster": stress } as Record<
    string,
    typeof sleep
  >;

  const now = new Date();
  const since = addDays(now, -29);
  const sinceKey = dayKey(since);

  /* events */
  const events: ActivityEvent[] = [];
  for (const r of results) {
    const a = getAssessment(r.slug);
    if (!a) continue;
    const head = headlineOf(a, scoreAll(a, r.answers));
    events.push({
      id: r.id,
      type: "assessment",
      at: r.completedAt,
      title: `${a.name} assessment`,
      detail: head?.band
        ? `${head.band.label} · ${a.title}`
        : `${a.scores.length} scores · ${a.title}`,
      ...(head?.band ? { tone: head.band.tone } : {}),
      link: { to: "/assessments/$slug/result/$id", params: { slug: a.slug, id: r.id } },
    });
  }
  for (const e of journal.entries) {
    const m = moodScale[e.mood_rating - 1]!;
    events.push({
      id: e.id,
      type: "mood",
      at: e.createdAt,
      title: `Felt ${m.label.toLowerCase()}`,
      detail: e.freehand_text_content
        ? `“${e.freehand_text_content}”`
        : `Mood ${e.mood_rating}/5${e.context_tags.length ? ` · ${e.context_tags.length} tags` : ""}`,
      emoji: m.emoji,
      link: { to: "/journal" },
    });
  }
  for (const p of programmes) {
    const current = programmeStates[p.slug]!;
    // the run in progress and every finished run
    for (const [ri, s] of [current, ...(current.runs ?? [])].entries()) {
      for (const [day, at] of Object.entries(s.completedAt ?? {})) {
        events.push({
          id: `${p.slug}-${ri}-${day}`,
          type: "program",
          at,
          title: `${p.name} · Day ${day}`,
          detail: `Day complete · ${Math.min(p.days.length, new Set(s.completed).size)} of ${p.days.length} done`,
          link: { to: "/program/$slug", params: { slug: p.slug } },
        });
      }
    }
  }
  for (const b of bookings) {
    const c = getConsultant(b.consultantId);
    if (!c) continue;
    const when = new Date(b.startsAt);
    events.push({
      id: b.id,
      type: "consult",
      at: b.createdAt,
      title:
        b.status === "cancelled" ? `Cancelled with ${c.name}` : `Session requested with ${c.name}`,
      detail: `${b.mode} · ${when.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}, ${when.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`,
      link: { to: "/consult/$id", params: { id: c.id } },
    });
  }
  for (const [id, at] of Object.entries(reading.opened)) {
    const r = getResource(id);
    if (!r) continue;
    events.push({
      id: `read-${id}`,
      type: "resource",
      at,
      title: "Read an article",
      detail: r.title,
      link: { to: "/resources" },
    });
  }
  events.sort((x, y) => y.at.localeCompare(x.at));

  /* wellness parts */
  const latest = assessments
    .map((a) => {
      const r = results
        .filter((x) => x.slug === a.slug)
        .sort((x, y) => y.completedAt.localeCompare(x.completedAt))[0];
      if (!r) return null;
      const scores = scoreAll(a, r.answers).filter((s) => s.value !== null);
      if (!scores.length) return null;
      const list = a.headline ? scores.filter((s) => s.score.id === a.headline) : scores;
      const vals = list.map((s) => {
        const p = percentOfRange(s.profile, s.value!);
        return (s.profile.direction === "better" ? p : 1 - p) * 100;
      });
      return vals.reduce((n, v) => n + v, 0) / vals.length;
    })
    .filter((v): v is number => v !== null);

  const recentMood = journal.entries.filter((e) => e.date >= sinceKey);
  const moodDays = new Set(recentMood.map((e) => e.date));
  const moodAvg = recentMood.length
    ? recentMood.reduce((n, e) => n + e.mood_rating, 0) / recentMood.length
    : null;

  const lastResult = [...results].sort((x, y) => y.completedAt.localeCompare(x.completedAt))[0];
  const doneOf = (slug: string, total: number) =>
    Math.min(total, new Set(programmeStates[slug]!.completed).size);
  const started = programmes.filter((p) => programmeStates[p.slug]!.completed.length > 0);
  const progPct = started.map((p) => (doneOf(p.slug, p.days.length) / p.days.length) * 100);

  const parts: WellnessPart[] = [
    {
      key: "assessments",
      label: "Assessments",
      weight: 40,
      value: latest.length ? latest.reduce((n, v) => n + v, 0) / latest.length : null,
      detail: latest.length
        ? `${latest.length} complete${lastResult ? ` · last ${shortDate(lastResult.completedAt)}` : ""}`
        : "Take an assessment to add this",
    },
    {
      key: "checkins",
      label: "Check-ins",
      weight: 30,
      value:
        moodAvg === null
          ? null
          : 0.6 * (((moodAvg - 1) / 4) * 100) + 0.4 * Math.min(100, (moodDays.size / 30) * 100),
      detail:
        moodAvg === null
          ? "Log a mood check-in to add this"
          : `${moodDays.size} of the last 30 days · avg mood ${moodAvg.toFixed(1)}/5`,
    },
    {
      key: "programs",
      label: "Programme activity",
      weight: 15,
      value: progPct.length ? progPct.reduce((n, v) => n + v, 0) / progPct.length : null,
      detail: started.length
        ? started
            .map((p) => `${p.name}, ${doneOf(p.slug, p.days.length)} of ${p.days.length} days`)
            .join(" · ")
        : "Start a program to add this",
    },
    {
      key: "health",
      label: "Health Connect",
      weight: 15,
      value: null,
      detail: "Sleep and steps · not connected",
    },
  ];
  const present = parts.filter((p) => p.value !== null);
  const totalWeight = present.reduce((n, p) => n + p.weight, 0);
  const score = present.length
    ? Math.round(present.reduce((n, p) => n + p.value! * p.weight, 0) / totalWeight)
    : null;

  const drafts = Object.entries(assessmentDrafts)
    .map(([slug, d]) => ({
      assessment: getAssessment(slug),
      answered: Object.keys(d.answers).length,
      updatedAt: d.updatedAt,
    }))
    .filter((d) => d.assessment && d.answered > 0);

  /* History and archives hold finished things only: completed assessments, journal check-ins and
   * programmes whose every day is done. Days of a programme still running stay with the programme. */
  const archive: ActivityEvent[] = events.filter(
    (e) => e.type === "assessment" || e.type === "mood",
  );
  for (const p of programmes) {
    for (const [ri, s] of (programmeStates[p.slug]!.runs ?? []).entries()) {
      const stamps = Object.values(s.completedAt ?? {}).sort();
      const at = s.archivedAt || stamps.at(-1);
      if (!at) continue;
      archive.push({
        id: `${p.slug}-completed-${ri}`,
        type: "program",
        at,
        title: `${p.name} completed`,
        detail: `All ${p.days.length} days done${stamps[0] ? ` · started ${new Date(stamps[0]).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : ""}`,
        link: { to: "/program/$slug/result", params: { slug: p.slug } },
      });
    }
  }
  archive.sort((a, b) => b.at.localeCompare(a.at));

  return {
    archive,
    drafts,
    events,
    parts,
    score,
    totalWeight,
    journal,
    bookings,
    reading,
    programmeStates,
    results,
  };
}
