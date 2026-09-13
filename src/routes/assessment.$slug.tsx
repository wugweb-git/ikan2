import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Clock3, ListChecks, Lock } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, Button, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { BandChip, categoryIcon } from "@/components/assessment/ui";
import { cn } from "@/lib/utils";
import { getAssessment, profiles } from "@/lib/assessment/instruments";
import { formatValue, headlineOf, optionLabel, scoreAll } from "@/lib/assessment/scoring";
import { useAssessmentStore } from "@/lib/assessment/store";

export const Route = createFileRoute("/assessment/$slug")({
  loader: ({ params }) => {
    const a = getAssessment(params.slug);
    if (!a) throw notFound();
    return { slug: a.slug };
  },
  head: ({ loaderData }) => {
    const a = loaderData ? getAssessment(loaderData.slug) : undefined;
    return a
      ? pageMeta(
          a.title,
          `${a.questions.length} questions, about ${a.minutes} minutes. ${a.instrument}.`,
        )
      : { meta: [{ title: "Assessment — iKAN" }] };
  },
  notFoundComponent: () => (
    <IkanShell>
      <div className="grid min-h-[70vh] place-items-center px-8 text-center">
        <div>
          <h1 className="font-display text-xl font-semibold">We couldn’t find that assessment</h1>
          <Link
            to="/assessment"
            className="mt-5 inline-flex h-12 items-center rounded-full bg-foreground px-6 font-semibold text-background"
          >
            See all assessments
          </Link>
        </div>
      </div>
    </IkanShell>
  ),
  component: AssessmentDetailPage,
});

function AssessmentDetailPage() {
  const { slug } = Route.useLoaderData();
  const a = getAssessment(slug)!;
  const navigate = useNavigate();
  const store = useAssessmentStore();
  const draft = store.draftFor(slug);
  const past = store.resultsFor(slug);
  const Icon = categoryIcon[a.category];
  const scaleKeys = [...new Set(a.questions.map((q) => q.scale))];
  const answered = draft ? Object.keys(draft.answers).length : 0;

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

        <section className="px-4 pt-2">
          <span className="grid h-14 w-14 place-items-center rounded-[18px] bg-[var(--accent-container)] text-[var(--on-accent-container)]">
            <Icon className="h-7 w-7" />
          </span>
          <p className="mt-5 text-[14px] font-medium text-[var(--accent-strong)]">{a.name}</p>
          <h1 className="mt-1 font-display text-[28px] font-semibold leading-9">{a.title}</h1>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{a.instrument}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]">
              <ListChecks className="h-4 w-4" /> {a.questions.length} questions
            </span>
            <span className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-foreground/20 px-3 text-[14px]">
              <Clock3 className="h-4 w-4" /> {a.minutes} min
            </span>
          </div>
        </section>

        <section className="mt-8 px-4">
          <h2 className="font-display text-[16px] font-semibold">What you’ll get</h2>
          <ul className="mt-3 overflow-hidden rounded-[20px] bg-secondary">
            {a.scores.map((s, i) => {
              const p = profiles[s.profile]!;
              return (
                <li
                  key={s.id}
                  className={cn(
                    "flex min-h-14 items-center gap-3 px-4 py-3",
                    i > 0 && "border-t border-background",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] leading-6">{s.label}</span>
                    <span className="block text-[13px] text-muted-foreground">
                      {s.instrument}, {formatValue(p, p.min)} to {p.max}
                      {p.direction === "better" ? ", higher is better" : ""}
                    </span>
                  </span>
                  <span className="text-[13px] text-muted-foreground">{p.bands.length} levels</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-8 px-4">
          <h2 className="font-display text-[16px] font-semibold">How you’ll answer</h2>
          <div className="mt-3 space-y-3">
            {scaleKeys.map((k) => (
              <div key={k} className="flex flex-wrap gap-2">
                {a.scales[k]!.options.map((o) => (
                  <span key={o.text} className="rounded-[8px] bg-secondary px-3 py-1.5 text-[13px]">
                    {optionLabel(o.text)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {past.length > 0 ? (
          <section className="mt-8 px-4">
            <h2 className="font-display text-[16px] font-semibold">Your results</h2>
            <ul className="mt-3 overflow-hidden rounded-[20px] bg-secondary">
              {past.slice(0, 3).map((r, i) => {
                const head = headlineOf(a, scoreAll(a, r.answers));
                return (
                  <li key={r.id} className={cn(i > 0 && "border-t border-background")}>
                    <Link
                      to="/result/$slug"
                      params={{ slug }}
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
                      ) : null}
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <p className="mx-4 mt-8 flex gap-3 rounded-[16px] border border-foreground/10 p-4 text-[13px] leading-5 text-muted-foreground">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" />
          Your answers stay on this device. If you stop partway, you can pick up where you left off.
        </p>

        <div className="sticky bottom-[88px] z-20 mt-6 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6">
          <Button
            className="w-full"
            onClick={() => navigate({ to: "/assessment-flow", search: { id: slug } })}
          >
            {draft
              ? `Continue, ${answered} of ${a.questions.length} answered`
              : past.length
                ? "Take it again"
                : "Start assessment"}
          </Button>
        </div>
      </div>
    </IkanShell>
  );
}
