import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarCheck,
  ChevronRight,
  Clock3,
  Sparkles,
  ThumbsUp,
  Trophy,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { DateText } from "@/components/date-text";
import { accentStyle, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { formatSeconds } from "@/hooks/use-active-time";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { completedRuns, shortDate } from "@/lib/equip/journey";
import { dayCount, programmes } from "@/lib/equip/programs";
import { useProgramme, type ProgrammeState } from "@/lib/equip/store";

/* Program history: one summary card for each of the three programmes, finished ones first.
 * A programme with no finished run is shown greyed out. A run in progress is never counted. */

export const Route = createFileRoute("/history/program/")({
  head: () => pageMeta("Program history", "All three programs, with every run you’ve finished."),
  component: ProgramHistoryPage,
});

function ProgramHistoryPage() {
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const states: Record<string, ProgrammeState> = {
    "sleep-tight": useProgramme("sleep-tight").state,
    unburn: useProgramme("unburn").state,
    "stress-buster": useProgramme("stress-buster").state,
  };
  const rows = programmes
    .map((p) => {
      const runs = hydrated ? completedRuns(p, states[p.slug]!) : [];
      return {
        p,
        runs,
        last: runs[0],
        days: runs.reduce((n, r) => n + r.daysDone, 0),
        seconds: runs.reduce((n, r) => n + r.seconds, 0),
        topics: new Set(runs.flatMap((r) => r.topics)).size,
      };
    })
    .sort(
      (a, b) =>
        Number(Boolean(b.last)) - Number(Boolean(a.last)) ||
        (b.last?.finishedAt ?? "").localeCompare(a.last?.finishedAt ?? ""),
    );
  const done = rows.filter((r) => r.runs.length);
  const helpful = done
    .flatMap((r) => r.runs.map((x) => x.helpful))
    .filter((x): x is number => x !== null);
  const totals = [
    {
      icon: Trophy,
      value: hydrated ? `${done.length}/${programmes.length}` : "—",
      label: "Programs completed",
    },
    {
      icon: CalendarCheck,
      value: hydrated ? String(done.reduce((n, r) => n + r.days, 0)) : "—",
      label: "Days done",
    },
    {
      icon: Clock3,
      value: hydrated
        ? (() => {
            const s = done.reduce((n, r) => n + r.seconds, 0);
            return s ? formatSeconds(s) : "—";
          })()
        : "—",
      label: "Time spent",
    },
    {
      icon: ThumbsUp,
      value: helpful.length
        ? `${(helpful.reduce((n, x) => n + x, 0) / helpful.length).toFixed(1)}/5`
        : "—",
      label: "Helpfulness",
    },
  ];

  return (
    <IkanShell>
      <TopAppBar
        leading={
          <IconButton label="Back" onClick={() => navigate({ to: "/history" })}>
            <ArrowLeft className="h-6 w-6" />
          </IconButton>
        }
        title="Program history"
      />

      <section className="mx-4 grid grid-cols-2 gap-2">
        {totals.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="rounded-[20px] bg-secondary p-4">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <p className="mt-2 font-display text-[22px] font-bold leading-7 tabular-nums">
                {t.value}
              </p>
              <p className="text-[12px] text-muted-foreground">{t.label}</p>
            </div>
          );
        })}
      </section>

      <h2 className="mt-8 px-4 font-display text-[18px] font-semibold">Your programs</h2>
      <ul className="mt-3 space-y-3 px-4">
        {rows.map(({ p, runs, last, days, seconds, topics }) => {
          const finished = runs.length > 0;
          return (
            <li key={p.slug} style={accentStyle(p.accent)}>
              <Link
                to="/history/program/$slug"
                params={{ slug: p.slug }}
                aria-label={`${p.name}${finished ? "" : ", not completed yet"}`}
                className={cn(
                  "flex gap-3 rounded-[24px] border border-foreground/10 p-3",
                  stateLayer,
                  !finished && hydrated && "opacity-55",
                )}
              >
                <img
                  src={p.cover}
                  alt=""
                  className={cn(
                    "h-24 w-20 shrink-0 rounded-[16px] object-cover",
                    !finished && "grayscale",
                  )}
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-display text-[18px] font-semibold leading-6">
                      {p.name}
                    </span>
                    <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  </span>
                  {finished ? (
                    <>
                      <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-[var(--accent-container)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--on-accent-container)]">
                        <Trophy className="h-3.5 w-3.5" /> Completed{" "}
                        {runs.length > 1 ? `${runs.length} times` : "once"}
                      </span>
                      <span className="mt-1.5 text-[12px] text-muted-foreground">
                        <DateText>
                          Last finished {last?.finishedAt ? shortDate(last.finishedAt) : ""}
                        </DateText>
                      </span>
                      <span className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2 text-[12px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <CalendarCheck className="h-3.5 w-3.5" /> {days} days
                        </span>
                        {seconds ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3.5 w-3.5" /> {formatSeconds(seconds)}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" /> {topics} topics
                        </span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="mt-1 text-[13px] text-muted-foreground">
                        Not completed yet
                      </span>
                      <span className="mt-auto pt-2 text-[12px] text-muted-foreground">
                        {dayCount(p)} days. Each finished run stacks up here.
                      </span>
                    </>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </IkanShell>
  );
}
