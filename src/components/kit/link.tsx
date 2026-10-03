import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* Links that leave iKAN.
 *
 * House rule: an external link ends in an arrow. It is not decoration — it is the only thing
 * on the page that tells someone the tap is about to leave the app, which matters more here
 * than on most sites, because iKAN also runs as an installed Android app where "leaving"
 * means a browser opening over the top of it.
 *
 * The arrow is `aria-hidden` and the real signal for screen readers is the visually hidden
 * "(opens in a new tab)". A glyph is not an announcement.
 *
 * `rel="noopener noreferrer"` is not optional with `target="_blank"`: without noopener the
 * opened page gets a handle on this one via window.opener.
 */

export function ExternalLink({
  href,
  children,
  underline = true,
  className,
  style,
}: {
  href: string;
  children: ReactNode;
  /** Off for links that are already a card or a button. */
  underline?: boolean | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      className={cn(
        "motion-tint inline-flex items-baseline gap-[0.15em] hover:opacity-80",
        underline && "underline",
        className,
      )}
    >
      {children}
      {/* The glyph does not fill its own viewBox, so without the negative margin a comma or
          full stop after the link sits a visible step away from it. */}
      <ArrowUpRight
        className="-mr-[0.14em] h-[0.95em] w-[0.95em] shrink-0 self-center"
        aria-hidden="true"
      />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
