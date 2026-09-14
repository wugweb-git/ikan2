import { dayKey } from "@/lib/journal";
import { nightMetrics } from "./metrics";
import type { Programme, UI } from "./types";
import type { ProgrammeState } from "./store";

/* What a finished (or running) programme adds up to, built only from what the programme records:
 * day completion times, active time, end-of-day feedback, choices, logs, the sleep diary, the
 * habit tracker and the person's own written conclusions. Anything with no data is left empty so
 * the result screen can hide it. */

const answerKey = (b: { key?: string; n: number }, day: number) => b.key ?? `${day}.${b.n}`;
const avg = (xs: number[]) => (xs.length ? xs.reduce((n, x) => n + x, 0) / xs.length : null);
const DAY = 86_400_000;

export type Summary = {
  startedAt: string | null;
  finishedAt: string | null;
  spanDays: number;
  daysDone: number;
  totalDays: number;
  daysActive: number;
  longestStreak: number;
  seconds: number;
  secondsPerDay: number | null;
  helpful: number | null;
  helpfulDays: number;
  feelEarly: number | null;
  feelLate: number | null;
  mostHelpful: { day: number; title: string; rating: number }[];
  choices: { day: number; title: string; picked: string[] }[];
  built: { title: string; count: number }[];
  habits: { count: number; rate: number | null } | null;
  sleep: {
    nights: number;
    asleep: number | null;
    efficiencyEarly: number | null;
    efficiencyLate: number | null;
    qualityEarly: number | null;
    qualityLate: number | null;
  } | null;
  words: { day: number; text: string }[];
  units: { title: string; focus: string; done: number; total: number }[];
  /** what was recorded on the first day: background, concern, usual sleep hours… */
  starting: { title: string; value: string }[];
  /** yes/no and option fields across logs, e.g. "Was this in my control?" 3 of 5 yes */
  tallies: { log: string; field: string; counts: { option: string; count: number }[] }[];
  /** the stated usual hours of sleep on day 0, when the programme asks */
  statedSleepHours: number | null;
  timeline: { start: string | null; end: string | null };
};

