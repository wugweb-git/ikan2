import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Badges: the small count or dot that sits on top of something else.
 *
 * Distinct from Pill, which is a label in the flow of the page. A badge is positioned over its
 * owner, so it carries the absolute placement itself and the owner only has to be `relative`.
 *
 * `count` caps at 9+ so the badge never grows wide enough to clip the icon beneath it.
 */

export type BadgeTone = "error" | "accent" | "neutral";

const tones: Record<BadgeTone, string> = {
  error: "bg-error text-on-error",
  accent: "bg-[var(--accent)] text-white",
  neutral: "bg-foreground text-background",
};

export function Badge({
  count,
  max = 9,
  tone = "error",
  label,
  className,
}: {
  /** Nothing renders at 0, so callers do not need to guard. */
  count: number;
  max?: number | undefined;
  tone?: BadgeTone | undefined;
  /** What the number means, for screen readers — e.g. "unread notifications". */
  label: string;
  className?: string | undefined;
}) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "pointer-events-none absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold",
        tones[tone],
        className,
      )}
    >
      <span aria-hidden="true">{count > max ? `${max}+` : count}</span>
      <span className="sr-only">
        {count} {label}
      </span>
    </span>
  );
}

/** A badge with no number: something needs attention, but not how much. */
export function Dot({
  tone = "error",
  label,
  className,
}: {
  tone?: BadgeTone | undefined;
  label: string;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
        tones[tone],
        className,
      )}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Inline status text with a leading dot — used by score bands and severity labels. */
export function StatusDot({
  children,
  color,
  className,
}: {
  children: ReactNode;
  /** Any CSS colour, usually a severity token. */
  color: string;
  className?: string | undefined;
}) {
  return (
    <span className={cn("type-body-sm inline-flex items-center gap-1.5", className)}>
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: color }}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
