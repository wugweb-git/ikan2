import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { stateLayer } from "@/components/equip/m3";

/* Chips and pills.
 *
 * Two things that look alike and behave differently, so they are two components:
 *
 *   Chip  is interactive — a filter, a choice, a suggestion. Renders a <button>, carries
 *         selected / disabled, and takes the M3 state layer.
 *   Pill  is static — a label, a count, a status. Renders a <span>, no states, never focusable.
 *
 * Both reproduce the treatments already in the app rather than introducing new ones:
 * three sizes (28/32/36dp) and five tones taken from what the screens were doing inline.
 */

export type ChipTone = "neutral" | "solid" | "outline" | "accent" | "success" | "danger";
export type ChipSize = "sm" | "md" | "lg";

const sizes: Record<ChipSize, string> = {
  sm: "h-7 gap-1 px-3 text-[12px]",
  md: "h-8 gap-1.5 px-3 text-[13px]",
  lg: "h-9 gap-1.5 px-4 text-[13px]",
};

/** Unselected look. The selected look is always `solid`, as it is on every screen today. */
const tones: Record<ChipTone, string> = {
  neutral: "bg-secondary text-foreground",
  solid: "bg-foreground text-background",
  outline: "border border-foreground/20 text-foreground",
  accent: "bg-[var(--accent-container)] text-[var(--on-accent-container)]",
  success: "bg-[var(--calm-soft)] text-[var(--calm-strong)]",
  danger: "bg-[var(--alert-soft)] text-[var(--alert-strong)]",
};

const base = "inline-flex shrink-0 items-center rounded-full font-semibold";

export function Chip({
  children,
  onClick,
  selected,
  disabled,
  tone = "neutral",
  size = "md",
  icon,
  onRemove,
  removeLabel,
  className,
}: {
  children: ReactNode;
  onClick?: (() => void) | undefined;
  /** Selected chips switch to the `solid` tone, matching every filter row in the app. */
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
  tone?: ChipTone | undefined;
  size?: ChipSize | undefined;
  icon?: ReactNode | undefined;
  /** Shows a trailing ✕. Needs `removeLabel` for the screen reader. */
  onRemove?: (() => void) | undefined;
  removeLabel?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <span className={cn(base, sizes[size], selected ? tones.solid : tones[tone], className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={selected}
        className={cn(
          "-mx-3 inline-flex h-full items-center gap-1.5 rounded-full px-3",
          onRemove && "pr-1.5",
          stateLayer,
          "disabled:pointer-events-none disabled:opacity-40",
        )}
      >
        {icon}
        {children}
      </button>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? "Remove"}
          className="-mr-2 grid h-6 w-6 shrink-0 place-items-center rounded-full"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </span>
  );
}

/** A chip row that scrolls sideways without a scrollbar, as the filter rows already do. */
export function ChipRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("no-scrollbar flex gap-2 overflow-x-auto", className)}>{children}</div>;
}

export function Pill({
  children,
  tone = "neutral",
  size = "md",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: ChipTone | undefined;
  size?: ChipSize | undefined;
  icon?: ReactNode | undefined;
  className?: string | undefined;
}) {
  return (
    <span className={cn(base, sizes[size], tones[tone], className)}>
      {icon}
      {children}
    </span>
  );
}

/** A number above its label, as the stat rows on the home and result screens show them. */
export function MetricPill({
  value,
  label,
  tone = "neutral",
  className,
}: {
  value: ReactNode;
  label: string;
  tone?: ChipTone | undefined;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-col items-center rounded-full px-4 py-1.5 text-center",
        tones[tone],
        className,
      )}
    >
      <strong className="font-display text-[15px] font-semibold leading-tight tabular-nums">
        {value}
      </strong>
      <span className="text-[11px] opacity-70">{label}</span>
    </span>
  );
}
