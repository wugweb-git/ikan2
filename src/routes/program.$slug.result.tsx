import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Brain,
  CheckCircle2,
  CloudRain,
  Eye,
  Heart,
  ListTodo,
  NotebookPen,
  NotebookText,
  Scale,
  Sparkles,
  Target,
  type LucideIcon,
  BedDouble,
  ListChecks,
  Moon,
  Star,
  CalendarDays,
  ChevronRight,
  Clock3,
  Flame,
  History,
  Hourglass,
  Quote,
  TrendingDown,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import { Bento } from "@/components/about";
import { Illustration } from "@/components/art";
import { BrandTitle, PrintHeader, ShareButton } from "@/components/result-share";
import { getAssessment } from "@/lib/assessment/instruments";
import { resources, slugOf } from "@/lib/resources";
import { IkanShell } from "@/components/ikan-shell";
import { DateText } from "@/components/date-text";
import { accentStyle, Button, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { formatSeconds } from "@/hooks/use-active-time";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { journeyOf, latestRun, relatedAssessment, runParam } from "@/lib/equip/journey";
import { formatDuration } from "@/lib/equip/metrics";
import { getProgramme, programmes } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";
import { demoRun } from "@/lib/equip/demo";
import {
  programmeHighlights,
  programmeSummary,
  type HighlightIcon,
  type Summary,
} from "@/lib/equip/summary";
import { moodScale } from "@/lib/journal";

/* Equip result, laid out like an assessment result: a headline, then what the run adds up to,
 * built only from what the programme records. Shown once when the last day is finished
 * (?done=true plays the celebration); afterwards it opens from Program history. */

type Search = { done?: boolean; demo?: boolean; run?: number };

export const Route = createFileRoute("/program/$slug/result")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(runParam(s["run"]) !== undefined ? { run: runParam(s["run"])! } : {}),
    ...(s["done"] === true || s["done"] === "true" ? { done: true } : {}),
    // development only: a filled-in sample run to review the layout
    ...(import.meta.env.DEV && (s["demo"] === true || s["demo"] === "1") ? { demo: true } : {}),
  }),
  loader: ({ params }) => {
    if (!getProgramme(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) =>
    pageMeta(
      `${loaderData ? getProgramme(loaderData.slug)?.name : "Program"} result`,
      "What you did and learnt in this program.",
    ),
  component: ResultPage,
});

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function ResultPage() {
  const { slug } = Route.useLoaderData();
  const { done, demo, run } = Route.useSearch();
  const p = getProgramme(slug)!;
  const navigate = useNavigate();
  const hydrated = useHydrated();
  // right after the last day the programme has already reset, so show the latest finished run
  const real = latestRun(p, useProgramme(slug).state, run);
  const state = demo ? demoRun(p, run ?? 0) : real;
  const j = journeyOf(p, state);
  const sum = programmeSummary(p, state);
  const highlights = programmeHighlights(p, state);
  const [celebrate, setCelebrate] = useState(Boolean(done));
  const related = getAssessment(relatedAssessment[slug] ?? "");
  const article =
    resources.find((r) => r.assessment === related?.slug) ??
    resources.find((r) => r.category === (slug === "sleep-tight" ? "Sleep" : "Stress"));

  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => setCelebrate(false), 3000);
    return () => clearTimeout(t);
  }, [celebrate]);

  const shareText = [
    `${p.name} (iKAN Equip program)`,
    sum.timeline.start
      ? `${new Date(sum.timeline.start).toDateString()}${sum.timeline.end ? ` to ${new Date(sum.timeline.end).toDateString()}` : ""}`
      : "",
    `${sum.daysDone} of ${sum.totalDays} days done, ${sum.daysActive} days active`,
    sum.seconds ? `Time spent: ${formatSeconds(sum.seconds)}` : "",
    sum.helpful !== null ? `Sessions rated ${sum.helpful.toFixed(1)} out of 5 for helpfulness` : "",
    sum.sleep?.efficiencyEarly != null && sum.sleep.efficiencyLate != null
      ? `Sleep efficiency: ${Math.round(sum.sleep.efficiencyEarly)}% to ${Math.round(sum.sleep.efficiencyLate)}%`
      : "",
    sum.units.length ? `What I learnt: ${sum.units.map((u) => u.title).join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const bar = (
    <TopAppBar
      leading={
        <IconButton
          label="Close"
          onClick={() => navigate({ to: "/program/$slug", params: { slug } })}
        >
          <X className="h-6 w-6" />
        </IconButton>
      }
      title={<BrandTitle />}
      trailing={
        <>
          <ShareButton subject={`${p.name}: my iKAN program result`} body={shareText} />
          <Link
            to="/history/program/$slug"
            params={{ slug }}
            aria-label="Program history"
            className={cn("grid h-12 w-12 place-items-center rounded-full", stateLayer)}
          >
            <History className="h-6 w-6" />
          </Link>
        </>
      }
    />
  );

  if (!hydrated) return <IkanShell>{bar}</IkanShell>;

  if (!j.started) {
    return (
      <IkanShell>
        <div style={accentStyle(p.accent)}>
          {bar}
          <div className="px-6 pt-16 text-center">
            <h1 className="font-display text-[22px] font-semibold">No result yet</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Finish all {p.days.length} days of {p.name} to see your result here.
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate({ to: "/program/$slug", params: { slug } })}
            >
              Go to {p.name}
            </Button>
          </div>
        </div>
      </IkanShell>
    );
  }

  const feel = (v: number | null) => (v ? moodScale[Math.round(v) - 1] : undefined);
  const sleepChange =
    sum.sleep?.efficiencyEarly != null && sum.sleep.efficiencyLate != null
      ? sum.sleep.efficiencyLate - sum.sleep.efficiencyEarly
      : null;

  return (
    <IkanShell>
      <div style={accentStyle(p.accent)}>
        {celebrate && j.finished ? (
          <button
            type="button"
            onClick={() => setCelebrate(false)}
            className="fixed inset-0 z-[95] grid place-items-center bg-background/90 backdrop-blur-sm"
            aria-label="Close celebration"
          >
            <span className="text-center">
              <span className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-[var(--accent)] text-white">
                <Trophy className="h-14 w-14" />
              </span>
              <span className="mt-4 block font-display text-[32px] font-semibold">
                Congratulations!
              </span>
              <span className="mt-1 block text-[17px]">You’ve completed {p.name}!</span>
            </span>
          </button>
        ) : null}

        {bar}
        <PrintHeader title={`${p.name} result`} />

        <div className="animate-fade pb-6">
          {/* header, like an assessment result */}
          <header className="px-4 pt-2">
            {sum.timeline.start ? (
              <p className="text-[13px] text-muted-foreground">
                <DateText>
                  {longDate(sum.timeline.start)}
                  {sum.timeline.end && sum.timeline.end !== sum.timeline.start
                    ? ` to ${longDate(sum.timeline.end)}`
                    : ""}
                </DateText>
              </p>
            ) : null}
            <h1 className="mt-1 font-display text-[28px] font-semibold leading-9">{p.name}</h1>
            <p className="mt-1 flex flex-wrap gap-x-3 text-[14px] text-muted-foreground">
              <span>{sum.totalDays} days</span>
              {sum.seconds ? <span>{formatSeconds(sum.seconds)} spent</span> : null}
              <span>
                {sum.daysActive} {sum.daysActive === 1 ? "day" : "days"} active
              </span>
            </p>
          </header>

          {/* headline card */}
          <section className="mx-4 mt-5 rounded-[28px] bg-[var(--accent-container)] p-5 text-[var(--on-accent-container)]">
            <p className="text-[14px] font-medium">Equip program result</p>
            <p className="mt-1 font-display text-[34px] font-bold leading-10">
              {j.finished
                ? "Completed"
                : `${Math.round((sum.daysDone / sum.totalDays) * 100)}% done`}
            </p>
            <p className="mt-1 text-[15px] tabular-nums">
              <span className="font-semibold">
                {sum.daysDone} of {sum.totalDays} days
              </span>
              {sum.spanDays > 1 ? (
                <span className="opacity-80">, over {sum.spanDays} days</span>
              ) : null}
            </p>
            <UnitBar units={sum.units} />
            {sum.feelEarly !== null && sum.feelLate !== null ? (
              <p className="mt-4 flex items-center gap-2 text-[15px] leading-6">
                <span className="text-[22px]" aria-hidden="true">
                  {feel(sum.feelEarly)?.emoji}
                </span>
                <ChevronRight className="h-4 w-4 opacity-60" />
                <span className="text-[22px]" aria-hidden="true">
                  {feel(sum.feelLate)?.emoji}
                </span>
                <span>
                  After sessions you went from feeling {feel(sum.feelEarly)?.label.toLowerCase()} to{" "}
                  {feel(sum.feelLate)?.label.toLowerCase()}.
                </span>
              </p>
            ) : null}
          </section>

          <section className="mt-6 px-4">
            <h2 className="font-display text-[16px] font-semibold">Time and consistency</h2>
            <div className="mt-3">
              <Bento
                colored
                items={[
                  ...(sum.seconds
                    ? [
                        {
                          icon: Clock3,
                          label: formatSeconds(sum.seconds),
                          text: sum.secondsPerDay
                            ? `spent, about ${formatSeconds(sum.secondsPerDay)} a day`
                            : "spent",
                        },
                      ]
                    : []),
                  {
                    icon: CalendarDays,
                    label: `${sum.daysActive} of ${sum.totalDays}`,
                    text: "days active",
                  },
                  ...(sum.longestStreak > 1
                    ? [{ icon: Flame, label: `${sum.longestStreak} days`, text: "longest streak" }]
                    : []),
                  ...(sum.spanDays
                    ? [
                        {
                          icon: Hourglass,
                          label: `${sum.spanDays} days`,
                          text: "from first day to last",
                        },
                      ]
                    : []),
                ]}
              />
            </div>
          </section>

          {sum.helpful !== null || sum.mostHelpful.length ? (
            <Rows
              title="How your sessions went"
              rows={[
                sum.helpful !== null
                  ? {
                      label: "Helpfulness",
                      value: `${sum.helpful.toFixed(1)} / 5`,
                      note: `from ${sum.helpfulDays} ${sum.helpfulDays === 1 ? "session" : "sessions"} you rated`,
                    }
                  : null,
                ...sum.mostHelpful.map((d) => ({
                  label: d.day === 0 ? "Onboarding" : `Day ${d.day}: ${d.title}`,
                  value: `${d.rating} / 5`,
                  note: "one of your most helpful days",
                })),
              ]}
            />
          ) : null}

          {/* what was learnt and explored */}
          <section className="mt-6 px-4">
            <h2 className="font-display text-[16px] font-semibold">What you learnt</h2>
            <ul className="mt-3 overflow-hidden rounded-[20px] bg-secondary">
              {sum.units.map((u, i) => (
                <li
                  key={u.title}
                  className={cn("px-4 py-3", i > 0 && "border-t border-background")}
                >
                  <div className="flex items-start gap-3">
                    <p className="min-w-0 flex-1 text-[15px] font-medium leading-6">{u.title}</p>
                    <span className="text-[13px] tabular-nums text-muted-foreground">
                      {u.done}/{u.total}
                    </span>
                  </div>
                  {u.focus ? (
                    <p className="text-[13px] leading-5 text-muted-foreground">{u.focus}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          {/* from the answers: programme specific */}
          {sum.sleep ? (
            <section className="mt-6 px-4">
              <h2 className="font-display text-[16px] font-semibold">Your sleep</h2>
              <div className="mt-3">
                <Bento
                  colored
                  offset={1}
                  items={[
                    {
                      icon: Moon,
                      label: `${sum.sleep.nights} nights`,
                      text: "logged in your sleep diary",
                    },
                    ...(sum.sleep.asleep
                      ? [
                          {
                            icon: BedDouble,
                            label: formatDuration(sum.sleep.asleep),
                            text:
                              sum.statedSleepHours !== null
                                ? `asleep a night on average (you said ${sum.statedSleepHours} h)`
                                : "asleep a night on average",
                          },
                        ]
                      : []),
                    ...(sum.sleep.efficiencyEarly != null && sum.sleep.efficiencyLate != null
                      ? [
                          {
                            icon: (sleepChange ?? 0) >= 0 ? TrendingUp : TrendingDown,
                            label: `${Math.round(sum.sleep.efficiencyEarly)}% → ${Math.round(sum.sleep.efficiencyLate)}%`,
                            text: "of time in bed asleep, first week to last",
                          },
                        ]
                      : []),
                    ...(sum.sleep.qualityEarly != null && sum.sleep.qualityLate != null
                      ? [
                          {
                            icon: Star,
                            label: `${sum.sleep.qualityEarly.toFixed(1)} → ${sum.sleep.qualityLate.toFixed(1)}`,
                            text: "sleep quality out of 5, first week to last",
                          },
                        ]
                      : []),
                    ...(sum.habits
                      ? [
                          {
                            icon: ListChecks,
                            label: `${sum.habits.rate}%`,
                            text: `habit check-ins done, ${sum.habits.count} ${sum.habits.count === 1 ? "habit" : "habits"}`,
                          },
                        ]
                      : []),
                  ]}
                />
              </div>
            </section>
          ) : null}

          {highlights && highlights.tiles.length ? (
            <section className="mt-6 px-4">
              <h2 className="font-display text-[16px] font-semibold">{highlights.title}</h2>
              <div className="mt-3">
                <Bento
                  colored
                  offset={2}
                  items={highlights.tiles.map((t) => ({
                    icon: highlightIcons[t.icon],
                    label: t.label,
                    text: t.text,
                  }))}
                />
              </div>
            </section>
          ) : null}

          {sum.starting.length ? (
            <Rows
              title="Where you started"
              rows={sum.starting.map((x) => ({ label: x.title, value: x.value, wide: true }))}
            />
          ) : null}

          {sum.built.length || sum.tallies.length ? (
            <Rows
              title="From your logs"
              rows={[
                ...sum.built.map((b) => ({
                  label: b.title,
                  value: `${b.count} ${b.count === 1 ? "entry" : "entries"}`,
                })),
                ...sum.tallies.map((t) => ({
                  label: t.field,
                  value: t.counts.map((c) => `${c.option} ${c.count}`).join(" · "),
                  note: t.log,
                  wide: true,
                })),
              ]}
            />
          ) : null}

          {sum.choices.length ? (
            <section className="mt-6 px-4">
              <h2 className="font-display text-[16px] font-semibold">What you noticed</h2>
              <div className="mt-3 space-y-4 rounded-[20px] bg-secondary p-4">
                {sum.choices.map((c) => (
                  <div key={`${c.day}-${c.title}`}>
                    <p className="text-[13px] text-muted-foreground">
                      Day {c.day} · {c.title}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {c.picked.map((x) => (
                        <span
                          key={x}
                          className="rounded-full bg-background px-3 py-1.5 text-[13px]"
                        >
                          {x}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {sum.words.length ? (
            <section className="mt-6 px-4">
              <h2 className="font-display text-[16px] font-semibold">In your words</h2>
              <ul className="mt-3 space-y-2">
                {sum.words.map((w) => (
                  <li key={`${w.day}-${w.text}`} className="rounded-[20px] bg-secondary p-4">
                    <Quote className="h-4 w-4 text-[var(--accent-strong)]" />
                    <p className="mt-1.5 text-[15px] leading-6">{w.text}</p>
                    <p className="mt-2 text-[12px] text-muted-foreground">Day {w.day}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-8 px-4 print:hidden">
            <h2 className="font-display text-[16px] font-semibold">What’s next</h2>
            <ul className="mt-3 space-y-3">
              {related ? (
                <li>
                  <Link
                    to="/assessments/$slug"
                    params={{ slug: related.slug }}
                    className={cn(
                      "flex items-center gap-3 rounded-[20px] bg-secondary p-3 pr-4",
                      stateLayer,
                    )}
                  >
                    <span className="h-16 w-16 shrink-0 overflow-hidden rounded-[14px]">
                      <Illustration art="measure" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-semibold text-[var(--accent-strong)]">
                        Assessment
                      </span>
                      <span className="block text-[15px] font-semibold leading-5">
                        {related.title}
                      </span>
                      <span className="block text-[13px] text-muted-foreground">
                        {related.questions.length} questions, about {related.minutes} min
                      </span>
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </li>
              ) : null}
              {article ? (
                <li>
                  <Link
                    to="/resources/$slug"
                    params={{ slug: slugOf(article) }}
                    className={cn(
                      "flex items-center gap-3 rounded-[20px] bg-secondary p-3 pr-4",
                      stateLayer,
                    )}
                  >
                    <span className="h-16 w-16 shrink-0 overflow-hidden rounded-[14px]">
                      <Illustration art={article.art} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-semibold text-[var(--accent-strong)]">
                        Read · {article.minutes} min
                      </span>
                      <span className="line-clamp-2 text-[15px] font-semibold leading-5">
                        {article.title}
                      </span>
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                </li>
              ) : null}
              {programmes
                .filter((x) => x.slug !== slug)
                .slice(0, 1)
                .map((o) => (
                  <li key={o.slug}>
                    <Link
                      to="/program/$slug"
                      params={{ slug: o.slug }}
                      style={accentStyle(o.accent)}
                      className={cn(
                        "flex items-center gap-3 rounded-[20px] bg-secondary p-3 pr-4",
                        stateLayer,
                      )}
                    >
                      <img
                        src={o.cover}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-[14px] object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-semibold text-[var(--accent-strong)]">
                          Program
                        </span>
                        <span className="block text-[15px] font-semibold leading-5">{o.name}</span>
                        <span className="line-clamp-1 text-[13px] text-muted-foreground">
                          {o.source.description}
                        </span>
                      </span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
            </ul>
          </section>

          <div className="mt-8 flex gap-3 px-4 print:hidden">
            <Button
              variant="outlined"
              className="flex-1"
              onClick={() => navigate({ to: "/program" })}
            >
              Explore programs
            </Button>
            <Button
              className="flex-1"
              icon={<NotebookPen className="h-4 w-4" />}
              onClick={() =>
                navigate({
                  to: "/diaries/$slug",
                  params: { slug },
                  search: run !== undefined ? { run } : {},
                })
              }
            >
              Learning diary
            </Button>
          </div>

          <p className="mx-auto mt-6 max-w-xs px-4 text-center text-[12px] leading-5 text-muted-foreground">
            A self-help program, not medical treatment. iKAN supports, but never replaces, care from
            a qualified professional.
          </p>
        </div>
      </div>
    </IkanShell>
  );
}

const highlightIcons: Record<HighlightIcon, LucideIcon> = {
  signs: Eye,
  log: NotebookText,
  goal: Target,
  check: CheckCircle2,
  worry: CloudRain,
  task: ListTodo,
  sparkle: Sparkles,
  heart: Heart,
  scale: Scale,
  brain: Brain,
};

type Row = {
  label: string;
  value: string;
  note?: string | undefined;
  trend?: number | null;
  wide?: boolean;
} | null;

/** A titled list of label and value rows, like the scores on an assessment result. */
function Rows({ title, rows }: { title: string; rows: Row[] }) {
  const shown = rows.filter((r): r is NonNullable<Row> => r !== null);
  if (!shown.length) return null;
  return (
    <section className="mt-6 px-4">
      <h2 className="font-display text-[16px] font-semibold">{title}</h2>
      <ul className="mt-3 overflow-hidden rounded-[20px] bg-secondary">
        {shown.map((r, i) => {
          const Trend = r.trend ? (r.trend > 0 ? TrendingUp : TrendingDown) : null;
          return (
            <li
              key={`${r.label}-${i}`}
              className={cn(
                "px-4 py-3",
                i > 0 && "border-t border-background",
                !r.wide && "flex items-start gap-3",
              )}
            >
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[15px] leading-6",
                    r.wide ? "text-muted-foreground" : "font-medium",
                  )}
                >
                  {r.label}
                </p>
                {r.note && !r.wide ? (
                  <p className="text-[13px] leading-5 text-muted-foreground">{r.note}</p>
                ) : null}
              </div>
              <p
                className={cn(
                  "inline-flex items-center gap-1.5 tabular-nums",
                  r.wide
                    ? "mt-0.5 text-[15px] font-medium leading-6"
                    : "shrink-0 text-right text-[15px] font-semibold",
                )}
              >
                {Trend ? <Trend className="h-4 w-4 text-[var(--accent-strong)]" /> : null}
                {r.value}
              </p>
              {r.note && r.wide ? (
                <p className="text-[13px] leading-5 text-muted-foreground">{r.note}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The programme as unit segments, filled where the days were done (like a result range bar). */
function UnitBar({ units }: { units: Summary["units"] }) {
  const total = units.reduce((n, u) => n + u.total, 0) || 1;
  return (
    <div className="mt-5 flex h-3 w-full gap-[3px]" aria-hidden="true">
      {units.map((u) => (
        <span
          key={u.title}
          className="h-full overflow-hidden rounded-full bg-background/60"
          style={{ width: `${(u.total / total) * 100}%` }}
        >
          <span
            className="block h-full rounded-full bg-[var(--accent-strong)]"
            style={{ width: `${(u.done / u.total) * 100}%` }}
          />
        </span>
      ))}
    </div>
  );
}
