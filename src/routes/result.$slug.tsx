import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import { History, LifeBuoy, TrendingDown, TrendingUp, X } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, Button, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { BandChip, RangeBar, toneStyle, valueText } from "@/components/assessment/ui";
import { cn } from "@/lib/utils";
import { getAssessment, type Assessment } from "@/lib/assessment/instruments";
import {
  headlineOf,
  recommendationsFor,
  riskEndorsed,
  scoreAll,
  type ScoreResult,
} from "@/lib/assessment/scoring";
import { useAssessmentStore, type StoredResult } from "@/lib/assessment/store";
import { getProgramme } from "@/lib/equip/programs";

type Search = { r?: string };

export const Route = createFileRoute("/result/$slug")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search["r"] === "string" ? { r: search["r"] } : {},
  loader: ({ params }) => {
    if (!getAssessment(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: () => ({ meta: [{ title: "Your result — iKAN" }, { name: "robots", content: "noindex" }] }),
  component: ResultPage,
});

const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

const dateTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`;
};

const duration = (secs: number) => {
  if (!Number.isFinite(secs) || secs <= 0) return null;
  if (secs < 60) return `${Math.round(secs)} sec`;
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return s === 0 ? `${m} min` : `${m} min ${s} sec`;
};

function ResultPage() {
  const { slug } = Route.useLoaderData();
  const { r } = Route.useSearch();
  const a = getAssessment(slug)!;
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const store = useAssessmentStore();
  const history = store.resultsFor(slug);
  const result = r ? history.find((x) => x.id === r) : history[0];

  const bar = (
    <TopAppBar
      leading={
        <IconButton label="Close" onClick={() => navigate({ to: "/assessment" })}>
          <X className="h-6 w-6" />
        </IconButton>
      }
      title={a.name}
      trailing={
        <Link
          to="/assessments"
          aria-label="All results"
          className={cn("grid h-12 w-12 place-items-center rounded-full", stateLayer)}
        >
          <History className="h-6 w-6" />
        </Link>
      }
    />
  );

  if (!hydrated) return <IkanShell>{bar}</IkanShell>;

  if (!result) {
    return (
      <IkanShell>
        <div style={accentStyle("mind")}>
          {bar}
          <div className="px-6 pt-16 text-center">
            <h1 className="font-display text-[22px] font-semibold">No result yet</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Take {a.title.toLowerCase()} to see your result here.
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate({ to: "/assessment-flow", search: { id: slug } })}
            >
              Start assessment
            </Button>
          </div>
        </div>
      </IkanShell>
    );
  }

  return (
    <IkanShell>
      <div style={accentStyle("mind")}>
        {bar}
        <ResultBody
          a={a}
          result={result}
          previous={history.find((x) => x.completedAt < result.completedAt)}
        />
      </div>
    </IkanShell>
  );
}

function ResultBody({
  a,
  result,
  previous,
}: {
  a: Assessment;
  result: StoredResult;
  previous: StoredResult | undefined;
}) {
  const navigate = useNavigate();
  const scores = scoreAll(a, result.answers);
  const head = headlineOf(a, scores);
  const rest = scores.filter((s) => s !== head);
  const complete = scores.every((s) => s.value !== null);
  const risk = riskEndorsed(a, result.answers);
  const severe = scores.some((s) => s.band?.tone === "error");
  const programmes = recommendationsFor(a, scores)
    .map(getProgramme)
    .filter((p) => p !== undefined);
  const prevHead = previous ? headlineOf(a, scoreAll(a, previous.answers)) : null;
  const time = duration(result.seconds);

  if (!complete) {
    return (
      <div className="px-6 pt-12 text-center">
        <h1 className="font-display text-[22px] font-semibold">This result couldn’t be scored</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Some answers are missing. Take the assessment again to get a result.
        </p>
        <Button
          className="mt-6"
          onClick={() => navigate({ to: "/assessment-flow", search: { id: a.slug } })}
        >
          Retake assessment
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade pb-6">
      <header className="px-4 pt-2">
        <p className="text-[13px] text-muted-foreground">{dateTime(result.completedAt)}</p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-8">{a.title}</h1>
        <p className="mt-1 flex flex-wrap gap-x-3 text-[14px] text-muted-foreground">
          <span>{a.questions.length} questions</span>
          {a.scores.length > 1 ? <span>{a.scores.length} scores</span> : null}
          {time ? <span>{time}</span> : null}
        </p>
      </header>

      {head?.band ? <HeadlineCard r={head} /> : null}

      {risk ? (
        <section
          className="mx-4 mt-4 rounded-[24px] p-5"
          style={{ ...toneStyle("error"), background: "var(--tone-container)" }}
        >
          <LifeBuoy className="h-6 w-6 text-[var(--tone)]" />
          <p className="mt-3 font-display text-[18px] font-semibold text-[var(--tone)]">
            You don’t have to carry this alone
          </p>
          <p className="mt-1 text-[15px] leading-6">
            You said you’ve had thoughts of being better off dead or of hurting yourself. Talking to
            someone today can help. These lines are free, confidential and open all day.
          </p>
          <Link
            to="/support"
            className={cn(
              "mt-4 inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[15px] font-semibold text-background",
              stateLayer,
            )}
          >
            Get support now
          </Link>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section className="mt-6 px-4">
          <h2 className="font-display text-[16px] font-semibold">
            {head ? (a.category === "burnout" ? "By area" : "Also screened") : "Your scores"}
          </h2>
          <ul className="mt-3 overflow-hidden rounded-[20px] bg-secondary">
            {rest.map((s, i) => (
              <li
                key={s.score.id}
                className={cn("px-4 py-4", i > 0 && "border-t border-background")}
              >
                <ScoreRow r={s} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {prevHead?.band && head?.band && previous ? (
        <Change now={head} before={prevHead} on={previous.completedAt} />
      ) : null}

      {programmes.length > 0 ? (
        <section className="mt-8 px-4">
          <h2 className="font-display text-[16px] font-semibold">Recommended for you</h2>
          <ul className="mt-3 space-y-3">
            {programmes.map((p, i) => (
              <li key={p.slug}>
                <Link
                  to="/program/$slug"
                  params={{ slug: p.slug }}
                  style={accentStyle(p.accent)}
                  className={cn("flex overflow-hidden rounded-[20px] bg-secondary", stateLayer)}
                >
                  <img src={p.cover} alt="" className="w-[88px] shrink-0 object-cover" />
                  <span className="min-w-0 flex-1 p-4">
                    {i === 0 ? (
                      <span className="block text-[12px] font-semibold text-[var(--accent-strong)]">
                        Best match
                      </span>
                    ) : null}
                    <span className="block font-display text-[17px] font-semibold">{p.name}</span>
                    {p.source.description ? (
                      <span className="mt-1 line-clamp-2 block text-[13px] leading-5 text-muted-foreground">
                        {p.source.description}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {severe && !risk ? (
        <section className="mx-4 mt-6 flex items-start gap-3 rounded-[20px] border border-foreground/10 p-4">
          <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-[15px] leading-6">
              Talking to a professional can help with what this result shows.
            </p>
            <Link
              to="/support"
              className="mt-1 inline-block text-[15px] font-semibold underline underline-offset-4"
            >
              See support options
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mt-8 px-4">
        <h2 className="font-display text-[16px] font-semibold">What this measured</h2>
        <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
          {a.instrument}. {a.scores.map((s) => `${s.label} (${s.instrument})`).join(", ")}.
        </p>
      </section>

      <div className="mt-8 flex gap-3 px-4">
        <Button
          variant="outlined"
          className="flex-1"
          onClick={() => navigate({ to: "/assessment-flow", search: { id: a.slug } })}
        >
          Retake
        </Button>
        <Button className="flex-1" onClick={() => navigate({ to: "/" })}>
          Back to home
        </Button>
      </div>

      <p className="mx-auto mt-6 max-w-xs px-4 text-center text-[12px] leading-5 text-muted-foreground">
        This is a screening, not a diagnosis. iKAN supports, but never replaces, care from a
        qualified professional.
      </p>
    </div>
  );
}

function HeadlineCard({ r }: { r: ScoreResult }) {
  const band = r.band!;
  return (
    <section
      className="mx-4 mt-5 rounded-[28px] p-5"
      style={{ ...toneStyle(band.tone), background: "var(--tone-container)" }}
    >
      <p className="text-[14px] font-medium text-[var(--tone)]">
        {r.score.label}, {r.score.instrument}
      </p>
      <p className="mt-1 font-display text-[34px] font-bold leading-10 text-[var(--tone)]">
        {band.label}
      </p>
      <p className="mt-1 text-[15px] tabular-nums">
        <span className="font-semibold">{valueText(r)}</span>
        {r.profile.direction === "better" ? (
          <span className="text-muted-foreground">, higher is better</span>
        ) : null}
      </p>
      <div className="mt-5">
        <RangeBar result={r} large />
        <div className="mt-2 flex justify-between text-[12px] text-muted-foreground tabular-nums">
          <span>{r.profile.min}</span>
          <span>{r.profile.max}</span>
        </div>
      </div>
      {band.interpretation ? (
        <p className="mt-4 text-[16px] leading-6">{band.interpretation}</p>
      ) : null}
    </section>
  );
}

function ScoreRow({ r }: { r: ScoreResult }) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-medium leading-6">{r.score.label}</p>
          <p className="text-[13px] text-muted-foreground tabular-nums">
            {r.score.instrument}, {valueText(r)}
            {r.profile.direction === "better" ? ", higher is better" : ""}
          </p>
        </div>
        {r.band ? (
          <BandChip label={r.band.label} tone={r.band.tone} className="max-w-[48%] text-right" />
        ) : null}
      </div>
      <div className="mt-3">
        <RangeBar result={r} />
      </div>
      {r.band?.interpretation ? (
        <p className="mt-3 text-[14px] leading-5 text-muted-foreground">{r.band.interpretation}</p>
      ) : null}
    </div>
  );
}

function Change({ now, before, on }: { now: ScoreResult; before: ScoreResult; on: string }) {
  const diff = (now.value ?? 0) - (before.value ?? 0);
  const better = now.profile.direction === "better" ? diff > 0 : diff < 0;
  const same = Math.abs(diff) < 1e-9;
  const Icon = diff > 0 ? TrendingUp : TrendingDown;
  return (
    <section className="mx-4 mt-6 flex items-center gap-3 rounded-[20px] border border-foreground/10 p-4">
      {same ? null : <Icon className="h-5 w-5 shrink-0" />}
      <p className="text-[15px] leading-6">
        {same
          ? "Same score as"
          : better
            ? "Better than"
            : now.profile.direction === "better"
              ? "Lower than"
              : "Higher than"}{" "}
        your last result on{" "}
        {new Date(on).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}:{" "}
        {before.band!.label}, {valueText(before)}.
      </p>
    </section>
  );
}
