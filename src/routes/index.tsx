import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Flame,
  LifeBuoy,
  Play,
  Watch,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Illustration } from "@/components/art";
import { accentStyle, stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { BandChip, toneColors } from "@/components/assessment/ui";
import { useHydrated } from "@/hooks/use-hydrated";
import { useScrollY } from "@/hooks/use-personal-context";
import { cn } from "@/lib/utils";
import { saveSnapshot, useEverything, useWellnessSnapshots, wellnessBand } from "@/lib/activity";
import { getAssessment } from "@/lib/assessment/instruments";
import { headlineOf, recommendationsFor, riskEndorsed, scoreAll } from "@/lib/assessment/scoring";
import { getProgramme, programmes } from "@/lib/equip/programs";
import { addDays, dayKey, moodScale } from "@/lib/journal";
import { useNotifications } from "@/lib/notifications";
import { firstName, profileInitials, useProfile, useSettings } from "@/lib/profile";
import { resources, type Resource } from "@/lib/resources";
import resAnxiety from "@/assets/res-anxiety.jpg";
import resBurnout from "@/assets/res-burnout.jpg";
import resSleep from "@/assets/res-sleep.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta("Home", "What to do today, your iKAN Score, programs, mood and reading in one place."),
  component: Home,
});

type Data = ReturnType<typeof useEverything>;

/* ---------- time of day ---------- */

type Part = "dawn" | "morning" | "afternoon" | "evening" | "night";
const partOf = (h: number): Part =>
  h >= 5 && h < 8
    ? "dawn"
    : h >= 8 && h < 12
      ? "morning"
      : h >= 12 && h < 17
        ? "afternoon"
        : h >= 17 && h < 20
          ? "evening"
          : "night";

/* The prototype's time-of-day tokens. */
const sky: Record<
  Part,
  { from: string; via: string; to: string; ink: string; muted: string; greet: string }
> = {
  dawn: {
    from: "#FFE4C9",
    via: "#FFD0A0",
    to: "#FFC085",
    ink: "#3A2210",
    muted: "#6E4A2E",
    greet: "Good morning",
  },
  morning: {
    from: "#E8F4FD",
    via: "#D4ECFB",
    to: "#B8DFF7",
    ink: "#12263A",
    muted: "#44607A",
    greet: "Good morning",
  },
  afternoon: {
    from: "#FFF8E1",
    via: "#FFE9B0",
    to: "#FFD97A",
    ink: "#3A2A05",
    muted: "#6E5820",
    greet: "Good afternoon",
  },
  evening: {
    from: "#E8D5F5",
    via: "#D4B8EA",
    to: "#C09FDE",
    ink: "#2A1740",
    muted: "#58446F",
    greet: "Good evening",
  },
  night: {
    from: "#2A2A3E",
    via: "#1E1E30",
    to: "#151525",
    ink: "#E8E8F0",
    muted: "#A0A0C0",
    greet: "Winding down",
  },
};

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

const covers: Record<string, string> = {
  "98d536d4-938b-4fbf-bc2c-f37e6d0b9409": resBurnout,
  "c775a1e1-a938-4aac-8519-e5ad9f8dda1f": resSleep,
  "resource-1766237270444": resAnxiety,
};

function Home() {
  const hydrated = useHydrated();
  const now = useNow();
  const scrollY = useScrollY();
  const { profile } = useProfile();
  const data = useEverything();
  const { unreadCount } = useNotifications();
  const score = hydrated ? data.score : null;

  useEffect(() => {
    if (score !== null) saveSnapshot(score);
  }, [score]);

  const part = now ? partOf(now.getHours()) : "morning";
  const name = hydrated ? firstName(profile) : "";
  const greeting = `${sky[part].greet}${name && name !== "there" ? `, ${name}` : ""}`;

  return (
    <IkanShell>
      <div
        className={cn("sticky-bar", scrollY > 150 && "sticky-bar-on")}
        aria-hidden={scrollY <= 150}
      >
        <span className="avatar avatar-sm">{hydrated ? profileInitials(profile) : ""}</span>
        <span className="truncate font-display text-sm font-semibold">{greeting}</span>
        {score !== null ? (
          <Link to="/wellness" className="ml-auto text-xs font-semibold text-muted-foreground">
            iKAN Score {score}
          </Link>
        ) : null}
      </div>

      <SkyHeader
        now={now}
        part={part}
        greeting={greeting}
        city={hydrated ? profile.city : ""}
        unread={hydrated ? unreadCount : 0}
        initials={hydrated ? profileInitials(profile) : ""}
        data={data}
        hydrated={hydrated}
      />

      <div className="relative z-10 -mt-6 space-y-8 rounded-t-[28px] bg-background pb-4 pt-5">
        <TodayCard data={data} hydrated={hydrated} />
        <ScoreCard score={score} data={data} hydrated={hydrated} />
        <Recommended data={data} hydrated={hydrated} />
        <YourPrograms data={data} hydrated={hydrated} />
        <ThisWeek data={data} hydrated={hydrated} />
        <Library />
        <RecentResults data={data} hydrated={hydrated} />
        <HealthCard />
      </div>
    </IkanShell>
  );
}