export function programmeSummary(p: Programme, s: ProgrammeState): Summary {
  const done = new Set(s.completed);
  const doneDays = p.days.filter((d) => done.has(d.day));
  const stamps = Object.values(s.completedAt ?? {}).sort();
  const startedAt = stamps[0] ?? null;
  const finishedAt = p.days.every((d) => done.has(d.day)) ? (stamps.at(-1) ?? null) : null;

  // days active and the longest run of consecutive calendar days
  const dates = [...new Set(stamps.map((t) => dayKey(new Date(t))))].sort();
  let longestStreak = 0;
  let run = 0;
  dates.forEach((d, i) => {
    const prev = dates[i - 1];
    run = prev && new Date(d).getTime() - new Date(prev).getTime() === DAY ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
  });

  // time
  const perDay = doneDays.map((d) => s.time?.[String(d.day)]?.total ?? 0).filter((x) => x > 0);
  const seconds = perDay.reduce((n, x) => n + x, 0);

  // end-of-day feedback, early third vs late third of the programme
  const fb = doneDays.map((d) => ({ d, f: s.feedback?.[String(d.day)] })).filter((x) => x.f);
  const helpfulRatings = fb.map((x) => x.f!.helpful).filter((x): x is number => !!x);
  const feels = fb.filter((x) => x.f!.feel);
  const third = Math.max(1, Math.floor(feels.length / 3));

  // multi-select choices, logs, conclusions
  const choices: Summary["choices"] = [];
  const collections = new Map<string, string>();
  const words: Summary["words"] = [];
  for (const d of doneDays) {
    for (const st of d.steps) {
      const v = st.view as UI;
      const k = answerKey(st.block, d.day);
      // day 0 answers are shown as "where you started"
      if (v.ui === "choice" && v.multi && d.day > 0) {
        const a = s.answers[k];
        const picked = (Array.isArray(a) ? a : typeof a === "string" && a ? [a] : []).filter(
          (x) => !/^other$/i.test(x),
        );
        const other = s.answers[`${k}#other`];
        if (typeof other === "string" && other.trim()) picked.push(other.trim());
        if (picked.length) choices.push({ day: d.day, title: st.block.title, picked });
      }
      if ((v.ui === "entries" || v.ui === "review") && !collections.has(v.collection)) {
        collections.set(v.collection, st.block.title);
      }
      if (v.ui === "conclude") {
        const t = s.answers[`${k}@${d.day}`];
        if (typeof t === "string" && t.trim()) words.push({ day: d.day, text: t.trim() });
      }
    }
  }
  // answers brought over from the old app: their conclusions and reflections count as your words
  for (const d of doneDays) {
    for (const b of s.legacy?.[String(d.day)] ?? []) {
      if (!/conclusion|reflection|takeaway|note/i.test(b.title)) continue;
      const text = b.lines.join(" ").trim();
      if (text.length > 3) words.push({ day: d.day, text });
    }
  }
  words.sort((a, b) => a.day - b.day);
  // day 0: where the person started
  const starting: Summary["starting"] = [];
  let statedSleepHours: number | null = null;
  const first = p.days.find((d) => d.day === 0);
  for (const st of first?.steps ?? []) {
    const v = st.view as UI;
    const k = answerKey(st.block, 0);
    const a = s.answers[k];
    if (a === undefined || a === "" || (Array.isArray(a) && !a.length)) continue;
    if (v.ui === "scale" && typeof a === "number") {
      if (/sleep/i.test(st.block.title)) statedSleepHours = a;
      starting.push({
        title: st.block.title,
        value: `${a}${/sleep|duration/i.test(st.block.title) ? " hours" : ""}`,
      });
    } else if (v.ui === "choice" || v.ui === "text") {
      starting.push({ title: st.block.title, value: Array.isArray(a) ? a.join(", ") : String(a) });
    }
  }

  // option and yes/no fields across each log
  const tallies: Summary["tallies"] = [];
  const seenField = new Set<string>();
  for (const d of p.days) {
    for (const st of d.steps) {
      const v = st.view as UI;
      if (v.ui !== "entries" && v.ui !== "review") continue;
      const fields = v.ui === "entries" ? v.fields : [...(v.addFields ?? []), ...v.fields];
      for (const f of fields) {
        const id = `${v.collection}:${f.key}`;
        if (seenField.has(id) || !(f.options?.length || f.type === "yesno")) continue;
        seenField.add(id);
        const counts = new Map<string, number>();
        for (const e of s.collections[v.collection] ?? []) {
          const val = e.values[f.key];
          if (val === null || val === undefined || val === "") continue;
          const label = typeof val === "boolean" ? (val ? "Yes" : "No") : String(val);
          counts.set(label, (counts.get(label) ?? 0) + 1);
        }
        if (counts.size)
          tallies.push({
            log: collections.get(v.collection) ?? st.block.title,
            field: f.label || st.block.title,
            counts: [...counts.entries()]
              .map(([option, count]) => ({ option, count }))
              .sort((a, b) => b.count - a.count),
          });
      }
    }
  }

  const built = [...collections.entries()]
    .map(([c, title]) => ({ title, count: (s.collections[c] ?? []).length }))
    .filter((b) => b.count > 0);

  // habit tracker (Sleep Tight): ticks over habits × tracked days
  const habitCount = (s.collections["habits"] ?? []).length;
  const trackedDays = Object.keys(s.tracker ?? {});
  const ticks = trackedDays.reduce(
    (n, d) => n + Object.values(s.tracker[d] ?? {}).filter(Boolean).length,
    0,
  );
  // habits tracked: the habit list, or every habit ticked at least once if that's larger
  const trackedIds = new Set(trackedDays.flatMap((d) => Object.keys(s.tracker[d] ?? {})));
  const habitTotal = Math.max(habitCount, trackedIds.size);
  const habits =
    habitTotal && trackedDays.length
      ? {
          count: habitTotal,
          rate: Math.min(100, Math.round((ticks / (habitTotal * trackedDays.length)) * 100)),
        }
      : null;

  // sleep diary: first week vs last week
  const nights = Object.entries(s.diary ?? {})
    .map(([day, e]) => ({ day: Number(day), m: nightMetrics(e), q: e.quality }))
    .sort((a, b) => a.day - b.day);
  const withM = nights.filter((n) => n.m);
  const early = withM.slice(0, 7);
  const late = withM.slice(-7);
  const sleep = nights.length
    ? {
        nights: nights.length,
        asleep: avg(withM.map((n) => n.m!.asleep)),
        efficiencyEarly: withM.length >= 4 ? avg(early.map((n) => n.m!.efficiency)) : null,
        efficiencyLate: withM.length >= 8 ? avg(late.map((n) => n.m!.efficiency)) : null,
        qualityEarly: avg(
          nights
            .slice(0, 7)
            .map((n) => n.q)
            .filter((q): q is number => !!q),
        ),
        qualityLate:
          nights.length >= 8
            ? avg(
                nights
                  .slice(-7)
                  .map((n) => n.q)
                  .filter((q): q is number => !!q),
              )
            : null,
      }
    : null;

  const units = p.source.units
    .map((u, i) => {
      const days = u.days.map((d) => d.day);
      return {
        title: u.title,
        focus: p.source.schedule[i]?.Focus ?? "",
        done: days.filter((d) => done.has(d)).length,
        total: days.length,
      };
    })
    .filter((u) => u.total > 0);

  return {
    startedAt,
    finishedAt,
    spanDays:
      startedAt && stamps.at(-1)
        ? Math.max(
            1,
            Math.round((new Date(stamps.at(-1)!).getTime() - new Date(startedAt).getTime()) / DAY) +
              1,
          )
        : 0,
    daysDone: doneDays.length,
    totalDays: p.days.length,
    daysActive: dates.length,
    longestStreak,
    seconds,
    secondsPerDay: perDay.length ? seconds / perDay.length : null,
    helpful: avg(helpfulRatings),
    helpfulDays: helpfulRatings.length,
    feelEarly: feels.length >= 2 ? avg(feels.slice(0, third).map((x) => x.f!.feel!)) : null,
    feelLate: feels.length >= 2 ? avg(feels.slice(-third).map((x) => x.f!.feel!)) : null,
    mostHelpful: fb
      .filter((x) => x.f!.helpful && x.f!.helpful >= 4)
      .sort((a, b) => b.f!.helpful! - a.f!.helpful!)
      .slice(0, 3)
      .map((x) => ({ day: x.d.day, title: x.d.title, rating: x.f!.helpful! })),
    choices,
    built,
    habits,
    sleep,
    words: words.slice(-3).reverse(),
    units,
    starting,
    tallies,
    statedSleepHours,
    timeline: { start: startedAt, end: stamps.at(-1) ?? null },
  };
}

