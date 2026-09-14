import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { History, LifeBuoy, LoaderCircle, TrendingDown, TrendingUp, X } from "lucide-react";
import { DateText } from "@/components/date-text";
import { IkanShell } from "@/components/ikan-shell";
import { BrandTitle, PrintHeader, ShareButton } from "@/components/result-share";
import { accentStyle, Button, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import {
  bandStyle,
  BandChip,
  RangeBar,
  severityContent,
  toneStyle,
  valueText,
} from "@/components/assessment/ui";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { getAssessment, type Assessment, type Severity } from "@/lib/assessment/instruments";
import {
  headlineOf,
  recommendationsFor,
  riskEndorsed,
  scoreAll,
  type ScoreResult,
} from "@/lib/assessment/scoring";
import { useAssessmentStore, type StoredResult } from "@/lib/assessment/store";
import { getProgramme } from "@/lib/equip/programs";
import { useImportStatus } from "@/lib/legacy-import";
import { useSyncStatus } from "@/lib/cloud-sync";

/* One assessment result: /assessments/<slug>/result/<result id>. Result ids are UUIDs, as in the
 * old iKan records. */

export const Route = createFileRoute("/assessments/$slug/result/$id")({
  loader: ({ params }) => {
    if (!getAssessment(params.slug)) throw notFound();
    return { slug: params.slug, id: params.id };
  },
  head: () => ({ meta: [{ title: "Your result — iKAN" }, { name: "robots", content: "noindex" }] }),
  pendingComponent: ResultLoading,
  component: ResultPage,
});

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

/** Shown while the result is being read, including while past results are still arriving. */
export function ResultLoading({ label = "Loading your result…" }: { label?: string }) {
  return (
    <IkanShell>
      <div className="grid min-h-[70dvh] place-items-center px-6 text-center" role="status">
        <div>
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-3 text-[15px] text-muted-foreground">{label}</p>
          <div className="mx-auto mt-6 w-64 space-y-3" aria-hidden="true">
            <div className="h-24 animate-pulse rounded-[24px] bg-secondary" />
            <div className="h-4 animate-pulse rounded-full bg-secondary" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-secondary" />
          </div>
        </div>
      </div>
    </IkanShell>
  );
}

function ResultPage() {
  const { slug, id } = Route.useLoaderData();
  const a = getAssessment(slug)!;
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const store = useAssessmentStore();
  const importing = useImportStatus().state === "running";
  const syncing = useSyncStatus().state === "syncing";
  const history = store.resultsFor(slug);
  const result = history.find((x) => x.id === id);

  const bar = (
    <TopAppBar
      leading={
        <IconButton label="Close" onClick={() => navigate({ to: "/assessments" })}>
          <X className="h-6 w-6" />
        </IconButton>
      }
      title={<BrandTitle />}
      trailing={
        <>
          {result ? (
            <ShareButton subject={`${a.title}: my iKAN result`} body={shareText(a, result)} />
          ) : null}
          <Link
            to="/history/assessments/$slug"
            params={{ slug: a.slug }}
            aria-label="All results"
            className={cn("grid h-12 w-12 place-items-center rounded-full", stateLayer)}
          >
            <History className="h-6 w-6" />
          </Link>
        </>
      }
    />
  );

  if (!hydrated || (!result && (importing || syncing))) return <ResultLoading />;

  if (!result) {
    return (
      <IkanShell>
        <div style={accentStyle("mind")}>
          {bar}
          <div className="px-6 pt-16 text-center">
            <h1 className="font-display text-[22px] font-semibold">Result not found</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              This result isn’t on this device. See all your {a.title.toLowerCase()} results, or
              take it again.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outlined"
                onClick={() => navigate({ to: "/history/assessments/$slug", params: { slug } })}
              >
                All results
              </Button>
              <Button onClick={() => navigate({ to: "/assessment-flow", search: { id: slug } })}>
                Take assessment
              </Button>
            </div>
          </div>
        </div>
      </IkanShell>
    );
  }

  return (
    <IkanShell>
      <div style={accentStyle("mind")}>
        {bar}
        <PrintHeader title={`${a.title} result`} />
        <ResultBody
          a={a}
          result={result}
          previous={history.find((x) => x.completedAt < result.completedAt)}
        />
      </div>
    </IkanShell>
  );
}

/** Plain-text summary for email: assessment, date, each score with its level. */
function shareText(a: Assessment, result: StoredResult) {
  const scores = scoreAll(a, result.answers);
  return [
    `${a.title} (${a.instrument})`,
    new Date(result.completedAt).toDateString(),
    ...scores.map((s) => `${s.score.label}: ${s.band?.label ?? "not scored"}, ${valueText(s)}`),
    headlineOf(a, scores)?.band?.interpretation ?? "",
    "This is a screening, not a diagnosis.",
  ]
    .filter(Boolean)
    .join("\n");
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
        <p className="text-[13px] text-muted-foreground">
          <DateText>{dateTime(result.completedAt)}</DateText>
        </p>
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
                      <span className="mt-1 line-clamp-2 text-[13px] leading-5 text-muted-foreground">
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

      <div className="mt-8 flex gap-3 px-4 print:hidden">
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

/** The old iKan severity wording under a band, e.g. "Moderately severe · Significant symptoms…". */
function SeverityLine({ severity }: { severity: Severity }) {
  const c = severityContent[severity];
  return (
    <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-[13px] font-medium text-[var(--tone)]">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: "var(--tone-bar)" }}
        aria-hidden="true"
      />
      {c.label} · {c.description}
    </p>
  );
}

function HeadlineCard({ r }: { r: ScoreResult }) {
  const band = r.band!;
  return (
    <section
      className="mx-4 mt-5 rounded-[28px] p-5"
      style={{ ...bandStyle(band), background: "var(--tone-container)" }}
    >
      <p className="text-[14px] font-medium text-[var(--tone)]">
        {r.score.label}, {r.score.instrument}
      </p>
      <p className="mt-1 font-display text-[34px] font-bold leading-10 text-[var(--tone)]">
        {band.label}
      </p>
      <SeverityLine severity={band.severity} />
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
          <BandChip
            label={r.band.label}
            tone={r.band.tone}
            severity={r.band.severity}
            className="max-w-[48%] text-right"
          />
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