/* ---------- sky header ---------- */

function SkyHeader({
  now,
  part,
  greeting,
  city,
  unread,
  initials,
  data,
  hydrated,
}: {
  now: Date | null;
  part: Part;
  greeting: string;
  city: string;
  unread: number;
  initials: string;
  data: Data;
  hydrated: boolean;
}) {
  const s = sky[part];
  const hour = now ? now.getHours() + now.getMinutes() / 60 : 9;
  const isDay = hour >= 6 && hour < 18;
  // where the sun (06:00–18:00) or moon (18:00–06:00) sits on its arc right now
  const t = isDay ? (hour - 6) / 12 : ((hour + 24 - 18) % 24) / 12;
  const angle = Math.PI * (1 - t);
  const cx = 160 + 130 * Math.cos(angle);
  const cy = 118 - 92 * Math.sin(angle);
  const night = part === "night";

  const loggedToday =
    hydrated && now ? data.journal.entries.some((e) => e.date === dayKey(now)) : false;
  const weekCount = hydrated
    ? data.events.filter((e) => new Date(e.at) >= addDays(new Date(), -6)).length
    : 0;
  const subline = !hydrated
    ? ""
    : data.events.length === 0
      ? "Let’s find a good place to start."
      : loggedToday
        ? `${weekCount} ${weekCount === 1 ? "thing" : "things"} done this week.`
        : "You haven’t checked in today yet.";

  return (
    <header
      className="relative overflow-hidden px-5 pb-14 pt-6 transition-colors duration-1000"
      style={{
        background: `linear-gradient(160deg, ${s.from}, ${s.via} 50%, ${s.to})`,
        color: s.ink,
      }}
    >
      <svg
        viewBox="0 0 320 140"
        preserveAspectRatio="xMidYMax slice"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] w-full"
        aria-hidden="true"
      >
        <path
          d="M30 118 A130 92 0 0 1 290 118"
          fill="none"
          stroke={s.ink}
          strokeOpacity="0.16"
          strokeDasharray="2 5"
        />
        {night
          ? [
              [40, 30],
              [80, 58],
              [120, 22],
              [210, 40],
              [262, 24],
              [290, 66],
              [180, 70],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 3 ? 1.2 : 1.8} fill="#FBBF24" opacity="0.85" />
            ))
          : null}
        {now ? (
          isDay ? (
            <g className="motion-safe:transition-transform">
              <circle
                cx={cx}
                cy={cy}
                r="24"
                fill={part === "evening" ? "#FF8C42" : "#FFB347"}
                opacity="0.22"
              />
              <circle
                cx={cx}
                cy={cy}
                r="13"
                fill={part === "evening" ? "#FF8C42" : part === "dawn" ? "#FFB347" : "#FFC83D"}
              />
            </g>
          ) : (
            <g>
              <circle cx={cx} cy={cy} r="13" fill="#E8E4D4" />
              <circle cx={cx + 5} cy={cy - 4} r="11" fill={s.via} />
            </g>
          )
        ) : null}
        <path
          d="M0 140 L0 124 C 70 112, 140 132, 210 120 S 300 112, 320 118 L320 140 Z"
          fill={s.ink}
          fillOpacity="0.06"
        />
      </svg>

      <div className="relative flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="min-h-5 text-[13px] font-medium" style={{ color: s.muted }}>
            {now
              ? now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
              : ""}
            {city ? `, ${city}` : ""}
          </p>
          <h1 className="mt-1 font-display text-[30px] font-semibold leading-9 tracking-[-0.01em]">
            {greeting}
          </h1>
          <p className="mt-1 min-h-5 text-[14px]" style={{ color: s.muted }}>
            {subline}
          </p>
        </div>
        <Link
          to="/notifications"
          aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-transform active:scale-95"
          style={{ background: night ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.65)" }}
        >
          <Bell className="h-5 w-5" />
          {unread ? (
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#B3261E] px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          ) : null}
        </Link>
        <Link
          to="/profile"
          aria-label="Profile"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-[14px] font-semibold transition-transform active:scale-95"
          style={{
            background: night ? "rgba(255,255,255,.18)" : "#FFFFFF",
            color: night ? s.ink : "#151515",
          }}
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}

/* ---------- today: one next step ---------- */

function TodayCard({ data, hydrated }: { data: Data; hydrated: boolean }) {
  if (!hydrated) return <div className="mx-4 h-[176px] rounded-[28px] bg-secondary" />;

  const latest = [...data.results].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
  const latestA = latest ? getAssessment(latest.slug) : undefined;
  const risk = latest && latestA ? riskEndorsed(latestA, latest.answers) : false;
  const today = dayKey(new Date());
  const loggedToday = data.journal.entries.some((e) => e.date === today);
  const draft = data.drafts[0];
  const active = programmes
    .map((p) => {
      const s = data.programmeStates[p.slug]!;
      let next = 0;
      while (s.completed.includes(next)) next += 1;
      const doneToday = Object.values(s.completedAt ?? {}).some(
        (at) => dayKey(new Date(at)) === today,
      );
      return { p, s, next, day: p.days.find((d) => d.day === next), doneToday };
    })
    .filter((x) => x.s.completed.length > 0 && x.day)
    .sort((a, b) => b.s.completed.length - a.s.completed.length)[0];

  if (risk) {
    return (
      <Link
        to="/support"
        className={cn(
          "mx-4 flex items-center gap-4 rounded-[28px] bg-[#F9DEDC] p-5 text-[#5A1410]",
          stateLayer,
        )}
      >
        <LifeBuoy className="h-8 w-8 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[19px] font-semibold leading-6">
            You don’t have to carry this alone
          </span>
          <span className="mt-1 block text-[14px] leading-5">
            Free, confidential helplines are open right now.
          </span>
        </span>
        <ChevronRight className="h-5 w-5" />
      </Link>
    );
  }

  if (draft?.assessment) {
    const a = draft.assessment;
    return (
      <NextStep
        label="Pick up where you left off"
        title={`Finish your ${a.name.toLowerCase()} assessment`}
        meta={`${draft.answered} of ${a.questions.length} answered`}
        progress={(draft.answered / a.questions.length) * 100}
        art="checkup"
        cta="Continue"
        link={{ to: "/assessment-flow", search: { id: a.slug } }}
      />
    );
  }

  if (!loggedToday) {
    return (
      <section className="mx-4 rounded-[28px] bg-foreground p-5 text-background">
        <p className="text-[13px] opacity-70">Today’s check-in</p>
        <p className="mt-1 font-display text-[22px] font-semibold leading-7">
          How are you feeling?
        </p>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {moodScale.map((m) => (
            <Link
              key={m.value}
              to="/journal"
              search={{ mood: m.value }}
              aria-label={`Log mood: ${m.label}`}
              className="group flex flex-col items-center gap-1.5 rounded-[18px] bg-white/10 py-3 transition-[transform,background-color] hover:bg-white/20 active:scale-95"
            >
              <span
                className="text-[28px] leading-none transition-transform group-hover:scale-110 motion-reduce:transform-none"
                aria-hidden="true"
              >
                {m.emoji}
              </span>
              <span className="text-[11px] font-medium opacity-80">{m.label}</span>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-[12px] opacity-60">Tap one to start. It takes about 30 seconds.</p>
      </section>
    );
  }

  if (active && !active.doneToday) {
    const done = Math.min(new Set(active.s.completed).size, active.p.days.length);
    return (
      <NextStep
        label={active.p.name}
        title={`Day ${active.next}: ${active.day!.title}`}
        meta={`${done} of ${active.p.days.length} days done`}
        progress={(done / active.p.days.length) * 100}
        image={active.p.cover}
        cta="Start today’s session"
        link={{
          to: "/program/$slug/day/$day",
          params: { slug: active.p.slug, day: String(active.next) },
        }}
      />
    );
  }

  if (data.results.length === 0) {
    const g = getAssessment("unsure-or-general-concern")!;
    return (
      <NextStep
        label="A good first step"
        title="See where you stand today"
        meta={`${g.questions.length} short questions, about ${g.minutes} min`}
        art="measure"
        cta="Take a short check"
        link={{ to: "/assessment/$slug", params: { slug: g.slug } }}
      />
    );
  }

  return (
    <section className="mx-4 flex items-center gap-4 rounded-[28px] bg-[#DFF0E8] p-5 text-[#173D2F]">
      <span className="text-[34px] leading-none" aria-hidden="true">
        🌿
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[19px] font-semibold">You’re done for today</span>
        <span className="mt-0.5 block text-[14px]">Check-in logged. See you tomorrow.</span>
      </span>
    </section>
  );
}

function NextStep({
  label,
  title,
  meta,
  progress,
  image,
  art,
  cta,
  link,
}: {
  label: string;
  title: string;
  meta: string;
  progress?: number;
  image?: string;
  art?: "checkup" | "measure";
  cta: string;
  link:
    | { to: "/assessment-flow"; search: { id: string } }
    | { to: "/program/$slug/day/$day"; params: { slug: string; day: string } }
    | { to: "/assessment/$slug"; params: { slug: string } };
}) {
  return (
    <Link
      {...link}
      className={cn(
        "mx-4 block overflow-hidden rounded-[28px] bg-foreground text-background",
        stateLayer,
      )}
    >
      <div className="relative h-28 overflow-hidden">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover opacity-80" />
        ) : art ? (
          <Illustration art={art} />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground to-transparent" />
        <span className="absolute left-5 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur">
          {label}
        </span>
      </div>
      <div className="px-5 pb-5">
        <p className="font-display text-[21px] font-semibold leading-7">{title}</p>
        <p className="mt-1 text-[13px] opacity-70">{meta}</p>
        {progress !== undefined ? (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
          </div>
        ) : null}
        <span className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-background px-5 text-[15px] font-semibold text-foreground">
          <Play className="h-4 w-4" /> {cta}
        </span>
      </div>
    </Link>
  );
}

/* ---------- sections ---------- */

function Section({
  title,
  note,
  action,
  children,
}: {
  title: string;
  note?: string;
  action?: { label: string; to: "/program" | "/resources" | "/assessments" | "/journal" };
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 px-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-[18px] font-semibold">{title}</h2>
          {action ? (
            <Link
              to={action.to}
              className="shrink-0 text-[14px] font-semibold text-muted-foreground hover:text-foreground"
            >
              {action.label}
            </Link>
          ) : null}
        </div>
        {note ? <p className="mt-0.5 text-[13px] text-muted-foreground">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ScoreCard({
  score,
  data,
  hydrated,
}: {
  score: number | null;
  data: Data;
  hydrated: boolean;
}) {
  const snapshots = useWellnessSnapshots();
  const weekAgo = Object.entries(snapshots)
    .filter(([k]) => k <= dayKey(addDays(new Date(), -7)))
    .sort(([a], [b]) => b.localeCompare(a))[0]?.[1];
  const band = score !== null ? wellnessBand(score) : null;
  const change = score !== null && weekAgo !== undefined ? score - weekAgo : null;
  const r = 30;
  const c = 2 * Math.PI * r;
  const sources = data.parts.filter((p) => p.value !== null).length;

  return (
    <Link
      to="/wellness"
      className={cn(
        "mx-4 flex items-center gap-4 rounded-[24px] border border-foreground/10 p-4",
        stateLayer,
      )}
    >
      <span className="relative h-[76px] w-[76px] shrink-0">
        <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle
            cx="38"
            cy="38"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="8"
          />
          {score !== null && band ? (
            <circle
              cx="38"
              cy="38"
              r={r}
              fill="none"
              stroke={toneColors[band.tone].bar}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - score / 100)}
              className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
            />
          ) : null}
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-[22px] font-bold tabular-nums">
          {score ?? "—"}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] text-muted-foreground">iKAN Score</span>
        <span className="block font-display text-[19px] font-semibold leading-6">
          {band ? band.label : hydrated ? "Starts with your first check-in" : ""}
        </span>
        <span className="mt-0.5 block text-[13px] text-muted-foreground">
          {score === null
            ? "Mood, assessments and programs all count"
            : change === null
              ? `From ${sources} of 4 sources`
              : change === 0
                ? "Same as last week"
                : `${change > 0 ? "Up" : "Down"} ${Math.abs(change)} since last week`}
        </span>
      </span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}

function Recommended({ data, hydrated }: { data: Data; hydrated: boolean }) {
  if (!hydrated) return null;
  const latest = [...data.results].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
  const a = latest ? getAssessment(latest.slug) : undefined;
  if (!latest || !a) return null;
  const scores = scoreAll(a, latest.answers);
  const head = headlineOf(a, scores);
  const recs = recommendationsFor(a, scores)
    .map(getProgramme)
    .filter((p) => p !== undefined)
    .slice(0, 2);
  const serious = scores.some((s) => s.band?.tone === "error");
  if (!recs.length && !serious) return null;

  return (
    <Section
      title="Recommended for you"
      note={`Based on your ${a.name.toLowerCase()} result${head?.band ? `: ${head.band.label}` : ""}`}
    >
      <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 pb-1">
        {serious ? (
          <Link
            to="/consult"
            className="flex w-[230px] shrink-0 snap-start flex-col justify-between rounded-[24px] bg-[#E3ECF8] p-4 text-[#1C3553]"
          >
            <CalendarCheck className="h-7 w-7" />
            <span className="mt-8">
              <span className="block font-display text-[17px] font-semibold leading-6">
                Talk to a professional
              </span>
              <span className="mt-1 block text-[13px] leading-5 opacity-80">
                Therapists and counselors you can book this week.
              </span>
            </span>
          </Link>
        ) : null}
        {recs.map((p) => (
          <Link
            key={p.slug}
            to="/program/$slug"
            params={{ slug: p.slug }}
            className="relative block h-[180px] w-[264px] shrink-0 snap-start overflow-hidden rounded-[24px] text-white"
          >
            <img src={p.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-4">
              <span className="block text-[12px] font-semibold opacity-80">
                {p.source.meta.days}
              </span>
              <span className="block font-display text-[20px] font-semibold">{p.name}</span>
              {p.source.description ? (
                <span className="mt-0.5 line-clamp-2 block text-[12px] leading-4 opacity-85">
                  {p.source.description}
                </span>
              ) : null}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function YourPrograms({ data, hydrated }: { data: Data; hydrated: boolean }) {
  const started = hydrated
    ? programmes.filter((p) => data.programmeStates[p.slug]!.completed.length > 0)
    : [];
  return (
    <Section
      title={started.length ? "Your programs" : "Programs"}
      action={{ label: "See all", to: "/program" }}
    >
      {started.length ? (
        <ul className="space-y-2 px-4">
          {started.map((p) => {
            const s = data.programmeStates[p.slug]!;
            const done = Math.min(new Set(s.completed).size, p.days.length);
            return (
              <li key={p.slug}>
                <Link
                  to="/program/$slug"
                  params={{ slug: p.slug }}
                  style={accentStyle(p.accent)}
                  className={cn(
                    "flex items-center gap-3 rounded-[20px] bg-secondary p-2.5 pr-4",
                    stateLayer,
                  )}
                >
                  <img
                    src={p.cover}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-[14px] object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-display text-[16px] font-semibold">
                        {p.name}
                      </span>
                      <span className="text-[12px] tabular-nums text-muted-foreground">
                        {done} of {p.days.length} days
                      </span>
                    </span>
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[var(--accent-container)]">
                      <span
                        className="block h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${(done / p.days.length) * 100}%` }}
                      />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 pb-1">
          {programmes.map((p) => (
            <Link
              key={p.slug}
              to="/program/$slug"
              params={{ slug: p.slug }}
              className="w-[152px] shrink-0 snap-start"
            >
              <img src={p.cover} alt="" className="h-[112px] w-full rounded-[20px] object-cover" />
              <span className="mt-2 block font-display text-[15px] font-semibold">{p.name}</span>
              <span className="block text-[12px] text-muted-foreground">{p.source.meta.days}</span>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}

function ThisWeek({ data, hydrated }: { data: Data; hydrated: boolean }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i - 6));
  const byDay = days.map((d) => {
    const list = hydrated ? data.journal.entries.filter((e) => e.date === dayKey(d)) : [];
    return list.length ? Math.round(list.reduce((n, e) => n + e.mood, 0) / list.length) : null;
  });
  let run = 0;
  if (hydrated) {
    const set = new Set(data.journal.entries.map((e) => e.date));
    let cursor = set.has(dayKey(new Date())) ? new Date() : addDays(new Date(), -1);
    while (set.has(dayKey(cursor))) {
      run += 1;
      cursor = addDays(cursor, -1);
    }
  }
  const logged = byDay.filter((v) => v !== null).length;

  return (
    <Section title="This week" action={{ label: "Journal", to: "/journal" }}>
      <Link
        to="/journal"
        className={cn("mx-4 block rounded-[24px] border border-foreground/10 p-4", stateLayer)}
      >
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const m = byDay[i] ?? null;
            const isToday = i === 6;
            return (
              <span key={i} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn("text-[11px]", isToday ? "font-bold" : "text-muted-foreground")}
                >
                  {d.toLocaleDateString("en-IN", { weekday: "narrow" })}
                </span>
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full text-[20px]",
                    m === null ? "border border-dashed border-foreground/20" : "bg-[#F9E2E9]",
                    isToday && m === null && "border-foreground/50",
                  )}
                >
                  {m !== null ? (
                    <span aria-label={moodScale[m - 1]!.label}>{moodScale[m - 1]!.emoji}</span>
                  ) : null}
                </span>
              </span>
            );
          })}
        </div>
        <p className="mt-3 flex items-center gap-2 text-[13px] text-muted-foreground">
          {run > 0 ? <Flame className="h-4 w-4 text-[#C4552E]" /> : null}
          {run > 0
            ? `${run}-day run, ${logged} of 7 days logged`
            : logged
              ? `${logged} of 7 days logged`
              : "Your week fills in as you check in."}
        </p>
      </Link>
    </Section>
  );
}

function Library() {
  const picks: Resource[] = [
    ...resources.filter((r) => covers[r.id]),
    ...resources.filter((r) => !covers[r.id] && r.featured),
  ].slice(0, 5);
  return (
    <Section title="From the library" action={{ label: "See all", to: "/resources" }}>
      <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 pb-1">
        {picks.map((r) => (
          <Link key={r.id} to="/resources" className="w-[200px] shrink-0 snap-start">
            <span className="block h-[124px] overflow-hidden rounded-[20px]">
              {covers[r.id] ? (
                <img src={covers[r.id]} alt="" className="h-full w-full object-cover" />
              ) : (
                <Illustration art={r.art} />
              )}
            </span>
            <span className="mt-2 block text-[12px] font-semibold text-muted-foreground">
              {r.category}, {r.minutes} min read
            </span>
            <span className="mt-0.5 line-clamp-2 block text-[14px] font-semibold leading-5">
              {r.title}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function RecentResults({ data, hydrated }: { data: Data; hydrated: boolean }) {
  if (!hydrated || !data.results.length) return null;
  const recent = [...data.results]
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))
    .slice(0, 3);
  return (
    <Section title="Recent results" action={{ label: "History", to: "/assessments" }}>
      <ul className="mx-4 overflow-hidden rounded-[24px] bg-secondary">
        {recent.map((r) => {
          const a = getAssessment(r.slug);
          if (!a) return null;
          const head = headlineOf(a, scoreAll(a, r.answers));
          return (
            <li key={r.id} className="border-b border-background last:border-0">
              <Link
                to="/result/$slug"
                params={{ slug: a.slug }}
                search={{ r: r.id }}
                className={cn("flex min-h-16 items-center gap-3 px-4 py-3", stateLayer)}
              >
                <ClipboardList className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{a.title}</span>
                  <span className="block text-[12px] text-muted-foreground">
                    {new Date(r.completedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </span>
                {head?.band ? (
                  <BandChip label={head.band.label} tone={head.band.tone} />
                ) : (
                  <span className="text-[12px] text-muted-foreground">5 scores</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function HealthCard() {
  const { settings } = useSettings();
  const hydrated = useHydrated();
  if (hydrated && settings.healthConnect) return null;
  return (
    <Link
      to="/settings"
      className={cn(
        "mx-4 flex items-center gap-3 rounded-[24px] border border-dashed border-foreground/20 p-4",
        stateLayer,
      )}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#FBEFD2] text-[#7A5A12]">
        <Watch className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">Add sleep and steps</span>
        <span className="block text-[13px] text-muted-foreground">
          Connect Health Connect so they count in your score
        </span>
      </span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}
