import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { ArrowRight, Download, Phone, Play, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { bandFor, getAssessment, maxScore, type Tone } from "@/lib/assessments";

// Full class names so Tailwind generates them (template-built names are purged).
const toneClass: Record<Tone, { chip: string; bar: string }> = {
  calm: { chip: "bg-calm-soft text-calm-strong", bar: "bg-calm" },
  mind: { chip: "bg-mind-soft text-mind-strong", bar: "bg-mind" },
  rest: { chip: "bg-rest-soft text-rest-strong", bar: "bg-rest" },
  alert: { chip: "bg-alert-soft text-alert-strong", bar: "bg-alert" },
};

type Search = { score?: number };

export const Route = createFileRoute("/result/$slug")({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search["score"] === "number" ? { score: search["score"] } : {},
  loader: ({ params }) => {
    const assessment = getAssessment(params.slug);
    if (!assessment) throw notFound();
    return { assessment };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Result unavailable — iKAN" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.assessment.title} — Your result`;
    return {
      meta: [
        { title: `${title} — iKAN` },
        { name: "description", content: `Your ${loaderData.assessment.category.toLowerCase()} screening score, what it means, and what to do next.` },
        { property: "og:title", content: `${title} — iKAN` },
        { property: "og:description", content: `Your ${loaderData.assessment.category.toLowerCase()} screening score, what it means, and what to do next.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  notFoundComponent: () => (
    <IkanShell>
      <div className="grid min-h-[70vh] place-items-center px-8 text-center">
        <div>
          <h1 className="font-display text-xl font-semibold">That result is unavailable</h1>
          <Button asChild className="mt-5"><Link to="/assessment">Browse assessments</Link></Button>
        </div>
      </div>
    </IkanShell>
  ),
  component: ResultPage,
});

function ResultPage() {
  const { assessment } = Route.useLoaderData();
  const { score: rawScore } = Route.useSearch();
  const max = maxScore(assessment);
  const score = Math.min(Math.max(rawScore ?? Math.round(max * 0.55), 0), max);
  const percent = Math.round((score / max) * 100);
  const band = bandFor(assessment, score);

  return (
    <IkanShell>
      <header className="px-5 pb-4 pt-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="eyebrow">{assessment.category} result</p>
            <h1 className="truncate font-display text-lg font-semibold">{assessment.title}</h1>
          </div>
          <Button variant="outline" className="h-11 rounded-full px-4"><Download /> Export</Button>
        </div>
      </header>

      <section className="px-5">
        <div className="surface overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <span className={`semantic-chip ${toneClass[band.tone].chip}`}>{band.label}</span>
            <span className="text-xs text-muted-foreground">{assessment.instrument.split(" · ")[0]}</span>
          </div>
          <div className="mt-6 grid grid-cols-[112px_minmax(0,1fr)] items-center gap-5">
            <div className="score-ring" style={{ "--score": `${percent}%` } as CSSProperties}>
              <div><strong>{percent}%</strong><span>{score} / {max}</span></div>
            </div>
            <div>
              <p className="font-display text-xl font-semibold leading-tight">{band.headline}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{band.body}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-2xl bg-secondary/55 py-3 text-center">
            <div><strong className="font-display text-lg">{score}</strong><p className="text-[10px] text-muted-foreground">Your score</p></div>
            <div><strong className="font-display text-lg">{max}</strong><p className="text-[10px] text-muted-foreground">Maximum</p></div>
            <div><strong className="font-display text-lg">{assessment.questions.length}</strong><p className="text-[10px] text-muted-foreground">Answers</p></div>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="mt-4 px-5">
          <div className="surface p-5">
            <p className="eyebrow">Where you sit</p>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full">
              {assessment.bands.map((b) => (
                <div key={b.label} className={`h-full flex-1 ${toneClass[b.tone].bar}`} style={{ opacity: b.label === band.label ? 1 : 0.28 }} />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              {assessment.bands.map((b) => <span key={b.label} className="flex-1 truncate text-center">{b.label}</span>)}
            </div>
          </div>
        </section>
      </Reveal>

      {band.seekHelp ? (
        <Reveal>
          <section className="mt-4 px-5">
            <div className="rounded-[20px] border border-alert/25 bg-alert-soft p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-alert-strong" />
                <div>
                  <p className="font-display text-sm font-semibold">Consider speaking with a professional</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Based on this result, a conversation with someone trained could make the next step feel lighter.
                  </p>
                </div>
              </div>
              <Button variant="support" className="mt-4 w-full"><Phone /> Book a consultation</Button>
            </div>
          </section>
        </Reveal>
      ) : null}

      <Reveal>
        <section className="mt-6 px-5">
          <p className="eyebrow">What helps from here</p>
          <div className="mt-2 space-y-2">
            {band.advice.map((item) => (
              <div key={item} className="surface flex items-center gap-3 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary"><Sparkles className="h-4 w-4" /></span>
                <p className="text-sm font-medium">{item}</p>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-6 px-5">
          <div className="surface p-4">
            <div className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mind-soft text-mind-strong"><Play className="h-4 w-4" /></div>
              <div>
                <p className="font-display text-sm font-semibold">Unburn · 10 minute reset</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Matched to your {assessment.category.toLowerCase()} result and recent check-ins.</p>
              </div>
            </div>
            <Button className="mt-4 w-full">Start guided session</Button>
          </div>
        </section>
      </Reveal>

      <section className="mt-6 grid grid-cols-2 gap-3 px-5">
        <Button asChild variant="outline"><Link to="/assessment-flow" search={{ id: assessment.slug }}><RotateCcw /> Retake</Link></Button>
        <Button asChild variant="outline"><Link to="/assessments">History</Link></Button>
      </section>

      <p className="mx-auto mt-4 max-w-xs px-5 text-center text-[10px] leading-4 text-muted-foreground">
        This screening is not a diagnosis. iKAN supports, but never replaces, care from a qualified professional.
      </p>
    </IkanShell>
  );
}
