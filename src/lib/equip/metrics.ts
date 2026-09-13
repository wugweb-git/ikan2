export type DiaryEntry = {
  bed?: string;
  tried?: string;
  latency?: number;
  wakings?: number;
  awake?: number;
  woke?: string;
  up?: string;
  quality?: number;
};

const toMinutes = (value: string | undefined) => {
  if (!value || !/^\d{1,2}:\d{2}$/.test(value)) return null;
  const [h, m] = value.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

/** Minutes from a to b, wrapping past midnight. */
const span = (a: number, b: number) => (b - a <= 0 ? b - a + 1440 : b - a);

export type NightMetrics = { inBed: number; asleep: number; efficiency: number };

/**
 * Time in bed: went to bed → got out of bed.
 * Time asleep: tried to sleep → woke up, minus time to fall asleep and time awake in the night.
 * Descriptive only; no target is prescribed.
 */
export function nightMetrics(e: DiaryEntry): NightMetrics | null {
  const bed = toMinutes(e.bed);
  const up = toMinutes(e.up);
  const tried = toMinutes(e.tried) ?? bed;
  const woke = toMinutes(e.woke) ?? up;
  if (bed === null || up === null || tried === null || woke === null) return null;
  const inBed = span(bed, up);
  const asleep = Math.max(
    0,
    Math.min(inBed, span(tried, woke) - (e.latency ?? 0) - (e.awake ?? 0)),
  );
  return { inBed, asleep, efficiency: Math.round((asleep / inBed) * 100) };
}

export const formatDuration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h}h ${m}m` : `${h}h`;
};

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const formatTime = (value: string | undefined) => {
  const m = toMinutes(value);
  if (m === null) return "Set time";
  const h = Math.floor(m / 60);
  const suffix = h >= 12 ? "pm" : "am";
  return `${h % 12 || 12}:${String(m % 60).padStart(2, "0")} ${suffix}`;
};
