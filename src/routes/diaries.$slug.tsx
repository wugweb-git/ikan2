import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Check, Clock, FileText } from "lucide-react";
import { DateText } from "@/components/date-text";
import { IkanShell } from "@/components/ikan-shell";
import { DayCard } from "@/components/equip/day-card";
import { accentStyle, IconButton, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { dayResponses, journeyOf, latestRun, runParam, shortDate } from "@/lib/equip/journey";
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

  const j = journeyOf(p, state);
  const doneDays = hydrated ? p.days.filter((d) => state.completed.includes(d.day)) : [];
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
            <p className="flex items-center gap-2 text-[13px] opacity-75">
              <BookOpen className="h-4 w-4" /> Learning diary
            </p>
            <h1 className="mt-1 font-display text-[26px] font-semibold leading-8">{p.name}</h1>
            {hydrated && j.startedAt ? (
              <p className="mt-0.5 text-[13px] opacity-70">
                <DateText>
                  {shortDate(j.startedAt)}
                  {j.finishedAt ? ` to ${shortDate(j.finishedAt)}` : ", in progress"}
                </DateText>
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2 text-[13px] font-semibold">
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
          <h2 className="font-display text-[18px] font-semibold">Program days</h2>
          {doneDays.length ? (
            <ul className="mt-3 space-y-3">
              {doneDays.map((d) => (
                <li key={d.day}>
                  <DayCard
                    title={d.title}
                    day={d.day}
                    at={state.completedAt?.[String(d.day)]}
                    responses={dayResponses(p, state, d.day)}
                    seconds={state.time?.[String(d.day)]?.total}
                    feedback={state.feedback?.[String(d.day)]}
                  />
                </li>
              ))}
            </ul>
          ) : hydrated ? (
            <div className="mt-3 rounded-[20px] border border-foreground/10 p-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-[15px] text-muted-foreground">No program activity yet.</p>
            </div>
          ) : null}
        </section>
      </div>
    </IkanShell>
  );
}
