import { severityColors } from "@/components/assessment/ui";
import type { headlineOf } from "@/lib/assessment/scoring";
import { percentOfRange } from "@/lib/assessment/scoring";

type Point = { head: ReturnType<typeof headlineOf> };

/** Headline score over time, oldest to newest, drawn as position within the instrument's range. */
export function Trend({ points, className }: { points: Point[]; className?: string }) {
  const w = 300;
  const h = 72;
  const pad = 8;
  const xy = points.map(({ head }, i) => {
    const p = head?.value != null ? percentOfRange(head.profile, head.value) : 0;
    return {
      x: pad + (i * (w - pad * 2)) / Math.max(1, points.length - 1),
      y: pad + (1 - p) * (h - pad * 2),
      severity: head?.band?.severity,
    };
  });
  const better = points[0]?.head?.profile.direction === "better";
  return (
    <div className={className ?? "rounded-[12px] bg-background px-3 py-2"}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-[72px] w-full"
        role="img"
        aria-label="Score over time"
      >
        <polyline
          points={xy.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {xy.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill={p.severity ? severityColors[p.severity].bar : "currentColor"}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
      <p className="type-label-md text-muted-foreground">
        {better ? "Higher is better" : "Lower is better"}
      </p>
    </div>
  );
}
