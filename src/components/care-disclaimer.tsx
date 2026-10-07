import { cn } from "@/lib/utils";

/* The note under a screening, a result or a programme: what this is, then that iKAN never
 * replaces professional care.
 *
 * Always two even lines. The full text is ~575px at 12px, so `text-balance` splits it into two
 * lines of ~290px, which fit a phone (~343px of text width). The 24rem cap keeps it at two on wide
 * screens too, where it would otherwise run onto one. Splitting it by sentence instead doesn't
 * work: the second sentence alone is 378px and wraps on every phone. */

export function CareDisclaimer({ lead, className }: { lead: string; className?: string }) {
  return (
    <p
      className={cn(
        "mx-auto max-w-[24rem] px-4 text-center text-[12px] leading-5 text-balance text-muted-foreground",
        className,
      )}
    >
      {lead} iKAN supports, but never replaces, care from a qualified professional.
    </p>
  );
}
