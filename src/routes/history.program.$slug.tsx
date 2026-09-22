import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Trophy } from "lucide-react";
import { DateText } from "@/components/date-text";
import { IkanShell } from "@/components/ikan-shell";
import { DayCard } from "@/components/equip/day-card";
import { accentStyle, Button, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { completedRuns, dayResponses, shortDate } from "@/lib/equip/journey";
import { dayCount, getProgramme } from "@/lib/equip/programs";
import { useProgramme } from "@/lib/equip/store";

/* One programme's archive: summary, every finished run stacked newest first (each day opens to
 * what was done). A run in progress is never shown here. */

export const Route = createFileRoute("/history/program/$slug")({
  loader: ({ params }) => {
    if (!getProgramme(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) =>
    pageMeta(
      `${loaderData ? getProgramme(loaderData.slug)?.name : "Program"} history`,
      "Every finished run of this program, with a summary.",
    ),
  component: ProgramArchivePage,
});

function ProgramArchivePage() {
  const { slug } = Route.useLoaderData();
  const p = getProgramme(slug)!;
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const { state } = useProgramme(slug);
  const runs = hydrated ? completedRuns(p, state) : [];
  const topics = [...new Set(runs.flatMap((r) => r.topics))];

  return (
    <IkanShell>
      <div style={accentStyle(p.accent)}>
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/history/program" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
          title={p.name}
        />

        <header className="relative mx-4 h-40 overflow-hidden rounded-[28px] text-white">
          <img src={p.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
          <div className="absolute inset-x-5 bottom-4">
            <p className="text-[13px] opacity-80">Program history</p>
            <h1 className="font-display text-[28px] font-semibold leading-8">{p.name}</h1>
            <p className="text-[13px] opacity-80">{dayCount(p)} days</p>
          </div>
        </header>

        {/* Summary */}
        <section className="mx-4 mt-4 grid grid-cols-2 gap-3">
          {[
            { v: runs.length, l: "Times completed" },
            { v: runs.reduce((n, r) => n + r.daysDone, 0), l: "Days done" },
            { v: runs.reduce((n, r) => n + r.activitiesDone, 0), l: "Activities" },
            { v: runs.reduce((n, r) => n + r.responses, 0), l: "Responses written" },
          ].map((x) => (
            <div key={x.l} className="rounded-[20px] bg-secondary p-4">
              <p className="font-display text-[24px] font-bold leading-7 tabular-nums">
                {hydrated ? x.v : "—"}
              </p>
              <p className="text-[13px] text-muted-foreground">{x.l}</p>
            </div>
          ))}
        </section>

        {topics.length ? (
          <section className="mt-6 px-4">
            <h2 className="font-display text-[16px] font-semibold">Topics you explored</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {topics.map((t) => (
                <span
                  key={t}
                  className="rounded-[10px] bg-[var(--accent-container)] px-3 py-1.5 text-[14px] text-[var(--on-accent-container)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {/* Stacked history */}
        <section className="mt-8 px-4">
          <h2 className="font-display text-[18px] font-semibold">All runs</h2>
          {hydrated && !runs.length ? (
            <p className="mt-3 rounded-[20px] border border-dashed border-foreground/20 p-6 text-center text-[15px] text-muted-foreground">
              No finished runs yet. Each time you finish {p.name}, it stacks up here.
            </p>
          ) : null}
          <ul className="mt-3 space-y-6">
            {runs.map((run, i) => (
              <li key={run.finishedAt ?? i}>
                <div className="flex items-center gap-3 rounded-[20px] bg-secondary p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-white">
                    <Trophy className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <DateText className="text-[15px] font-semibold">
                      {run.startedAt ? shortDate(run.startedAt) : ""}
                      {run.finishedAt ? ` to ${shortDate(run.finishedAt)}` : ""}
                    </DateText>
                    <span className="block text-[13px] text-muted-foreground">
                      {run.totalDays} days · {run.activitiesDone} activities · {run.responses}{" "}
                      responses
                    </span>
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[13px] font-semibold">
                  <Link
                    to="/program/$slug/result"
                    params={{ slug }}
                    search={{ run: i }}
                    className={cn(
                      "flex h-11 items-center justify-center gap-1.5 rounded-full border border-foreground/15",
                      stateLayer,
                    )}
                  >
                    <Trophy className="h-4 w-4" /> View result
                  </Link>
                  <Link
                    to="/diaries/$slug"
                    params={{ slug }}
                    search={{ run: i }}
                    className={cn(
                      "flex h-11 items-center justify-center gap-1.5 rounded-full border border-foreground/15",
                      stateLayer,
                    )}
                  >
                    <BookOpen className="h-4 w-4" /> Learning diary
                  </Link>
                </div>
                <ul className="mt-3 space-y-2">
                  {p.days
                    .filter((d) => run.state.completed.includes(d.day))
                    .reverse()
                    .map((d) => (
                      <li key={d.day}>
                        <DayCard
                          title={d.title}
                          day={d.day}
                          at={run.state.completedAt?.[String(d.day)]}
                          responses={dayResponses(p, run.state, d.day)}
                          seconds={run.state.time?.[String(d.day)]?.total}
                          feedback={run.state.feedback?.[String(d.day)]}
                        />
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 px-4">
          <Button
            variant="outlined"
            className="w-full"
            onClick={() => navigate({ to: "/program/$slug", params: { slug } })}
          >
            Go to {p.name}
          </Button>
        </div>
      </div>
    </IkanShell>
  );
}
