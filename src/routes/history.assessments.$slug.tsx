import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LifeBuoy, TrendingDown, TrendingUp } from "lucide-react";
import { DateText } from "@/components/date-text";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, Button, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import {
  BandChip,
  categoryIcon,
  RangeBar,
  toneStyle,
  valueText,
  bandStyle,
  severityContent,
} from "@/components/assessment/ui";
import { Trend } from "@/components/assessment/trend";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { getAssessment } from "@/lib/assessment/instruments";
import { headlineOf, riskEndorsed, scoreAll, type ScoreResult } from "@/lib/assessment/scoring";
import { useAssessmentStore } from "@/lib/assessment/store";
import { RETAKE_AFTER_DAYS, retakeTiming } from "@/lib/assessment/reassess";
import { Disclosure } from "@/components/kit/disclosure";
import { EmptyState } from "@/components/kit/empty";

/* One assessment's archive: summary, every finished result stacked newest first (each opens to
 * its scores), and what to do next based on the latest result. */

export const Route = createFileRoute("/history/assessments/$slug")({
  loader: ({ params }) => {
    if (!getAssessment(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ loaderData }) =>
    pageMeta(
      `${loaderData ? getAssessment(loaderData.slug)?.title : "Assessment"} history`,
      "Every result for this assessment, with a summary and recommendations.",
    ),
  component: AssessmentArchivePage,
});

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function AssessmentArchivePage() {
  const { slug } = Route.useLoaderData();
  const a = getAssessment(slug)!;
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const store = useAssessmentStore();
  const Icon = categoryIcon[a.category];
  const scored = (hydrated ? store.resultsFor(slug) : []).map((r) => {
    const scores = scoreAll(a, r.answers);
    return { r, scores, head: headlineOf(a, scores) };
  });
  const latest = scored[0];
  const retake = retakeTiming(latest?.r);
  const previous = scored[1];
  const first = scored.at(-1);
  const severe = latest?.scores.some((s) => s.band?.tone === "error") ?? false;
  const risk = latest ? riskEndorsed(a, latest.r.answers) : false;

  return (
    <IkanShell>
      <div style={accentStyle("mind")}>
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/history/assessments" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
          title={a.name}
        />

        <header className="flex items-center gap-3 px-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[var(--accent-container)] text-[var(--on-accent-container)]">
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-[24px] font-semibold leading-7">{a.title}</h1>
            <p className="type-body-sm text-muted-foreground">{a.instrument}</p>
          </div>
        </header>

        {/* Summary */}
        <section className="mx-4 mt-5 grid grid-cols-3 divide-x divide-background rounded-[24px] bg-secondary py-4 text-center">
          {[
            { v: hydrated ? String(scored.length) : "—", l: "Times taken" },
            { v: first ? date(first.r.completedAt) : "—", l: "First" },
            { v: latest ? date(latest.r.completedAt) : "—", l: "Latest" },
          ].map((x) => (
            <div key={x.l} className="px-1">
              <p className="font-display text-[17px] font-bold leading-6 tabular-nums">{x.v}</p>
              <p className="type-label-md text-muted-foreground">{x.l}</p>
            </div>
          ))}
        </section>

        {hydrated && !latest ? (
          <EmptyState
            tone="dashed"
            title="No results yet"
            className="mx-4 mt-5"
            action={
              <Button onClick={() => navigate({ to: "/assessment-flow", search: { id: slug } })}>
                Take assessment
              </Button>
            }
          >
            Your results stack up here each time you take it.
          </EmptyState>
        ) : null}

        {latest?.head?.band ? (
          <section
            className="mx-4 mt-4 rounded-[28px] p-5"
            style={{ ...bandStyle(latest.head.band), background: "var(--tone-container)" }}
          >
            <p className="type-body-sm font-medium text-[var(--tone)]">
              Latest · {latest.head.score.label}
            </p>
            <p className="mt-1 font-display text-[30px] font-bold leading-9 text-[var(--tone)]">
              {latest.head.band.label}
            </p>
            <p className="type-body-sm font-medium mt-1 text-[var(--tone)]">
              {severityContent[latest.head.band.severity].label} ·{" "}
              {severityContent[latest.head.band.severity].description}
            </p>
            <p className="type-action tabular-nums">{valueText(latest.head)}</p>
            <div className="mt-4">
              <RangeBar result={latest.head} large />
            </div>
            {previous?.head?.band ? <Change now={latest.head} before={previous.head} /> : null}
          </section>
        ) : null}

        {a.headline && scored.length >= 2 ? (
          <section className="mx-4 mt-4 rounded-[24px] bg-secondary p-4">
            <h2 className="type-title-md">Over time</h2>
            <Trend
              points={[...scored].reverse()}
              className="mt-2 rounded-[12px] bg-background px-3 py-2"
            />
          </section>
        ) : null}

        {/* Stacked history */}
        {scored.length ? (
          <section className="mt-8 px-4">
            <h2 className="type-subhead">All results</h2>
            <ul className="mt-3 space-y-2">
              {scored.map(({ r, scores, head }, i) => (
                <li key={r.id}>
                  <Disclosure
                    tone="outlined"
                    radius={20}
                    open={i === 0}
                    bodyClassName="space-y-3 border-t border-foreground/10 px-4 py-3"
                    meta={
                      head?.band ? (
                        <BandChip
                          label={head.band.label}
                          tone={head.band.tone}
                          severity={head.band.severity}
                        />
                      ) : null
                    }
                    title={
                      <>
                        <DateText className="type-action">{date(r.completedAt)}</DateText>
                        <span className="type-label-md block text-muted-foreground">
                          {i === 0 ? "Latest" : `${scored.length - i} of ${scored.length}`}
                          {head ? ` · ${valueText(head)}` : ` · ${scores.length} scores`}
                        </span>
                      </>
                    }
                  >
                    {scores.map((s) => (
                      <div key={s.score.id}>
                        <div className="flex items-start gap-3">
                          <p className="type-label-lg min-w-0 flex-1">
                            {s.score.label}
                            <span className="type-label-md font-normal block text-muted-foreground tabular-nums">
                              {valueText(s)}
                            </span>
                          </p>
                          {s.band ? (
                            <BandChip
                              label={s.band.label}
                              tone={s.band.tone}
                              severity={s.band.severity}
                            />
                          ) : null}
                        </div>
                        <div className="mt-2">
                          <RangeBar result={s} />
                        </div>
                      </div>
                    ))}
                    <Link
                      to="/assessments/$slug/result/$id"
                      params={{ slug, id: r.id }}
                      className="type-body-md font-semibold inline-block text-[var(--accent-strong)] underline"
                    >
                      Open full result
                    </Link>
                  </Disclosure>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {latest ? (
          <section className="mt-8 px-4">
            {risk || severe ? (
              <Link
                to="/support"
                className={cn("mb-4 flex items-start gap-3 rounded-[20px] p-4", stateLayer)}
                style={{ ...toneStyle("error"), background: "var(--tone-container)" }}
              >
                <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-[var(--tone)]" />
                <span className="type-body">
                  {risk
                    ? "You don’t have to carry this alone. Free, confidential support lines are open all day."
                    : "Talking to a professional can help with what your latest result shows."}
                  <span className="mt-1 block font-semibold underline">See support options</span>
                </span>
              </Link>
            ) : null}
            <Button
              variant={retake.due ? "filled" : "outlined"}
              className="w-full"
              onClick={() => navigate({ to: "/assessment-flow", search: { id: slug } })}
            >
              Retake assessment
            </Button>
            <p className="type-body-sm mt-2 text-center text-muted-foreground">
              {retake.due
                ? `It’s been ${retake.days} days since your last result. A good time to see how things have changed.`
                : `Best retaken every ${RETAKE_AFTER_DAYS} days. Next suggested from ${retake.from!.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.`}
            </p>
          </section>
        ) : null}

        <p className="mx-auto mt-6 max-w-xs px-4 text-center text-[12px] leading-5 text-muted-foreground">
          This is a screening, not a diagnosis. iKAN supports, but never replaces, care from a
          qualified professional.
        </p>
      </div>
    </IkanShell>
  );
}

function Change({ now, before }: { now: ScoreResult; before: ScoreResult }) {
  const diff = (now.value ?? 0) - (before.value ?? 0);
  const same = Math.abs(diff) < 1e-9;
  const better = now.profile.direction === "better" ? diff > 0 : diff < 0;
  const Icon = diff > 0 ? TrendingUp : TrendingDown;
  return (
    <p className="type-body-md mt-4 flex items-center gap-2">
      {same ? null : <Icon className="h-4 w-4 shrink-0" />}
      {same ? "Same as" : better ? "Better than" : "Worse than"} last time: {before.band!.label},{" "}
      {valueText(before)}
    </p>
  );
}
