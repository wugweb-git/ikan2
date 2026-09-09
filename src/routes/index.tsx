import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ChartNoAxesColumn,
  ChevronRight,
  CloudSun,
  Heart,
  MapPin,
  Play,
  Plus,
  Smile,
  Sparkles,
  Watch,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Personalized Wellness Dashboard — iKAN" },
      { name: "description", content: "Your wellness score, current program, assessments, mood journal, support and resources in one place." },
      { property: "og:title", content: "Your Personalized Wellness Dashboard — iKAN" },
      { property: "og:description", content: "Your wellness score, current program, assessments, mood journal, support and resources in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const moodDimensions = [
  { label: "Energy", value: 62, tone: "var(--rest)" },
  { label: "Calm", value: 48, tone: "var(--calm)" },
  { label: "Focus", value: 71, tone: "var(--mind)" },
];

const offerings = [
  { label: "Programs", meta: "1 active", icon: Sparkles, to: "/" as const, tone: "score-calm" },
  { label: "Assessments", meta: "4 taken", icon: ChartNoAxesColumn, to: "/assessments" as const, tone: "score-mind" },
  { label: "Mood journal", meta: "5-day streak", icon: Smile, to: "/" as const, tone: "score-rest" },
  { label: "Consult", meta: "Book a slot", icon: Heart, to: "/" as const, tone: "score-alert" },
];

const activity = [
  { title: "Unburn · Day 9 session", meta: "6 of 10 min listened", progress: 60 },
  { title: "Sleep quality assessment", meta: "12 of 20 questions", progress: 55 },
  { title: "Evening breathing", meta: "Completed today", progress: 100 },
];

const resources = [
  { tag: "Anxiety", title: "The 3-minute reset that actually works", read: "4 min read" },
  { tag: "Sleep", title: "Why your mind races at 1 AM", read: "6 min read" },
  { tag: "Burnout", title: "Small boundaries, big recovery", read: "5 min read" },
];

