import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, Button, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { BandChip, categoryIcon, toneColors } from "@/components/assessment/ui";
import { cn } from "@/lib/utils";
import { assessments, type Assessment } from "@/lib/assessment/instruments";
import { headlineOf, percentOfRange, scoreAll } from "@/lib/assessment/scoring";
import { useAssessmentStore, type StoredResult } from "@/lib/assessment/store";

export const Route = createFileRoute("/assessments")({
  head: () =>
    pageMeta(
      "Your results",
      "Every assessment you’ve taken, with how your results change over time.",
    ),
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const store = useAssessmentStore();
  const taken = assessments.filter((a) => store.resultsFor(a.slug).length > 0);

  return (
    <IkanShell>
      <div style={accentStyle("mind")}>
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/assessment" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
        />
        <header className="px-4 pb-2">
          <h1 className="font-display text-[32px] font-semibold leading-10">Your results</h1>
        </header>

        {taken.length === 0 ? (
          <div className="px-4 pt-10 text-center">
            <p className="font-display text-[20px] font-semibold">No results yet</p>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Results appear here after you finish an assessment.
            </p>
            <Button className="mt-6" onClick={() => navigate({ to: "/assessment" })}>
              Choose an assessment
            </Button>
          </div>
        ) : (
          <ul className="space-y-4 px-4 pt-3">
            {taken.map((a) => (
              <li key={a.slug}>
                <AssessmentHistory a={a} results={store.resultsFor(a.slug)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </IkanShell>
  );
}

function AssessmentHistory({ a, results }: { a: Assessment; results: StoredResult[] }) {
  const Icon = categoryIcon[a.category];
  const scored = results.map((r) => ({ r, head: headlineOf(a, scoreAll(a, r.answers)) }));

  return (
    <section className="overflow-hidden rounded-[24px] bg-secondary">
      <div className="flex items-center gap-3 px-4 pt-4">
        <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[var(--accent-container)] text-[var(--on-accent-container)]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[17px] font-semibold">{a.title}</p>
          <p className="text-[13px] text-muted-foreground">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
        </div>
      </div>

      {a.headline ? (
        scored.length >= 2 ? (
          <Trend points={[...scored].reverse()} />
        ) : (
          <p className="mx-4 mt-3 rounded-[12px] bg-background px-4 py-3 text-[14px] leading-5 text-muted-foreground">
            Take this assessment again to see how your results change over time.
          </p>
        )
      ) : null}

      <ul className="mt-3">
        {scored.map(({ r, head }) => (
          <li key={r.id} className="border-t border-background">
            <Link
              to="/result/$slug"
              params={{ slug: a.slug }}
              search={{ r: r.id }}
              className={cn("flex min-h-14 items-center gap-3 px-4 py-3", stateLayer)}
            >
              <span className="flex-1 text-[15px]">
                {new Date(r.completedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {head?.band ? (
                <BandChip label={head.band.label} tone={head.band.tone} />
              ) : (
                <span className="text-[13px] text-muted-foreground">5 scores</span>
              )}
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Headline score over time, oldest to newest, drawn as position within the instrument's range. */
function Trend({ points }: { points: { r: StoredResult; head: ReturnType<typeof headlineOf> }[] }) {
  const w = 300;
  const h = 72;
  const pad = 8;
  const xy = points.map(({ head }, i) => {
    const p = head?.value != null ? percentOfRange(head.profile, head.value) : 0;
    return {
      x: pad + (i * (w - pad * 2)) / Math.max(1, points.length - 1),
      y: pad + (1 - p) * (h - pad * 2),
      tone: head?.band?.tone,
    };
  });
  const better = points[0]?.head?.profile.direction === "better";
  return (
    <div className="mx-4 mt-3 rounded-[12px] bg-background px-3 py-2">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-[72px] w-full"
        role="img"
        aria-label="Score over time"
      >
        <polyline
          points={xy.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {xy.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill={p.tone ? toneColors[p.tone].bar : "currentColor"}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
      <p className="text-[12px] text-muted-foreground">
        {better ? "Higher is better" : "Lower is better"}
      </p>
    </div>
  );
}
