import writeups from "./writeups.json";

/* The write-ups for each assessment and programme, from the old iKan app (assessment_def and
 * equip records), shaped for the detail pages and the "Before you start" sheet.
 *
 * Kept verbatim except where the old copy was wrong for this app:
 *  - "Takes about 5 minutes" was the same on every assessment; the real length is used instead
 *  - lines about progress being saved on the device / pausing are left out (removed from the UI)
 *  - a tile that only described a decorative image is not shown
 *  - day counts come from the programme's actual days, not the old text (30 vs 35 days) */

type Raw = Record<string, string | string[] | undefined>;
const A = writeups.assessments as Record<string, Raw>;
const P = writeups.programmes as Record<string, Raw>;

export type Section = { title: string; paragraphs: string[]; bullets: string[] };

const stems = (x: string) =>
  new Set(
    x
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter(
        (w) =>
          w.length > 3 &&
          !["your", "each", "with", "that", "this", "there", "based", "about"].includes(w),
      )
      .map((w) => w.replace(/(ing|ed|es|s)$/, "")),
  );

/** Drop items that say the same thing as an earlier one (two or more shared key words,
 * or "no right or wrong answers" vs "no correct answers"). */
export function dedupe(items: string[]): string[] {
  const kept: string[] = [];
  for (const item of items) {
    const a = stems(item);
    const same = kept.some((k) => {
      const b = stems(k);
      const shared = [...a].filter((w) => b.has(w)).length;
      const bothAnswers =
        /answer/i.test(item) &&
        /answer/i.test(k) &&
        /(right|wrong|correct)/i.test(item) &&
        /(right|wrong|correct)/i.test(k);
      return shared >= 2 || bothAnswers;
    });
    if (!same) kept.push(item);
  }
  return kept;
}

const hidden = /saved automatically|pause and return|pick up where|stay on (this|your) device/i;

const str = (v: Raw[string]) => (typeof v === "string" ? v.trim() : "");
const list = (v: Raw[string]) =>
  (Array.isArray(v) ? v : typeof v === "string" && v ? [v] : [])
    .map((x) => x.trim())
    .filter((x) => x && x.toLowerCase() !== "yes" && !hidden.test(x));

const isHeading = (block: string) =>
  !block.includes("\n") && !block.startsWith("- ") && block.length < 60 && !/[.!:]$/.test(block);

/** "Heading\n\nparagraph\n\n- bullet\n\nNext heading\n\n…" → sections, one per heading. */
function parseSections(text: string | undefined, fallbackTitle = ""): Section[] {
  if (!text || /decorative only/i.test(text)) return [];
  const out: Section[] = [];
  let cur: Section = { title: fallbackTitle, paragraphs: [], bullets: [] };
  for (const raw of text.split(/\n{2,}/)) {
    const block = raw.trim();
    if (!block) continue;
    // "Important\nThis assessment is not a diagnosis…": a heading glued to its paragraph
    const glued = block.match(/^([^\n]{1,40})\n([\s\S]+)$/);
    if (glued && isHeading(glued[1]!) && !glued[2]!.trim().startsWith("- ")) {
      if (cur.paragraphs.length || cur.bullets.length) out.push(cur);
      cur = {
        title: glued[1]!.trim(),
        paragraphs: [glued[2]!.replace(/\s+/g, " ").trim()],
        bullets: [],
      };
      continue;
    }
    if (isHeading(block)) {
      if (cur.paragraphs.length || cur.bullets.length || cur.title !== fallbackTitle) out.push(cur);
      cur = { title: block, paragraphs: [], bullets: [] };
      continue;
    }
    const lines = block.split("\n").map((l) => l.trim());
    if (lines.every((l) => l.startsWith("- "))) cur.bullets.push(...lines.map((l) => l.slice(2)));
    else cur.paragraphs.push(lines.join(" ").replace(/\s+/g, " "));
  }
  if (cur.paragraphs.length || cur.bullets.length) out.push(cur);
  return out
    .map((x) => ({ ...x, bullets: x.bullets.filter((b) => !hidden.test(b)) }))
    .filter((x) => x.paragraphs.length || x.bullets.length);
}

const parseTile = (text: string | undefined, fallbackTitle = ""): Section | null =>
  parseSections(text, fallbackTitle)[0] ?? null;

