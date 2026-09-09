import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, ChevronRight, CloudSun, Headphones, MoonStar, Sparkles } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Personalized Wellness Dashboard — iKAN" },
      { name: "description", content: "Your daily mental wellness check-in, personalized program, and latest insights." },
      { property: "og:title", content: "Your Personalized Wellness Dashboard — iKAN" },
      { property: "og:description", content: "Your daily mental wellness check-in, personalized program, and latest insights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <IkanShell>
      <header className="px-5 pt-6 animate-fade-in">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="flex min-w-0 items-center gap-3"><div className="brand-mark"><Sparkles className="h-4 w-4" /></div><div className="min-w-0"><p className="font-display text-sm font-semibold">iKAN</p><p className="truncate text-[10px] text-muted-foreground">Your personal care journal</p></div></div>
          <div className="avatar">RA</div>
        </div>
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="eyebrow">Wednesday, 9 September</p><h1 className="mt-1 font-display text-[28px] font-bold leading-tight">Good morning, Ravi</h1><p className="mt-2 text-sm text-muted-foreground">You slept better. Let’s protect that calm today.</p></div><div className="flex shrink-0 items-center gap-1 rounded-full bg-rest-soft px-3 py-2 text-xs font-semibold text-rest-strong"><CloudSun className="h-4 w-4" />26°</div></div>
      </header>

      <section className="mt-5 px-5 animate-fade-in delay-1">
        <div className="surface p-4">
          <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4"><div className="mini-score"><span>78</span></div><div className="min-w-0"><p className="eyebrow">Today’s check-in</p><h2 className="mt-1 font-display text-base font-semibold">How is your mind feeling?</h2><p className="mt-1 text-xs text-muted-foreground">40 seconds · best before 10 AM</p></div></div>
          <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Quick mood check-in"><Button variant="secondary">Calm</Button><Button variant="secondary">Busy</Button><Button>Check in</Button></div>
        </div>
      </section>

      <section className="mt-4 px-5 animate-fade-in delay-2">
        <div className="rounded-[20px] border border-mind/25 bg-mind-soft p-4"><div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-background text-mind-strong"><MoonStar className="h-5 w-5" /></div><div className="min-w-0"><p className="eyebrow text-mind-strong">Picked for your pattern</p><h2 className="mt-1 truncate font-display text-sm font-semibold">A calmer evening starts at 7:30</h2><p className="mt-1 truncate text-xs text-muted-foreground">Your worry eases after short breathing sessions.</p></div><Button size="icon" className="h-11 w-11 rounded-full" aria-label="Start breathing session"><ArrowRight /></Button></div></div>
      </section>

      <section className="mt-6 px-5 animate-fade-in delay-3">
        <div className="mb-3 flex items-end justify-between"><div><p className="eyebrow">Your program</p><h2 className="mt-1 font-display text-lg font-semibold">Unburn</h2></div><span className="text-xs font-semibold text-calm-strong">Day 9 of 14</span></div>
        <div className="surface overflow-hidden"><div className="program-band"><div><span>Today's 10-minute reset</span><strong>Release the pressure</strong></div><Headphones className="h-7 w-7" /></div><div className="p-4"><Progress value={64} className="h-1.5 bg-secondary [&>div]:bg-calm" /><div className="mt-3 flex justify-between text-[10px] text-muted-foreground"><span>8 sessions complete</span><span>64%</span></div><Button className="mt-4 w-full"><Headphones /> Continue session</Button></div></div>
      </section>

      <section className="mt-6 px-5 animate-fade-in delay-4">
        <div className="mb-3 flex items-center justify-between"><div><p className="eyebrow">Your signals</p><h2 className="mt-1 font-display text-lg font-semibold">What changed this week</h2></div><span className="text-xs text-muted-foreground">Swipe</span></div>
        <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
          <article className="insight-card snap-start"><MoonStar className="text-mind-strong" /><p>Sleep</p><strong>+42 min</strong><span>Longer than last week</span></article>
          <article className="insight-card snap-start"><Brain className="text-calm-strong" /><p>Worry</p><strong>−9%</strong><span>Lowest after 6 PM</span></article>
          <article className="insight-card snap-start"><Sparkles className="text-rest-strong" /><p>Consistency</p><strong>5 days</strong><span>Your best streak yet</span></article>
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between"><div><p className="eyebrow">Latest assessment</p><h2 className="mt-1 font-display text-lg font-semibold">Your progress</h2></div><Button asChild variant="ghost" size="sm" className="rounded-full"><Link to="/assessments">History <ChevronRight /></Link></Button></div>
        <Link to="/assessment-result" className="surface grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 transition-transform active:scale-[.99]"><div className="score-tile score-rest">62</div><div className="min-w-0"><p className="truncate font-display text-sm font-semibold">Feeling overwhelmed and anxious</p><p className="mt-1 text-xs text-muted-foreground">13/21 · 4 points better than March</p></div><ChevronRight className="h-5 w-5 text-muted-foreground" /></Link>
      </section>

      <section className="mx-5 mt-6 rounded-[20px] border border-border bg-secondary/45 p-4"><p className="font-display text-sm font-semibold">For you, not everyone</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Your plan adapts to your check-ins, assessments, sleep patterns, and the sessions you actually finish.</p></section>
    </IkanShell>
  );
}
