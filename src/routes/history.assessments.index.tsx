import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { DateText } from "@/components/date-text";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { BandChip, categoryIcon } from "@/components/assessment/ui";
import { Trend } from "@/components/assessment/trend";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { assessments } from "@/lib/assessment/instruments";
import { frozen } from "@/lib/assessment/frozen";
import { useAssessmentStore } from "@/lib/assessment/store";

/* Assessment history: one summary card for each of the seven assessments. Each opens its own
 * page with the stacked results. Finished results only; drafts never appear. */

export const Route = createFileRoute("/history/assessments/")({
  head: () => pageMeta("Assessment history", "All seven assessments, with your results over time."),
  component: AssessmentHistoryPage,
});

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function AssessmentHistoryPage() {
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const store = useAssessmentStore();
  const taken = hydrated ? assessments.filter((a) => store.resultsFor(a.slug).length).length : 0;
  const total = hydrated ? store.results.length : 0;

  return (
    <IkanShell>
      <div style={accentStyle("mind")}>
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/history" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
          title="Assessment history"
        />
        <section className="mx-4 grid grid-cols-2 divide-x divide-background rounded-[24px] bg-secondary py-4 text-center">
          <div>
            <p className="type-title-lg font-bold tabular-nums">
              {hydrated ? `${taken}/${assessments.length}` : "—"}
            </p>
            <p className="type-label-md text-muted-foreground">Assessments taken</p>
          </div>
          <div>
            <p className="type-title-lg font-bold tabular-nums">{hydrated ? total : "—"}</p>
            <p className="type-label-md text-muted-foreground">Results in total</p>
          </div>
        </section>

        <ul className="mt-5 space-y-3 px-4">
          {assessments.map((a) => {
            const Icon = categoryIcon[a.category];
            const results = hydrated ? store.resultsFor(a.slug) : [];
            const scored = results.map((r) => ({ r, head: frozen(a, r).head }));
            const latest = scored[0];
            return (
              <li key={a.slug}>
                <Link
                  to="/history/assessments/$slug"
                  params={{ slug: a.slug }}
                  aria-label={latest ? undefined : `${a.title}, not taken yet`}
                  className={cn(
                    "block overflow-hidden rounded-[24px] bg-secondary",
                    stateLayer,
                    hydrated && !latest && "opacity-55 grayscale",
                  )}
                >
                  <span className="flex items-center gap-3 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[var(--accent-container)] text-[var(--on-accent-container)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="type-body-sm font-medium block text-[var(--accent-strong)]">
                        {a.name}
                      </span>
                      <span className="block font-display text-[17px] font-semibold leading-6">
                        {a.title}
                      </span>
                      <span className="type-body-sm block text-muted-foreground">
                        {latest ? (
                          <>
                            {results.length} {results.length === 1 ? "result" : "results"} ·{" "}
                            <DateText>{date(latest.r.completedAt)}</DateText>
                          </>
                        ) : (
                          "Not taken yet"
                        )}
                      </span>
                    </span>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </span>
                  {latest ? (
                    <span className="flex items-center gap-3 border-t border-background px-4 py-3">
                      <span className="type-body-sm flex-1 text-muted-foreground">Latest</span>
                      {latest.head?.band ? (
                        <BandChip
                          label={latest.head.band.label}
                          tone={latest.head.band.tone}
                          severity={latest.head.band.severity}
                        />
                      ) : (
                        <span className="type-body-sm">{a.scores.length} scores</span>
                      )}
                    </span>
                  ) : null}
                  {a.headline && scored.length >= 2 ? (
                    <Trend
                      points={[...scored].reverse().slice(-8)}
                      className="mx-4 mb-4 block rounded-[12px] bg-background px-3 py-2"
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </IkanShell>
  );
}
