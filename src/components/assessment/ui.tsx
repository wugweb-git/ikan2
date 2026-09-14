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
import type { Assessment, Band, Severity, Tone } from "@/lib/assessment/instruments";
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

/* Severity scale, as the old iKan app showed it (green, blue, yellow, orange, red), mapped onto
 * this app's theme families so it sits with the rest of the UI: calm, mind, rest, an orange
 * between rest and alert, then alert. Each step gets a bar colour, a soft container and a text
 * shade that stays readable on that container. */
export const severityColors: Record<Severity, { fg: string; container: string; bar: string }> = {
  minimal: {
    fg: "oklch(0.44 0.09 165)",
    container: "oklch(0.95 0.035 165)",
    bar: "oklch(0.68 0.12 165)",
  },
  mild: {
    fg: "oklch(0.45 0.1 245)",
    container: "oklch(0.95 0.03 245)",
    bar: "oklch(0.68 0.11 245)",
  },
  moderate: {
    fg: "oklch(0.47 0.1 75)",
    container: "oklch(0.96 0.05 85)",
    bar: "oklch(0.8 0.14 83)",
  },
  "moderately-severe": {
    fg: "oklch(0.47 0.14 45)",
    container: "oklch(0.95 0.04 50)",
    bar: "oklch(0.72 0.15 50)",
  },
  severe: {
    fg: "oklch(0.45 0.17 25)",
    container: "oklch(0.95 0.035 25)",
    bar: "oklch(0.6 0.19 25)",
  },
};

/** Plain wording for each severity step, rewritten from the old app's catalog descriptions. */
export const severityContent: Record<Severity, { label: string; description: string }> = {
  minimal: { label: "Minimal", description: "Nothing of concern right now" },
  mild: { label: "Mild", description: "A few signs worth keeping an eye on" },
  moderate: { label: "Moderate", description: "Noticeable symptoms. Guided support can help" },
  "moderately-severe": {
    label: "Moderately severe",
    description: "Significant symptoms. A guided program is recommended",
  },
  severe: { label: "Severe", description: "Serious symptoms. Please talk to a professional soon" },
};

/** Colours for a band: by its severity, as the old app showed them. */
export const bandStyle = (band: Pick<Band, "severity"> | null | undefined): CSSProperties =>
  band
    ? ({
        "--tone": severityColors[band.severity].fg,
        "--tone-container": severityColors[band.severity].container,
        "--tone-bar": severityColors[band.severity].bar,
      } as CSSProperties)
    : toneStyle(undefined);

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
  severity,
  className,
}: {
  label: string;
  tone: Tone;
  /** when given, the chip takes the severity colour instead of the tone */
  severity?: Severity | undefined;
  className?: string;
}) {
  return (
    <span
      style={severity ? bandStyle({ severity }) : toneStyle(tone)}
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
                background: severityColors[band.severity].bar,
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
