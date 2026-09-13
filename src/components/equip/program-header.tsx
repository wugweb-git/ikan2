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

export const pageMeta = (title: string, description: string) => ({
  meta: [
    { title: `${title} — iKAN` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — iKAN` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
