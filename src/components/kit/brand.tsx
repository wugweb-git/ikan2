import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* The brand accent patterns, carried over from the first iKAN site.
 *
 * Two things it did that ikan2 had no equivalent for: a heading with one word in a brand
 * hue, and an icon sitting on a tint of its own colour. Both are here, and both resolve
 * the accessibility problem the originals had — the old site's own stylesheet says the raw
 * brand hues "must not be used as a text colour", then set that heading word in raw teal
 * at 2.29:1. Anything carrying a word here uses the -ink shade instead (5.9–6.5:1).
 */

export type BrandHue = "teal" | "amber" | "coral" | "slate";

/** Fills, icons, borders. 2.0–3.0:1 on white — never put a word in these. */
const fill: Record<BrandHue, string> = {
  teal: "var(--brand-teal)",
  amber: "var(--brand-amber)",
  coral: "var(--brand-coral)",
  slate: "var(--brand-slate)",
};

/** The same hues, text-safe. */
const ink: Record<BrandHue, string> = {
  teal: "var(--brand-teal-ink)",
  amber: "var(--brand-amber-ink)",
  coral: "var(--brand-coral-ink)",
  slate: "var(--brand-slate-ink)",
};

/**
 * One word of a heading in a brand hue — "Born from **personal** experience".
 *
 * Renders a plain <span>, so it inherits the heading's size, face and weight and only
 * changes colour. Use it for a word that is genuinely the point of the sentence; a heading
 * where every other line has one stops meaning anything.
 */
export function AccentWord({
  children,
  hue = "teal",
  className,
}: {
  children: ReactNode;
  hue?: BrandHue | undefined;
  className?: string | undefined;
}) {
  return (
    <span className={className} style={{ color: ink[hue] }}>
      {children}
    </span>
  );
}

/**
 * An icon in a brand hue on an 8% tint of itself — the "Science Backed" flask.
 *
 * The tint is mixed from the one token rather than stored as a second colour, so a hue can
 * never drift from its own wash. `color-mix` with `transparent` means it also sits correctly
 * on any surface, including the dark theme.
 */
export function IconTile({
  children,
  hue = "teal",
  size = "md",
  shape = "circle",
  bordered = false,
  className,
}: {
  children: ReactNode;
  hue?: BrandHue | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  /** The old site used both: a circle on the About values, a rounded square in the Library. */
  shape?: "circle" | "square" | undefined;
  bordered?: boolean | undefined;
  className?: string | undefined;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "motion-tint grid shrink-0 place-items-center",
        size === "sm" && "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
        size === "md" && "h-12 w-12 [&_svg]:h-6 [&_svg]:w-6",
        size === "lg" && "h-16 w-16 [&_svg]:h-7 [&_svg]:w-7",
        shape === "circle" ? "rounded-full" : "rounded-[16px]",
        className,
      )}
      style={{
        background: `color-mix(in oklab, ${fill[hue]} 8%, transparent)`,
        color: fill[hue],
        ...(bordered
          ? { border: `1px solid color-mix(in oklab, ${fill[hue]} 19%, transparent)` }
          : {}),
      }}
    >
      {children}
    </span>
  );
}

/**
 * The four brand dots, as the old site's section marker.
 *
 * Decorative: it carries `aria-hidden`, because four coloured circles say nothing to a
 * screen reader that the heading beneath them does not already say.
 */
export function BrandDots({
  size = 12,
  className,
}: {
  size?: number | undefined;
  className?: string | undefined;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-hidden="true">
      {(Object.keys(fill) as BrandHue[]).map((h) => (
        <span
          key={h}
          className="rounded-full"
          style={{ width: size, height: size, background: fill[h] }}
        />
      ))}
    </span>
  );
}

/** A themed section ground — the old site's teal wash, generalised to all four hues. */
export function BrandWash({
  children,
  hue = "teal",
  className,
}: {
  children: ReactNode;
  hue?: BrandHue | undefined;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn("rounded-[24px] p-5", className)}
      style={{
        background: `linear-gradient(160deg, color-mix(in oklab, ${fill[hue]} 10%, transparent) 0%, color-mix(in oklab, ${fill[hue]} 20%, transparent) 100%)`,
      }}
    >
      {children}
    </div>
  );
}
