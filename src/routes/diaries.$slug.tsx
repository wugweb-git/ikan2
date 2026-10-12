import { useEffect } from "react";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Check, Clock, FileText } from "lucide-react";
import { DateText } from "@/components/date-text";
import { IkanShell } from "@/components/ikan-shell";
import { DayCard } from "@/components/equip/day-card";
import { accentStyle, IconButton, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { dayResponses, latestRun, runJourney, runParam, shortDate } from "@/lib/equip/journey";
import { sealProgramme } from "@/lib/equip/seal";
import type { RunSnapshot } from "@/lib/equip/store";
import { getProgramme } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";

/* Learning diary, as in the old app's LearningDiary: one programme, what was written during it,
 * day by day. Equip only. */

export const Route = createFileRoute("/diaries/$slug")({
  validateSearch: (s: Record<string, unknown>): { run?: number } =>
    runParam(s["run"]) !== undefined ? { run: runParam(s["run"])! } : {},
  loader: ({ params }) => {
    if (!getProgramme(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) =>
    pageMeta(
      `Learning diary${loaderData ? ` · ${getProgramme(loaderData.slug)?.name}` : ""}`,
      "Your answers from this program, day by day.",
    ),
  component: DiaryPage,
});

function DiaryPage() {
  const { slug } = Route.useLoaderData();
  const p = getProgramme(slug)!;
  const navigate = useNavigate();
  const hydrated = useHydrated();
  // the run in progress, else the latest finished one
  const { run } = Route.useSearch();
  const state = latestRun(p, useProgramme(slug).state, run);

  // finished runs whose diary is not frozen yet are frozen on first view, as the result page does
  useEffect(() => {
    sealProgramme(p);
  }, [p]);

  const j = runJourney(p, state);
  /* A finished run shows the diary frozen when it finished, in the words the person saw; only a
   * run in progress reads the live programme. */
  const frozen = (state as { snapshot?: RunSnapshot }).snapshot?.diary;
  const doneDays = hydrated
    ? (frozen ??
      p.days
        .filter((d) => state.completed.includes(d.day))
        .map((d) => ({ day: d.day, title: d.title, responses: dayResponses(p, state, d.day) })))
    : [];
  const duration =
    j.startedAt && j.finishedAt
      ? Math.max(
          1,
          Math.ceil(
            (new Date(j.finishedAt).getTime() - new Date(j.startedAt).getTime()) / 86_400_000,
          ),
        )
      : 0;

  return (
    <IkanShell>
      <div style={accentStyle(p.accent)}>
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/diaries" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
          title="Learning diary"
        />

        <header className="relative mx-4 overflow-hidden rounded-[24px] bg-foreground p-5 text-background">
          <img
            src={p.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative">
            <p className="type-body-sm flex items-center gap-2 opacity-75">
              <BookOpen className="h-4 w-4" /> Learning diary
            </p>
            <h1 className="mt-1 font-display text-[26px] font-semibold leading-8">{p.name}</h1>
            {hydrated && j.startedAt ? (
              <p className="type-body-sm mt-0.5 opacity-70">
                <DateText>
                  {shortDate(j.startedAt)}
                  {j.finishedAt ? ` to ${shortDate(j.finishedAt)}` : ", in progress"}
                </DateText>
              </p>
            ) : null}
            <div className="type-body-sm font-semibold mt-4 flex flex-wrap gap-2">
              <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3">
                <Check className="h-4 w-4" /> {hydrated ? j.daysDone : 0}/{j.totalDays} days
              </span>
              {hydrated && j.responses ? (
                <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3">
                  <FileText className="h-4 w-4" /> {j.responses} responses
                </span>
              ) : null}
              {hydrated && duration ? (
                <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/15 px-3">
                  <Clock className="h-4 w-4" /> {duration} {duration === 1 ? "day" : "days"}
                </span>
              ) : null}
            </div>
          </div>
        </header>

        <section className="px-4 pb-6 pt-6">
          <h2 className="type-subhead">Program days</h2>
          {doneDays.length ? (
            <ul className="mt-3 space-y-3">
              {doneDays.map((d) => (
                <li key={d.day}>
                  <DayCard
                    title={d.title}
                    day={d.day}
                    at={state.completedAt?.[String(d.day)]}
                    responses={d.responses}
                    seconds={state.time?.[String(d.day)]?.total}
                    feedback={state.feedback?.[String(d.day)]}
                  />
                </li>
              ))}
            </ul>
          ) : hydrated ? (
            <div className="mt-3 rounded-[20px] border border-foreground/10 p-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="type-action mt-3 text-muted-foreground">No program activity yet.</p>
            </div>
          ) : null}
        </section>
      </div>
    </IkanShell>
  );
}
