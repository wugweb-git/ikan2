import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock3, FileText, Lock, ListChecks, ShieldCheck } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { getAssessment, maxScore } from "@/lib/assessments";

export const Route = createFileRoute("/assessment/$slug")({
  loader: ({ params }) => {
    const assessment = getAssessment(params.slug);
    if (!assessment) throw notFound();
    return { assessment };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Assessment not found — iKAN" }, { name: "robots", content: "noindex" }] };
    }
    const { title, blurb } = loaderData.assessment;
    return {
      meta: [
        { title: `${title} — iKAN Assessment` },
        { name: "description", content: blurb },
        { property: "og:title", content: `${title} — iKAN Assessment` },
        { property: "og:description", content: blurb },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: AssessmentMissing,
  component: AssessmentDetailPage,
});

function AssessmentMissing() {
  return (
    <IkanShell>
      <div className="grid min-h-[70vh] place-items-center px-8 text-center">
        <div>
          <h1 className="font-display text-xl font-semibold">We could not find that screening</h1>
          <Button asChild className="mt-5"><Link to="/assessment">Browse assessments</Link></Button>
        </div>
      </div>
    </IkanShell>
  );
}

function AssessmentDetailPage() {
  const { assessment } = Route.useLoaderData();

  return (
    <IkanShell>
      <header className="px-5 pb-4 pt-6">
        <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-full">
          <Link to="/assessment" aria-label="Back to assessments"><ArrowLeft /></Link>
        </Button>
      </header>

      <section className="px-5">
        <span className={`semantic-chip bg-${assessment.tone}-soft text-${assessment.tone}-strong`}>{assessment.category}</span>
        <h1 className="mt-3 font-display text-[28px] font-semibold leading-[1.15] tracking-tight">{assessment.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{assessment.about}</p>
      </section>

      <Reveal>
        <section className="mt-5 px-5">
          <div className="surface grid grid-cols-3 divide-x divide-border py-3 text-center">
            <div><ListChecks className="mx-auto h-4 w-4 text-muted-foreground" /><strong className="mt-2 block font-display text-sm">{assessment.questions.length}</strong><p className="text-[10px] text-muted-foreground">Questions</p></div>
            <div><Clock3 className="mx-auto h-4 w-4 text-muted-foreground" /><strong className="mt-2 block font-display text-sm">{assessment.minutes} min</strong><p className="text-[10px] text-muted-foreground">To finish</p></div>
            <div><FileText className="mx-auto h-4 w-4 text-muted-foreground" /><strong className="mt-2 block font-display text-sm">{maxScore(assessment)}</strong><p className="text-[10px] text-muted-foreground">Max score</p></div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-5 px-5">
          <div className="surface p-5">
            <p className="eyebrow">What it looks at</p>
            <ul className="mt-3 space-y-2">
              {assessment.focus.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-secondary"><Check className="h-3.5 w-3.5" /></span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{assessment.instrument}</p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-5 px-5">
          <div className="surface p-4">
            <p className="eyebrow">How you will answer</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {assessment.scale.map((option) => (
                <span key={option.label} className="rounded-full bg-secondary px-3 py-1.5 text-[11px] font-semibold">{option.label}</span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-5 px-5">
          <div className="flex gap-3 rounded-[20px] border border-border bg-secondary/45 p-4">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-5 text-muted-foreground">
              Your answers stay private to your account. You can stop halfway and pick up where you left off.
            </p>
          </div>
        </section>
      </Reveal>

      <section className="mt-6 px-5">
        <Button asChild className="h-13 w-full text-base">
          <Link to="/assessment-flow" search={{ id: assessment.slug }}>Start assessment</Link>
        </Button>
        <p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Screening only. This is not a diagnosis.
        </p>
      </section>
    </IkanShell>
  );
}
