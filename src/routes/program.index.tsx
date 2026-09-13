import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { cn } from "@/lib/utils";
import { programmes, upcoming } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";
import type { Programme } from "@/lib/equip/types";

export const Route = createFileRoute("/program/")({
  head: () => pageMeta("Programs", "iKAN Equip programs for sleep, burnout and stress."),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <IkanShell>
      <header className="px-4 pb-1 pt-8">
        <h1 className="font-display text-[32px] font-semibold leading-10">Programs</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">Short daily sessions, one skill at a time.</p>
      </header>
      <ul className="space-y-3 px-4 pt-4">
        {programmes.map((p) => (
          <li key={p.slug}>
            <ProgrammeCard programme={p} />
          </li>
        ))}
      </ul>
      <section className="mt-8 px-4">
        <h2 className="font-display text-[16px] font-semibold">Coming soon</h2>
        <ul className="mt-2">
          {upcoming.map((u) => (
            <li key={u.name} className="flex min-h-14 items-center justify-between rounded-[16px] border border-dashed border-foreground/20 px-4 text-[16px] text-muted-foreground">
              {u.name}
              <span className="text-[13px]">Soon</span>
            </li>
          ))}
        </ul>
      </section>
    </IkanShell>
  );
}

function ProgrammeCard({ programme }: { programme: Programme }) {
  const { state, nextDay } = useProgramme(programme.slug);
  const total = programme.days.length;
  const done = state.completed.length;
  const started = done > 0;
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
        <p className="font-display text-[20px] font-semibold leading-7">{programme.name}</p>
        {src.description ? <p className="mt-1 line-clamp-2 text-[14px] leading-5 text-muted-foreground">{src.description}</p> : null}
        <div className="mt-auto pt-3">
          {started ? (
            <>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--accent-container)]">
                <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(done / total) * 100}%` }} />
              </div>
              <p className="mt-2 flex items-center justify-between text-[13px] font-medium text-[var(--accent-strong)]">
                {nextDay < total ? `Continue with day ${nextDay}` : "All days done"}
                <ChevronRight className="h-4 w-4" />
              </p>
            </>
          ) : (
            <p className="flex items-center justify-between text-[13px] text-muted-foreground">
              <span>
                {src.meta.days}, {src.meta.level.charAt(0).toUpperCase() + src.meta.level.slice(1)}
              </span>
              <ChevronRight className="h-4 w-4" />
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
