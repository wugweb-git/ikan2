import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assessments, getAssessment } from "@/lib/assessments";

type Search = { id?: string };

export const Route = createFileRoute("/assessment-flow")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Taking your assessment — iKAN" },
      { name: "description", content: "Answer one question at a time. Your progress is saved as you go." },
      { property: "og:title", content: "Taking your assessment — iKAN" },
      { property: "og:description", content: "Answer one question at a time. Your progress is saved as you go." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AssessmentFlowPage,
});

function AssessmentFlowPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const assessment = useMemo(() => getAssessment(id ?? "") ?? assessments[0], [id]);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const total = assessment.questions.length;
  const question = assessment.questions[step];
  const selected = answers[question.id];
  const progress = done ? 100 : Math.round((step / total) * 100);
  const score = Object.values(answers).reduce((sum, value) => sum + value, 0);

  const choose = (value: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    window.setTimeout(() => {
      if (step + 1 < total) setStep(step + 1);
      else setDone(true);
    }, 220);
  };

  const back = () => {
    if (done) setDone(false);
    else if (step > 0) setStep(step - 1);
  };

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-canvas">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center bg-background px-6 shadow-app">
          <div className="animate-fade-in surface p-8 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-calm-soft">
              <Check className="h-10 w-10 text-calm-strong" strokeWidth={3} />
            </div>
            <h1 className="mt-7 font-display text-2xl font-semibold">All done</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Thank you for taking a moment for yourself. Your {assessment.category.toLowerCase()} result is ready.
            </p>
            <div className="mt-6 rounded-2xl bg-secondary/60 p-4 text-left">
              <p className="eyebrow">You answered</p>
              <p className="mt-1 font-display text-lg font-semibold">{total} of {total} questions</p>
            </div>
            <Button
              className="mt-6 h-13 w-full text-base"
              onClick={() => navigate({ to: "/result/$slug", params: { slug: assessment.slug }, search: { score } })}
            >
              View results <ChevronRight />
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full text-muted-foreground">
              <Link to="/assessment">Back to assessments</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background shadow-app">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-full">
              <Link to="/assessment/$slug" params={{ slug: assessment.slug }} aria-label="Exit assessment"><X /></Link>
            </Button>
            <p className="truncate text-center font-display text-sm font-semibold">{assessment.title}</p>
            <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">{step + 1} of {total}</span>
          </div>
          <div className="h-1 w-full bg-secondary">
            <div className="h-full rounded-r-full bg-foreground transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </header>

        <main className="flex-1 px-5 pb-40 pt-8">
          <div key={question.id} className="animate-fade-in">
            {question.helper ? <p className="eyebrow">{question.helper}</p> : <p className="eyebrow">{assessment.category} screening</p>}
            <h1 className="mt-2 font-display text-[26px] font-semibold leading-[1.2] tracking-tight">{question.text}</h1>

            <div className="mt-8 space-y-3">
              {question.options.map((option) => {
                const active = selected === option.value;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => choose(option.value)}
                    aria-pressed={active}
                    className={`tile flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card shadow-[var(--shadow-card)]"
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                        active ? "border-background bg-background text-foreground" : "border-border"
                      }`}
                    >
                      {active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                    </span>
                    <span className="font-display text-sm font-semibold">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        <footer className="fixed inset-x-0 bottom-0 z-30 flex justify-center">
          <div className="w-full max-w-md border-t border-border bg-background/92 px-5 pb-6 pt-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 rounded-full" onClick={back} disabled={step === 0} aria-label="Previous question">
                <ArrowLeft />
              </Button>
              <Button
                className="h-12 flex-1 text-base"
                disabled={selected === undefined}
                onClick={() => (step + 1 < total ? setStep(step + 1) : setDone(true))}
              >
                {step + 1 === total ? "Finish" : "Continue"}
              </Button>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Answer honestly. There are no wrong answers.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
