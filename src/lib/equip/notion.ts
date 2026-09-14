/* ------------------------------------------------------------------ *
 * Shape of src/lib/equip/content/*.json, copied from the Notion programme pages
 * on 2026-09-13. All strings are verbatim from Notion.
 * ------------------------------------------------------------------ */

export type BodyItem = { kind: "p" | "li" | "ol"; text: string };

export type Note =
  | { kind: "text" | "li" | "ol" | "quote"; text: string }
  | { kind: "divider" }
  | { kind: "table"; rows: string[][] };

export type NBlock = {
  n: number;
  title: string;
  type: string;
  interaction?: string;
  key?: string;
  group?: string;
  minutes?: number;
  body: BodyItem[];
  notes: Note[];
  prompt?: string;
  options?: string[];
  columns?: string[];
  rows?: string[];
  constraints?: { min?: number; max?: number } | string;
  rules?: { dependsOn?: string } | string;
  uiHints?: string;
  listItems?: string[];
  quoteText?: string[];
  tables?: string[][][];
  userMayAddRows?: boolean;
};

export type NDay = {
  day: number;
  title: string;
  kind: string;
  declaredBlocks: number;
  subtitle: string | null;
  blocks: NBlock[];
  notes?: Note[];
};

export type NUnit = { n: number; title: string; days: NDay[]; notes: Note[] };

export type NProgramme = {
  slug: string;
  source: string;
  name: string;
  tagline?: string;
  description: string;
  meta: { id: string; days: string; blocks: string; category: string; level: string };
  schedule: { Days: string; Unit: string; Focus: string }[];
  units: NUnit[];
};

/* ---------------------------- note helpers ---------------------------- */

const textOf = (n: Note) => ("text" in n ? n.text : "");

export const noteLines = (b: NBlock) => b.notes.map(textOf).filter(Boolean);

/** The line right after a marker line such as "Prompt" or "For this task, prompt". */
export function lineAfter(b: NBlock, marker: RegExp): string | undefined {
  const lines = noteLines(b);
  const i = lines.findIndex((l) => marker.test(l));
  return i >= 0 ? stripQuotes(lines[i + 1] ?? "") : undefined;
}

/** Bullet items that follow a marker line, up to the next non-bullet line. */
export function bulletsAfter(b: NBlock, marker: RegExp): string[] {
  const i = b.notes.findIndex((n) => marker.test(textOf(n)));
  if (i < 0) return [];
  const out: string[] = [];
  for (const n of b.notes.slice(i + 1)) {
    if (n.kind === "li" || n.kind === "ol") out.push(n.text);
    else if (out.length) break;
  }
  return out;
}

/** Options written on one line, e.g. "✅Yes ❌No", or on the lines after "Options". */
export function optionsAfter(b: NBlock): string[] {
  const lines = noteLines(b);
  const i = lines.findIndex((l) => /^Options:?$/i.test(l.trim()));
  if (i < 0) return [];
  const rest = lines.slice(i + 1);
  const first = rest[0] ?? "";
  if (/^✅\s*Yes\s*❌\s*No$/.test(first.trim())) return ["✅Yes", "❌No"];
  return rest.filter((l) => /^\p{Extended_Pictographic}/u.test(l.trim())).map((l) => l.trim());
}

export const firstTable = (b: NBlock) => {
  const t = b.notes.find((n): n is Extract<Note, { kind: "table" }> => n.kind === "table");
  return t?.rows ?? b.tables?.[0];
};

/** "I have to … → The document … → …" example cards from the notes. */
export const exampleCard = (b: NBlock) => {
  const i = noteLines(b).findIndex((l) => /^Example Card$/i.test(l.trim()));
  const line = i >= 0 ? noteLines(b)[i + 1] : undefined;
  return line ? line.split("→").map((s) => s.trim()) : undefined;
};

export const stripQuotes = (s: string) =>
  s
    .trim()
    .replace(/^[“"‘']|[”"’']$/g, "")
    .trim();

/** Split an emoji-led run like "😊 Woke up refreshed 💤 Slept soundly" into options. */
export function splitEmojiOptions(s: string) {
  return s
    .split(/(?=\p{Extended_Pictographic})/u)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^(\p{Extended_Pictographic}️?)\s*(.*)$/u);
      return m ? { glyph: m[1]!, label: m[2]!.trim() } : { label: part };
    });
}

/** Content blocks that aren't meant for users (e.g. "(empty block — no content …)"). */
export const visibleBody = (b: NBlock) => b.body.filter((i) => !/^\*?\(empty block/i.test(i.text));

/** "Repeat task 2 from day 4", "Repeat Tasks 6 from Day 13", "Repeat of task 3 from day 25". */
export function repeatRef(
  b: NBlock,
): { day: number; n: number | "diary"; scope: "today" | "all" } | null {
  const text = noteLines(b).join(" ");
  if (/Repeat Sleep Diary from day 1/i.test(text)) return { day: 1, n: "diary", scope: "all" };
  const m = text.match(/Repeat (?:of )?(?:task|tasks|exercise)\s+(\d+)\s+from\s+day\s+(\d+)/i);
  if (!m) return null;
  const today = /New entries only|only give options to add new cards/i.test(text);
  return { day: Number(m[2]), n: Number(m[1]), scope: today ? "today" : "all" };
}

/** "Prompt: What has been stressing you recently?" written inline in a note. */
export const inlinePrompt = (b: NBlock) => {
  for (const l of noteLines(b)) {
    const m = l.match(/Prompt:\s*(.+)$/);
    if (m) return stripQuotes(m[1]!);
  }
  return undefined;
};

/** "User lists things down. Limit to 10." */
export const listLimit = (b: NBlock) => {
  const m = noteLines(b)
    .join(" ")
    .match(/Limit (?:rituals )?to (\d+)/i);
  return m ? Number(m[1]) : undefined;
};

/** "Tasks 2-5 can be done by showing 2 at a time on 1 card" */
export const groupedRange = (b: NBlock) => {
  const m = noteLines(b)
    .join(" ")
    .match(/Tasks (\d+)\s*-\s*(\d+) can be done by showing (\d+) at a time/i);
  return m ? { from: Number(m[1]), to: Number(m[2]), perCard: Number(m[3]) } : null;
};
