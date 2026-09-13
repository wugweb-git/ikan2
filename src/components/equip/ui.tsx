import type { ReactNode } from "react";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/equip/metrics";

export type StepProps = {
  onNext: () => void;
  onBack: (() => void) | undefined;
};

export function StepTitle({ title, prompt }: { title: string; prompt?: string | undefined }) {
  return (
    <div>
      <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      {prompt ? (
        <h2
          className={cn(
            "mt-2 font-display font-semibold text-balance",
            // instructions read as copy; short questions read as headlines
            prompt.length > 80
              ? "text-[19px] leading-[1.4]"
              : "text-[26px] leading-[1.18] tracking-[-0.01em]",
          )}
        >
          {prompt}
        </h2>
      ) : null}
    </div>
  );
}

/** The fixed bottom bar every step renders. */
export function StepFooter({
  onBack,
  onNext,
  label = "Continue",
  disabled,
  secondary,
}: {
  onBack: (() => void) | undefined;
  onNext: () => void;
  label?: string;
  disabled?: boolean;
  secondary?: ReactNode;
}) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex justify-center">
      <div className="w-full max-w-md bg-gradient-to-t from-background via-background to-background/0 px-5 pb-6 pt-8">
        {secondary}
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-secondary text-foreground transition-transform active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onNext}
            disabled={disabled}
            className="h-14 flex-1 rounded-full bg-foreground font-display text-base font-semibold text-background transition-[transform,opacity] active:scale-[0.98] disabled:opacity-30"
          >
            {label}
          </button>
        </div>
      </div>
    </footer>
  );
}

export function OptionTile({
  selected,
  onClick,
  multi,
  glyph,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  multi?: boolean | undefined;
  glyph?: string | undefined;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-[18px] px-4 py-4 text-left transition-colors",
        selected
          ? "bg-foreground text-background"
          : "bg-secondary/70 text-foreground active:bg-secondary",
      )}
    >
      {glyph ? (
        <span className="text-xl leading-none" aria-hidden="true">
          {glyph}
        </span>
      ) : null}
      <span className="flex-1 text-[15px] font-medium leading-snug">{children}</span>
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center border-2 transition-colors",
          multi ? "rounded-md" : "rounded-full",
          selected ? "border-background bg-background text-foreground" : "border-foreground/20",
        )}
      >
        {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
    </button>
  );
}

export function YesNo({
  value,
  onChange,
  label,
}: {
  value: boolean | null | undefined;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-2">
      {[
        { v: true, text: "Yes" },
        { v: false, text: "No" },
      ].map(({ v, text }) => (
        <button
          key={text}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "h-12 rounded-full text-sm font-semibold transition-colors",
            value === v
              ? "bg-foreground text-background"
              : "bg-background text-foreground ring-1 ring-foreground/10",
          )}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

/** A large time display backed by the native picker. */
export function TimeField({
  value,
  onChange,
  label,
}: {
  value: string | undefined;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <span
        className={cn(
          "flex h-[120px] items-center justify-center rounded-[24px] bg-secondary/70 font-display font-semibold tabular-nums",
          value ? "text-[44px] tracking-[-0.02em]" : "text-[20px] text-muted-foreground",
        )}
      >
        {value ? formatTime(value) : "Tap to set the time"}
      </span>
      <input
        type="time"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </label>
  );
}

export function Stepper({
  value,
  onChange,
  unit,
  step = 1,
  presets,
  min = 0,
  max = 600,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
  unit: string;
  step?: number;
  presets?: number[];
  min?: number;
  max?: number;
}) {
  const v = value ?? 0;
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div>
      <div className="flex items-center justify-between rounded-[24px] bg-secondary/70 p-3">
        <button
          type="button"
          aria-label={`Less ${unit}`}
          onClick={() => onChange(clamp(v - step))}
          className="grid h-14 w-14 place-items-center rounded-full bg-background shadow-sm active:scale-95"
        >
          <Minus className="h-5 w-5" />
        </button>
        <div className="text-center" aria-live="polite">
          <span
            className={cn(
              "font-display text-[44px] font-semibold tabular-nums",
              value === undefined && "text-muted-foreground/60",
            )}
          >
            {v}
          </span>
          <span className="ml-1.5 text-sm text-muted-foreground">{unit}</span>
        </div>
        <button
          type="button"
          aria-label={`More ${unit}`}
          onClick={() => onChange(clamp(v + step))}
          className="grid h-14 w-14 place-items-center rounded-full bg-background shadow-sm active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      {presets ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={cn(
                "h-10 min-w-14 rounded-full px-4 text-sm font-semibold tabular-nums",
                value === p ? "bg-foreground text-background" : "bg-secondary/70",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export const fieldClass =
  "w-full rounded-[16px] bg-background px-4 py-3.5 text-[15px] outline-none ring-1 ring-foreground/10 placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-foreground/40";
