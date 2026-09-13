import { createFileRoute, Link, linkOptions } from "@tanstack/react-router";
import {
  Activity,
  Bell,
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
import { moodScale } from "@/lib/journal";
import { saveSnapshot, useEverything, wellnessBand } from "@/lib/activity";
import { defaultProfile, firstName, profileInitials, useProfile } from "@/lib/profile";
import { getResource } from "@/lib/resources";
import { useNotifications } from "@/lib/notifications";
import { useHydrated } from "@/hooks/use-hydrated";
import { useEffect } from "react";
import { usePersonalContext, useScrollY } from "@/hooks/use-personal-context";
import programCover from "@/assets/program-cover.jpg";
import resAnxiety from "@/assets/res-anxiety.jpg";
import resBurnout from "@/assets/res-burnout.jpg";
import resSleep from "@/assets/res-sleep.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Personalized Wellness Dashboard — iKAN" },
      {
        name: "description",
        content:
          "Your wellness score, current program, assessments, mood journal, support and resources in one place.",
      },
      { property: "og:title", content: "Your Personalized Wellness Dashboard — iKAN" },
      {
        property: "og:description",
        content:
          "Your wellness score, current program, assessments, mood journal, support and resources in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const offerings = [
  {
    label: "Programs",
    meta: "1 active",
    icon: Sparkles,
    to: "/program" as const,
    tone: "score-calm",
  },
  {
    label: "Assessments",
    meta: "7 available",
    icon: ChartNoAxesColumn,
    to: "/assessment" as const,
    tone: "score-mind",
  },
  {
    label: "Mood journal",
    meta: "Daily check-in",
    icon: Smile,
    to: "/journal" as const,
    tone: "score-rest",
  },
  {
    label: "Consult",
    meta: "5 consultants",
    icon: Heart,
    to: "/consult" as const,
    tone: "score-alert",
  },
];

const activity = [
  {
    title: "Unburn · Day 9 session",
    meta: "6 of 10 min listened",
    progress: 60,
    link: linkOptions({ to: "/program/$slug", params: { slug: "unburn" } }),
  },
  {
    title: "Sleep assessment",
    meta: "Struggling with quality sleep · 8 questions",
    progress: 0,
    link: linkOptions({
      to: "/assessment/$slug",
      params: { slug: "struggling-with-quality-sleep" },
    }),
  },
  {
    title: "Mood check-in",
    meta: "How are you feeling today?",
    progress: 0,
    link: linkOptions({ to: "/journal" }),
  },
];

const readForWeek = [
  { id: "98d536d4-938b-4fbf-bc2c-f37e6d0b9409", tag: "Burnout", img: resBurnout },
  { id: "c775a1e1-a938-4aac-8519-e5ad9f8dda1f", tag: "Sleep", img: resSleep },
  { id: "resource-1766237270444", tag: "Anxiety", img: resAnxiety },
].map((r) => ({ ...r, resource: getResource(r.id)! }));

