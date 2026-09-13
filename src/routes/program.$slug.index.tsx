import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BookOpen, LifeBuoy } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { BackLink, ProgramHeader, pageMeta } from "@/components/equip/program-header";
import { HabitStreaks, NightGrid, NightsChart, UnitList } from "@/components/equip/journey";
import { allDays, getDay, getProgramme, minutesFor, unitOf } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";
import type { Programme, Step } from "@/lib/equip/types";

export const Route = createFileRoute("/program/$slug/")({
  loader: ({ params }) => {
    const programme = getProgramme(params.slug);
    if (!programme) throw notFound();
    return { slug: programme.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProgramme(loaderData.slug) : undefined;
    return p ? pageMeta(p.name, p.tagline) : { meta: [{ title: "Programme — iKAN" }] };
  },
  component: ProgrammePage,
});

function ProgrammePage() {
  const { slug } = Route.useLoaderData();
  const programme = getProgramme(slug)!;
  const { state, nextDay } = useProgramme(slug);
  return state.completed.length === 0 ? (
    <Cover programme={programme} />
  ) : (
    <Journey programme={programme} completed={state.completed} next={nextDay} />
  );
}

function Cover({ programme }: { programme: Programme }) {
  const days = allDays(programme).length;
  return (
    <IkanShell>
      <div className="relative">
        <img src={programme.cover} alt="" className="h-[340px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/10 to-background" />
        <div className="absolute inset-x-0 top-0">
          <ProgramHeader back={<BackLink to="/program" />} />
        </div>
      </div>
      <section className="-mt-16 relative px-5">
        <h1 className="font-display text-[40px] font-semibold leading-[1.02] tracking-[-0.025em]">
          {programme.name}
        </h1>
        <p className="mt-3 text-[18px] leading-[1.45]">{programme.tagline}</p>
        <p className="mt-3 text-[15px] leading-[1.6] text-muted-foreground">
          {programme.description}
        </p>
        <p className="mt-5 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{days} days</span>, about 5 to 15 minutes
          each. {programme.level}.
        </p>
      </section>

      <section className="mt-9 px-5">
        <h2 className="font-display text-lg font-semibold">What you'll work on</h2>
        <div className="mt-1">
          <UnitList programme={programme} completed={[]} next={0} />
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="rounded-[22px] bg-secondary/70 p-5 text-[14px] leading-[1.6] text-muted-foreground">
          {programme.notes.map((n) => (
            <p key={n} className="[&+p]:mt-2">
              {n}
            </p>
          ))}
          <Link
            to="/support"
            className="mt-3 inline-flex items-center gap-1.5 font-semibold text-alert-strong"
          >
            <LifeBuoy className="h-4 w-4" /> Get support now
          </Link>
        </div>
      </section>

      <div className="sticky bottom-24 z-10 mt-6 px-5">
        <Link
          to="/program/$slug/day/$day"
          params={{ slug: programme.slug, day: "0" }}
          className="flex h-14 items-center justify-center rounded-full bg-foreground font-display text-base font-semibold text-background shadow-dock"
        >
          Start with day 0
        </Link>
      </div>
    </IkanShell>
  );
}

const activityOf = (s: Step) =>
  s.kind === "lesson" || s.kind === "conclude" ? null : "title" in s ? s.title : null;

function Journey({
  programme,
  completed,
  next,
}: {
  programme: Programme;
  completed: number[];
  next: number;
}) {
  const { state, entries } = useProgramme(programme.slug);
  const days = allDays(programme);
  const finished = next >= days.length;
  const tonight = finished ? undefined : getDay(programme, next);
  const unit = tonight ? unitOf(programme, tonight.day) : undefined;
  const activities = tonight
    ? Array.from(new Set(tonight.steps.map(activityOf).filter(Boolean)))
    : [];

  return (
    <IkanShell>
      <ProgramHeader
        back={<BackLink to="/program" />}
        title={programme.name}
        action={
          <Link
            to="/program/$slug/journal"
            params={{ slug: programme.slug }}
            aria-label="Your journal"
            className="grid h-11 w-11 place-items-center rounded-full bg-secondary/70"
          >
            <BookOpen className="h-5 w-5" />
          </Link>
        }
      />

      <section className="px-5 pt-4">
        {tonight ? (
          <>
            <p className="text-[15px] text-muted-foreground">
              {unit ? `${unit.title}, unit ${unit.n} of ${programme.units.length}` : null}
            </p>
            <h1 className="mt-1 font-display text-[44px] font-semibold leading-none tracking-[-0.03em] tabular-nums">
              Day {tonight.day}
              <span className="text-muted-foreground/50"> / {days.length - 1}</span>
            </h1>
          </>
        ) : (
          <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.02em]">
            You finished {programme.name}
          </h1>
        )}
      </section>

      {tonight ? (
        <section className="mt-5 px-5">
          <Link
            to="/program/$slug/day/$day"
            params={{ slug: programme.slug, day: String(tonight.day) }}
            className="hero-card block"
          >
            <img src={programme.cover} alt="" className="hero-media" />
            <div className="hero-veil" />
            <div className="relative">
              <p className="text-sm opacity-75">Today, about {minutesFor(tonight)} min</p>
              <p className="mt-1 font-display text-[26px] font-semibold leading-tight">
                {tonight.title}
              </p>
              {activities.length ? (
                <ul className="mt-4 space-y-1.5 text-[15px]">
                  {activities.map((a) => (
                    <li key={a} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-background/70" />
                      {a}
                    </li>
                  ))}
                </ul>
              ) : null}
              <span className="mt-6 flex h-12 items-center justify-center rounded-full bg-background font-display text-[15px] font-semibold text-foreground">
                Start day {tonight.day}
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="mt-10 px-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold">Your days</h2>
          <p className="text-sm tabular-nums text-muted-foreground">
            {completed.length} of {days.length} done
          </p>
        </div>
        <div className="mt-4">
          <NightGrid programme={programme} completed={completed} next={next} />
        </div>
      </section>

      {Object.keys(state.diary).length > 0 ? (
        <section className="mt-10 px-5">
          <h2 className="font-display text-lg font-semibold">Your nights</h2>
          <div className="mt-4">
            <NightsChart diary={state.diary} />
          </div>
        </section>
      ) : null}

      {Object.keys(state.tracker).length > 0 ? (
        <section className="mt-10 px-5">
          <h2 className="font-display text-lg font-semibold">Your habits</h2>
          <div className="mt-4">
            <HabitStreaks habits={entries("habits")} tracker={state.tracker} field="habit" />
          </div>
        </section>
      ) : null}

      <section className="mt-10 px-5">
        <h2 className="font-display text-lg font-semibold">Units</h2>
        <UnitList programme={programme} completed={completed} next={next} />
      </section>
    </IkanShell>
  );
}
