/* ------------------------------------------------------------------ *
 * Equip programme model — mirrors the Notion programme docs:
 * programme → units (day ranges) → days → steps (the Notion "blocks").
 * ------------------------------------------------------------------ */

export type FieldType = "text" | "longtext" | "time" | "date" | "yesno";

export type Field = { key: string; label: string; type: FieldType; placeholder?: string };

export type EntryValues = Record<string, string | boolean | null>;

export type Step =
  | { kind: "lesson"; title: string; body: string[]; bullets?: string[]; example?: string }
  /** quiz (single) and checklist (multi) blocks */
  | {
      kind: "choice";
      key: string;
      title: string;
      prompt: string;
      options: { label: string; glyph?: string }[];
      multi?: boolean;
      /** adds a free-text "Other" option */
      other?: boolean;
    }
  | {
      kind: "scale";
      key: string;
      title: string;
      prompt: string;
      min: number;
      max: number;
      unit: string;
    }
  | { kind: "reflect"; key: string; title: string; prompt: string; optional?: boolean }
  /** the Day 1 sleep diary, one question per screen */
  | { kind: "diary"; title: string }
  /** comparison matrix: label each line as a thought or a feeling */
  | {
      kind: "sort";
      title: string;
      prompt: string;
      worked: { situation: string; lines: { text: string; answer: "Thought" | "Feeling" }[] };
      items: { situation: string; lines: string[] }[];
    }
  /** input table as swipeable cards; the user adds as many as they like */
  | {
      kind: "entries";
      collection: string;
      title: string;
      prompt: string;
      fields: Field[];
      example?: EntryValues;
      limit?: number;
      timerSeconds?: number;
    }
  /** pull earlier cards back up and answer one more question on each */
  | {
      kind: "review";
      collection: string;
      title: string;
      prompt: string;
      fields: Field[];
      /** checklist answers to seed as cards before reviewing them */
      seedFrom?: { choiceKey: string; field: string };
      /** lets the user add a fresh card, prompted with these fields plus the review fields */
      addFields?: Field[];
    }
  /** daily habit tracker over the user's habit list */
  | { kind: "tracker"; collection: string; field: string; title: string; prompt: string }
  | { kind: "conclude"; line: string; reflectKey?: string; prompt?: string };

export type Day = { day: number; title: string; subtitle?: string; steps: Step[] };

export type Unit = { n: number; title: string; focus: string; days: Day[] };

export type Programme = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  level: string;
  cover: string;
  units: Unit[];
  /** things the programme wants the user to know before starting */
  notes: string[];
};
