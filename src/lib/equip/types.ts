import type { NBlock, NDay, NProgramme } from "./notion";

export type FieldType = "text" | "longtext" | "time" | "date" | "datetime" | "yesno" | "select";

export type Field = {
  key: string;
  /** visible label, verbatim from Notion; empty for Notion's "blank text" cards */
  label: string;
  type: FieldType;
  options?: string[];
};

export type EntryValues = Record<string, string | boolean | null>;

/** How a Notion block is presented. The block itself supplies every visible string. */
export type UI =
  | { ui: "lesson"; cards?: { title: string; text?: string[]; items: string[]; footer?: string }[] }
  | {
      ui: "choice";
      prompt: string;
      options: { label: string; glyph?: string }[];
      multi: boolean;
      /** an option (e.g. "Others") that opens a text field */
      otherOption?: string;
      table?: string[][];
      cards?: boolean;
    }
  | { ui: "scale"; prompt: string; min: number; max: number }
  | { ui: "text"; prompt: string; dependsOn?: { key: string; equals: string } }
  | { ui: "diary" }
  | {
      ui: "sort";
      items: { situation: string; lines: string[]; labels: string[] }[];
      perCard: number;
    }
  | {
      ui: "entries";
      collection: string;
      prompt?: string;
      fields: Field[];
      example?: EntryValues;
      limit?: number;
      /** "today": only cards added today are shown (Notion "New entries only") */
      scope: "today" | "all";
      /** a plain list: "add 3 things with add more once 3 have been entered", "Limit to 10" */
      list?: { initial: number; max?: number };
      retentionHours?: number;
      editable?: string[];
    }
  | {
      ui: "review";
      collection: string;
      /** collections whose cards are pulled up (defaults to `collection`) */
      from?: string[];
      prompt: string;
      fields: Field[];
      addFields?: Field[];
      seedFrom?: { choiceKey: string; field: string };
      seeds?: EntryValues[];
      example?: string[];
      scope: "today" | "all";
      /** each card is asked once: cards answered on an earlier day aren't asked again */
      once?: boolean;
      /** a matching answer copies the card into another collection, e.g. a chosen ritual becomes a
       * tracked habit; changing the answer back removes the copy */
      promote?: { collection: string; field: string; from: string; when: string };
    }
  | { ui: "tracker"; collection: string; field: string; prompt: string; note?: string }
  | { ui: "statements"; prompt: string; statements: string[]; options: string[] }
  | { ui: "conclude"; prompt?: string };

export type Step = { id: string; block: NBlock; view: UI };

export type Day = NDay & { steps: Step[] };

export type Programme = {
  slug: string;
  name: string;
  source: NProgramme;
  cover: string;
  accent: "night" | "ember" | "calm" | "mind";
  days: Day[];
  /** exercises Notion marks "available for ever, on demand", unlocked once reached */
  tools: { day: number; n: number; title: string }[];
};
