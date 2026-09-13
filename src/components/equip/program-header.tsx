import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Back = "/" | "/program" | "/program/sleep-tight" | "/program/sleep-tight/units";

export function ProgramHeader({
  back,
  eyebrow,
  title,
  action,
}: {
  back: Back;
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="px-5 pb-4 pt-6">
      <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-full">
          <Link to={back} aria-label="Back">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="min-w-0 text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="truncate font-display text-xl font-semibold">{title}</h1>
        </div>
        {action ?? <span />}
      </div>
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
