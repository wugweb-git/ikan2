import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Check, ChevronRight, LifeBuoy, Lock, Wrench } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, Button, IconButton, stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useScrollY } from "@/hooks/use-personal-context";
import { cn } from "@/lib/utils";
import { focusOf, getProgramme, minutesOf } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";
import type { Programme } from "@/lib/equip/types";

export const Route = createFileRoute("/program/$slug/")({
  loader: ({ params }) => {
    const programme = getProgramme(params.slug);
    if (!programme) throw notFound();
    return { slug: programme.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProgramme(loaderData.slug) : undefined;
    return p ? pageMeta(p.name, p.source.description) : { meta: [{ title: "Programme — iKAN" }] };
  },
  component: ProgrammePage,
});

function ProgrammePage() {
  const { slug } = Route.useLoaderData();
  const programme = getProgramme(slug)!;
  const navigate = useNavigate();
  const { state, nextDay } = useProgramme(slug);
  const y = useScrollY();
  const collapsed = y > 180;
  const lastDay = programme.days.at(-1)!.day;
  const finished = nextDay > lastDay;
  const today = finished ? undefined : programme.days.find((d) => d.day === nextDay);
  const started = state.completed.length > 0;
  const src = programme.source;

  return (
    <IkanShell>
      <div style={accentStyle(programme.accent)}>
        {/* small top app bar that takes over once the large header scrolls away */}
        <div
          className={cn(
            "fixed inset-x-0 top-0 z-40 mx-auto flex h-16 max-w-md items-center gap-1 bg-background px-1 transition-[opacity,box-shadow]",
            collapsed ? "opacity-100 shadow-[0_1px_0_rgba(0,0,0,0.08)]" : "pointer-events-none opacity-0",
          )}
          aria-hidden={!collapsed}
        >
          <IconButton label="Back" onClick={() => navigate({ to: "/program" })}>
            <ArrowLeft className="h-6 w-6" />
          </IconButton>
          <p className="flex-1 truncate px-2 font-display text-[20px] font-semibold">{programme.name}</p>
          <JournalButton slug={slug} />
        </div>

        {/* large top app bar over the cover */}
        <header className="relative h-[300px] overflow-hidden text-background">
          <img src={programme.cover} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ transform: `translateY(${y * 0.3}px) scale(1.05)` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/75" />
          <div className="relative flex h-16 items-center justify-between px-1">
            <IconButton label="Back" onClick={() => navigate({ to: "/program" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
            <JournalButton slug={slug} />
          </div>
          <div className="absolute inset-x-0 bottom-0 px-4 pb-6">
            {src.tagline ? <p className="text-[14px] opacity-85">{src.tagline}</p> : null}
            <h1 className="mt-1 font-display text-[40px] font-semibold leading-[44px] tracking-[-0.02em]">{programme.name}</h1>
            <p className="mt-2 text-[14px] opacity-85">
              {src.meta.days}, {src.meta.level}
            </p>
          </div>
        </header>

        <div className="-mt-4 relative rounded-t-[28px] bg-background px-4 pt-6">
          {!started && src.description ? <p className="mb-5 text-[16px] leading-[1.6] text-foreground/85">{src.description}</p> : null}

          {today ? (
            <section className="rounded-[28px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]">
              <p className="text-[14px] font-medium">
                {started ? "Up next" : "Start here"}, about {minutesOf(today)} min
              </p>
              <p className="mt-1 font-display text-[36px] font-semibold leading-[44px] tabular-nums">Day {today.day}</p>
              <p className="font-display text-[20px] font-semibold leading-7">{today.title}</p>
              {today.subtitle ? <p className="mt-1 text-[15px] opacity-80">{today.subtitle}</p> : null}
              <ul className="mt-4 flex flex-wrap gap-2">
                {today.blocks
                  .filter((b) => b.type !== "conclude")
                  .map((b, i) => (
                    <li key={i} className="rounded-[8px] border border-current/25 px-3 py-1.5 text-[13px] font-medium">
                      {b.title}
                    </li>
                  ))}
              </ul>
              <Button
                className="mt-5 h-14 w-full text-[16px]"
                onClick={() => navigate({ to: "/program/$slug/day/$day", params: { slug, day: String(today.day) } })}
              >
                Start day {today.day}
              </Button>
            </section>
          ) : (
            <section className="rounded-[28px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]">
              <p className="font-display text-[24px] font-semibold">All {programme.days.length} days done</p>
              <p className="mt-1 text-[15px]">Every day stays open to revisit below.</p>
            </section>
          )}

          <DayGrid programme={programme} completed={state.completed} next={nextDay} />

          {programme.tools.length ? <Tools programme={programme} reached={nextDay} /> : null}

          <section className="mt-8">
            <h2 className="px-0 font-display text-[16px] font-semibold">Units</h2>
            <ul className="-mx-4 mt-1">
              {src.units.map((u, i) => {
                const days = u.days.map((d) => d.day);
                const done = days.filter((d) => state.completed.includes(d)).length;
                const current = days.includes(nextDay);
                return (
                  <li key={i} className="flex min-h-[72px] items-center gap-4 px-4 py-2">
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-[15px] font-semibold",
                        done === days.length ? "bg-foreground text-background" : current ? "bg-[var(--accent-container)] text-[var(--on-accent-container)]" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {done === days.length ? <Check className="h-5 w-5" strokeWidth={3} /> : i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] font-medium leading-6">{u.title}</p>
                      <p className="text-[14px] leading-5 text-muted-foreground">{focusOf(programme, i)}</p>
                    </div>
                    <p className="shrink-0 text-right text-[12px] leading-4 tabular-nums text-muted-foreground">
                      {days.length === 1 ? `Day ${days[0]}` : `Days ${days[0]}–${days.at(-1)}`}
                      <span className="block">
                        {done}/{days.length}
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          <Link to="/support" className={cn("-mx-4 mt-4 flex min-h-14 items-center gap-4 px-4 text-alert-strong", stateLayer)}>
            <LifeBuoy className="h-6 w-6" />
            <span className="flex-1 text-[16px] font-medium">Get support now</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </IkanShell>
  );
}

function JournalButton({ slug }: { slug: string }) {
  return (
    <Link to="/program/$slug/journal" params={{ slug }} aria-label="Your entries" className={cn("grid h-12 w-12 place-items-center rounded-full", stateLayer)}>
      <BookOpen className="h-6 w-6" />
    </Link>
  );
}

/** Calendar-style day picker: done days are filled, the next day is outlined. */
function DayGrid({ programme, completed, next }: { programme: Programme; completed: number[]; next: number }) {
  return (
    <section className="mt-8">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[16px] font-semibold">Days</h2>
        <p className="text-[14px] tabular-nums text-muted-foreground">
          {completed.length} of {programme.days.length}
        </p>
      </div>
      <ol className="mt-3 grid grid-cols-7 gap-y-2">
        {programme.days.map((d) => {
          const done = completed.includes(d.day);
          const open = d.day === next;
          const cell = (
            <span
              className={cn(
                "mx-auto grid h-10 w-10 place-items-center rounded-full text-[14px] font-medium tabular-nums",
                done && "bg-foreground text-background",
                open && "border-2 border-[var(--accent)] font-semibold text-foreground",
                !done && !open && "text-muted-foreground/60",
              )}
            >
              {d.day}
            </span>
          );
          return (
            <li key={d.day}>
              {done || open ? (
                <Link
                  to="/program/$slug/day/$day"
                  params={{ slug: programme.slug, day: String(d.day) }}
                  aria-label={`Day ${d.day}: ${d.title}${done ? ", done" : ", up next"}`}
                  className="block rounded-full focus-visible:outline-2"
                >
                  {cell}
                </Link>
              ) : (
                <span role="img" aria-label={`Day ${d.day}: ${d.title}, locked`} className="block">
                  {cell}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Tools({ programme, reached }: { programme: Programme; reached: number }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-[16px] font-semibold">Tools</h2>
      <p className="mt-1 text-[14px] text-muted-foreground">Open these any time once you reach them.</p>
      <ul className="-mx-4 mt-1">
        {programme.tools.map((t) => {
          const open = reached > t.day;
          return (
            <li key={`${t.day}.${t.n}`}>
              {open ? (
                <Link
                  to="/program/$slug/tool/$step"
                  params={{ slug: programme.slug, step: `${t.day}.${t.n}` }}
                  className={cn("flex min-h-14 items-center gap-4 px-4", stateLayer)}
                >
                  <Wrench className="h-6 w-6" />
                  <span className="flex-1 text-[16px]">{t.title}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              ) : (
                <p className="flex min-h-14 items-center gap-4 px-4 text-muted-foreground">
                  <Lock className="h-5 w-5" />
                  <span className="flex-1 text-[16px]">{t.title}</span>
                  <span className="text-[13px]">Day {t.day}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
