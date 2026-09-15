import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Flag,
  Gauge,
  Activity,
  AlarmClock,
  ArrowLeft,
  BookOpen,
  Brain,
  CalendarDays,
  Clock3,
  Lightbulb,
  Moon,
  Repeat,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Check,
  ChevronRight,
  History,
  LifeBuoy,
  Lock,
  NotebookPen,
  Play,
  Wrench,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import {
  accentStyle,
  BottomSheet,
  Button,
  IconButton,
  Snackbar,
  stateLayer,
  useSnack,
} from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import {
  Bento,
  BeforeYouStart,
  Group,
  ImportantNote,
  SubHead,
  useBeforeStart,
} from "@/components/about";
import { dedupe, programmeAbout, type ProgrammeAbout } from "@/lib/content/about";
import { useScrollY } from "@/hooks/use-personal-context";
import { cn } from "@/lib/utils";
import { AddToCalendar } from "@/components/add-to-calendar";
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
  const { state, nextDay, reset } = useProgramme(slug);
  const [cancelling, setCancelling] = useState(false);
  const y = useScrollY();
  const collapsed = y > 150;
  const lastDay = programme.days.at(-1)!.day;
  const finished = nextDay > lastDay;
  const today = finished ? undefined : programme.days.find((d) => d.day === nextDay);
  const started = state.completed.length > 0;
  const src = programme.source;
  const snack = useSnack();
  const about = programmeAbout(slug, programme.days.length);
  const openToday = () =>
    today && navigate({ to: "/program/$slug/day/$day", params: { slug, day: String(today.day) } });
  const before = useBeforeStart(`programme.${slug}`, () => void openToday());

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

  const activities =
    today?.steps.filter((st) => st.view.ui !== "conclude").map((st) => st.block.title) ?? [];
  const uniqueActivities = activities.filter((t, i) => activities.indexOf(t) === i);
  const shown = uniqueActivities.slice(0, 4);

  const runs = state.runs ?? [];
  const level = src.meta.level.charAt(0).toUpperCase() + src.meta.level.slice(1);

  return (
    <IkanShell>
      <div style={accentStyle(programme.accent)}>
        {/* small top app bar that takes over once the banner scrolls away */}
        <div
          className={cn(
            "fixed inset-x-0 top-0 z-40 mx-auto flex h-16 max-w-app items-center gap-1 bg-background px-1 transition-[opacity,box-shadow]",
            collapsed
              ? "opacity-100 shadow-[0_1px_0_rgba(0,0,0,0.08)]"
              : "pointer-events-none opacity-0",
          )}
          aria-hidden={!collapsed}
        >
          <IconButton label="Back" onClick={() => navigate({ to: "/program" })}>
            <ArrowLeft className="h-6 w-6" />
          </IconButton>
          <p className="flex-1 truncate px-2 font-display text-[20px] font-semibold">
            {programme.name}
          </p>
        </div>

        <header className="relative h-56 overflow-hidden">
          <img
            src={programme.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover motion-reduce:transform-none"
            style={{ transform: `translateY(${Math.min(y, 224) * 0.3}px) scale(1.05)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
          <div className="absolute inset-x-0 top-0 p-2">
            <IconButton
              label="Back"
              onClick={() => navigate({ to: "/program" })}
              className="bg-background/80 backdrop-blur"
            >
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          </div>
        </header>

        <section className="relative -mt-10 px-4">
          <span className="grid h-14 w-14 place-items-center rounded-[18px] border-4 border-background bg-[var(--accent-container)] text-[var(--on-accent-container)]">
            <Sparkles className="h-7 w-7" />
          </span>
          <p className="mt-5 text-[14px] font-medium text-[var(--accent-strong)]">Equip program</p>
          <h1 className="mt-1 font-display text-[30px] font-semibold leading-9">
            {programme.name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]">
              <CalendarDays className="h-4 w-4" /> {programme.days.length} days
            </span>
            <span className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]">
              <Clock3 className="h-4 w-4" /> 5–10 min a day
            </span>
            <span className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]">
              <Gauge className="h-4 w-4" /> {level}
            </span>
          </div>
          {runs.length || started ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {runs.length ? (
                <Link
                  to="/history/program/$slug"
                  params={{ slug }}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--accent-container)] pl-3 pr-2 text-[14px] font-semibold text-[var(--on-accent-container)]",
                    stateLayer,
                  )}
                >
                  <History className="h-4 w-4" /> {runs.length} past{" "}
                  {runs.length === 1 ? "run" : "runs"}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : null}
              {started ? (
                <Link
                  to="/diaries/$slug"
                  params={{ slug }}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-3 pr-2 text-[14px] font-semibold",
                    stateLayer,
                  )}
                >
                  <NotebookPen className="h-4 w-4" /> Learning diary
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          ) : null}
        </section>

        {/* enrolled: what today holds (the button lives in the bar at the bottom) */}
        {started && today ? (
          <div className="mt-6 px-4">
            <section className="rounded-[28px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[13px] font-semibold">Up next</p>
                <p className="text-[13px] font-medium">About {minutesOf(today)} min</p>
              </div>
              <p className="mt-1 font-display text-[26px] font-semibold leading-8 tabular-nums">
                Day {today.day}
              </p>
              <p className="font-display text-[18px] font-semibold leading-6">{today.title}</p>
              <AddToCalendar
                className="mt-3"
                label="Daily reminder"
                filename={`ikan-${programme.slug}`}
                time="20:00"
                event={{
                  title: `${programme.name}: today’s session`,
                  details: `About ${minutesOf(today)} minutes. Open iKAN to continue your program.`,
                  start: new Date(),
                  minutes: Math.max(10, minutesOf(today)),
                  daily: Math.max(1, programme.days.length - state.completed.length),
                  url: `https://app.ikanhealth.in/program/${programme.slug}`,
                  alertBefore: 0,
                }}
              />
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
                    <li className="pl-9 text-[14px] opacity-80">
                      and {uniqueActivities.length - shown.length} more
                    </li>
                  ) : null}
                </ol>
              ) : null}
            </section>
          </div>
        ) : null}

        {/* progress band (or what's inside, before starting) */}
        <section className="mt-10 bg-foreground/[0.035] px-4 pb-8 pt-7">
          <h2 className="font-display text-[20px] font-semibold leading-7">
            {started ? "Your progress" : "What’s inside"}
          </h2>
          {started ? (
            <>
              <DayGrid programme={programme} completed={state.completed} next={nextDay} />
              {programme.tools.length ? <Tools programme={programme} reached={nextDay} /> : null}
            </>
          ) : null}
          <ul className="mt-4 overflow-hidden rounded-[20px] bg-background">
            {src.units.map((u, i) => {
              const days = u.days.map((d) => d.day);
              const done = days.filter((d) => state.completed.includes(d)).length;
              const complete = started && done === days.length;
              const current = started && days.includes(nextDay);
              const range =
                days.length === 1
                  ? days[0] === 0
                    ? "Intro"
                    : `Day ${days[0]}`
                  : `Days ${days[0] === 0 ? 1 : days[0]}–${days.at(-1)}`;
              return (
                <li
                  key={i}
                  className={cn(
                    "flex min-h-[68px] items-center gap-3 px-4 py-2",
                    i > 0 && "border-t border-foreground/[0.06]",
                    current && "bg-[var(--accent-container)]/40",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[14px] font-semibold",
                      complete
                        ? "bg-foreground text-background"
                        : current
                          ? "bg-[var(--accent-container)] text-[var(--on-accent-container)]"
                          : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {complete ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium leading-5">{u.title}</p>
                    <p className="text-[13px] leading-5 text-muted-foreground">
                      {focusOf(programme, i)}
                    </p>
                  </div>
                  <p className="shrink-0 text-right text-[12px] tabular-nums text-muted-foreground">
                    {range}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        {about && !started ? (
          <div className="px-4">
            <ProgrammeAboutSections about={about} />
          </div>
        ) : null}

        <div className="mt-8 px-4">
          <Link
            to="/support"
            className={cn(
              "-mx-4 flex min-h-14 items-center gap-4 px-4 text-alert-strong",
              stateLayer,
            )}
          >
            <LifeBuoy className="h-6 w-6" />
            <span className="flex-1 text-[16px] font-medium">Get support now</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
        {/* one button, always in reach: first visit, returning (finished before) or enrolled */}
        <div className="sticky bottom-[88px] z-20 mt-6 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6">
          {started && today ? (
            <Button
              className="h-14 w-full text-[16px]"
              icon={<Play className="h-5 w-5" />}
              onClick={openToday}
            >
              Continue with day {today.day}
            </Button>
          ) : (
            <Button
              className="h-14 w-full text-[16px]"
              icon={<Play className="h-5 w-5" />}
              onClick={before.request}
            >
              {runs.length ? "Start again" : "Start the program"}
            </Button>
          )}
        </div>
        {started && !finished ? (
          <div className="mt-10 border-t border-foreground/10 pt-4">
            <Button
              variant="text"
              className="w-full text-[oklch(0.45_0.17_25)]"
              onClick={() => setCancelling(true)}
            >
              Cancel program
            </Button>
          </div>
        ) : null}
        <BottomSheet
          open={cancelling}
          onClose={() => setCancelling(false)}
          title={`Cancel ${programme.name}?`}
        >
          <p className="text-[15px] leading-6 text-muted-foreground">
            You’ve done {Math.min(new Set(state.completed).size, programme.days.length)} of{" "}
            {programme.days.length} days. Cancelling clears this run’s progress and answers, and
            can’t be undone. Programs you’ve finished before stay in your history.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => setCancelling(false)}>Keep going</Button>
            <Button
              variant="text"
              className="text-[oklch(0.45_0.17_25)]"
              onClick={() => {
                reset();
                setCancelling(false);
                void navigate({ to: "/program" });
              }}
            >
              Cancel program
            </Button>
          </div>
        </BottomSheet>
        <BeforeYouStart
          open={before.open}
          onClose={before.close}
          onConfirm={before.confirm}
          items={[
            { icon: CalendarDays, text: `${programme.days.length} days, one short session a day` },
            { icon: Clock3, text: "Go at your own pace and come back any time" },
            { icon: ShieldCheck, text: "A self-help program, not medical treatment" },
            { icon: LifeBuoy, text: "Not for emergencies. Get support if you feel unsafe" },
          ]}
          cta="Start the program"
        />
        <Snackbar message={snack.message} />
      </div>
    </IkanShell>
  );
}

/** Calendar-style day picker: done days are filled, the next day is outlined. */
function DayGrid({
  programme,
  completed,
  next,
}: {
  programme: Programme;
  completed: number[];
  next: number;
}) {
  return (
    <section className="mt-3 rounded-[20px] bg-background p-3">
      <p className="px-1 text-[13px] tabular-nums text-muted-foreground">
        {completed.length} of {programme.days.length} days done
      </p>
      <ol className="mt-2 grid grid-cols-7 gap-y-2">
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
              {d.day === 0 ? <Flag className="h-4 w-4" aria-hidden="true" /> : d.day}
            </span>
          );
          return (
            <li key={d.day}>
              {done || open ? (
                <Link
                  to="/program/$slug/day/$day"
                  params={{ slug: programme.slug, day: String(d.day) }}
                  aria-label={`${d.day === 0 ? "Intro" : `Day ${d.day}`}: ${d.title}${done ? ", done" : ", up next"}`}
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
      <p className="mt-1 text-[14px] text-muted-foreground">
        Open these any time once you reach them.
      </p>
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

const includedIcon = (t: string) =>
  /lesson|minute/i.test(t)
    ? BookOpen
    : /cbt|technique|evidence/i.test(t)
      ? Brain
      : /track|progress|insight/i.test(t)
        ? TrendingUp
        : /plan|personal/i.test(t)
          ? Target
          : Lightbulb;
const whoIcons = [Moon, Brain, AlarmClock, Activity];

function ProgrammeAboutSections({ about }: { about: ProgrammeAbout }) {
  const included = dedupe(about.included);
  return (
    <div>
      <Group title="About this program" className="px-0">
        <p className="text-[15px] leading-6 text-foreground/85">
          {about.description || about.intro}
        </p>
        {about.whoFor.length ? (
          <>
            <SubHead>Is this for you?</SubHead>
            <Bento items={about.whoFor.map((text, i) => ({ icon: whoIcons[i % 4]!, text }))} />
          </>
        ) : null}
      </Group>

      {about.outcomes.length ? (
        <Group title="What you’ll gain" className="px-0">
          <Bento
            items={about.outcomes.map((o, i) => ({
              icon: [Sparkles, ShieldCheck, Repeat, Zap][i % 4]!,
              label: o.title,
              text: o.text,
            }))}
            offset={1}
          />
        </Group>
      ) : null}

      {included.length ? (
        <Group title="What’s included" className="px-0">
          <Bento items={included.map((text) => ({ icon: includedIcon(text), text }))} offset={2} />
        </Group>
      ) : null}

      <ImportantNote
        className="mx-0"
        text="A self-help program, not medical treatment, a diagnosis or an emergency service. If things feel severe or don’t ease, speak with a professional."
      />
    </div>
  );
}