function Index() {
  const hydrated = useHydrated();
  const { profile } = useProfile();
  const data = useEverything();
  const { unreadCount } = useNotifications();
  const who = hydrated ? profile : defaultProfile;
  const ctx = usePersonalContext(firstName(who), who.city || "Pune");
  const score = hydrated ? data.score : null;
  const band = score !== null ? wellnessBand(score) : null;
  const part = (k: string) => data.parts.find((x) => x.key === k)?.value ?? null;
  const rings = [
    { label: "Assess", value: hydrated ? part("assessments") : null, color: "var(--mind)" },
    { label: "Mood", value: hydrated ? part("mood") : null, color: "var(--rest)" },
    { label: "Programs", value: hydrated ? part("programs") : null, color: "var(--calm)" },
  ];
  useEffect(() => {
    if (score !== null) saveSnapshot(score);
  }, [score]);
  const scrollY = useScrollY();
  const collapsed = scrollY > 64;

  return (
    <IkanShell>
      {/* Ambient canvas tinted by time of day */}
      <div className={`ambient ambient-${ctx.dayPart}`} aria-hidden="true" />

      <div className={collapsed ? "sticky-bar sticky-bar-on" : "sticky-bar"}>
        <span className="avatar avatar-sm">{profileInitials(who)}</span>
        <span className="truncate font-display text-sm font-semibold">{ctx.greeting}</span>
        <span className="ml-auto text-xs font-semibold text-muted-foreground">{score ?? ""}</span>
      </div>

      <header className="relative px-5 pt-7">
        <div
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"
          style={{
            opacity: Math.max(0, 1 - scrollY / 140),
            transform: `translateY(${Math.min(scrollY * 0.25, 24)}px)`,
          }}
        >
          <div className="min-w-0">
            <p className="eyebrow flex flex-wrap items-center gap-1">
              <MapPin className="h-3 w-3" /> {ctx.city}
              {ctx.dateLabel ? <> · {ctx.dateLabel}</> : null} · <CloudSun className="h-3 w-3" />{" "}
              26°
            </p>
            <h1 className="mt-1 font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em]">
              {ctx.greeting}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{ctx.subline}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/notifications"
              aria-label={
                hydrated && unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"
              }
              className="relative grid h-11 w-11 place-items-center rounded-full bg-background/70 backdrop-blur transition-transform active:scale-95"
            >
              <Bell className="h-5 w-5" />
              {hydrated && unreadCount ? (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#B3261E] px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
            <Link to="/profile" aria-label="Profile" className="avatar-ring">
              <span className="avatar">{profileInitials(who)}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* iKAN wellness score — Google Health style rings */}
      <Reveal className="mt-5 px-5">
        <div className="surface overflow-hidden">
          <div className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-4 p-4">
            <div
              className="score-orb"
              style={{
                background: `conic-gradient(from 210deg, var(--calm) 0 ${score ?? 0}%, var(--secondary) ${score ?? 0}%)`,
              }}
            >
              <span>
                <strong>{score ?? "—"}</strong>
                <small>score</small>
              </span>
            </div>
            <div className="min-w-0">
              <p className="eyebrow">iKAN wellness score</p>
              <h2 className="mt-1 font-display text-base font-semibold leading-snug">
                {band ? band.label : "Your score starts with one check-in"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {score !== null
                  ? `Built from ${data.parts.filter((x) => x.value !== null).length} of 4 parts`
                  : "Log your mood or take an assessment"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 px-4 pb-4">
            {rings.map((r) => (
              <div key={r.label} className="ring-stat">
                <span
                  className="ring-dial"
                  style={{ ["--p" as string]: `${r.value ?? 0}%`, ["--c" as string]: r.color }}
                >
                  <i>{r.value === null ? "—" : Math.round(r.value)}</i>
                </span>
                <span className="ring-label">{r.label}</span>
              </div>
            ))}
          </div>
          <Link to="/wellness" className="row-link">
            See iKAN Wellness <ChevronRight className="h-4 w-4" />
          </Link>
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
            style={{
              transform: `translate3d(0, ${Math.min(scrollY * 0.06, 26)}px, 0) scale(1.12)`,
            }}
          />
          <div className="hero-veil" />
          <div className="relative">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <span className="hero-chip">Current program</span>
                <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.02em]">
                  Unburn
                </h2>
                <p className="mt-1 text-[11px] uppercase tracking-[.14em] opacity-70">
                  Day 9 · 31 days total
                </p>
              </div>
              <div className="hero-ring">
                <span>29%</span>
              </div>
            </div>
            <div className="hero-track mt-4">
              <i style={{ width: "29%" }} />
            </div>
            <p className="mt-3 text-sm opacity-85">
              Ready for your next session? Takes about 10 minutes.
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                asChild
                className="flex-1 rounded-full bg-background text-foreground transition-transform hover:bg-background/90 active:scale-[.97]"
              >
                <Link to="/program/$slug" params={{ slug: "unburn" }}>
                  <Play /> Start session
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="rounded-full border border-white/25 text-background hover:bg-white/10 hover:text-background"
              >
                <Link to="/program/$slug/journal" params={{ slug: "unburn" }}>
                  <CalendarCheck /> Progress
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Activity */}
      <Reveal className="mt-6 px-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="eyebrow">Pick up again</p>
            <h2 className="mt-1 font-display text-lg font-semibold tracking-[-0.01em]">
              Your activity
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">3 open</span>
        </div>
        <div className="surface divide-y divide-border">
          {activity.map((a) => (
            <Link
              key={a.title}
              {...a.link}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 transition-colors hover:bg-secondary/50"
            >
              <span className="activity-dial" style={{ ["--p" as string]: `${a.progress}%` }}>
                <span>{a.progress ? `${a.progress}%` : "New"}</span>
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.meta}</p>
              </div>
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background [&_svg]:h-4 [&_svg]:w-4"
              >
                {a.progress > 0 ? <Play /> : <ArrowUpRight />}
              </span>
            </Link>
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
              <Link
                key={o.label}
                to={o.to}
                className="surface tile flex flex-col gap-3 p-4"
                style={{ transitionDelay: `${i * 20}ms` }}
              >
                <span className={`score-tile ${o.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
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
            <div>
              <p className="eyebrow">Today’s check-in</p>
              <h2 className="mt-1 font-display text-base font-semibold">How are you feeling?</h2>
            </div>
            <span className="semantic-chip bg-secondary text-muted-foreground">40 sec</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Mood, energy and stress in a few quick taps.
          </p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {moodScale.map((m) => (
              <Link
                key={m.value}
                to="/journal"
                search={{ mood: m.value }}
                aria-label={m.label}
                className="flex flex-col items-center gap-1 rounded-2xl bg-secondary py-2 transition-transform active:scale-95"
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {m.emoji}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">{m.label}</span>
              </Link>
            ))}
          </div>
          <Button
            asChild
            className="mt-3 w-full rounded-full transition-transform active:scale-[.98]"
          >
            <Link to="/journal">
              <Plus /> Log today’s mood
            </Link>
          </Button>
        </div>
      </Reveal>

      {/* Health sync */}
      <Reveal className="mt-4 px-5">
        <div className="rounded-[22px] border border-mind/25 bg-mind-soft p-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-background text-mind-strong">
              <Watch className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow text-mind-strong">Connect your data</p>
              <h2 className="mt-1 font-display text-sm font-semibold">
                Sync sleep & steps automatically
              </h2>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" className="h-10 rounded-full">
              <Activity /> Google Fit
            </Button>
            <Button variant="secondary" size="sm" className="h-10 rounded-full">
              <Heart /> Health Connect
            </Button>
          </div>
        </div>
      </Reveal>

      {/* Support */}
      <Reveal className="mt-4 px-5">
        <div className="rounded-[22px] border border-alert/25 bg-alert-soft p-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-background text-alert-strong">
              <Heart className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow text-alert-strong">Support</p>
              <h2 className="mt-1 font-display text-sm font-semibold">Let’s talk about it</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Therapists available near {ctx.city}, today 6–9 PM.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="support"
            className="mt-3 w-full rounded-full transition-transform active:scale-[.98]"
          >
            <Link to="/consult">
              <CalendarDays /> Book a consultation
            </Link>
          </Button>
        </div>
      </Reveal>

      {/* Resources */}
      <Reveal className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="eyebrow">Resources</p>
            <h2 className="mt-1 font-display text-lg font-semibold tracking-[-0.01em]">
              Read for your week
            </h2>
          </div>
          <Link to="/resources" className="text-xs font-semibold text-foreground">
            See all
          </Link>
        </div>
        <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
          {readForWeek.map((r) => (
            <Link key={r.id} to="/resources" className="read-card snap-start">
              <img src={r.img} alt="" aria-hidden="true" loading="lazy" width={816} height={816} />
              <div className="read-veil" />
              <div className="read-body">
                <span className="read-tag">
                  <BookOpen className="h-3 w-3" /> {r.tag}
                </span>
                <strong className="line-clamp-3">{r.resource.title}</strong>
                <span className="read-meta">{r.resource.minutes} min read</span>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal className="mx-5 mt-6 rounded-[22px] border border-border bg-secondary/45 p-4">
        <p className="font-display text-sm font-semibold">For you, not everyone</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          This screen shifts with your local time, weather and city — and reorders itself around the
          check-ins, assessments and sessions you actually finish.
        </p>
      </Reveal>
    </IkanShell>
  );
}
