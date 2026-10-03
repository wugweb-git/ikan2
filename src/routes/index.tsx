import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  MapPin,
  CloudSun,
  Clock3,
  UserRoundPen,
  X,
  Bell,
  CalendarDays,
  ChartNoAxesColumn,
  Heart,
  Plus,
  Smile,
  Sparkles,
  CalendarCheck,
  ChevronRight,
  Flame,
  LifeBuoy,
  Play,
  Watch,
} from "lucide-react";
import { DateText } from "@/components/date-text";
import { IkanShell } from "@/components/ikan-shell";
import { ProfilePhoto } from "@/components/profile-photo";
import { Illustration } from "@/components/art";
import { accentStyle, stateLayer } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { BandChip, toneColors } from "@/components/assessment/ui";
import { useHydrated } from "@/hooks/use-hydrated";
import { useScrollY } from "@/hooks/use-personal-context";
import { cn } from "@/lib/utils";
import { saveSnapshot, useEverything, useWellnessSnapshots, wellnessBand } from "@/lib/activity";
import { getAssessment } from "@/lib/assessment/instruments";
import {
  dismissReassess,
  reassessCopy,
  reassessDismissed,
  reassessReason,
} from "@/lib/assessment/reassess";
import { headlineOf, recommendationsFor, riskEndorsed, scoreAll } from "@/lib/assessment/scoring";
import { dayCount, daysDoneOf, getProgramme, minutesOf, programmes } from "@/lib/equip/programs";
import { consultants } from "@/lib/consultants";
import { addDays, dayKey, moodScale } from "@/lib/journal";
import { useNotifications } from "@/lib/notifications";
import {
  aboutYouComplete,
  cityName,
  firstName,
  profileInitials,
  useProfile,
  useSettings,
} from "@/lib/profile";
import { checkMoodReminder, refreshWeather, useDevice, weatherWord } from "@/lib/device";
import { syncMoodReminder } from "@/lib/local-reminders";
import { enableNativePush, nativePushSupported } from "@/lib/native-push";
import { autoSyncHealthConnect, recentAverage, useHealthConnect } from "@/lib/health-connect";
import {
  lengthLabel,
  mediumIcon,
  mediumLabel,
  mediumOf,
  resources,
  slugOf,
  type Resource,
} from "@/lib/resources";
import resAnxiety from "@/assets/res-anxiety.jpg";
import resBurnout from "@/assets/res-burnout.jpg";
import resSleep from "@/assets/res-sleep.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta(
      "Home",
      "What to do today, your iKAN Score, programs, mood and reading in one place.",
      "/",
    ),
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

  const device = useDevice();
  const { settings } = useSettings();
  useEffect(() => {
    if (!hydrated) return;
    void refreshWeather();
    void autoSyncHealthConnect();
    const prefs = { moodReminder: settings.moodReminders, time: settings.moodReminderTime };
    // Each platform uses the channel that actually reaches it: web push in browsers and on an
    // iPhone home screen, FCM in the Android app, where Web Push does not exist.
    if (nativePushSupported()) {
      if (!device.notificationsOff) void enableNativePush(prefs);
    } else if (Notification?.permission === "granted" && !device.notificationsOff) {
      void import("@/lib/push").then((m) => m.enablePush(prefs));
    }
    checkMoodReminder({
      enabled: settings.moodReminders,
      time: settings.moodReminderTime,
      loggedToday: data.journal.entries.some((e) => e.date === dayKey(new Date())),
    });
    // The Android app can't use web push, so the same reminder is scheduled on the phone.
    void syncMoodReminder({ enabled: settings.moodReminders, time: settings.moodReminderTime });
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-schedule whenever the reminder setting changes, not only on first load.
  useEffect(() => {
    if (!hydrated) return;
    void syncMoodReminder({ enabled: settings.moodReminders, time: settings.moodReminderTime });
  }, [hydrated, settings.moodReminders, settings.moodReminderTime]);
  const city = hydrated ? cityName(profile.city) || device.location?.city || "" : "";

  const part = now ? partOf(now.getHours()) : "morning";
  const name = hydrated ? firstName(profile) : "";
  const greeting = `${sky[part].greet}${name && name !== "there" ? `, ${name}` : ""}`;

  return (
    <IkanShell>
      <div
        className={cn("sticky-bar", scrollY > 150 && "sticky-bar-on")}
        aria-hidden={scrollY <= 150}
      >
        <span className="avatar avatar-sm overflow-hidden">
          <ProfilePhoto src={hydrated ? profile.avatar : undefined}>
            {hydrated ? profileInitials(profile) : ""}
          </ProfilePhoto>
        </span>
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
        city={city}
        weather={hydrated && device.weather ? device.weather : undefined}
        unread={hydrated ? unreadCount : 0}
        initials={hydrated ? profileInitials(profile) : ""}
        photo={hydrated ? profile.avatar : undefined}
        data={data}
        hydrated={hydrated}
      />

      <div className="relative z-10 -mt-6 space-y-8 rounded-t-[28px] bg-background pb-4 pt-5">
        <TodayCard data={data} hydrated={hydrated} />
        {hydrated && !aboutYouComplete(profile) ? <AboutYouPrompt /> : null}
        <ReassessPrompt data={data} hydrated={hydrated} />
        <ScoreCard score={score} data={data} hydrated={hydrated} />
        <HealthCard />
        <CurrentProgram data={data} hydrated={hydrated} />
        <PickUp data={data} hydrated={hydrated} />
        <Recommended data={data} hydrated={hydrated} />
        <Offerings data={data} hydrated={hydrated} />
        <MoodCheckin data={data} hydrated={hydrated} />
        <SupportCard city={city} />
        <YourPrograms data={data} hydrated={hydrated} />
        <ThisWeek data={data} hydrated={hydrated} />
        <Library />
        <RecentResults data={data} hydrated={hydrated} />
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
  weather,
  unread,
  initials,
  photo,
  data,
  hydrated,
}: {
  now: Date | null;
  part: Part;
  greeting: string;
  city: string;
  weather?: { temp: number; code: number } | undefined;
  unread: number;
  initials: string;
  photo?: string | undefined;
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
      className="relative overflow-hidden px-5 pb-14 pt-[max(2.5rem,calc(var(--safe-top,env(safe-area-inset-top))+1.5rem))] transition-colors duration-1000"
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
          <p
            className="type-body-sm font-medium flex min-h-5 flex-wrap items-center gap-x-3"
            style={{ color: s.muted }}
          >
            <span>
              {now
                ? now.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })
                : ""}
            </span>
            {city ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {city}
              </span>
            ) : null}
            {weather ? (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <CloudSun className="h-3.5 w-3.5" aria-hidden="true" /> {weather.temp}°{" "}
                {weatherWord(weather.code)}
              </span>
            ) : null}
          </p>
          <h1 className="mt-1 font-display text-[30px] font-semibold leading-9 tracking-[-0.01em]">
            {greeting}
          </h1>
          <p className="type-body-md mt-1 min-h-5" style={{ color: s.muted }}>
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
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-error px-1 text-[10px] font-bold text-on-error">
              {unread}
            </span>
          ) : null}
        </Link>
        <Link
          to="/profile"
          aria-label="Profile"
          className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full font-display text-[14px] font-semibold transition-transform active:scale-95"
          style={{
            background: night ? "rgba(255,255,255,.18)" : "#FFFFFF",
            color: night ? s.ink : "#151515",
          }}
        >
          <ProfilePhoto src={photo}>{initials}</ProfilePhoto>
        </Link>
      </div>
    </header>
  );
}

