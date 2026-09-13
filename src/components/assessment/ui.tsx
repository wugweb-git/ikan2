import type { CSSProperties } from "react";
import {
  CloudRain,
  Compass,
  Flame,
  Gauge,
  Moon,
  Scale,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Assessment, Tone } from "@/lib/assessment/instruments";
import { formatValue, percentOfRange, type ScoreResult } from "@/lib/assessment/scoring";

export const categoryIcon: Record<Assessment["category"], LucideIcon> = {
  depression: CloudRain,
  anxiety: Waves,
  stress: Gauge,
  sleep: Moon,
  balance: Scale,
  burnout: Flame,
  general: Compass,
};

/** Band tone is authored per band in the spec; these are its colours (text shades 4.5:1+ on their containers). */
export const toneColors: Record<Tone, { fg: string; container: string; bar: string }> = {
  success: { fg: "#1E6644", container: "#DDF1E5", bar: "#3E9B6C" },
  warning: { fg: "#744F00", container: "#FCEFCF", bar: "#D39B22" },
  error: { fg: "#9E2A2A", container: "#FBE2E0", bar: "#D2544F" },
};

export const toneStyle = (tone: Tone | undefined): CSSProperties =>
  tone
    ? ({
        "--tone": toneColors[tone].fg,
        "--tone-container": toneColors[tone].container,
        "--tone-bar": toneColors[tone].bar,
      } as CSSProperties)
    : ({
        "--tone": "var(--muted-foreground)",
        "--tone-container": "var(--secondary)",
        "--tone-bar": "var(--muted-foreground)",
      } as CSSProperties);

export function BandChip({
  label,
  tone,
  className,
}: {
  label: string;
  tone: Tone;
  className?: string;
}) {
  return (
    <span
      style={toneStyle(tone)}
      className={cn(
        "inline-flex min-h-7 items-center rounded-[8px] bg-[var(--tone-container)] px-2.5 text-[13px] font-semibold leading-4 text-[var(--tone)]",
        className,
      )}
    >
      {label}
    </span>
  );
}

/** The instrument's range as band segments, with a marker where the score landed. */
export function RangeBar({ result, large }: { result: ScoreResult; large?: boolean }) {
  const { profile, value } = result;
  const span = profile.max - profile.min;
  return (
    <div className="relative">
      <div className={cn("flex w-full gap-[3px]", large ? "h-3" : "h-2")}>
        {profile.bands.map((band) => {
          const on = result.band === band;
          return (
            <span
              key={band.label}
              className="h-full rounded-full"
              style={{
                width: `${((band.max - band.min) / span) * 100}%`,
                background: toneColors[band.tone].bar,
                opacity: on ? 1 : 0.22,
              }}
            />
          );
        })}
      </div>
      {value !== null ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-background bg-foreground shadow",
            large ? "h-6 w-6" : "h-4 w-4",
          )}
          style={{ left: `${percentOfRange(profile, value) * 100}%` }}
        />
      ) : null}
    </div>
  );
}

export const valueText = (r: ScoreResult) =>
  r.value === null ? "—" : `${formatValue(r.profile, r.value)} of ${r.profile.max}`;
