import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Clock3, History, Lock, Sparkles } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { assessments, maxScore } from "@/lib/assessments";

export const Route = createFileRoute("/assessment/")({
  head: () => ({
    meta: [
      { title: "Health Assessments — iKAN" },
      { name: "description", content: "Seven quick, evidence-based screenings for stress, anxiety, mood, sleep, burnout, self-worth and focus." },
      { property: "og:title", content: "Health Assessments — iKAN" },
      { property: "og:description", content: "Seven quick, evidence-based screenings for stress, anxiety, mood, sleep, burnout, self-worth and focus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessmentListPage,
});

const promises = [
  { icon: Sparkles, title: "Clinical screenings", body: "Built on instruments used in practice." },
  { icon: Lock, title: "Private by default", body: "Results stay in your account only." },
  { icon: Clock3, title: "Two to four minutes", body: "Short enough to finish in one sitting." },
];

function AssessmentListPage() {
  return (
    <IkanShell>
      <header className="px-5 pb-4 pt-6">
        <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-full">
            <Link to="/" aria-label="Back to dashboard"><ArrowLeft /></Link>
          </Button>
          <div className="min-w-0 text-center">
            <p className="eyebrow">iKAN screenings</p>
            <h1 className="font-display text-xl font-semibold">Assessments</h1>
          </div>
          <Button asChild variant="outline" size="icon" className="h-11 w-11 rounded-full">
            <Link to="/assessments" aria-label="Assessment history"><History /></Link>
          </Button>
        </div>
      </header>

      <Reveal>
        <section className="px-5">
          <div className="hero-card">
            <span className="hero-chip">7 available</span>
            <p className="mt-4 font-display text-2xl font-semibold leading-tight">Understand what you are carrying.</p>
            <p className="mt-2 max-w-[16rem] text-sm leading-6 opacity-80">
              Each screening gives you a score, a plain-language reading, and a next step that fits it.
            </p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-4 grid grid-cols-3 gap-2 px-5">
          {promises.map(({ icon: Icon, title, body }) => (
            <div key={title} className="surface p-3">
              <Icon className="h-4 w-4" aria-hidden="true" />
              <p className="mt-3 font-display text-[11px] font-semibold leading-tight">{title}</p>
              <p className="mt-1 text-[10px] leading-4 text-muted-foreground">{body}</p>
            </div>
          ))}
        </section>
      </Reveal>

      <section className="mt-7 px-5">
        <p className="eyebrow">Available assessments</p>
        <div className="mt-3 space-y-3">
          {assessments.map((item) => (
            <Reveal key={item.slug}>
              <Link
                to="/assessment/$slug"
                params={{ slug: item.slug }}
                className="surface tile grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4"
              >
                <div className={`score-tile score-${item.tone}`}>{item.questions.length}</div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {item.category} · {item.minutes} min · {maxScore(item)} pts
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <p className="mx-auto mt-6 max-w-xs px-5 text-center text-[10px] leading-4 text-muted-foreground">
        Screenings are not a diagnosis. iKAN supports, but never replaces, care from a qualified professional.
      </p>
    </IkanShell>
  );
}
