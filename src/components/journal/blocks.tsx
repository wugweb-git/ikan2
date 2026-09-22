import type { ReactNode } from "react";
import {
  Activity,
  Bandage,
  Check,
  Footprints,
  HeartPulse,
  Moon,
  PencilLine,
  Smile,
  Tags,
} from "lucide-react";
import { stateLayer, TextField } from "@/components/equip/m3";
import { cn } from "@/lib/utils";
import { contextTags, painScale, type ScalePoint } from "@/lib/journal";

/* The Mood Journal's blocks, one component per block type, so the check-in page and Storybook
 * show the same thing. */

const icons: Record<string, ReactNode> = {
  mood: <Smile />,
  sleep: <Moon />,
  stress: <Activity />,
  pain: <HeartPulse />,
  pain_experience: <Bandage />,
  pain_impact: <Footprints />,
  note: <PencilLine />,
  tags: <Tags />,
};

/** Step count, icon, question and subtitle; pain follow-ups carry a chip saying so. */
export function BlockHeader({
  id,
  question,
  subtitle,
  step,
  of,
  followUp,
}: {
  id: string;
  question: string;
  subtitle: string;
  step: number;
  of: number;
  followUp?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)] [&_svg]:h-5 [&_svg]:w-5"
        >
          {icons[id]}
        </span>
        <p className="text-[13px] font-semibold tabular-nums text-[var(--accent-strong)]">
          Step {step} of {of}
        </p>
        {followUp ? (
          <span className="ml-auto rounded-full bg-background px-2.5 py-1 text-[12px] font-medium">
            About your pain
          </span>
        ) : null}
      </div>
      <h3 className="mt-3 font-display text-[21px] font-semibold leading-7 text-balance">
        {question}
      </h3>
      <p className="mt-1 text-[14px] text-muted-foreground">{subtitle}</p>
    </div>
  );
}

const tile = (on: boolean) =>
  cn(
    "flex flex-col items-center justify-center gap-1.5 rounded-[16px] transition-[background-color,transform,box-shadow] active:scale-95",
    stateLayer,
    on
      ? "-translate-y-0.5 bg-[var(--accent-container)] text-[var(--on-accent-container)] shadow-[0_6px_16px_-10px_rgba(0,0,0,0.45)] ring-2 ring-[var(--accent)]"
      : "bg-background",
  );

/** Five labelled emoji tiles in a row. */
export function EmojiScaleBlock({
  scale,
  value,
  onPick,
  label,
  note,
}: {
  scale: ScalePoint[];
  value: number | undefined;
  onPick: (v: number) => void;
  label: string;
  /** shown under the scale, e.g. where a pre-filled answer came from */
  note?: string | undefined;
}) {
  return (
    <div>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-5 gap-2">
        {scale.map((p) => {
          const on = value === p.value;
          return (
            <button
              key={p.value}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`${p.label}, ${p.value} of ${scale.length}`}
              onClick={() => onPick(p.value)}
              className={cn(tile(on), "py-3")}
            >
              <span
                className={cn("text-[32px] leading-none transition-transform", on && "scale-110")}
                aria-hidden="true"
              >
                {p.emoji}
              </span>
              <span className="text-[11.5px] font-medium leading-4">{p.label}</span>
            </button>
          );
        })}
      </div>
      {note ? (
        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-[var(--accent-strong)]">
          <Moon className="h-4 w-4" aria-hidden="true" />
          {note}
        </p>
      ) : null}
    </div>
  );
}

/** Two large tiles: ✅ Yes and ❌ No. */
export function YesNoBlock({
  value,
  onPick,
  label,
}: {
  value: boolean | undefined;
  onPick: (v: boolean) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-2">
      {painScale.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.label}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onPick(o.value)}
            className={cn(tile(on), "h-24")}
          >
            <span className="text-[30px] leading-none" aria-hidden="true">
              {o.emoji}
            </span>
            <span className="text-[16px] font-semibold">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function NoteBlock({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <TextField
      label=""
      ariaLabel={label}
      value={value}
      onChange={onChange}
      multiline
      rows={4}
      maxLength={500}
      placeholder="Write a line or two"
    />
  );
}

export function TagsBlock({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {contextTags.map((t) => {
          const on = value.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((x) => x !== t.id) : [...value, t.id])}
              className={cn(
                "inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-[14px] font-medium transition-colors",
                stateLayer,
                on
                  ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]"
                  : "border-foreground/20 bg-background",
              )}
            >
              {on ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <span aria-hidden="true">{t.emoji}</span>
              )}
              {t.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[12px] text-muted-foreground" aria-live="polite">
        {value.length ? `${value.length} picked` : "Pick any that apply"}
      </p>
    </div>
  );
}
