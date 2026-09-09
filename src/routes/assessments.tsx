import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CalendarDays, ChevronRight, Filter } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/assessments")({
  head: () => ({
    meta: [
      { title: "Assessment History — iKAN" },
      { name: "description", content: "Review your wellness assessments, trends, and progress over time." },
      { property: "og:title", content: "Assessment History — iKAN" },
      { property: "og:description", content: "Review your wellness assessments, trends, and progress over time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessmentsPage,
});

const history = [
  { title: "Feeling overwhelmed and anxious", kind: "Anxiety", score: "13/21", state: "Moderately severe", date: "Sep 8", tone: "mind" },
  { title: "Struggling with quality sleep", kind: "Sleep", score: "23/40", state: "Improving", date: "Sep 8", tone: "calm" },
  { title: "Feeling worried and stressed", kind: "Stress", score: "16/40", state: "Mild", date: "Sep 8", tone: "rest" },
  { title: "Feeling depressed and hopeless", kind: "Mood", score: "30/36", state: "Needs attention", date: "Sep 3", tone: "alert" },
];

function AssessmentsPage() {
  return (
    <IkanShell>
      <header className="px-5 pb-5 pt-6">
        <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-full">
            <Link to="/" aria-label="Back to dashboard"><ArrowLeft /></Link>
          </Button>
          <div className="min-w-0 text-center">
            <p className="eyebrow">Your progress</p>
            <h1 className="font-display text-xl font-semibold">Assessment history</h1>
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-full" aria-label="Filter assessments"><Filter /></Button>
        </div>
      </header>

      <section className="px-5">
        <div className="surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div><p className="eyebrow">Last 30 days</p><p className="mt-1 font-display text-3xl font-semibold">5 check-ins</p></div>
            <div className="rounded-full bg-calm-soft px-3 py-1.5 text-xs font-semibold text-calm-strong">↗ 8% steadier</div>
          </div>
          <div className="mt-5 flex h-24 items-end gap-2" aria-label="Recent wellness trend">
            {[42, 55, 48, 66, 74, 68, 79].map((height, index) => (
              <div key={height + index} className="flex flex-1 flex-col items-center gap-2">
                <div className={index === 6 ? "chart-column bg-calm" : "chart-column bg-secondary"} style={{ height }} />
                <span className="text-[10px] text-muted-foreground">{index === 6 ? "Now" : `W${index + 1}`}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-7 px-5">
        <div className="mb-3 flex items-center justify-between">
          <div><p className="eyebrow">All attempts</p><h2 className="font-display text-lg font-semibold">Your timeline</h2></div>
          <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground"><CalendarDays /> 2026</Button>
        </div>
        <div className="space-y-3">
          {history.map((item, index) => (
            <Link key={item.title} to={index === 0 ? "/assessment-result" : "/assessments"} className="surface grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 transition-transform active:scale-[.99]">
              <div className={`score-tile score-${item.tone}`}>{item.score.split("/")[0]}</div>
              <div className="min-w-0"><p className="truncate font-display text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.kind} · {item.state}</p></div>
              <div className="text-right"><p className="text-xs font-medium">{item.date}</p><ChevronRight className="ml-auto mt-2 h-4 w-4 text-muted-foreground" /></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-5 mt-6 rounded-[20px] border border-border bg-secondary/45 p-4">
        <div className="flex gap-3"><ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0 text-calm-strong" /><div><p className="font-display text-sm font-semibold">A useful pattern</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Your sleep scores improve when you complete at least three grounding sessions in a week.</p></div></div>
      </section>
    </IkanShell>
  );
}