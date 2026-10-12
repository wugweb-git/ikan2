import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { accentStyle, stateLayer } from "@/components/equip/m3";
import { cn } from "@/lib/utils";
import { dayCount, daysDoneOf } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";
import type { Programme } from "@/lib/equip/types";

export function ProgrammeCard({ programme }: { programme: Programme }) {
  const { state, nextDay } = useProgramme(programme.slug);
  const total = dayCount(programme);
  const done = daysDoneOf(programme, state.completed);
  const started = state.completed.length > 0;
  const src = programme.source;

  return (
    <Link
      to="/program/$slug"
      params={{ slug: programme.slug }}
      style={accentStyle(programme.accent)}
      className={cn("flex overflow-hidden rounded-[24px] bg-secondary", stateLayer)}
    >
      <img src={programme.cover} alt="" className="w-[112px] shrink-0 object-cover" />
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <p className="type-title-lg">{programme.name}</p>
        {src.description ? (
          <p className="type-label-lg mt-1 line-clamp-2 text-muted-foreground">{src.description}</p>
        ) : null}
        <div className="mt-auto pt-3">
          {started ? (
            <>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--accent-container)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
              <p className="type-body-sm font-medium mt-2 flex items-center justify-between text-[var(--accent-strong)]">
                {done < total ? `Continue with day ${nextDay}` : "All days done"}
                <ChevronRight className="h-4 w-4" />
              </p>
            </>
          ) : (
            <p className="type-body-sm flex items-center justify-between text-muted-foreground">
              <span>
                {total} days, {src.meta.level.charAt(0).toUpperCase() + src.meta.level.slice(1)}
              </span>
              <ChevronRight className="h-4 w-4" />
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
