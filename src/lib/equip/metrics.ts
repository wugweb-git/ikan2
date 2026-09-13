import type { Row } from "./types";

const toMinutes = (value: unknown) => {
  if (typeof value !== "string" || !/^\d{1,2}:\d{2}$/.test(value)) return null;
  const [h, m] = value.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

const toCount = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export type NightMetrics = { windowMin: number; asleepMin: number; efficiency: number };

/**
 * Sleep window = got in bed → got out of bed (wrapping past midnight).
 * Time asleep = window minus minutes to fall asleep and minutes awake inside it.
 * Descriptive only — no restriction threshold is prescribed (pending a clinical call).
 */
export function nightMetrics(row: Partial<Row>): NightMetrics | null {
  const inBed = toMinutes(row["in_bed"]);
  const outOfBed = toMinutes(row["out_of_bed"]);
  if (inBed === null || outOfBed === null) return null;
  let windowMin = outOfBed - inBed;
  if (windowMin <= 0) windowMin += 24 * 60;
  const asleepMin = Math.max(0, windowMin - toCount(row["latency"]) - toCount(row["awake"]));
  return { windowMin, asleepMin, efficiency: Math.round((asleepMin / windowMin) * 100) };
}

export const formatDuration = (min: number) =>
  `${Math.floor(min / 60)}h ${String(Math.round(min % 60)).padStart(2, "0")}m`;