/* ---------- ask for missing profile details, until done or dismissed ---------- */

function AboutYouPrompt() {
  const key = "ikan.about-you.dismissed";
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    try {
      setHidden(Boolean(window.localStorage.getItem(key)));
    } catch {
      setHidden(false);
    }
  }, []);
  if (hidden) return null;
  return (
    <div className="mx-4 flex items-center gap-3 rounded-[24px] border border-foreground/10 p-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary">
        <UserRoundPen className="h-5 w-5" />
      </span>
      <Link to="/welcome" search={{ step: "about" }} className="min-w-0 flex-1">
        <span className="type-action block">Finish your profile</span>
        <span className="type-body-sm block text-muted-foreground">
          Date of birth, city and a few details, so suggestions fit you.
        </span>
      </Link>
      <button
        type="button"
        aria-label="Not now"
        onClick={() => {
          try {
            window.localStorage.setItem(key, new Date().toISOString());
          } catch {
            /* storage unavailable */
          }
          setHidden(true);
        }}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ---------- health data from Health Connect ---------- */

function HealthCard() {
  const hydrated = useHydrated();
  const h = useHealthConnect();
  if (!hydrated) return null;
  const steps = recentAverage(h.days, "steps");
  const sleep = recentAverage(h.days, "sleep_minutes");
  const rhr = recentAverage(h.days, "resting_heart_rate");
  const tiles = [
    steps ? { v: Math.round(steps).toLocaleString("en-IN"), l: "steps a day" } : null,
    sleep
      ? { v: `${Math.floor(sleep / 60)}h ${Math.round(sleep % 60)}m`, l: "sleep a night" }
      : null,
    rhr ? { v: `${Math.round(rhr)}`, l: "resting bpm" } : null,
  ].filter((t): t is { v: string; l: string } => Boolean(t));

  if (tiles.length) {
    return (
      <section className="mx-4 rounded-[24px] bg-secondary p-4">
        <div className="flex items-center gap-2">
          <Watch className="h-5 w-5" />
          <h2 className="type-title-md flex-1">Your last 7 days</h2>
          <Link to="/settings" className="type-body-sm font-semibold text-muted-foreground">
            Health Connect
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {tiles.map((t) => (
            <div key={t.l} className="rounded-[16px] bg-background p-3">
              <p className="type-subhead tabular-nums">{t.v}</p>
              <p className="type-label-md text-muted-foreground">{t.l}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // on the website there is nothing to connect yet, so no card
  if (!h.native) return null;
  const cls = cn(
    "mx-4 flex items-center gap-3 rounded-[24px] border border-dashed border-foreground/20 p-4",
    stateLayer,
  );
  const inner = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#FBEFD2] text-[#7A5A12]">
        <Watch className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="type-action block">Add sleep and steps</span>
        <span className="type-body-sm block text-muted-foreground">
          Connect Health Connect to see them next to your score
        </span>
      </span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </>
  );
  return (
    <Link to="/settings" className={cls}>
      {inner}
    </Link>
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
          "mx-4 flex items-center gap-4 rounded-[28px] bg-error-container p-5 text-on-error-container",
          stateLayer,
        )}
      >
        <LifeBuoy className="h-8 w-8 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[19px] font-semibold leading-6">
            You don’t have to carry this alone
          </span>
          <span className="type-label-lg mt-1 block">
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
        <p className="type-body-sm opacity-70">Today’s check-in</p>
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
        <p className="type-label-md mt-3 opacity-60">
          Tap one to start. It takes about 30 seconds.
        </p>
      </section>
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
        link={{ to: "/assessments/$slug", params: { slug: g.slug } }}
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
        <span className="type-body-md mt-0.5 block">Check-in logged. See you tomorrow.</span>
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
    | { to: "/assessments/$slug"; params: { slug: string } };
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
        <span className="type-label-md font-semibold absolute left-5 top-4 rounded-full bg-black/45 px-2.5 py-1 text-white backdrop-blur">
          {label}
        </span>
      </div>
      <div className="px-5 pb-5">
        <p className="font-display text-[21px] font-semibold leading-7">{title}</p>
        <p className="type-body-sm mt-1 opacity-70">{meta}</p>
        {progress !== undefined ? (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
          </div>
        ) : null}
        <span className="type-action mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-background px-5 text-foreground">
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
  action?: { label: string; to: "/program" | "/resources" | "/history/assessments" | "/journal" };
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 px-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="type-subhead">{title}</h2>
          {action ? (
            <Link
              to={action.to}
              className="type-body-md font-semibold shrink-0 text-muted-foreground hover:text-foreground"
            >
              {action.label}
            </Link>
          ) : null}
        </div>
        {note ? <p className="type-body-sm mt-0.5 text-muted-foreground">{note}</p> : null}
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
        <span className="type-body-sm block text-muted-foreground">iKAN Score</span>
        <span className="block font-display text-[19px] font-semibold leading-6">
          {band ? band.label : hydrated ? "Starts with your first check-in" : ""}
        </span>
        <span className="type-body-sm mt-0.5 block text-muted-foreground">
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
      <div className="no-scrollbar flex snap-x scroll-px-4 items-stretch gap-3 overflow-x-auto px-4 pb-1">
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
              <span className="type-body-sm mt-1 block opacity-80">
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
              <span className="type-label-md font-semibold block opacity-80">
                {dayCount(p)} days
              </span>
              <span className="type-title-lg font-semibold block">{p.name}</span>
              {p.source.description ? (
                <span className="type-label-md mt-0.5 line-clamp-2 opacity-85">
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
            const done = daysDoneOf(p, s.completed);
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
                      <span className="type-title-md truncate">{p.name}</span>
                      <span className="type-label-md tabular-nums text-muted-foreground">
                        {done} of {dayCount(p)} days
                      </span>
                    </span>
                    <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[var(--accent-container)]">
                      <span
                        className="block h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${(done / dayCount(p)) * 100}%` }}
                      />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="no-scrollbar flex snap-x scroll-px-4 items-stretch gap-3 overflow-x-auto px-4 pb-1">
          {programmes.map((p) => (
            <Link
              key={p.slug}
              to="/program/$slug"
              params={{ slug: p.slug }}
              className="w-[152px] shrink-0 snap-start"
            >
              <img src={p.cover} alt="" className="h-[112px] w-full rounded-[20px] object-cover" />
              <span className="mt-2 block font-display text-[15px] font-semibold">{p.name}</span>
              <span className="type-label-md block text-muted-foreground">{dayCount(p)} days</span>
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
    return list.length
      ? Math.round(list.reduce((n, e) => n + e.mood_rating, 0) / list.length)
      : null;
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
        <p className="type-body-sm mt-3 flex items-center gap-2 text-muted-foreground">
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
      <div className="no-scrollbar flex snap-x scroll-px-4 items-stretch gap-3 overflow-x-auto px-4 pb-1">
        {picks.map((r) => (
          <Link
            key={r.id}
            to="/resources/$slug"
            params={{ slug: slugOf(r) }}
            className="flex w-[240px] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] bg-secondary"
          >
            <span className="block h-[132px] overflow-hidden">
              {covers[r.id] ? (
                <img src={covers[r.id]} alt="" className="h-full w-full object-cover" />
              ) : (
                <Illustration art={r.art} />
              )}
            </span>
            <span className="flex flex-1 flex-col p-3">
              <span className="line-clamp-3 text-[15px] font-semibold leading-5">{r.title}</span>
              <span className="type-label-md mt-auto flex items-center gap-2 pt-2 text-muted-foreground">
                <span className="rounded-full bg-background px-2 py-0.5 font-medium">
                  {r.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  {(() => {
                    const Icon = mediumIcon[mediumOf(r)];
                    return <Icon className="h-3.5 w-3.5" aria-hidden="true" />;
                  })()}
                  {mediumLabel(r)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {lengthLabel(r)}
                </span>
              </span>
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
    <Section title="Recent results" action={{ label: "History", to: "/history/assessments" }}>
      <ul className="mx-4 overflow-hidden rounded-[24px] bg-secondary">
        {recent.map((r) => {
          const a = getAssessment(r.slug);
          if (!a) return null;
          const head = headlineOf(a, scoreAll(a, r.answers));
          return (
            <li key={r.id} className="border-b border-background last:border-0">
              <Link
                to="/assessments/$slug/result/$id"
                params={{ slug: a.slug, id: r.id }}
                className={cn("flex min-h-16 items-center gap-3 px-4 py-3", stateLayer)}
              >
                {/* A clipboard says "a form to fill in", which is what these rows are not:
                    they are scores already recorded, and each carries its band on the right. */}
                <ChartNoAxesColumn className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1">
                  <span className="type-action font-medium block truncate">{a.title}</span>
                  <DateText className="type-label-md text-muted-foreground">
                    {new Date(r.completedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </DateText>
                </span>
                {head?.band ? (
                  <BandChip
                    label={head.band.label}
                    tone={head.band.tone}
                    severity={head.band.severity}
                  />
                ) : (
                  <span className="type-label-md text-muted-foreground">5 scores</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ---------- re-check prompt (old iKan reassessment triggers) ---------- */

function ReassessPrompt({ data, hydrated }: { data: Data; hydrated: boolean }) {
  const [hidden, setHidden] = useState(false);
  if (!hydrated || hidden || reassessDismissed()) return null;
  const reason = reassessReason(data.results, data.journal.entries, data.programmeStates);
  if (!reason) return null;
  return (
    <section className="mx-4 flex items-center gap-3 rounded-[24px] bg-[oklch(0.96_0.05_85)] p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-background text-[oklch(0.47_0.1_75)]">
        <Activity className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[15px] font-semibold">Ready for a re-check?</span>
        <span className="type-body-sm mt-0.5 block text-muted-foreground">
          {reassessCopy[reason]}
        </span>
        <span className="mt-3 flex items-center gap-2">
          <Link
            to="/assessments"
            className="type-body-sm font-semibold inline-flex h-9 items-center rounded-full bg-foreground px-4 text-background"
          >
            Choose an assessment
          </Link>
          <button
            type="button"
            onClick={() => {
              dismissReassess();
              setHidden(true);
            }}
            className="type-body-sm font-medium h-9 rounded-full px-3 text-muted-foreground"
          >
            Not now
          </button>
        </span>
      </span>
    </section>
  );
}

/* ---------- current program, activity, offerings, check-in, support ---------- */

/** The programme you're in the middle of: the most recently active one that isn't finished. */
function ongoing(data: Data) {
  return programmes
    .map((p) => {
      const s = data.programmeStates[p.slug]!;
      let next = 0;
      while (s.completed.includes(next)) next += 1;
      const last =
        Object.values(s.completedAt ?? {})
          .sort()
          .at(-1) ?? "";
      return { p, s, next, day: p.days.find((d) => d.day === next), last };
    })
    .filter((x) => x.s.completed.length > 0 && x.day)
    .sort((a, b) => b.last.localeCompare(a.last))[0];
}

function CurrentProgram({ data, hydrated }: { data: Data; hydrated: boolean }) {
  const cur = hydrated ? ongoing(data) : undefined;
  if (!cur) return null;
  const done = daysDoneOf(cur.p, cur.s.completed);
  const pct = Math.round((done / dayCount(cur.p)) * 100);
  return (
    <section className="px-4">
      <p className="type-body-sm font-semibold mb-2 text-muted-foreground">Your program</p>
      <div className="hero-card">
        <img src={cur.p.cover} alt="" className="hero-media" />
        <div className="hero-veil" />
        <div className="relative">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <span className="hero-chip">Current program</span>
              <h2 className="mt-2 font-display text-[26px] font-bold tracking-[-0.02em]">
                {cur.p.name}
              </h2>
              <p className="type-body-sm mt-1 opacity-75">
                {cur.next === 0 ? "Onboarding" : `Day ${cur.next} · ${cur.day!.title}`} · {done} of{" "}
                {dayCount(cur.p)} days done
              </p>
            </div>
            <div
              className="hero-ring"
              style={{
                background: `conic-gradient(var(--background) 0 ${pct}%, oklch(1 0 0 / 0.14) ${pct}%)`,
              }}
            >
              <span>{pct}%</span>
            </div>
          </div>
          <div className="hero-track mt-4">
            <i style={{ width: `${pct}%` }} />
          </div>
          <p className="type-body-md mt-3 opacity-85">
            Ready for your next session? Takes about {Math.max(5, minutesOf(cur.day!))} minutes.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              to="/program/$slug/day/$day"
              params={{ slug: cur.p.slug, day: String(cur.next) }}
              className="type-body-md font-semibold inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-background text-foreground transition-transform active:scale-[.97]"
            >
              <Play className="h-4 w-4" /> Start session
            </Link>
            <Link
              to="/program/$slug"
              params={{ slug: cur.p.slug }}
              className="type-body-md font-semibold inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/25 px-4 hover:bg-white/10"
            >
              <CalendarCheck className="h-4 w-4" /> Progress
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Things left open: today's programme session, unfinished assessments, today's check-in. */
function PickUp({ data, hydrated }: { data: Data; hydrated: boolean }) {
  if (!hydrated) return null;
  const today = dayKey(new Date());
  const drafts = data.drafts.slice(0, 2);
  const needsMood = !data.journal.entries.some((e) => e.date === today);
  if (!drafts.length && !needsMood) return null;
  const rowClass = cn(
    "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4",
    stateLayer,
  );
  return (
    <Section title="Your activity" note="Pick up where you left off">
      <div className="mx-4 divide-y divide-background overflow-hidden rounded-[24px] bg-secondary">
        {drafts.map((d) => (
          <Link
            key={d.assessment!.slug}
            to="/assessment-flow"
            search={{ id: d.assessment!.slug }}
            className={rowClass}
          >
            <ActivityRow
              title={`${d.assessment!.name} assessment`}
              meta={`${d.answered} of ${d.assessment!.questions.length} answered`}
              progress={Math.round((d.answered / d.assessment!.questions.length) * 100)}
            />
          </Link>
        ))}
        {needsMood ? (
          <Link to="/journal" className={rowClass}>
            <ActivityRow title="Mood check-in" meta="How are you feeling today?" progress={0} />
          </Link>
        ) : null}
      </div>
    </Section>
  );
}

function ActivityRow({ title, meta, progress }: { title: string; meta: string; progress: number }) {
  return (
    <>
      <span className="activity-dial" style={{ ["--p" as string]: `${progress}%` }}>
        <span>{progress ? `${progress}%` : "New"}</span>
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-[15px] font-semibold">{title}</span>
        <span className="type-body-sm mt-0.5 block truncate text-muted-foreground">{meta}</span>
      </span>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background">
        {progress > 0 ? <Play className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
      </span>
    </>
  );
}

function Offerings({ data, hydrated }: { data: Data; hydrated: boolean }) {
  const active = hydrated
    ? programmes.filter((p) => {
        const s = data.programmeStates[p.slug]!;
        return s.completed.length > 0 && new Set(s.completed).size < p.days.length;
      }).length
    : 0;
  const tiles = [
    {
      label: "Programs",
      meta: active ? `${active} active` : `${programmes.length} programs`,
      icon: Sparkles,
      to: "/program" as const,
      tone: "score-calm",
    },
    {
      label: "Assessments",
      meta: "7 available",
      icon: ChartNoAxesColumn,
      to: "/assessments" as const,
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
      meta: `${consultants.length} consultants`,
      icon: Heart,
      to: "/consult" as const,
      tone: "score-alert",
    },
  ];
  return (
    <Section title="Everything in iKAN">
      <div className="grid grid-cols-2 gap-3 px-4">
        {tiles.map((o) => {
          const Icon = o.icon;
          return (
            <Link
              key={o.label}
              to={o.to}
              className={cn("surface flex flex-col gap-3 p-4", stateLayer)}
            >
              <span className={cn("score-tile", o.tone)}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[15px] font-semibold">{o.label}</span>
                <span className="type-body-sm mt-0.5 block text-muted-foreground">{o.meta}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}

/** The mood check-in card. Hidden while Today's card is already asking the same question. */
function MoodCheckin({ data, hydrated }: { data: Data; hydrated: boolean }) {
  if (!hydrated) return null;
  const today = dayKey(new Date());
  const logged = data.journal.entries.filter((e) => e.date === today);
  const latest = [...data.results].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
  const latestA = latest ? getAssessment(latest.slug) : undefined;
  const risk = latest && latestA ? riskEndorsed(latestA, latest.answers) : false;
  const todayAsks = !risk && !data.drafts[0] && logged.length === 0;
  if (todayAsks) return null;
  return (
    <section className="surface mx-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="type-body-sm font-semibold text-muted-foreground">Today’s check-in</p>
          <h2 className="type-subhead mt-1">How are you feeling?</h2>
        </div>
        <span className="type-label-md rounded-full bg-secondary px-2.5 py-1 text-muted-foreground">
          {logged.length ? `${logged.length} today` : "40 sec"}
        </span>
      </div>
      <p className="type-body-sm mt-1 text-muted-foreground">
        Mood, sleep, stress and pain in a few quick taps.
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
      <Link
        to="/journal"
        className="type-body-md font-semibold mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-background transition-transform active:scale-[.98]"
      >
        <Plus className="h-4 w-4" /> {logged.length ? "Add another check-in" : "Log today’s mood"}
      </Link>
    </section>
  );
}

function SupportCard({ city }: { city: string }) {
  return (
    <section className="mx-4 rounded-[22px] border border-error/20 bg-error/5 p-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-background text-on-error-container">
          <Heart className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="type-label-md font-semibold text-on-error-container">Support</p>
          <h2 className="type-title-md">Let’s talk about it</h2>
          <p className="type-body-sm mt-0.5 text-muted-foreground">
            {consultants.length} consultants{city ? ` for you in ${city}` : ""}, with video, call
            and chat sessions.
          </p>
        </div>
      </div>
      <Link
        to="/consult"
        className="type-body-md font-semibold mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-on-error-container text-error-container transition-transform active:scale-[.98]"
      >
        <CalendarDays className="h-4 w-4" /> Book a consultation
      </Link>
    </section>
  );
}
