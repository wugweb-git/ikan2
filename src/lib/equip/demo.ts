import type { Programme } from "./types";
import type { ArchivedRun, ProgrammeState } from "./store";

/* Development only: sample runs, never saved, so result and history layouts can be reviewed with
 * every section filled. Used behind ?demo=1, which production builds ignore. */

/** Development only: a complete sample run (never saved) so every section of the result shows. */
export function demoRun(p: Programme, variant = 0): ProgrammeState {
  // each variant is an earlier, slightly different run
  const start = Date.now() - (p.days.length + variant * 60) * 86_400_000;
  const v = variant;
  const at = (day: number) => new Date(start + day * 86_400_000 + 20 * 3_600_000).toISOString();
  const answers: ProgrammeState["answers"] = {};
  const collections: ProgrammeState["collections"] = {};
  const diary: ProgrammeState["diary"] = {};
  const tracker: ProgrammeState["tracker"] = {};
  const lines = [
    "I sleep better when my phone stays out of the bedroom.",
    "Writing worries down before bed makes them feel smaller.",
    "A short walk after lunch helps my afternoons.",
  ];
  for (const d of p.days) {
    for (const st of d.steps) {
      const v = st.view;
      const k = st.block.key ?? `${d.day}.${st.block.n}`;
      if (v.ui === "choice" && v.multi) answers[k] = v.options.slice(0, 3).map((o) => o.label);
      if (v.ui === "conclude") answers[`${k}@${d.day}`] = lines[d.day % lines.length]!;
      if ((v.ui === "entries" || v.ui === "review") && (collections[v.collection]?.length ?? 0) < 6)
        collections[v.collection] = [
          ...(collections[v.collection] ?? []),
          {
            id: `${v.collection}-${d.day}`,
            day: d.day,
            createdAt: at(d.day),
            values: Object.fromEntries(
              (v.ui === "entries" ? v.fields : [...(v.addFields ?? []), ...v.fields]).map((f) => [
                f.key,
                f.type === "yesno" ? true : /status/i.test(f.label) ? "Done" : "Sample",
              ]),
            ),
          },
        ];
      if (v.ui === "diary") {
        const late = d.day / p.days.length;
        diary[String(d.day)] = {
          bed: "23:00",
          tried: "23:15",
          latency: Math.round(40 - late * 25),
          awake: Math.round(35 - late * 25),
          woke: "06:30",
          up: "06:45",
          quality: Math.min(5, 2 + Math.round(late * 3)),
        };
      }
      if (v.ui === "tracker") tracker[String(d.day)] = { a: true, b: d.day % 3 !== 0 };
    }
  }
  if (collections["habits"] === undefined && p.slug === "sleep-tight")
    collections["habits"] = [
      { id: "a", day: 18, createdAt: at(18), values: {} },
      { id: "b", day: 18, createdAt: at(18), values: {} },
    ];
  return {
    completed: p.days.map((d) => d.day),
    completedAt: Object.fromEntries(p.days.map((d) => [String(d.day), at(d.day)])),
    answers,
    collections,
    diary,
    tracker,
    time: Object.fromEntries(
      p.days.map((d) => [String(d.day), { total: 300 + v * 90 + ((d.day * 97) % 300), steps: {} }]),
    ),
    feedback: Object.fromEntries(
      p.days.map((d) => [
        String(d.day),
        {
          helpful: Math.max(
            1,
            Math.min(5, 3 - Math.min(v, 1) + Math.round((d.day / p.days.length) * 2)),
          ),
          feel: Math.max(
            1,
            Math.min(5, 2 - Math.min(v, 1) + Math.round((d.day / p.days.length) * 2)),
          ),
          at: at(d.day),
        },
      ]),
    ),
  };
}

/** Three finished sample runs, newest first. */
export const demoRuns = (p: Programme): ArchivedRun[] =>
  [0, 1, 2].map((v) => {
    const r = demoRun(p, v);
    return {
      ...r,
      archivedAt: Object.values(r.completedAt ?? {})
        .sort()
        .at(-1)!,
    };
  });