/** "This assessment is not a diagnosis. It's a way to …" → "Not a diagnosis or an emergency service. It's a way to …" */
const shortImportant = (para: string | undefined, who: string) => {
  const rest = (para ?? "").split(/(?<=\.)\s+/).slice(1).join(" ");
  const age = /18\+/.test(who) ? " For adults 18 and over." : "";
  return `A self-help check, not a diagnosis or an emergency service.${rest ? ` ${rest}` : ""}${age}`;
};

export type AssessmentAbout = {
  intro: string;
  what: Section | null;
  looksAt: string[];
  how: Section | null;
  youllSee: Section | null;
  remember: string[];
  whoFor: string;
  important: string[];
  importantShort: string;
};

export function assessmentAbout(slug: string, minutes: number): AssessmentAbout | null {
  const a = A[slug];
  if (!a) return null;
  const raw = (n: number) => str(a[`metadata.tile${n}_content`]);
  // tile 1 carries "What is this assessment?", "What it measures", "Number of questions", "Important"
  const one = parseSections(raw(1), "What is this assessment?");
  const find = (re: RegExp) => one.find((x) => re.test(x.title));
  const what = one[0] ?? null;
  const measures = find(/measure/i);
  const importantPara = find(/^important/i)?.paragraphs ?? [];
  const how = parseTile(raw(3), "How it works");
  const five = parseTile(raw(5), "Important notes");
  // one assessment repeats "How it works" in the important-notes tile; fall back to the shared notes
  const notes =
    five && /important/i.test(five.title)
      ? five.bullets
      : [
          "This is a self-help and awareness tool, not a medical diagnosis",
          "Not intended for emergency or crisis situations",
        ];
  return {
    intro: str(a["description"]),
    what: what ? { ...what, bullets: [] } : null,
    looksAt: measures?.bullets.length ? measures.bullets : list(a["section2_bullets"]),
    how: how
      ? {
          ...how,
          // "results appear immediately" is what "After you finish" is about
          bullets: [
            ...how.bullets.filter((b) => !/results (appear|are shown)/i.test(b)),
            `Takes about ${minutes} minutes`,
          ],
        }
      : { title: "How it works", paragraphs: [], bullets: [`Takes about ${minutes} minutes`] },
    youllSee: parseTile(raw(4), "What you’ll see"),
    remember: list(a["section4_notes"]),
    whoFor: str(a["section1_who_content"]),
    importantShort: shortImportant(importantPara[0], str(a["section1_who_content"])),
    // the "not a diagnosis" paragraph already says what the first shared note says
    important: [
      ...importantPara,
      ...notes.filter(
        (n) => !(importantPara.length && /not a (medical|clinical)?.*diagnosis/i.test(n)),
      ),
    ],
  };
}

export type ProgrammeAbout = {
  intro: string;
  description: string;
  whoFor: string[];
  included: string[];
  how: string[];
  outcomes: { title: string; text: string }[];
  important: string[];
};

export function programmeAbout(slug: string, days: number): ProgrammeAbout | null {
  const p = P[slug];
  if (!p) return null;
  const fixDays = (s: string) =>
    s
      .replace(/\b\d+\s+days\b/g, `${days} days`)
      .replace(/\b\d+-day\b/g, `${days}-day`)
      .replace(/\s{2,}/g, " ");
  const who = list(p["repo_editor_placeholder_eligibility"]);
  return {
    intro: fixDays(str(p["metadata.tile1_content"])),
    description: fixDays(str(p["description"]).replace(/\s*\n\s*\./, ".")),
    whoFor: who.length ? who.slice(1) : [],
    included: list(p["metadata.tile2_content"]),
    how: list(p["metadata.tile3_content"]),
    outcomes: list(p["metadata.tile4_content"]).map((o) => {
      const [title, ...rest] = o.split(/\.\s+|\s+-\s+/);
      return { title: title!.trim(), text: rest.join(". ").trim() };
    }),
    important: [
      "This is a self-help program, not medical treatment or a diagnosis",
      "Not intended for emergency or crisis situations. If you feel unsafe, get support now",
      "If what you’re going through feels severe or doesn’t ease, speak with a professional",
      "Go at your own pace, and come back to any day you’ve finished",
    ],
  };
}
