import { useCallback, useSyncExternalStore } from "react";
import { instruments } from "./program";
import type { Row } from "./types";

/* ------------------------------------------------------------------ *
 * Per-user progress for Equip, kept in localStorage (no accounts yet).
 * Hydration-safe: the server and first client render see EMPTY.
 * ------------------------------------------------------------------ */

export type EquipState = {
  startedAt: string | null;
  intake: Record<string, string>;
  completed: number[];
  /** instrument key → user rows (seeds are never stored, they come from the model) */
  entries: Record<string, Row[]>;
  /** option_pool instrument key → picked labels */
  pools: Record<string, string[]>;
  /** mood log: unit number → rating 1–5 */
  mood: Record<string, number>;
};

const KEY = "ikan.equip.sleep-tight.v1";

const EMPTY: EquipState = {
  startedAt: null,
  intake: {},
  completed: [],
  entries: {},
  pools: {},
  mood: {},
};

let cache: EquipState | null = null;
const listeners = new Set<() => void>();

function purgeExpired(state: EquipState): EquipState {
  const now = Date.now();
  const entries = { ...state.entries };
  for (const [key, rows] of Object.entries(entries)) {
    const hours = instruments[key]?.retentionHours;
    if (!hours) continue;
    entries[key] = rows.filter((row) => {
      const created = typeof row["createdAt"] === "string" ? Date.parse(row["createdAt"]) : now;
      return now - created < hours * 3_600_000;
    });
  }
  return { ...state, entries };
}

function read(): EquipState {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? purgeExpired({ ...EMPTY, ...(JSON.parse(raw) as Partial<EquipState>) }) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: EquipState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — keep in memory for this session */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const newId = () => `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/** Rows dedupe on the instrument's identity columns (case-insensitive). */
function identityOf(instrument: string, row: Row) {
  const identity = instruments[instrument]?.identity;
  if (!identity?.length) return null;
  return identity
    .map((key) =>
      String(row[key] ?? "")
        .trim()
        .toLowerCase(),
    )
    .join("|");
}

export const equipActions = {
  start(intake: Record<string, string>) {
    const state = read();
    write({ ...state, intake, startedAt: state.startedAt ?? new Date().toISOString() });
  },
  complete(unit: number) {
    const state = read();
    if (state.completed.includes(unit)) return;
    write({ ...state, completed: [...state.completed, unit].sort((a, b) => a - b) });
  },
  addRow(instrument: string, values: Record<string, string | boolean | null>, unit: number) {
    const state = read();
    const row = {
      ...values,
      id: newId(),
      unit: String(unit),
      createdAt: new Date().toISOString(),
    } as Row;
    const rows = state.entries[instrument] ?? [];
    const key = identityOf(instrument, row);
    const next = key
      ? [...rows.filter((r) => identityOf(instrument, r) !== key), row]
      : [...rows, row];
    write({ ...state, entries: { ...state.entries, [instrument]: next } });
  },
  /** Fill fields on an existing row. Seed rows are copied (still marked seed) on first edit. */
  updateRow(instrument: string, row: Row, patch: Record<string, string | boolean | null>) {
    const state = read();
    const rows = state.entries[instrument] ?? [];
    const exists = rows.some((r) => r.id === row.id);
    const next = exists
      ? rows.map((r) => (r.id === row.id ? ({ ...r, ...patch } as Row) : r))
      : [...rows, { ...row, ...patch, seedOf: row.id, id: newId() } as Row];
    write({ ...state, entries: { ...state.entries, [instrument]: next } });
  },
  removeRow(instrument: string, id: string) {
    const state = read();
    const rows = (state.entries[instrument] ?? []).filter((r) => r.id !== id);
    write({ ...state, entries: { ...state.entries, [instrument]: rows } });
  },
  setPool(instrument: string, picks: string[]) {
    const state = read();
    write({ ...state, pools: { ...state.pools, [instrument]: picks } });
  },
  setMood(unit: number, rating: number) {
    const state = read();
    write({ ...state, mood: { ...state.mood, [String(unit)]: rating } });
  },
  reset() {
    write(EMPTY);
  },
};

export function useEquipProgress() {
  const state = useSyncExternalStore(subscribe, read, () => EMPTY);

  /** Seed rows (not yet overridden by the user) followed by the user's own rows. */
  const rowsFor = useCallback(
    (instrument: string, withSeeds = true): Row[] => {
      const own = state.entries[instrument] ?? [];
      if (!withSeeds) return own;
      const copies = new Map(own.filter((r) => r["seedOf"]).map((r) => [r["seedOf"], r]));
      const seeds = (instruments[instrument]?.seeds ?? []).map((s) => copies.get(s.id) ?? s);
      return [...seeds, ...own.filter((r) => !r["seedOf"])];
    },
    [state],
  );

  /** The next unit the user may open — every earlier one is complete. */
  const nextUnit = (() => {
    let n = 0;
    while (state.completed.includes(n)) n += 1;
    return n;
  })();

  return { state, rowsFor, nextUnit, ...equipActions };
}
