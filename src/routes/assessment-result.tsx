import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Phone, Play, ShieldCheck, TrendingDown } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Button } from "@/components/ui/button";
import type { CSSProperties } from "react";

export const Route = createFileRoute("/assessment-result")({
  head: () => ({
    meta: [
      { title: "Anxiety Assessment Result — iKAN" },
      { name: "description", content: "Understand your latest anxiety assessment, trend, and recommended next steps." },
      { property: "og:title", content: "Anxiety Assessment Result — iKAN" },
      { property: "og:description", content: "Understand your latest anxiety assessment, trend, and recommended next steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessmentResultPage,
});

function AssessmentResultPage() {
  const values = [82, 78, 75, 70, 66, 62];
  return (
    <IkanShell>
      <header className="px-5 pb-4 pt-6">
        <div className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-full"><Link to="/assessments" aria-label="Back to history"><ArrowLeft /></Link></Button>
          <div className="min-w-0"><p className="eyebrow">Latest result</p><h1 className="truncate font-display text-lg font-semibold">Overwhelmed &amp; anxious</h1></div>
          <Button variant="outline" className="h-11 rounded-full px-4"><Download /> Export</Button>
        </div>
      </header>

      <section className="px-5">
        <div className="surface overflow-hidden p-5">
          <div className="flex items-center justify-between"><span className="semantic-chip bg-rest-soft text-rest-strong">Moderately severe</span><span className="text-xs text-muted-foreground">Sep 8, 2026</span></div>
          <div className="mt-6 grid grid-cols-[112px_minmax(0,1fr)] items-center gap-5">
            <div className="score-ring" style={{ "--score": "62%" } as CSSProperties}><div><strong>62%</strong><span>13 / 21</span></div></div>
            <div><p className="font-display text-xl font-semibold leading-tight">You're improving, and support could still help.</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Your score is 4 points lower than your first check-in. The biggest change is fewer restless evenings.</p></div>
          </div>
          <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-2xl bg-secondary/55 py-3 text-center">
            <div><strong className="font-display text-lg">2</strong><p className="text-[10px] text-muted-foreground">Attempts</p></div>
            <div><strong className="font-display text-lg text-calm-strong">−4</strong><p className="text-[10px] text-muted-foreground">Since March</p></div>
            <div><strong className="font-display text-sm">6 months</strong><p className="text-[10px] text-muted-foreground">Between</p></div>
          </div>
        </div>
      </section>

      <section className="mt-4 px-5">
        <div className="rounded-[20px] border border-alert/25 bg-alert-soft p-4">
          <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-alert-strong" /><div><p className="font-display text-sm font-semibold">Consider speaking with a professional</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Based on this result and your recent check-ins, a conversation could make the next step feel lighter.</p></div></div>
          <Button variant="support" className="mt-4 w-full"><Phone /> Find support</Button>
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="surface p-5">
          <div className="flex items-start justify-between"><div><p className="eyebrow">Score over time</p><h2 className="mt-1 font-display text-lg font-semibold">The direction is positive</h2></div><TrendingDown className="h-5 w-5 text-calm-strong" /></div>
          <div className="relative mt-6 h-36 border-b border-l border-border">
            <svg viewBox="0 0 300 120" className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" aria-label="Score decreased from 82 to 62 percent">
              <path d="M0 18 C48 22, 55 32, 105 39 S175 63, 210 74 S262 91, 300 94" fill="none" stroke="var(--calm)" strokeWidth="4" strokeLinecap="round" />
              <path d="M0 18 C48 22, 55 32, 105 39 S175 63, 210 74 S262 91, 300 94 L300 120 L0 120 Z" fill="var(--calm-soft)" />
            </svg>
            <div className="absolute -bottom-6 inset-x-0 flex justify-between text-[10px] text-muted-foreground"><span>Mar 17</span><span>Sep 8</span></div>
          </div>
          <div className="mt-10 flex justify-between">{values.map((value) => <span key={value} className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold">{value}</span>)}</div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <p className="eyebrow">Recommended next</p>
        <div className="mt-2 surface p-4"><div className="flex gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mind-soft text-mind-strong"><Play className="h-4 w-4" /></div><div><p className="font-display text-sm font-semibold">Unburn · 10 minute reset</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Chosen because tension appears most often in your evening check-ins.</p></div></div><Button className="mt-4 w-full">Start guided session</Button></div>
      </section>

      <section className="mt-6 px-5"><Button variant="outline" className="w-full" asChild><Link to="/assessments">View all attempts</Link></Button><p className="mx-auto mt-4 max-w-xs text-center text-[10px] leading-4 text-muted-foreground">This screening is not a diagnosis. iKAN supports, but never replaces, care from a qualified professional.</p></section>
    </IkanShell>
  );
}