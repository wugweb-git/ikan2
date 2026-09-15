import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Clock3, History, ListChecks } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { BandChip, categoryIcon } from "@/components/assessment/ui";
import { cn } from "@/lib/utils";
import { assessments, type Assessment } from "@/lib/assessment/instruments";
import { headlineOf, scoreAll } from "@/lib/assessment/scoring";
import { useAssessmentStore } from "@/lib/assessment/store";

export const Route = createFileRoute("/assessments/")({
  head: () =>
    pageMeta(
      "Assessments",
      "Seven short assessments for depression, anxiety, stress, sleep, work balance, burnout and general wellbeing.",
    ),
  component: AssessmentListPage,
});

function AssessmentListPage() {
  const store = useAssessmentStore();
  const taken = store.results.length;

  return (
    <IkanShell>
      <div style={accentStyle("mind")}>
        <header className="flex items-start gap-2 px-4 pb-1 pt-8">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[32px] font-semibold leading-10">Assessments</h1>
            <p className="mt-1 text-[15px] text-muted-foreground">
              Answer a few questions and see where you stand today.
            </p>
          </div>
          <Link
            to="/history/assessments"
            aria-label="Your results"
            className={cn(
              "relative grid h-12 w-12 shrink-0 place-items-center rounded-full",
              stateLayer,
            )}
          >
            <History className="h-6 w-6" />
            {taken > 0 ? (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--accent-strong)] px-1 text-[10px] font-bold text-background">
                {taken}
              </span>
            ) : null}
          </Link>
        </header>

        <ul className="space-y-3 px-4 pt-5">
          {assessments.map((a) => (
            <li key={a.slug}>
              <AssessmentCard assessment={a} />
            </li>
          ))}
        </ul>

        <div className="mt-8 px-4 text-center text-[12px] leading-5 text-muted-foreground">
          <p>These are screenings, not a diagnosis.</p>
          <p>iKAN supports, but never replaces, care from a qualified professional.</p>
        </div>
      </div>
    </IkanShell>
  );
}

function AssessmentCard({ assessment: a }: { assessment: Assessment }) {
  const { resultsFor, draftFor } = useAssessmentStore();
  const latest = resultsFor(a.slug)[0];
  const draft = draftFor(a.slug);
  const head = latest ? headlineOf(a, scoreAll(a, latest.answers)) : null;
  const Icon = categoryIcon[a.category];

  return (
    <Link
      to="/assessments/$slug"
      params={{ slug: a.slug }}
      className={cn("flex items-center gap-4 rounded-[24px] bg-secondary p-4", stateLayer)}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-[var(--accent-container)] text-[var(--on-accent-container)]">
        <Icon className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-[var(--accent-strong)]">{a.name}</span>
        <span className="block font-display text-[17px] font-semibold leading-6">{a.title}</span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" /> {a.questions.length} questions
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {a.minutes} min
          </span>
          {draft ? (
            <span className="font-medium text-foreground">
              {Object.keys(draft.answers).length} of {a.questions.length} answered
            </span>
          ) : null}
        </span>
        {latest && !head ? (
          <span className="mt-2 block text-[13px] font-medium">Result saved</span>
        ) : null}
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
