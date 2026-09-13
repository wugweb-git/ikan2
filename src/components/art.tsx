import { useId } from "react";
import { cn } from "@/lib/utils";
import type { Art } from "@/lib/resources";

/* Abstract illustrations for articles and empty states, drawn in SVG so they stay sharp and
 * light. One scene per topic; colours are fixed so they read the same on any card. */

const palettes: Record<Art, [string, string, string]> = {
  stress: ["#FDE7D8", "#F6B48F", "#C4552E"],
  burnout: ["#FBEFD2", "#F2C46B", "#9A6512"],
  work: ["#E4ECF7", "#9DB8DE", "#2F5580"],
  anxiety: ["#E6E7F6", "#A9ADE3", "#3B418C"],
  mood: ["#F9E2E9", "#E9A3B9", "#8C3652"],
  sleep: ["#1F2A44", "#3D4E7A", "#F4E3A1"],
  measure: ["#DFF0E8", "#8CC7AC", "#2B634D"],
  checkup: ["#E3F1F6", "#8FC6D8", "#236174"],
};

export function Illustration({ art, className }: { art: Art; className?: string }) {
  const id = useId().replace(/:/g, "");
  const [bg, mid, ink] = palettes[art];
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bg} />
          <stop offset="1" stopColor={mid} stopOpacity={art === "sleep" ? 1 : 0.55} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#g${id})`} />
      {art === "stress" ? (
        <g fill="none" stroke={ink} strokeLinecap="round">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M-10 ${70 + i * 22} C 60 ${40 + i * 22}, 110 ${110 + i * 22}, 180 ${70 + i * 22} S 290 ${40 + i * 22}, 340 ${80 + i * 22}`}
              strokeWidth={6 - i}
              strokeOpacity={0.9 - i * 0.15}
            />
          ))}
          <circle cx="250" cy="52" r="22" fill={ink} fillOpacity="0.9" stroke="none" />
        </g>
      ) : null}
      {art === "burnout" ? (
        <g>
          <circle cx="160" cy="118" r="70" fill={mid} fillOpacity="0.6" />
          <path
            d="M160 48 C 196 92, 206 120, 184 156 C 176 170, 144 172, 136 156 C 120 128, 132 98, 160 48 Z"
            fill={ink}
            fillOpacity="0.9"
          />
          <path
            d="M160 104 C 174 124, 176 138, 168 152 C 162 160, 154 160, 150 152 C 144 140, 148 126, 160 104 Z"
            fill={bg}
          />
          <rect x="60" y="176" width="200" height="6" rx="3" fill={ink} fillOpacity="0.35" />
        </g>
      ) : null}
      {art === "work" ? (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={48 + i * 40}
              y={150 - [40, 70, 55, 95, 80, 120][i]!}
              width="24"
              height={[40, 70, 55, 95, 80, 120][i]}
              rx="6"
              fill={ink}
              fillOpacity={0.35 + i * 0.1}
            />
          ))}
          <path d="M40 150 H 290" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <circle cx="262" cy="40" r="14" fill="none" stroke={ink} strokeWidth="4" />
        </g>
      ) : null}
      {art === "anxiety" ? (
        <g fill="none" stroke={ink}>
          {[26, 46, 66, 86, 106].map((r, i) => (
            <circle
              key={r}
              cx="160"
              cy="100"
              r={r}
              strokeWidth={3}
              strokeOpacity={1 - i * 0.17}
              strokeDasharray={i % 2 ? "6 10" : undefined}
            />
          ))}
          <circle cx="160" cy="100" r="10" fill={ink} stroke="none" />
        </g>
      ) : null}
      {art === "mood" ? (
        <g>
          <path
            d="M0 150 C 60 120, 110 170, 170 140 S 270 110, 320 130 V200 H0Z"
            fill={ink}
            fillOpacity="0.25"
          />
          <path
            d="M0 170 C 70 150, 120 190, 190 165 S 280 150, 320 160 V200 H0Z"
            fill={ink}
            fillOpacity="0.45"
          />
          <circle cx="112" cy="76" r="30" fill="#FFF7E6" />
          <circle cx="126" cy="70" r="26" fill={bg} />
          {[
            [220, 52],
            [250, 82],
            [196, 92],
          ].map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r="4" fill={ink} fillOpacity="0.7" />
          ))}
        </g>
      ) : null}
      {art === "sleep" ? (
        <g>
          <circle cx="222" cy="72" r="34" fill={ink} />
          <circle cx="238" cy="62" r="30" fill={mid} />
          {[
            [60, 40],
            [96, 80],
            [140, 36],
            [40, 120],
            [290, 140],
            [180, 110],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 ? 2 : 3} fill={ink} fillOpacity="0.9" />
          ))}
          <path d="M0 170 C 80 140, 160 190, 320 150 V200 H0Z" fill="#141C30" />
        </g>
      ) : null}
      {art === "measure" ? (
        <g>
          <path
            d="M60 150 A 100 100 0 0 1 260 150"
            fill="none"
            stroke={ink}
            strokeOpacity="0.2"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M60 150 A 100 100 0 0 1 214 72"
            fill="none"
            stroke={ink}
            strokeWidth="18"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="150"
            x2="214"
            y2="92"
            stroke={ink}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="160" cy="150" r="10" fill={ink} />
        </g>
      ) : null}
      {art === "checkup" ? (
        <g>
          <rect x="92" y="36" width="136" height="140" rx="18" fill="#FFFFFF" fillOpacity="0.85" />
          <path
            d="M112 106 H 138 L 150 80 L 168 132 L 182 100 H 208"
            fill="none"
            stroke={ink}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x="112"
              y={144 + i * 0}
              width={[60, 40, 80][i]}
              height="6"
              rx="3"
              fill={ink}
              fillOpacity="0.25"
              transform={`translate(0 ${i * 0})`}
            />
          ))}
          <circle cx="228" cy="40" r="18" fill={ink} />
          <path d="M221 40 h14 M228 33 v14" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
}

/** Monogram avatar with a soft two-tone gradient from a hue. */
export function Avatar({
  text,
  hue,
  size = 56,
  className,
}: {
  text: string;
  hue: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-display font-semibold",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        color: `hsl(${hue} 45% 22%)`,
        background: `radial-gradient(circle at 30% 25%, hsl(${hue} 80% 92%), hsl(${hue} 55% 78%))`,
        boxShadow: `inset 0 0 0 2px hsl(${hue} 60% 96%)`,
      }}
    >
      {text}
    </span>
  );
}
