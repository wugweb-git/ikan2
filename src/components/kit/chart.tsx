import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Charts.
 *
 * Four shapes cover every chart in the app, and all four were hand-drawn per screen before
 * this: a line over time (mood, scores), a ring gauge (the wellness score), a column series
 * (the wellness metric rows) and a small dial (per-metric completion).
 *
 * Rules that hold for all of them:
 *   - SVG, no chart library: these are small, fixed shapes and the bundle stays small.
 *   - `label` is required, not optional. A chart with no text alternative is a decoration,
 *     and a decoration should pass `aria-hidden` instead by leaving `label` empty.
 *   - Colour comes from tokens or `currentColor`, never a literal.
 *   - Every transition is paired with `motion-reduce:transition-none`.
 *   - Gaps in the data are gaps in the line, not zeroes: `null` breaks the series into
 *     segments rather than dropping it to the floor, which would read as a bad day.
 */

type Series = (number | null)[];

/** Scales a series into viewBox points, keeping `null` as a hole. */
const project = (values: Series, w: number, h: number, pad: number, min: number, max: number) => {
  const span = max - min || 1;
  const step = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0;
  return values.map((v, i) =>
    v === null ? null : { x: pad + i * step, y: pad + (1 - (v - min) / span) * (h - pad * 2) },
  );
};

export function Sparkline({
  values,
  min = 0,
  max = 100,
  label,
  gridAt,
  stroke = "var(--accent)",
  dot = "var(--accent-strong)",
  width = 300,
  height = 72,
  className,
}: {
  values: Series;
  min?: number | undefined;
  max?: number | undefined;
  /** Describes the whole chart for a screen reader. Empty string marks it decorative. */
  label: string;
  /** Horizontal guides, in data units. */
  gridAt?: number[] | undefined;
  stroke?: string | undefined;
  dot?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  className?: string | undefined;
}) {
  const pad = 8;
  const pts = project(values, width, height, pad, min, max);

  /* split on the holes, so a missing day leaves a break instead of a dive to zero */
  const segments: { x: number; y: number }[][] = [];
  let run: { x: number; y: number }[] = [];
  pts.forEach((p) => {
    if (p) run.push(p);
    else if (run.length) {
      segments.push(run);
      run = [];
    }
  });
  if (run.length) segments.push(run);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block h-auto w-full", className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {gridAt?.map((v) => {
        const y = pad + (1 - (v - min) / (max - min || 1)) * (height - pad * 2);
        return (
          <line
            key={v}
            x1={pad}
            x2={width - pad}
            y1={y}
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.08"
          />
        );
      })}
      {segments.map((s, i) => (
        <polyline
          key={i}
          points={s.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {pts.map((p, i) =>
        p ? (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={dot} stroke="white" strokeWidth="2" />
        ) : null,
      )}
    </svg>
  );
}

/** The big score gauge: a stroked arc that animates to its value. */
export function ProgressRing({
  value,
  max = 100,
  label,
  size = 200,
  thickness = 16,
  from = "var(--calm)",
  via = "var(--mind)",
  to = "var(--accent)",
  track = "rgba(255,255,255,0.12)",
  children,
  className,
}: {
  /** `null` draws an empty ring, for before the first result exists. */
  value: number | null;
  max?: number | undefined;
  label: string;
  size?: number | undefined;
  thickness?: number | undefined;
  from?: string | undefined;
  via?: string | undefined;
  to?: string | undefined;
  track?: string | undefined;
  /** What sits in the middle — usually the number and its band. */
  children?: ReactNode | undefined;
  className?: string | undefined;
}) {
  const gradient = useId();
  const r = size / 2 - thickness / 2 - 4;
  const circumference = 2 * Math.PI * r;
  const pct = value === null ? 0 : Math.min(1, Math.max(0, value / max));

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full -rotate-90"
        {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      >
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={from} />
            <stop offset="0.6" stopColor={via} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradient})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
      ) : null}
    </div>
  );
}

/** A column series. Heights are a share of the tallest bar, so the shape survives any unit. */
export function Bars({
  values,
  max,
  label,
  color = "var(--accent)",
  trackColor = "var(--secondary)",
  height = 28,
  className,
}: {
  values: Series;
  /** Fixed ceiling. Defaults to the largest value present. */
  max?: number | undefined;
  label: string;
  color?: string | undefined;
  trackColor?: string | undefined;
  height?: number | undefined;
  className?: string | undefined;
}) {
  const top = max ?? Math.max(1, ...values.map((v) => v ?? 0));
  return (
    <span
      className={cn("flex flex-1 items-end gap-[2px]", className)}
      style={{ height }}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {values.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-t-[3px] transition-[height] duration-500 motion-reduce:transition-none"
          style={{
            height: v === null ? "3px" : `${Math.max(8, (v / top) * 100)}%`,
            background: v === null ? trackColor : color,
          }}
        />
      ))}
    </span>
  );
}

/** A small conic dial for one share — "4 of 7 days". Reads its value from the token the
 *  `ring-dial` utility already expects, so the two stay interchangeable. */
export function Dial({
  value,
  max = 100,
  label,
  color = "var(--calm)",
  size = 46,
  children,
  className,
}: {
  value: number;
  max?: number | undefined;
  label: string;
  color?: string | undefined;
  size?: number | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}) {
  const pct = `${Math.min(100, Math.max(0, (value / max) * 100))}%`;
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} 0 ${pct}, var(--secondary) ${pct})`,
      }}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <span
        className="grid place-items-center rounded-full bg-card font-display text-[11px] font-bold"
        style={{ width: size - 10, height: size - 10 }}
      >
        {children}
      </span>
    </span>
  );
}
