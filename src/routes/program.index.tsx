import { createFileRoute, Link } from "@tanstack/react-router";
import { IkanShell } from "@/components/ikan-shell";
import { BackLink, ProgramHeader, pageMeta } from "@/components/equip/program-header";
import { allDays, programmes, upcoming } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";
import type { Programme } from "@/lib/equip/types";

export const Route = createFileRoute("/program/")({
  head: () =>
    pageMeta(
      "Programmes",
      "Self-paced Equip programmes that build skills for sleep, stress and burnout.",
    ),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <IkanShell>
      <ProgramHeader back={<BackLink to="/" />} />
      <section className="px-5 pt-3">
        <h1 className="font-display text-[40px] font-semibold leading-none tracking-[-0.025em]">
          Programmes
        </h1>
        <p className="mt-3 max-w-[22rem] text-[15px] leading-6 text-muted-foreground">
          Short daily sittings that build one skill at a time. Go at your own pace.
        </p>
      </section>

      <section className="mt-7 space-y-4 px-5">
        {programmes.map((p) => (
          <ProgrammeCard key={p.slug} programme={p} />
        ))}
      </section>

      <section className="mt-10 px-5">
        <h2 className="font-display text-lg font-semibold">On the way</h2>
        <ul className="mt-2 divide-y divide-foreground/[0.07]">
          {upcoming.map((u) => (
            <li key={u.name} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-display text-[16px] font-semibold">{u.name}</p>
                <p className="mt-0.5 text-[14px] text-muted-foreground">{u.body}</p>
              </div>
              <span className="shrink-0 text-[13px] text-muted-foreground">Soon</span>
            </li>
          ))}
        </ul>
      </section>
    </IkanShell>
  );
}

function ProgrammeCard({ programme }: { programme: Programme }) {
  const { state, nextDay } = useProgramme(programme.slug);
  const total = allDays(programme).length;
  const done = state.completed.length;
  const started = done > 0;

  return (
    <Link
      to="/program/$slug"
      params={{ slug: programme.slug }}
      className="hero-card block min-h-[320px]"
    >
      <img src={programme.cover} alt="" className="hero-media !opacity-80" />
      <div className="hero-veil" />
      <div className="relative flex min-h-[280px] flex-col">
        <p className="text-sm opacity-80">
          {started ? `Day ${Math.min(nextDay, total - 1)} is next` : `${total} days`}
        </p>
        <div className="mt-auto">
          <p className="font-display text-[34px] font-semibold leading-none tracking-[-0.02em]">
            {programme.name}
          </p>
          <p className="mt-2 max-w-[18rem] text-[15px] leading-snug opacity-85">
            {programme.tagline}
          </p>
          {started ? (
            <div className="mt-5 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background/20">
                <div
                  className="h-full rounded-full bg-background"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
              <span className="text-sm tabular-nums opacity-85">
                {done}/{total}
              </span>
            </div>
          ) : null}
          <span className="mt-5 flex h-12 items-center justify-center rounded-full bg-background font-display text-[15px] font-semibold text-foreground">
            {started ? "Continue" : "See the programme"}
          </span>
        </div>
      </div>
    </Link>
  );
}
