import { createFileRoute, Link } from "@tanstack/react-router";
import { History, NotebookPen } from "lucide-react";
import { ProgrammeCard } from "@/components/equip/programme-card";
import { IkanShell } from "@/components/ikan-shell";
import { stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { cn } from "@/lib/utils";
import { programmes, upcoming } from "@/lib/equip/programs";
import type {} from "@/lib/equip/types";

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
