import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, BookOpen, Check, ChevronRight, LifeBuoy, Lock, Play, Wrench } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, Button, IconButton, Snackbar, stateLayer, useSnack } from "@/components/equip/m3";
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
  const collapsed = y > 150;
  const lastDay = programme.days.at(-1)!.day;
  const finished = nextDay > lastDay;
  const today = finished ? undefined : programme.days.find((d) => d.day === nextDay);
  const started = state.completed.length > 0;
  const src = programme.source;
  const snack = useSnack();

  // "Day N complete" once, after returning from a finished day
  useEffect(() => {
    try {
      const flag = sessionStorage.getItem("ikan.equip.finished");
      if (flag?.startsWith(`${slug}:`)) {
        sessionStorage.removeItem("ikan.equip.finished");
        snack.show(`Day ${flag.split(":")[1]} complete`);
      }
    } catch {
      /* storage unavailable */
    }
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const activities = today?.steps.filter((st) => st.view.ui !== "conclude").map((st) => st.block.title) ?? [];
  const uniqueActivities = activities.filter((t, i) => activities.indexOf(t) === i);
  const shown = uniqueActivities.slice(0, 4);

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
        <header className="relative h-[232px] overflow-hidden text-background">
          <img
            src={programme.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover motion-reduce:transform-none"
            style={{ transform: `translateY(${Math.min(y, 232) * 0.3}px) scale(1.05)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/80" />
          <div className="relative flex h-16 items-center justify-between px-1">
            <IconButton label="Back" onClick={() => navigate({ to: "/program" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
            <JournalButton slug={slug} />
          </div>
          <div className="absolute inset-x-0 bottom-0 px-4 pb-8">
            <h1 className="font-display text-[36px] font-semibold leading-[40px] tracking-[-0.02em]">{programme.name}</h1>
            <p className="mt-1.5 text-[14px] opacity-90">
              {src.meta.days}, {src.meta.level.charAt(0).toUpperCase() + src.meta.level.slice(1)}
            </p>
          </div>
        </header>

        <div className="-mt-4 relative rounded-t-[28px] bg-background px-4 pt-5">
          {today ? (
            <section className="rounded-[28px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-[32px] font-semibold leading-10 tabular-nums">Day {today.day}</p>
                <p className="text-[13px] font-medium">About {minutesOf(today)} min</p>
              </div>
              <p className="font-display text-[20px] font-semibold leading-7">{today.title}</p>
              {today.subtitle ? <p className="mt-0.5 text-[15px] opacity-80">{today.subtitle}</p> : null}
              {shown.length ? (
                <ol className="mt-4 space-y-1.5 text-[15px]">
                  {shown.map((t, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-background/60 text-[12px] font-semibold tabular-nums">
                        {i + 1}
                      </span>
                      <span className="truncate">{t}</span>
                    </li>
                  ))}
                  {uniqueActivities.length > shown.length ? (
                    <li className="pl-9 text-[14px] opacity-80">and {uniqueActivities.length - shown.length} more</li>
                  ) : null}
                </ol>
              ) : null}
              <Button
                className="mt-5 h-14 w-full text-[16px]"
                icon={<Play className="h-5 w-5" />}
                onClick={() => navigate({ to: "/program/$slug/day/$day", params: { slug, day: String(today.day) } })}
              >
                {started ? `Continue with day ${today.day}` : `Start day ${today.day}`}
              </Button>
            </section>
          ) : (
            <section className="rounded-[28px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-background/60">
                <Check className="h-6 w-6" strokeWidth={3} />
              </span>
              <p className="mt-3 font-display text-[24px] font-semibold">All {programme.days.length} days done</p>
              <p className="mt-1 text-[15px]">Every day stays open to revisit below.</p>
            </section>
          )}

          {!started && src.description ? (
            <section className="mt-6">
              <h2 className="font-display text-[16px] font-semibold">About</h2>
              {src.description ? <p className="mt-2 text-[16px] leading-[1.6] text-foreground/85">{src.description}</p> : null}
            </section>
          ) : null}

          <DayGrid programme={programme} completed={state.completed} next={nextDay} />

          {programme.tools.length ? <Tools programme={programme} reached={nextDay} /> : null}

          <section className="mt-8">
            <h2 className="font-display text-[16px] font-semibold">Units</h2>
            <ul className="-mx-4 mt-1">
              {src.units.map((u, i) => {
                const days = u.days.map((d) => d.day);
                const done = days.filter((d) => state.completed.includes(d)).length;
                const complete = done === days.length;
                const current = days.includes(nextDay);
                return (
                  <li key={i} className={cn("flex min-h-[72px] items-center gap-4 px-4 py-2", current && "bg-[var(--accent-container)]/40")}>
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-[15px] font-semibold",
                        complete ? "bg-foreground text-background" : current ? "bg-[var(--accent-container)] text-[var(--on-accent-container)]" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {complete ? <Check className="h-5 w-5" strokeWidth={3} /> : i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] font-medium leading-6">{u.title}</p>
                      <p className="text-[14px] leading-5 text-muted-foreground">{focusOf(programme, i)}</p>
                      {done > 0 && !complete ? (
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--accent-container)]">
                          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(done / days.length) * 100}%` }} />
                        </div>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-right text-[12px] leading-4 tabular-nums text-muted-foreground">
                      {days.length === 1 ? `Day ${days[0]}` : `Days ${days[0]}–${days.at(-1)}`}
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
        <Snackbar message={snack.message} />
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