/* ---------- programme-specific highlights ---------- */

export type HighlightIcon =
  "signs" | "log" | "goal" | "check" | "worry" | "task" | "sparkle" | "heart" | "scale" | "brain";

export type Highlights = {
  title: string;
  tiles: { icon: HighlightIcon; label: string; text: string }[];
};

/** Each programme's own story, from the logs and choices it records. Tiles with no data are left out. */
export function programmeHighlights(p: Programme, s: ProgrammeState): Highlights | null {
  // every field each log (collection) can hold, by label
  const fields = new Map<string, { key: string; label: string }[]>();
  for (const d of p.days)
    for (const st of d.steps) {
      const v = st.view as UI;
      if (v.ui !== "entries" && v.ui !== "review") continue;
      const list = fields.get(v.collection) ?? [];
      for (const f of v.ui === "entries" ? v.fields : [...(v.addFields ?? []), ...v.fields])
        if (!list.some((x) => x.key === f.key)) list.push({ key: f.key, label: f.label });
      fields.set(v.collection, list);
    }
  const entries = (c: string) => s.collections[c] ?? [];
  const count = (...cs: string[]) => cs.reduce((n, c) => n + entries(c).length, 0);
  const keyOf = (c: string, label: RegExp) => fields.get(c)?.find((f) => label.test(f.label))?.key;
  const filled = (c: string, label: RegExp) => {
    const k = keyOf(c, label);
    return k ? entries(c).filter((e) => `${e.values[k] ?? ""}`.trim()).length : 0;
  };
  const matching = (c: string, label: RegExp, value: RegExp) => {
    const k = keyOf(c, label);
    return k
      ? entries(c).filter((e) => {
          const v = e.values[k];
          return typeof v === "boolean" ? v && value.test("yes") : value.test(`${v ?? ""}`);
        }).length
      : 0;
  };
  const picked = (day: number, title: RegExp) => {
    const d = p.days.find((x) => x.day === day);
    const st = d?.steps.find((x) => title.test(x.block.title));
    if (!st) return 0;
    const a = s.answers[st.block.key ?? `${day}.${st.block.n}`];
    return Array.isArray(a) ? a.length : a ? 1 : 0;
  };
  const tiles: Highlights["tiles"] = [];
  const n = (x: number, one: string, many: string) => `${x} ${x === 1 ? one : many}`;
  const add = (n: number, icon: HighlightIcon, label: string, text: string) => {
    if (n > 0) tiles.push({ icon, label, text });
  };

  if (p.slug === "unburn") {
    const signs = picked(1, /indicator/i);
    add(signs, "signs", n(signs, "sign", "signs"), "of burnout you noticed at the start");
    add(
      count("tf_log"),
      "log",
      n(count("tf_log"), "entry", "entries"),
      "in your thought and feeling log",
    );
    const efforts = count("efforts");
    const aligned = matching("efforts", /align/i, /yes/i);
    add(
      efforts,
      "goal",
      n(efforts, "effort", "efforts"),
      aligned ? `weighed against your goals, ${aligned} aligned` : "weighed against their rewards",
    );
    add(
      count("goals"),
      "check",
      n(count("goals"), "goal", "goals"),
      "with your own measures of success",
    );
    add(
      count("worries"),
      "worry",
      n(count("worries"), "worry", "worries"),
      "written down and set aside",
    );
    const tasks = count("tasks");
    const doneTasks = matching("tasks", /status/i, /done|complete|finish/i);
    add(
      tasks,
      "task",
      doneTasks ? `${doneTasks} of ${tasks}` : n(tasks, "task", "tasks"),
      doneTasks ? "tasks you took up and finished" : "tasks you took up",
    );
    add(
      filled("perfectionism", /realistic goal/i),
      "scale",
      n(filled("perfectionism", /realistic goal/i), "situation", "situations"),
      "where you set a realistic goal instead of a perfect one",
    );
    const good = count("good_things", "grateful");
    add(good, "heart", n(good, "good thing", "good things"), "and things you’re grateful for");
    return { title: "Your burnout reset", tiles };
  }

  if (p.slug === "stress-buster") {
    const signs = picked(2, /stress and you/i);
    add(signs, "signs", n(signs, "sign", "signs"), "of how stress shows up in you");
    add(
      count("recent_stressors"),
      "worry",
      n(count("recent_stressors"), "stressor", "stressors"),
      "you named at the start",
    );
    const demands = count("demands");
    const resources = count("resources");
    if (demands || resources)
      tiles.push({
        icon: "scale",
        label: `${demands} vs ${resources}`,
        text: "demands against the resources you have",
      });
    const thoughts = count("thought_log");
    const challenged = filled("thought_log", /alternate/i);
    add(
      thoughts,
      "brain",
      challenged ? `${challenged} of ${thoughts}` : n(thoughts, "thought", "thoughts"),
      challenged
        ? "logged thoughts you challenged with an alternative"
        : "logged in your thought log",
    );
    add(count("worries"), "log", n(count("worries"), "worry", "worries"), "emptied from your mind");
    const good = count("good_things", "grateful", "joy");
    add(good, "heart", n(good, "moment", "moments"), "of joy, good things and gratitude");
    return { title: "Your stress toolkit", tiles };
  }

  return null;
}
