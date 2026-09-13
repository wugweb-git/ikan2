import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
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
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { usePersonalContext, useScrollY } from "@/hooks/use-personal-context";
import programCover from "@/assets/program-cover.jpg";
import resAnxiety from "@/assets/res-anxiety.jpg";
import resBurnout from "@/assets/res-burnout.jpg";
import resSleep from "@/assets/res-sleep.jpg";

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

const rings = [
  { label: "Energy", value: 62, color: "var(--rest)" },
  { label: "Calm", value: 48, color: "var(--calm)" },
  { label: "Focus", value: 71, color: "var(--mind)" },
];

const offerings = [
  { label: "Programs", meta: "1 active", icon: Sparkles, to: "/program" as const, tone: "score-calm" },
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
  { tag: "Anxiety", title: "The 3-minute reset that actually works", read: "4 min read", img: resAnxiety },
  { tag: "Sleep", title: "Why your mind races at 1 AM", read: "6 min read", img: resSleep },
  { tag: "Burnout", title: "Small boundaries, big recovery", read: "5 min read", img: resBurnout },
];

function Index() {
  const ctx = usePersonalContext("Ravi");
  const scrollY = useScrollY();
  const collapsed = scrollY > 64;

  return (
    <IkanShell>
      {/* Ambient canvas tinted by time of day */}
      <div className={`ambient ambient-${ctx.dayPart}`} aria-hidden="true" />

      <div className={collapsed ? "sticky-bar sticky-bar-on" : "sticky-bar"}>
        <span className="avatar avatar-sm">RA</span>
        <span className="truncate font-display text-sm font-semibold">{ctx.greeting}</span>
        <span className="ml-auto text-xs font-semibold text-muted-foreground">78</span>
      </div>

      <header className="relative px-5 pt-7">
        <div
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"
          style={{ opacity: Math.max(0, 1 - scrollY / 140), transform: `translateY(${Math.min(scrollY * 0.25, 24)}px)` }}
        >
          <div className="min-w-0">
            <p className="eyebrow flex flex-wrap items-center gap-1">
              <MapPin className="h-3 w-3" /> {ctx.city}
              {ctx.dateLabel ? <> · {ctx.dateLabel}</> : null} · <CloudSun className="h-3 w-3" /> 26°
            </p>
            <h1 className="mt-1 font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em]">{ctx.greeting}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{ctx.subline}</p>
          </div>
          <span className="avatar-ring"><span className="avatar">RA</span></span>
        </div>
      </header>

      {/* iKAN wellness score — Google Health style rings */}
      <Reveal className="mt-5 px-5">
        <div className="surface overflow-hidden">
          <div className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-4 p-4">
            <div className="score-orb"><span><strong>78</strong><small>score</small></span></div>
            <div className="min-w-0">
              <p className="eyebrow">iKAN wellness score</p>
              <h2 className="mt-1 font-display text-base font-semibold leading-snug">Steady, slightly stretched</h2>
              <p className="mt-1 text-xs text-muted-foreground">+6 this month · sleep is carrying you</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 px-4 pb-4">
            {rings.map((r) => (
              <div key={r.label} className="ring-stat">
                <span className="ring-dial" style={{ ["--p" as string]: `${r.value}%`, ["--c" as string]: r.color }}>
                  <i>{r.value}</i>
                </span>
                <span className="ring-label">{r.label}</span>
              </div>
            ))}
          </div>
          <Link to="/assessments" className="row-link">See wellness timeline <ChevronRight className="h-4 w-4" /></Link>
        </div>
      </Reveal>

      {/* Current program — image hero */}
      <Reveal className="mt-5 px-5">
        <p className="eyebrow mb-2">Your program</p>
        <div className="hero-card">
          <img
            src={programCover}
            alt=""
            aria-hidden="true"
            loading="lazy"
            width={1024}
            height={768}
            className="hero-media"
            style={{ transform: `translate3d(0, ${Math.min(scrollY * 0.06, 26)}px, 0) scale(1.12)` }}
          />
          <div className="hero-veil" />
          <div className="relative">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <span className="hero-chip">Current program</span>
                <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.02em]">Unburn</h2>
                <p className="mt-1 text-[11px] uppercase tracking-[.14em] opacity-70">Day 9 · 31 days total</p>
              </div>
              <div className="hero-ring"><span>29%</span></div>
            </div>
            <div className="hero-track mt-4"><i style={{ width: "29%" }} /></div>
            <p className="mt-3 text-sm opacity-85">Ready for your next session? Takes about 10 minutes.</p>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1 rounded-full bg-background text-foreground transition-transform hover:bg-background/90 active:scale-[.97]"><Play /> Start session</Button>
              <Button variant="ghost" className="rounded-full border border-white/25 text-background hover:bg-white/10 hover:text-background"><CalendarCheck /> Progress</Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Activity */}
      <Reveal className="mt-6 px-5">
        <div className="mb-3 flex items-end justify-between">
          <div><p className="eyebrow">Pick up again</p><h2 className="mt-1 font-display text-lg font-semibold tracking-[-0.01em]">Your activity</h2></div>
          <span className="text-xs text-muted-foreground">3 open</span>
        </div>
        <div className="surface divide-y divide-border">
          {activity.map((a) => (
            <div key={a.title} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
              <span className="activity-dial" style={{ ["--p" as string]: `${a.progress}%` }}><span>{a.progress}%</span></span>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.meta}</p>
              </div>
              <Button size="icon" variant={a.progress === 100 ? "secondary" : "default"} className="h-9 w-9 rounded-full transition-transform active:scale-90" aria-label={`Resume ${a.title}`}>
                {a.progress === 100 ? <ArrowUpRight /> : <Play />}
              </Button>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Offerings */}
      <Reveal className="mt-6 px-5">
        <p className="eyebrow mb-3">Everything in iKAN</p>
        <div className="grid grid-cols-2 gap-3">
          {offerings.map((o, i) => {
            const Icon = o.icon;
            return (
              <Link key={o.label} to={o.to} className="surface tile flex flex-col gap-3 p-4" style={{ transitionDelay: `${i * 20}ms` }}>
                <span className={`score-tile ${o.tone}`}><Icon className="h-5 w-5" /></span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-semibold">{o.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{o.meta}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>

      {/* Mood check-in */}
      <Reveal className="mt-6 px-5">
        <div className="surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div><p className="eyebrow">Today’s check-in</p><h2 className="mt-1 font-display text-base font-semibold">How is your mind feeling?</h2></div>
            <span className="semantic-chip bg-secondary text-muted-foreground">40 sec</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Not just a face — we track energy, calm and focus separately.</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {["Calm", "Busy", "Low", "Tense"].map((m) => (
              <Button key={m} variant="secondary" size="sm" className="h-9 rounded-full transition-transform active:scale-95">{m}</Button>
            ))}
          </div>
          <Button className="mt-3 w-full rounded-full transition-transform active:scale-[.98]"><Plus /> Log today’s mood</Button>
        </div>
      </Reveal>

      {/* Health sync */}
      <Reveal className="mt-4 px-5">
        <div className="rounded-[22px] border border-mind/25 bg-mind-soft p-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-background text-mind-strong"><Watch className="h-5 w-5" /></span>
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
      </Reveal>

      {/* Support */}
      <Reveal className="mt-4 px-5">
        <div className="rounded-[22px] border border-alert/25 bg-alert-soft p-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-background text-alert-strong"><Heart className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="eyebrow text-alert-strong">Support</p>
              <h2 className="mt-1 font-display text-sm font-semibold">Let’s talk about it</h2>
              <p className="mt-1 text-xs text-muted-foreground">Therapists available near {ctx.city}, today 6–9 PM.</p>
            </div>
          </div>
          <Button variant="support" className="mt-3 w-full rounded-full transition-transform active:scale-[.98]"><CalendarDays /> Book a consultation</Button>
        </div>
      </Reveal>

      {/* Resources */}
      <Reveal className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <div><p className="eyebrow">Resources</p><h2 className="mt-1 font-display text-lg font-semibold tracking-[-0.01em]">Read for your week</h2></div>
          <span className="text-xs text-muted-foreground">Swipe</span>
        </div>
        <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
          {resources.map((r) => (
            <article key={r.title} className="read-card snap-start">
              <img src={r.img} alt="" aria-hidden="true" loading="lazy" width={816} height={816} />
              <div className="read-veil" />
              <div className="read-body">
                <span className="read-tag"><BookOpen className="h-3 w-3" /> {r.tag}</span>
                <strong>{r.title}</strong>
                <span className="read-meta">{r.read}</span>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="mx-5 mt-6 rounded-[22px] border border-border bg-secondary/45 p-4">
        <p className="font-display text-sm font-semibold">For you, not everyone</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          This screen shifts with your local time, weather and city — and reorders itself around the check-ins, assessments and sessions you actually finish.
        </p>
      </Reveal>
    </IkanShell>
  );
}
