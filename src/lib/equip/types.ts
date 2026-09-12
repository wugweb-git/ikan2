export type Beat = "teach" | "rehearse" | "work" | "close";

export type ProjectionMode = "collect" | "extend" | "review" | "summarise";

export type ColumnType = "text" | "time" | "bool" | "enum";

export type Column = {
  key: string;
  label: string;
  type: ColumnType;
  options?: string[];
  /** added by a later revision — null on earlier rows, retroactively fillable */
  revision?: number;
};

export type Row = Record<string, string | boolean | null> & { id: string; seed?: boolean };

export type InstrumentType =
  | "record"
  | "nested_record"
  | "join"
  | "option_pool"
  | "drill"
  | "scale"
  | "form";

export type Instrument = {
  key: string;
  name: string;
  type: InstrumentType;
  columns?: Column[];
  /** columns that identify a row for dedupe */
  identity?: string[];
  seeds?: Row[];
  childCap?: number;
  retentionHours?: number;
};

export type DrillItem = {
  prompt: string;
  question: string;
  choices: string[];
  reveal?: string;
};

export type PoolOption = { label: string; glyph?: string };

export type Block =
  | { kind: "teach"; id: string; beat: Beat; title: string; body?: string[]; bullets?: string[]; image?: boolean }
  | { kind: "drill"; id: string; beat: Beat; title: string; note?: string; items: DrillItem[] }
  | {
      kind: "pool";
      id: string;
      beat: Beat;
      instrument: string;
      title: string;
      note?: string;
      options: PoolOption[];
      allowOther?: boolean;
      refusal?: boolean;
    }
  | {
      kind: "record";
      id: string;
      beat: Beat;
      instrument: string;
      mode: ProjectionMode;
      title: string;
      note?: string;
      /** only these columns are editable in this projection (defaults to all) */
      fields?: string[];
    }
  | {
      kind: "nested";
      id: string;
      beat: Beat;
      instrument: string;
      mode: ProjectionMode;
      title: string;
      note?: string;
      evaluationAllowed?: boolean;
      timeBoxSeconds?: number;
    }
  | {
      kind: "timed";
      id: string;
      beat: Beat;
      instrument: string;
      title: string;
      note?: string;
      seconds: number;
      retentionNote?: string;
    }
  | { kind: "scale"; id: string; beat: Beat; instrument: string; title: string; note?: string }
  | { kind: "diary"; id: string; beat: Beat; title: string; note?: string }
  | { kind: "summarise"; id: string; beat: Beat; instrument: string; title: string; note?: string }
  | { kind: "close"; id: string; beat: Beat; line: string };

export type Unit = {
  n: number;
  title: string;
  component: string;
  minutes: number;
  blocks: Block[];
  /** rehearsal units have no spine — the standing set is the unit */
  rehearsal?: boolean;
  needsClinicalCall?: boolean;
};

export type StandingEntry = { instrument: string; from: number };
