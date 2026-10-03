import { useId, useState } from "react";
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
  wellbeing: ["#EAF3DB", "#A9CE82", "#3C6B27"],
  confidence: ["#EFE7FA", "#B79DE2", "#4B2E86"],
  resilience: ["#E7EAF0", "#A6B2C6", "#33415C"],
  worry: ["#E7EAFB", "#9AA6EA", "#2E3A8C"],
  lowmood: ["#F4E7F1", "#D2A2C7", "#6C2F60"],
  kindness: ["#F7EDE2", "#E0C3A3", "#8A5A33"],
  routine: ["#EDF0DF", "#BFCB8E", "#5A6B23"],
  report: ["#E4EFF0", "#93C0C4", "#1E5A60"],
  night: ["#2A2340", "#4A3F6B", "#E6C77D"],
  pause: ["#F3EFE6", "#D9CBA8", "#7A6530"],
  breathe: ["#E6F2F4", "#A2CDD6", "#276873"],
  pressure: ["#F0E9F4", "#C3A8D4", "#5C3570"],
  overload: ["#FCEAE6", "#F0A99B", "#9E3621"],
  toolkit: ["#F6ECEA", "#DDB4AE", "#8B4A42"],
  unwind: ["#E4F0EF", "#9CC9C4", "#275E58"],
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
      {art === "wellbeing" ? (
        <g>
          {[-140, -115, -90, -65, -40].map((deg) => {
            const a = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={160 + Math.cos(a) * 48}
                y1={96 + Math.sin(a) * 48}
                x2={160 + Math.cos(a) * 76}
                y2={96 + Math.sin(a) * 76}
                stroke={ink}
                strokeWidth="7"
                strokeLinecap="round"
                strokeOpacity="0.85"
              />
            );
          })}
          <circle cx="160" cy="96" r="34" fill={ink} fillOpacity="0.9" />
          <path
            d="M0 152 C 70 126, 130 166, 200 146 S 290 130, 320 142 V200 H0Z"
            fill={ink}
            fillOpacity="0.3"
          />
        </g>
      ) : null}
      {art === "confidence" ? (
        <g>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={70 + i * 63}
              y={150 - [40, 72, 104][i]!}
              width="54"
              height={[40, 72, 104][i]}
              rx="10"
              fill={ink}
              fillOpacity={0.35 + i * 0.2}
            />
          ))}
          <circle cx="223" cy="30" r="14" fill={ink} />
          <path
            d="M56 152 H 264"
            stroke={ink}
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />
        </g>
      ) : null}
      {art === "resilience" ? (
        <g>
          <path
            d="M70 156 Q 100 116 130 156 Q 165 76 200 156 Q 235 34 270 156"
            fill="none"
            stroke={ink}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 10"
            strokeOpacity="0.7"
          />
          <circle cx="235" cy="40" r="14" fill={ink} />
          <path
            d="M40 158 H 286"
            stroke={ink}
            strokeWidth="5"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />
        </g>
      ) : null}
      {art === "worry" ? (
        <g fill="none" stroke={ink}>
          <circle cx="126" cy="100" r="52" strokeWidth="5" strokeOpacity="0.85" />
          <circle
            cx="194"
            cy="100"
            r="52"
            strokeWidth="5"
            strokeOpacity="0.55"
            strokeDasharray="7 11"
          />
          <circle cx="160" cy="100" r="8" fill={ink} stroke="none" />
        </g>
      ) : null}
      {art === "pause" ? (
        /* a run of hurried marks, and the one gap you give yourself inside it */
        <g>
          {Array.from({ length: 13 }, (_, i) => i).map((i) => {
            const x = 34 + i * 21;
            const gap = i === 6;
            return gap ? null : (
              <path
                key={i}
                d={`M${x} ${74 + (i % 3) * 7} V ${130 - (i % 2) * 8}`}
                stroke={ink}
                strokeWidth="6"
                strokeLinecap="round"
                strokeOpacity={0.3 + Math.abs(i - 6) * 0.1}
              />
            );
          })}
          <circle cx="160" cy="102" r="13" fill={ink} />
        </g>
      ) : null}
      {art === "breathe" ? (
        /* one breath, drawn out: in, held, and let go */
        <g fill="none" stroke={ink} strokeLinecap="round">
          <path
            d="M24 136 C 70 136, 86 62, 132 62 L 190 62 C 236 62, 252 136, 298 136"
            strokeWidth="7"
          />
          <path
            d="M24 160 C 70 160, 86 104, 132 104 L 190 104 C 236 104, 252 160, 298 160"
            strokeWidth="6"
            strokeOpacity="0.4"
          />
          <circle cx="161" cy="62" r="9" fill={ink} stroke="none" />
        </g>
      ) : null}
      {art === "pressure" ? (
        /* weight coming down on something that bends and does not break */
        <g>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${118 + i * 42} 34 V 86`}
              stroke={ink}
              strokeWidth="6"
              strokeLinecap="round"
              strokeOpacity={0.35 + i * 0.12}
            />
          ))}
          <path
            d="M130 92 L 160 118 L 190 92"
            fill="none"
            stroke={ink}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M34 140 C 92 140, 110 170, 160 170 C 210 170, 228 140, 286 140"
            fill="none"
            stroke={ink}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
      ) : null}
      {art === "overload" ? (
        /* the response that was useful once, and has not switched off since */
        <g>
          <path
            d="M58 150 A 102 102 0 0 1 262 150"
            fill="none"
            stroke={ink}
            strokeOpacity="0.2"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M58 150 A 102 102 0 0 1 252 108"
            fill="none"
            stroke={ink}
            strokeWidth="18"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="150"
            x2="248"
            y2="118"
            stroke={ink}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <circle cx="160" cy="150" r="11" fill={ink} />
          {[
            [276, 70],
            [292, 98],
            [258, 52],
          ].map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r="4" fill={ink} fillOpacity="0.6" />
          ))}
        </g>
      ) : null}
      {art === "toolkit" ? (
        /* five things to try, none of which is the whole answer */
        <g>
          <circle cx="56" cy="100" r="20" fill={ink} fillOpacity="0.85" />
          <rect x="94" y="80" width="40" height="40" rx="10" fill={ink} fillOpacity="0.6" />
          <path d="M166 76 L 190 120 H 142 Z" fill={ink} fillOpacity="0.75" />
          <rect x="206" y="88" width="40" height="24" rx="12" fill={ink} fillOpacity="0.5" />
          <path
            d="M276 84 V 116 M260 100 H 292"
            stroke={ink}
            strokeWidth="7"
            strokeLinecap="round"
            strokeOpacity="0.9"
          />
          <path
            d="M34 148 H 294"
            stroke={ink}
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.3"
          />
        </g>
      ) : null}
      {art === "unwind" ? (
        /* something wound tight, loosening into a straight line */
        <g fill="none" stroke={ink} strokeLinecap="round">
          <path
            d="M96 100 m -8 0 a 8 8 0 1 1 16 0 a 20 20 0 1 1 -40 0 a 34 34 0 1 1 68 0 C 132 128, 160 142, 196 142 L 300 142"
            strokeWidth="7"
          />
          <circle cx="96" cy="100" r="4" fill={ink} stroke="none" />
        </g>
      ) : null}
      {art === "kindness" ? (
        /* something small held in an open hand, rather than braced against anything */
        <g>
          <path
            d="M70 104 C 70 150, 110 176, 160 176 C 210 176, 250 150, 250 104"
            fill="none"
            stroke={ink}
            strokeWidth="7"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <circle cx="160" cy="98" r="30" fill={ink} fillOpacity="0.9" />
          <circle cx="160" cy="98" r="14" fill={bg} />
          {[112, 160, 208].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={44 + (i === 1 ? -10 : 0)}
              r={i === 1 ? 6 : 4}
              fill={ink}
              fillOpacity="0.45"
            />
          ))}
        </g>
      ) : null}
      {art === "routine" ? (
        /* the same small thing, done again and again, and one of them today */
        <g>
          <path
            d="M34 142 H 286"
            stroke={ink}
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const x = 48 + i * 43;
            const tall = i === 3;
            return (
              <g key={i}>
                <path
                  d={`M${x} 142 V ${tall ? 70 : 110}`}
                  stroke={ink}
                  strokeWidth={tall ? 8 : 6}
                  strokeLinecap="round"
                  strokeOpacity={tall ? 0.95 : 0.4}
                />
                {tall ? <circle cx={x} cy="56" r="10" fill={ink} /> : null}
              </g>
            );
          })}
        </g>
      ) : null}
      {art === "report" ? (
        /* four measures against one line, every one of them short of it */
        <g>
          {[0.3, 0.52, 0.44, 0.74].map((share, i) => {
            const y = 62 + i * 30;
            return (
              <g key={i}>
                <rect x="38" y={y} width="236" height="10" rx="5" fill={ink} fillOpacity="0.15" />
                <rect
                  x="38"
                  y={y}
                  width={236 * share}
                  height="10"
                  rx="5"
                  fill={ink}
                  fillOpacity={0.5 + i * 0.12}
                />
              </g>
            );
          })}
          <path
            d="M274 52 V 182"
            stroke={ink}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 7"
            strokeOpacity="0.75"
          />
        </g>
      ) : null}
      {art === "night" ? (
        /* late hours, and what they cost the next day */
        <g>
          <circle cx="226" cy="58" r="26" fill={ink} />
          <circle cx="240" cy="48" r="23" fill={mid} />
          <path
            d="M28 92 C 78 92, 104 128, 150 142 S 244 170, 300 162"
            fill="none"
            stroke={ink}
            strokeWidth="6"
            strokeLinecap="round"
            strokeOpacity="0.9"
          />
          {[
            [62, 52],
            [104, 74],
            [150, 44],
          ].map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r="3" fill={ink} fillOpacity="0.8" />
          ))}
          <path d="M0 176 H320 V200 H0Z" fill={ink} fillOpacity="0.25" />
        </g>
      ) : null}
      {art === "lowmood" ? (
        <g>
          <circle cx="160" cy="132" r="44" fill={ink} fillOpacity="0.85" />
          <path d="M0 132 H320 V200 H0Z" fill={ink} fillOpacity="0.28" />
          <path
            d="M28 132 H 92"
            stroke={ink}
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.55"
          />
          <path
            d="M228 132 H 292"
            stroke={ink}
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="0.55"
          />
          {[
            [78, 56],
            [242, 46],
            [196, 74],
          ].map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r="4" fill={ink} fillOpacity="0.6" />
          ))}
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
  photo,
}: {
  text: string;
  hue: number;
  size?: number;
  className?: string;
  /** a real photo; falls back to initials if it fails to load */
  photo?: string | undefined;
}) {
  const [failed, setFailed] = useState(false);
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.36,
    color: `hsl(${hue} 45% 22%)`,
    background: `radial-gradient(circle at 30% 25%, hsl(${hue} 80% 92%), hsl(${hue} 55% 78%))`,
    boxShadow: `inset 0 0 0 2px hsl(${hue} 60% 96%)`,
  };
  if (photo && !failed) {
    return (
      <img
        src={photo}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("shrink-0 rounded-full object-cover", className)}
        style={{ width: size, height: size, background: style.background }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-display font-semibold",
        className,
      )}
      style={style}
    >
      {text}
    </span>
  );
}

/* Artwork for the screens where something has gone wrong. Drawn as one open line on the page
 * rather than inside a tinted card: this app uses its accents for progress and selection, and a
 * full-bleed block of colour on a dead end would be the loudest thing in the product. The line
 * draws itself once, which is the whole point of the picture - the path runs out, the wave
 * breaks, the signal stops - and holds still for anyone who asks for less motion. */
export type StateScene = "lost" | "broken" | "offline";

/** The ink each scene is drawn in: the text-safe shade of the matching programme accent. */
export const sceneInk: Record<StateScene, string> = {
  lost: "#2F5580",
  broken: "#7A5A12",
  offline: "#33415C",
};

export function StateIllustration({ scene, className }: { scene: StateScene; className?: string }) {
  return (
    <svg
      viewBox="0 0 320 150"
      className={cn("block w-full", className)}
      style={{ color: sceneInk[scene] }}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        {scene === "lost" ? (
          <>
            {/* the trail you were on, and where it stops being a trail */}
            <path
              className="state-draw"
              d="M24 112 C 72 112, 80 52, 124 52 S 172 100, 198 86"
              strokeWidth="7"
            />
            <path
              d="M214 78 C 240 66, 254 44, 296 42"
              strokeWidth="7"
              strokeDasharray="1 17"
              strokeOpacity="0.45"
            />
            <circle cx="24" cy="112" r="8" fill="currentColor" stroke="none" />
          </>
        ) : null}
        {scene === "broken" ? (
          <>
            {/* the line this app draws everywhere else, interrupted */}
            <path
              className="state-draw"
              d="M24 100 C 62 100, 74 44, 116 44 S 146 88, 150 90"
              strokeWidth="7"
            />
            <path
              d="M186 90 C 204 90, 214 40, 252 40 S 288 86, 300 80"
              strokeWidth="7"
              strokeOpacity="0.38"
            />
          </>
        ) : null}
        {scene === "offline" ? (
          <>
            {/* a signal that stops short, and the quiet under it */}
            <path className="state-draw" d="M124 108 A 36 36 0 0 1 196 108" strokeWidth="7" />
            <path
              d="M94 108 A 66 66 0 0 1 226 108"
              strokeWidth="7"
              strokeOpacity="0.4"
              strokeDasharray="3 16"
            />
            <path
              d="M64 108 A 96 96 0 0 1 256 108"
              strokeWidth="7"
              strokeOpacity="0.2"
              strokeDasharray="3 16"
            />
            <circle cx="160" cy="108" r="9" fill="currentColor" stroke="none" />
          </>
        ) : null}
      </g>
    </svg>
  );
}