function Index() {
  return (
    <IkanShell>
      <header className="px-5 pt-6 animate-fade-in">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Pune · Wed, 9 Sep · <CloudSun className="h-3 w-3" /> 26°
            </p>
            <h1 className="mt-1 font-display text-[26px] font-bold leading-tight">Good morning, Ravi</h1>
            <p className="mt-1 text-sm text-muted-foreground">Muggy morning — a slow start suits you today.</p>
          </div>
          <div className="avatar-ring">
            <span className="avatar">RA</span>
          </div>
        </div>
      </header>

      {/* iKAN wellness score */}
      <section className="mt-5 px-5 animate-fade-in delay-1">
        <div className="surface p-4">
          <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-4">
            <div className="mini-score"><span>78</span></div>
            <div className="min-w-0">
              <p className="eyebrow">iKAN wellness score</p>
              <h2 className="mt-1 font-display text-base font-semibold">Steady, slightly stretched</h2>
              <p className="mt-1 text-xs text-muted-foreground">+6 this month · sleep is carrying you</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {moodDimensions.map((d) => (
              <div key={d.label} className="metric-pill">
                <span>{d.label}</span>
                <div className="metric-track"><i style={{ width: `${d.value}%`, background: d.tone }} /></div>
              </div>
            ))}
          </div>
          <Button asChild variant="ghost" size="sm" className="mt-3 w-full rounded-full">
            <Link to="/assessments">See wellness timeline <ChevronRight /></Link>
          </Button>
        </div>
      </section>

      {/* Current program — dark hero card */}
      <section className="mt-4 px-5 animate-fade-in delay-2">
        <p className="eyebrow mb-2">Your program</p>
        <div className="hero-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <span className="hero-chip">Current program</span>
              <h2 className="mt-2 font-display text-2xl font-bold">Unburn</h2>
              <p className="mt-1 text-[11px] uppercase tracking-[.12em] opacity-70">Day 9 · 31 days total</p>
            </div>
            <div className="hero-ring"><span>29%</span></div>
          </div>
          <div className="hero-track mt-4"><i style={{ width: "29%" }} /></div>
          <p className="mt-3 text-sm opacity-80">Ready for your next session? Takes about 10 minutes.</p>
          <div className="mt-4 flex gap-2">
            <Button className="flex-1 rounded-full bg-background text-foreground hover:bg-background/90"><Play /> Start session</Button>
            <Button variant="ghost" className="rounded-full border border-white/20 text-background hover:bg-white/10 hover:text-background"><CalendarCheck /> Progress</Button>
          </div>
        </div>
      </section>

      {/* Continue where you left off */}
      <section className="mt-6 px-5 animate-fade-in delay-3">
        <div className="mb-3 flex items-end justify-between">
          <div><p className="eyebrow">Pick up again</p><h2 className="mt-1 font-display text-lg font-semibold">Your activity</h2></div>
          <span className="text-xs text-muted-foreground">3 open</span>
        </div>
        <div className="surface divide-y divide-border">
          {activity.map((a) => (
            <div key={a.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
              <div className="activity-dial" style={{ ["--p" as string]: `${a.progress}%` }}><span>{a.progress}%</span></div>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.meta}</p>
              </div>
              <Button size="icon" variant={a.progress === 100 ? "secondary" : "default"} className="h-9 w-9 rounded-full" aria-label={`Resume ${a.title}`}>
                {a.progress === 100 ? <ArrowUpRight /> : <Play />}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Our offerings */}
      <section className="mt-6 px-5 animate-fade-in delay-4">
        <p className="eyebrow mb-3">Everything in iKAN</p>
        <div className="grid grid-cols-2 gap-3">
          {offerings.map((o) => {
            const Icon = o.icon;
            return (
              <Link key={o.label} to={o.to} className="surface flex flex-col gap-3 p-4 transition-transform active:scale-[.98]">
                <span className={`score-tile ${o.tone}`}><Icon className="h-5 w-5" /></span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-semibold">{o.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{o.meta}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Mood check-in — iKAN's multi-dimension take */}
      <section className="mt-6 px-5">
        <div className="surface p-4">
          <div className="flex items-center justify-between">
            <div><p className="eyebrow">Today’s check-in</p><h2 className="mt-1 font-display text-base font-semibold">How is your mind feeling?</h2></div>
            <span className="semantic-chip bg-secondary text-muted-foreground">40 sec</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Not just a face — we track energy, calm and focus separately.</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {["Calm", "Busy", "Low", "Tense"].map((m) => (
              <Button key={m} variant="secondary" size="sm" className="h-9 rounded-full">{m}</Button>
            ))}
          </div>
          <Button className="mt-3 w-full rounded-full"><Plus /> Log today’s mood</Button>
        </div>
      </section>

      {/* Health sync */}
      <section className="mt-4 px-5">
        <div className="rounded-[20px] border border-mind/25 bg-mind-soft p-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-background text-mind-strong"><Watch className="h-5 w-5" /></div>
            <div className="min-w-0">
              <p className="eyebrow text-mind-strong">Connect your data</p>
              <h2 className="mt-1 font-display text-sm font-semibold">Sync sleep & steps automatically</h2>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" className="h-10 rounded-full"><Activity /> Google Fit</Button>
            <Button variant="secondary" size="sm" className="h-10 rounded-full"><Heart /> Health Connect</Button>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="mt-4 px-5">
        <div className="rounded-[20px] border border-alert/25 bg-alert-soft p-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-background text-alert-strong"><Heart className="h-5 w-5" /></div>
            <div className="min-w-0">
              <p className="eyebrow text-alert-strong">Support</p>
              <h2 className="mt-1 font-display text-sm font-semibold">Let’s talk about it</h2>
              <p className="mt-1 text-xs text-muted-foreground">Therapists available near Pune, today 6–9 PM.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-alert-strong" />
          </div>
          <Button variant="support" className="mt-3 w-full rounded-full"><CalendarDays /> Book a consultation</Button>
        </div>
      </section>

      {/* Resources */}
      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <div><p className="eyebrow">Resources</p><h2 className="mt-1 font-display text-lg font-semibold">Read for your week</h2></div>
          <span className="text-xs text-muted-foreground">Swipe</span>
        </div>
        <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
          {resources.map((r) => (
            <article key={r.title} className="insight-card snap-start">
              <BookOpen className="text-calm-strong" />
              <p>{r.tag}</p>
              <strong className="!text-base leading-snug">{r.title}</strong>
              <span>{r.read}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-5 mt-6 rounded-[20px] border border-border bg-secondary/45 p-4">
        <p className="font-display text-sm font-semibold">For you, not everyone</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Your dashboard reorders itself around your check-ins, assessments, local time and weather, and the sessions you actually finish.</p>
      </section>
    </IkanShell>
  );
}
