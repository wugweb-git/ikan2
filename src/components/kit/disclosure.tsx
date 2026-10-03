import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* Disclosure — one thing that opens to show more.
 *
 * Built on <details>/<summary> deliberately: it opens without JavaScript, survives SSR with no
 * hydration flash, and the global focus ring already covers `summary`. Five screens had rolled
 * this by hand in three different radii; this is that markup, once.
 *
 * `chevron` picks the affordance the screen already used: "down" rotates 180° on open (the FAQ
 * and the day card), "right" rotates 90° (the assessment and consultant screens).
 */

export type DisclosureTone = "outlined" | "filled" | "plain";

/* A fixed map, not an interpolated class: Tailwind only emits what it can see in the source. */
const radii = {
  0: "",
  12: "rounded-[12px]",
  16: "rounded-[16px]",
  20: "rounded-[20px]",
  24: "rounded-[24px]",
} as const;

const tones: Record<DisclosureTone, string> = {
  outlined: "border border-foreground/10 bg-background",
  filled: "bg-secondary",
  plain: "",
};

export function Disclosure({
  title,
  children,
  leading,
  meta,
  tone = "outlined",
  radius = 20,
  chevron = "down",
  open,
  padded = true,
  className,
  bodyClassName,
}: {
  title: ReactNode;
  children: ReactNode;
  /** Icon or thumbnail before the title. */
  leading?: ReactNode | undefined;
  /** Secondary text on the right of the summary row, before the chevron. */
  meta?: ReactNode | undefined;
  tone?: DisclosureTone | undefined;
  radius?: 0 | 12 | 16 | 20 | 24 | undefined;
  chevron?: "down" | "right" | undefined;
  /** Open on first render. Uncontrolled after that — the element owns its state. */
  open?: boolean | undefined;
  padded?: boolean | undefined;
  className?: string | undefined;
  /** Replaces the body's own padding — for bodies that want a divider or a different inset. */
  bodyClassName?: string | undefined;
}) {
  const Chevron = chevron === "down" ? ChevronDown : ChevronRight;
  return (
    <details
      open={open}
      className={cn("group overflow-hidden", tones[tone], radii[radius], className)}
    >
      <summary
        className={cn(
          "flex min-h-14 cursor-pointer list-none items-center gap-3 text-[15px] font-medium [&::-webkit-details-marker]:hidden",
          padded && "px-4 py-3",
        )}
      >
        {leading}
        <span className="min-w-0 flex-1">{title}</span>
        {meta ? <span className="shrink-0 text-[13px] text-muted-foreground">{meta}</span> : null}
        <Chevron
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
            chevron === "down" ? "group-open:rotate-180" : "group-open:rotate-90",
          )}
        />
      </summary>
      <div className={bodyClassName ?? cn(padded && "px-4 pb-4")}>{children}</div>
    </details>
  );
}

/** A stack of disclosures sharing one outline, divided by hairlines — the FAQ pattern. */
export function DisclosureGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px] border border-foreground/10 [&>details+details]:border-t [&>details+details]:border-foreground/10 [&>details]:rounded-none [&>details]:border-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
