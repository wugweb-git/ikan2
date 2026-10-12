import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, History, NotebookPen } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { cn } from "@/lib/utils";
import { dayCount, daysDoneOf, programmes, upcoming } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";
import type { Programme } from "@/lib/equip/types";

export const Route = createFileRoute("/program/")({
  head: () =>
    pageMeta("Programs", "iKAN Equip programs for sleep, burnout and stress.", "/program"),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <IkanShell>
      <header className="safe-top relative px-4 pb-1">
        <div className="safe-pin absolute right-2 flex">
          <Link
            to="/history/program"
            aria-label="Equip history"
            title="Equip history"
            className={cn(
              "grid h-12 w-12 place-items-center rounded-full text-foreground",
              stateLayer,
            )}
          >
            <History className="h-6 w-6" />
          </Link>
          <Link
            to="/diaries"
            aria-label="Learning diaries"
            title="Learning diaries"
            className={cn(
              "grid h-12 w-12 place-items-center rounded-full text-foreground",
              stateLayer,
            )}
          >
            <NotebookPen className="h-6 w-6" />
          </Link>
        </div>
        <h1 className="type-headline-lg">Programs</h1>
        <p className="type-action mt-1 text-muted-foreground">
          Short daily sessions, one skill at a time.
        </p>
      </header>
      <ul className="space-y-3 px-4 pt-4">
        {programmes.map((p) => (
          <li key={p.slug}>
            <ProgrammeCard programme={p} />
          </li>
        ))}
      </ul>
      <section className="mt-8 px-4">
        <h2 className="type-title-md">Coming soon</h2>
        <ul className="mt-2">
          {upcoming.map((u) => (
            <li
              key={u.name}
              className="type-body-lg flex min-h-14 items-center justify-between rounded-[16px] border border-dashed border-foreground/20 px-4 text-muted-foreground"
            >
              {u.name}
              <span className="type-body-sm">Soon</span>
            </li>
          ))}
        </ul>
      </section>
    </IkanShell>
  );
}

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
