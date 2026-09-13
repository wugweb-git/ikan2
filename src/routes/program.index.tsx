import { createFileRoute, Link } from "@tanstack/react-router";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { cn } from "@/lib/utils";
import { programmes, upcoming } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";
import type { Programme } from "@/lib/equip/types";

export const Route = createFileRoute("/program/")({
  head: () => pageMeta("Programmes", "iKAN Equip programmes for sleep and burnout."),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <IkanShell>
      <header className="px-4 pb-2 pt-8">
        <h1 className="font-display text-[32px] font-semibold leading-10">Programmes</h1>
      </header>
      <ul className="space-y-4 px-4 pt-2">
        {programmes.map((p) => (
          <li key={p.slug}>
            <ProgrammeCard programme={p} />
          </li>
        ))}
      </ul>
      <section className="mt-8">
        <h2 className="px-4 font-display text-[16px] font-semibold">Coming soon</h2>
        <ul className="mt-1">
          {upcoming.map((u) => (
            <li key={u.name} className="flex min-h-14 items-center px-4 text-[16px] text-muted-foreground">
              {u.name}
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
  const src = programme.source;

  return (
    <Link
      to="/program/$slug"
      params={{ slug: programme.slug }}
      style={accentStyle(programme.accent)}
      className={cn("block overflow-hidden rounded-[28px] bg-secondary", stateLayer)}
    >
      <img src={programme.cover} alt="" className="h-40 w-full object-cover" />
      <div className="p-5">
        <p className="font-display text-[24px] font-semibold leading-8">{programme.name}</p>
        <p className="mt-1 text-[15px] leading-6 text-muted-foreground">{src.description}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-1 flex-1 gap-1">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(done / total) * 100}%` }} />
            <div className="h-full flex-1 rounded-full bg-[var(--accent-container)]" />
          </div>
          <span className="text-[13px] tabular-nums text-muted-foreground">
            {done > 0 ? (nextDay < total ? `Day ${nextDay} next` : "Done") : `${src.meta.days}, ${src.meta.level}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
