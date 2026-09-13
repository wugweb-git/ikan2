import sleepCover from "@/assets/equip-sleep-tight.jpg";
import unburnCover from "@/assets/res-burnout.jpg";
import sleepJson from "./content/sleep-tight.json";
import unburnJson from "./content/unburn.json";
import {
  bulletsAfter,
  exampleCard,
  firstTable,
  lineAfter,
  noteLines,
  optionsAfter,
  repeatRef,
  splitEmojiOptions,
  type NBlock,
  type NProgramme,
} from "./notion";
import type { Day, Field, Programme, Step, UI } from "./types";

/* ------------------------------------------------------------------ *
 * Notion → screen mapping. Every visible string comes from the Notion
 * block or its designer note; this file only decides the interaction.
 * ------------------------------------------------------------------ */

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’'‘]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

const field = (label: string, type: Field["type"] = "text", options?: string[]): Field => ({
  key: slug(label) || "text",
  label,
  type,
  ...(options ? { options } : {}),
});

const yesNo = (label: string, options = ["✅Yes", "❌No"]) => field(label, "yesno", options);

/** Fields drawn in a note's ASCII card: the lines between "Entry #1" and "[ + Add New Entry ]". */
function cardFields(b: NBlock): { fields: Field[]; example: Record<string, string> } {
  const lines = noteLines(b);
  const start = lines.findIndex((l) => /^Entry #1$/.test(l.trim()));
  const fields: Field[] = [];
  const example: Record<string, string> = {};
  for (const raw of lines.slice(start + 1)) {
    const line = raw.trim();
    if (/Add New Entry/i.test(line) || /^1 card per entry/i.test(line)) break;
    if (/^\+-+\+?$/.test(line)) continue;
    const picker = line.match(/^(.*?)\.?\s*Time Picker$/i);
    const select = line.match(/^(.*?)\s+Let user choose from (.+?)(?:\s+etc\.?)?$/i);
    if (picker) fields.push(field(picker[1]!.trim(), "time"));
    else if (select) fields.push(field(select[1]!.trim(), "select", select[2]!.split(",").map((s) => s.trim())));
    else {
      const [label, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      const f = field(label!.trim(), /^time$/i.test(label!.trim()) ? "time" : "longtext");
      fields.push(f);
      if (value) example[f.key] = value;
    }
  }
  return { fields, example };
}

type Overrides = Record<string, (b: NBlock, p: NProgramme) => UI>;

const blockAt = (p: NProgramme, day: number, n: number) =>
  p.units.flatMap((u) => u.days).find((d) => d.day === day)?.blocks.find((b) => b.n === n);

/* ------------------------------- Sleep Tight ------------------------------- */

const sleepThoughtFields = (p: NProgramme) => cardFields(blockAt(p, 9, 11)!).fields;

const sleepOverrides: Overrides = {
  "8.4": (b) => ({
    ui: "choice",
    prompt: b.body[0]?.text ?? b.title,
    multi: true,
    options: splitEmojiOptions(b.quoteText?.[0] ?? ""),
  }),
  "9.11": (b) => {
    const { fields, example } = cardFields(b);
    return { ui: "entries", collection: "thoughts", fields, example, scope: "all" };
  },
  "10.4": (b, p) => {
    const prompt = lineAfter(b, /prompted$/) ?? b.title;
    return {
      ui: "review",
      collection: "thoughts",
      prompt,
      fields: [yesNo(prompt, optionsAfter(b))],
      addFields: sleepThoughtFields(p),
      scope: "all",
    };
  },
  "11.4": () => ({
    ui: "entries",
    collection: "mind_dump",
    fields: [field("Date", "date"), { key: "text", label: "", type: "longtext" }],
    scope: "all",
  }),
  "12.5": (b, p) => {
    const prompt = lineAfter(b, /^Prompt$/) ?? b.title;
    const thing = field(b.columns?.[0]?.trim() ?? "Things that kept me up");
    return {
      ui: "review",
      collection: "distractors",
      prompt,
      fields: [yesNo(prompt, optionsAfter(b))],
      seedFrom: { choiceKey: blockAt(p, 12, 4)?.key ?? "sleep_lets_check", field: thing.key },
      ...(b.userMayAddRows ? { addFields: [thing] } : {}),
      scope: "all",
    };
  },
  "13.6": () => ({
    ui: "entries",
    collection: "ideas",
    fields: [field("Disturbance"), field("Ways to reduce", "longtext")],
    scope: "all",
  }),
  "15.4": () => ({
    ui: "review",
    collection: "ideas",
    prompt: "",
    fields: [field("Pros", "longtext"), field("Cons", "longtext")],
    scope: "all",
  }),
  "16.6": () => ({ ui: "entries", collection: "rituals", fields: [field("Ritual")], limit: 10, scope: "all" }),
  "17.5": () => ({ ui: "entries", collection: "activities", fields: [field("Activity")], limit: 10, scope: "all" }),
  "17.7": (b) => {
    const prompt = lineAfter(b, /Promot$/) ?? b.title;
    return { ui: "review", collection: "activities", prompt, fields: [yesNo(prompt, optionsAfter(b))], scope: "all" };
  },
  "18.4": (b) => ({
    ui: "entries",
    collection: "habits",
    fields: [field(b.columns?.[0]?.trim() ?? "Habit")],
    limit: 10,
    scope: "all",
  }),
  "18.6": (b, p) => ({
    ui: "tracker",
    collection: "habits",
    field: field(blockAt(p, 18, 4)?.columns?.[0]?.trim() ?? "Habit").key,
    prompt: lineAfter(b, /Promot$/) ?? b.title,
    ...(b.listItems?.[0] ? { note: b.listItems[0] } : {}),
  }),
};

/* --------------------------------- Unburn --------------------------------- */

const tfLogFields = [field("Date and time", "datetime"), field("Event"), field("Thought"), field("Feeling")];
const effortFields = (p: NProgramme) => cardFields(blockAt(p, 9, 3)!).fields;

const listStep = (collection: string) => (b: NBlock): UI => ({
  ui: "entries",
  collection,
  prompt: lineAfter(b, /prompt$/i) ?? b.title,
  fields: [{ key: "text", label: "", type: "text" }],
  listOf: 3,
  scope: "all",
});

const unburnOverrides: Overrides = {
  "1.2": (b) => ({
    ui: "choice",
    prompt: lineAfter(b, /^Prompt$/) ?? b.title,
    multi: true,
    options: bulletsAfter(b, /^Options:?$/).map((label) => ({ label })),
  }),
  "3.2": () => ({ ui: "entries", collection: "tf_log", fields: tfLogFields, scope: "all" }),
  "4.2": () => ({
    ui: "review",
    collection: "tf_log",
    prompt: "Response",
    fields: [field("Response", "longtext")],
    addFields: tfLogFields,
    scope: "all",
  }),
  "8.3": (b) => ({
    ui: "choice",
    prompt: lineAfter(b, /and prompt$/) ?? b.title,
    multi: false,
    options: ["✅Yes", "❌No"].map((label) => ({ label })),
    ...(firstTable(b) ? { table: firstTable(b)! } : {}),
  }),
  "9.2": (b) => ({
    ui: "choice",
    prompt: lineAfter(b, /prompt$/) ?? b.title,
    multi: false,
    options: optionsAfter(b).flatMap((o) => splitEmojiOptions(o)),
  }),
  "9.3": (b) => ({ ui: "entries", collection: "efforts", fields: cardFields(b).fields, scope: "all" }),
  "12.2": (b) => ({
    ui: "entries",
    collection: "goals",
    prompt: lineAfter(b, /^Prompt$/) ?? b.title,
    fields: cardFields(b).fields,
    scope: "all",
  }),
  "14.1": (b) => {
    const prompt = lineAfter(b, /and prompt$/) ?? b.title;
    return { ui: "review", collection: "goals", prompt, fields: [yesNo(prompt, optionsAfter(b))], scope: "all" };
  },
  "14.2": (b) => {
    const prompt = lineAfter(b, /and prompt$/) ?? b.title;
    return {
      ui: "review",
      collection: "efforts",
      prompt,
      fields: [{ ...yesNo(prompt, optionsAfter(b)), key: "aligns" }],
      scope: "all",
    };
  },
  "15.2": (b) => {
    const lines = noteLines(b);
    const cards = ["Card 1", "Card 2"].map((marker) => {
      const i = lines.findIndex((l) => l.trim() === marker);
      return { title: lines[i + 1] ?? "", items: bulletsAfter(b, new RegExp(`^${escape(lines[i + 1] ?? "")}$`)) };
    });
    return { ui: "lesson", cards };
  },
  "16.2": (b, p) => {
    const prompt = lineAfter(b, /and prompt$/) ?? b.title;
    return {
      ui: "review",
      collection: "efforts",
      prompt,
      fields: [field(prompt, "longtext")],
      addFields: effortFields(p),
      scope: "all",
    };
  },
  "18.2": () => ({
    ui: "entries",
    collection: "worries",
    fields: [field("Time", "time"), { key: "text", label: "", type: "longtext" }],
    retentionHours: 24,
    scope: "all",
  }),
  "21.2": listStep("good_things"),
  "21.3": listStep("could_be_better"),
  "21.4": listStep("tomorrow"),
  "21.5": listStep("grateful"),
  "23.3": (b) => ({
    ui: "statements",
    prompt: lineAfter(b, /^For this task,?$/) ?? b.title,
    statements: bulletsAfter(b, /Show each of these and prompt:/),
    options: noteLines(b).filter((l) => /^(✅|❌)/.test(l.trim())),
  }),
  "24.2": (b) => {
    const example = exampleCard(b);
    return {
      ui: "review",
      collection: "perfectionism",
      prompt: "Perfect Outcome",
      fields: [field("Perfect Outcome", "longtext")],
      seeds: bulletsAfter(b, /Show each of these and prompt:/).map((s) => ({ situation: s })),
      ...(example ? { example } : {}),
      scope: "all",
    };
  },
  "25.2": () => ({
    ui: "review",
    collection: "perfectionism",
    prompt: "Realistic Outcome",
    fields: [field("Realistic Outcome", "longtext")],
    scope: "all",
  }),
  "26.2": (b) => {
    const { fields } = cardFields(b);
    return {
      ui: "review",
      collection: "perfectionism",
      prompt: fields.slice(3).map((f) => f.label).join(" and "),
      fields: fields.slice(3).map((f) => ({ ...f, type: "longtext" as const })),
      addFields: fields.slice(0, 3).map((f) => ({ ...f, type: "longtext" as const })),
      scope: "all",
    };
  },
  "27.2": (b) => {
    const { fields } = cardFields(b);
    const prompt = noteLines(b)
      .find((l) => /^Prompt:/.test(l))
      ?.replace(/^Prompt:\s*/, "");
    return {
      ui: "entries",
      collection: "tasks",
      ...(prompt ? { prompt } : {}),
      fields: fields.map((f) => (f.type === "longtext" ? { ...f, type: "text" as const } : f)),
      editable: fields.filter((f) => f.type === "select").map((f) => f.key),
      scope: "all",
    };
  },
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ------------------------------ resolution ------------------------------ */

function defaultView(b: NBlock): UI {
  if (b.title === "Sleep Diary" && b.interaction === "input-table") return { ui: "diary" };
  if (b.type === "conclude") return { ui: "conclude", ...(b.prompt ? { prompt: b.prompt } : {}) };
  if (b.interaction === "scale" && typeof b.constraints === "object") {
    return { ui: "scale", prompt: b.prompt ?? b.title, min: b.constraints.min ?? 0, max: b.constraints.max ?? 10 };
  }
  if (b.options?.length) {
    const multi = b.interaction === "multi-select" || b.type === "checklist";
    return {
      ui: "choice",
      prompt: b.prompt ?? b.body[0]?.text ?? b.title,
      multi,
      options: b.options.map((label) => ({ label })),
      ...(b.options.find((o) => /^Other/i.test(o)) ? { otherOption: b.options.find((o) => /^Other/i.test(o))! } : {}),
      ...(b.uiHints === "cards" ? { cards: true } : {}),
    };
  }
  if (b.prompt && (b.type === "reflection" || b.type === "quiz")) {
    const rule = typeof b.rules === "object" ? b.rules.dependsOn?.match(/^(\w+)\s*==\s*(.+)$/) : null;
    return { ui: "text", prompt: b.prompt, ...(rule ? { dependsOn: { key: rule[1]!, equals: rule[2]!.trim() } } : {}) };
  }
  return { ui: "lesson" };
}

function build(p: NProgramme, overrides: Overrides, cover: string, accent: Programme["accent"]): Programme {
  const resolve = (day: number, b: NBlock, seen = new Set<string>()): UI => {
    const id = `${day}.${b.n}`;
    if (overrides[id]) return overrides[id]!(b, p);
    const ref = repeatRef(b);
    if (ref && !seen.has(id)) {
      if (ref.n === "diary") return b.type === "lesson" ? { ui: "lesson" } : { ui: "diary" };
      const target = blockAt(p, ref.day, ref.n);
      if (target) {
        seen.add(id);
        const view = resolve(ref.day, target, seen);
        return view.ui === "entries" || view.ui === "review" ? { ...view, scope: ref.scope } : view;
      }
    }
    return defaultView(b);
  };

  const days: Day[] = p.units.flatMap((u) =>
    u.days.map((d) => {
      const steps: Step[] = [];
      for (const b of d.blocks) {
        const view = resolve(d.day, b);
        // consecutive comparison-matrix blocks: "showing 2 at a time on 1 card"
        if (b.interaction === "comparison-matrix") {
          const item = { situation: b.columns?.[0] ?? "", labels: b.columns?.slice(1) ?? [], lines: b.rows ?? [] };
          const prev = steps.at(-1);
          if (prev?.view.ui === "sort") prev.view.items.push(item);
          else steps.push({ id: `${d.day}.${b.n}`, block: b, view: { ui: "sort", items: [item] } });
          continue;
        }
        steps.push({ id: `${d.day}.${b.n}`, block: b, view });
        // a lesson carrying "Repeat Sleep Diary" in its note (Day 4 has no numbered diary block)
        if (view.ui === "lesson" && repeatRef(b)?.n === "diary") {
          steps.push({ id: `${d.day}.${b.n}-diary`, block: { ...b, title: "Sleep Diary", body: [] }, view: { ui: "diary" } });
        }
      }
      return { ...d, steps };
    }),
  );

  const tools = days.flatMap((d) =>
    d.blocks
      .filter((b) => noteLines(b).some((l) => /available for ever, on demand/i.test(l)))
      .map((b) => ({ day: d.day, n: b.n, title: b.title })),
  );

  return { slug: p.slug, name: p.name.split(" — ")[0]!.trim(), source: p, cover, accent, days, tools };
}

export const programmes: Programme[] = [
  build(sleepJson as NProgramme, sleepOverrides, sleepCover, "night"),
  build(unburnJson as NProgramme, unburnOverrides, unburnCover, "ember"),
];

/** Equip programmes named in the docs whose content isn't in Notion yet. */
export const upcoming = [{ name: "Stressbuster" }, { name: "Productivity Reset" }];

export const getProgramme = (s: string) => programmes.find((p) => p.slug === s);
export const getDay = (p: Programme, day: number) => p.days.find((d) => d.day === day);
export const unitOf = (p: Programme, day: number) => p.source.units.find((u) => u.days.some((d) => d.day === day));
export const focusOf = (p: Programme, unitIndex: number) => p.source.schedule[unitIndex]?.Focus ?? "";
export const minutesOf = (d: Day) => d.blocks.reduce((sum, b) => sum + (b.minutes ?? 0), 0);

/** The Day 1 "Sleep Diary" rows, reused every day the diary repeats. */
export const diaryRows = (p: Programme) =>
  p.source.units.flatMap((u) => u.days).find((d) => d.day === 1)?.blocks.find((b) => b.title === "Sleep Diary")?.listItems ?? [];

export const findStep = (p: Programme, id: string) => {
  const day = Number(id.split(".")[0]);
  return p.days.find((d) => d.day === day)?.steps.find((s) => s.id === id);
};
