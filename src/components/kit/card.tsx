import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { stateLayer } from "@/components/equip/m3";

/* Cards.
 *
 * The app has one card shape used many ways — assessment, programme, resource, consultant,
 * journal, history. They differed only in radius (16/20/24/28), fill (secondary, hairline,
 * plain) and whether they were a link. Those are the two props below; everything else is the
 * same box.
 *
 * Most cards are links, and TanStack's <Link> is typed against the route tree, so wrapping it
 * would throw that away. `cardClass()` exists for exactly that case: the call site keeps its
 * own <Link> and takes the box styling from here. `Card` is the component for everything that
 * is not a link.
 */

export type CardTone = "filled" | "outlined" | "plain" | "media";
export type CardRadius = 12 | 16 | 20 | 24 | 28;

const tones: Record<CardTone, string> = {
  filled: "bg-secondary",
  outlined: "border border-foreground/10 bg-background",
  plain: "bg-background",
  /* clips a cover image to the corner radius and puts text on top of it */
  media: "relative overflow-hidden text-white",
};

const radii: Record<CardRadius, string> = {
  12: "rounded-[12px]",
  16: "rounded-[16px]",
  20: "rounded-[20px]",
  24: "rounded-[24px]",
  28: "rounded-[28px]",
};

export function cardClass({
  tone = "filled",
  radius = 24,
  interactive = false,
  inset = false,
}: {
  tone?: CardTone | undefined;
  radius?: CardRadius | undefined;
  /** Adds the M3 state layer. Set it on anything that is a link or a button. */
  interactive?: boolean | undefined;
  /** The card's own padding. Off for cards whose first child is a full-bleed image. */
  inset?: boolean | undefined;
} = {}) {
  return cn(
    "motion-tint block overflow-hidden",
    radii[radius],
    tones[tone],
    inset && "p-4",
    interactive && stateLayer,
  );
}

export function Card({
  children,
  tone = "filled",
  radius = 24,
  inset = false,
  className,
}: {
  children: ReactNode;
  tone?: CardTone | undefined;
  radius?: CardRadius | undefined;
  inset?: boolean | undefined;
  className?: string | undefined;
}) {
  return <div className={cn(cardClass({ tone, radius, inset }), className)}>{children}</div>;
}

/** The square icon tile that leads an assessment, history or settings card. */
export function CardIcon({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: "accent" | "solid" | "plain" | undefined;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-[16px]",
        tone === "accent" && "bg-[var(--accent-container)] text-[var(--on-accent-container)]",
        tone === "solid" && "bg-foreground text-background",
        tone === "plain" && "bg-background text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The small coloured line above a card's title — the instrument name, the category. */
export function CardEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <span className={cn("type-body-sm font-medium block text-[var(--accent-strong)]", className)}>
      {children}
    </span>
  );
}

export function CardTitle({
  children,
  size = "md",
  className,
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | undefined;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "block font-display font-semibold",
        size === "sm" && "text-[15px] leading-5",
        size === "md" && "text-[17px] leading-6",
        size === "lg" && "text-[20px] leading-7",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The wrapping row of small facts under a title: question count, minutes, progress. */
export function CardMeta({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "type-body-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** One fact inside CardMeta: an icon and its text, kept on one line. */
export function CardFact({
  icon,
  children,
}: {
  icon?: ReactNode | undefined;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {icon}
      {children}
    </span>
  );
}

/** Progress along the bottom of a programme card, with its own caption row. */
export function CardProgress({
  done,
  total,
  caption,
  className,
}: {
  done: number;
  total: number;
  caption?: ReactNode | undefined;
  className?: string | undefined;
}) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (done / total) * 100)) : 0;
  return (
    <div className={className}>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-[var(--accent-container)]"
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-700 motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
      {caption ? (
        <p className="type-body-sm font-medium mt-2 flex items-center justify-between text-[var(--accent-strong)]">
          {caption}
          <ChevronRight className="h-4 w-4 shrink-0" />
        </p>
      ) : null}
    </div>
  );
}

/** The veil that keeps text legible over a cover photo. */
export function CardVeil({ className }: { className?: string | undefined }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent",
        className,
      )}
    />
  );
}
