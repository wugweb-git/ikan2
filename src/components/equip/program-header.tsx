import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

const backClass =
  "grid h-11 w-11 place-items-center rounded-full bg-secondary/70 text-foreground transition-transform active:scale-95";

/** Back to a fixed route, or to a programme page when `slug` is given. */
export function BackLink(props: { to: "/" | "/program" } | { to: "/program/$slug"; slug: string }) {
  if (props.to === "/program/$slug") {
    return (
      <Link
        to="/program/$slug"
        params={{ slug: props.slug }}
        aria-label="Back"
        className={backClass}
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
    );
  }
  return (
    <Link to={props.to} aria-label="Back" className={backClass}>
      <ArrowLeft className="h-5 w-5" />
    </Link>
  );
}

export function ProgramHeader({
  back,
  title,
  action,
}: {
  back: ReactNode;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-5 pb-2 pt-5">
      {back}
      {title ? (
        <p className="min-w-0 truncate font-display text-[15px] font-semibold">{title}</p>
      ) : null}
      {action ?? <span className="h-11 w-11" />}
    </header>
  );
}

/* Per-page title, description and link preview. Pass `path` on pages that should be findable
 * on their own (articles, assessments) so they get a canonical url; screens behind sign-in can
 * leave it out. */
export const pageMeta = (title: string, description: string, path?: string) => ({
  meta: [
    { title: `${title} — iKAN` },
    { name: "description", content: description },
    { property: "og:site_name", content: "iKAN" },
    { property: "og:locale", content: "en_IN" },
    { property: "og:title", content: `${title} — iKAN` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    ...(path ? [{ property: "og:url", content: `https://app.ikanhealth.in${path}` }] : []),
    { property: "og:image", content: "https://app.ikanhealth.in/pwa-512x512.png" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: `${title} — iKAN` },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: "https://app.ikanhealth.in/pwa-512x512.png" },
  ],
  ...(path ? { links: [{ rel: "canonical", href: `https://app.ikanhealth.in${path}` }] } : {}),
});

/* Structured data, as a <script type="application/ld+json"> in the head.
 *
 * Search engines use it to show an article as an article rather than a generic page - the
 * headline, the date, who published it. Nothing here is private: every field is already
 * visible on the page itself. */
export const jsonLd = (data: Record<string, unknown>) => ({
  type: "application/ld+json",
  children: JSON.stringify(data),
});
