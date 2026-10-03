import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ClipboardList,
  HardDrive,
  Moon,
  ShieldCheck,
  Smile,
  Sparkles,
  Watch,
  type LucideIcon,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { accentStyle, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { toneColors } from "@/components/assessment/ui";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import {
  saveSnapshot,
  scoreBands,
  useEverything,
  useWellnessSnapshots,
  wellnessBand,
  type WellnessPart,
} from "@/lib/activity";
import { addDays, dayKey, moodScale } from "@/lib/journal";

export const Route = createFileRoute("/wellness")({
  head: () =>
    pageMeta("iKAN Score", "Your Collective Wellness Index: one number over everything you log."),
  component: ScorePage,
});

const partMeta: Record<
  WellnessPart["key"],
  {
    icon: LucideIcon;
    color: string;
    to: "/assessments" | "/journal" | "/program" | "/settings";
    cta: string;
  }
> = {
  assessments: {
    icon: ClipboardList,
    color: "#5D64B4",
    to: "/assessments",
    cta: "Take an assessment",
  },
  checkins: { icon: Smile, color: "#C2607C", to: "/journal", cta: "Log a check-in" },
  programs: { icon: Sparkles, color: "#4E8F75", to: "/program", cta: "Open programs" },
  health: { icon: Watch, color: "#B98A22", to: "/settings", cta: "Connect" },
};

const short = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

function ScorePage() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const data = useEverything();
  const snapshots = useWellnessSnapshots();
  const [open, setOpen] = useState<string | null>(null);
  const score = hydrated ? data.score : null;

  useEffect(() => {
    if (score !== null) saveSnapshot(score);
  }, [score]);

  const band = score !== null ? wellnessBand(score) : null;
  const nextBand = band ? scoreBands[scoreBands.indexOf(band) + 1] : undefined;
  const firstEvent = hydrated ? data.events.at(-1) : undefined;

  const days = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i - 29));
  const series = days.map((d) => snapshots[dayKey(d)] ?? null);
  const weekAgo = [...Object.entries(snapshots)]
    .filter(([k]) => k <= dayKey(addDays(new Date(), -7)))
    .sort(([a], [b]) => b.localeCompare(a))[0]?.[1];
  const best = Object.values(snapshots).length ? Math.max(...Object.values(snapshots)) : null;
  const change = score !== null && weekAgo !== undefined ? score - weekAgo : null;

  const present = data.parts.filter((p) => p.value !== null);

  return (
    <IkanShell>
      <div style={accentStyle("calm")}>
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
        />
        <header className="px-4">
          <h1 className="font-display text-[32px] font-semibold leading-10">iKAN Score</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {firstEvent
              ? `One number over everything you have logged since ${new Date(firstEvent.at).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}`
              : "Your Collective Wellness Index"}
          </p>
        </header>

        <section className="relative mx-4 mt-4 overflow-hidden rounded-[32px] bg-[#0F1A17] px-5 pb-6 pt-6 text-white">
          <Aurora />
          <div className="relative flex flex-col items-center text-center">
            <ScoreRing score={score} />
            {band ? (
              <>
                <p className="mt-3 font-display text-[24px] font-semibold">{band.label}</p>
                <p
                  className="mt-2 inline-flex h-7 items-center rounded-full px-3 text-[13px] font-semibold"
                  style={{ background: "rgba(255,255,255,.14)" }}
                >
                  {change === null
                    ? "Your first reading"
                    : change === 0
                      ? "No change since last week"
                      : `${change > 0 ? "Up" : "Down"} ${Math.abs(change)} since last week`}
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 font-display text-[22px] font-semibold">
                  Your score starts here
                </p>
                <p className="mt-1 max-w-[260px] text-[14px] leading-5 opacity-80">
                  Log a mood check-in, take an assessment or finish a program day.
                </p>
              </>
            )}
          </div>
        </section>

        {score !== null && band ? (
          <section className="mx-4 mt-4 rounded-[24px] bg-secondary p-4">
            <div className="relative pt-5">
              <span
                className="absolute top-0 -translate-x-1/2 text-[11px] font-bold tabular-nums"
                style={{ left: `${score}%` }}
              >
                ▼ {score}
              </span>
              <div className="flex h-3 gap-[3px]">
                {scoreBands.map((b) => (
                  <span
                    key={b.label}
                    className="h-full rounded-full"
                    style={{
                      width: `${b.max - b.min + 1}%`,
                      background: toneColors[b.tone].bar,
                      opacity: b === band ? 1 : 0.25,
                    }}
                  />
                ))}
              </div>
              <div className="relative mt-1 h-4 text-[11px] tabular-nums text-muted-foreground">
                {[0, 25, 45, 65, 80, 100].map((t) => (
                  <span key={t} className="absolute -translate-x-1/2" style={{ left: `${t}%` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 text-[14px] leading-5">
              {band.label} spans {band.min} to {band.max}.
              {nextBand
                ? ` You are ${nextBand.min - score} ${nextBand.min - score === 1 ? "point" : "points"} from ${nextBand.label}.`
                : " That’s the top band."}
            </p>
          </section>
        ) : null}

        <SectionTitle>How it moved</SectionTitle>
        <section className="mx-4 rounded-[24px] border border-foreground/10 p-4">
          {hydrated && series.filter((v) => v !== null).length > 1 ? (
            <>
              <div
                className="flex h-24 items-end gap-[3px]"
                role="img"
                aria-label="iKAN Score by day, last 30 days"
              >
                {series.map((v, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t-[3px]"
                    style={{
                      height: v === null ? 3 : `${Math.max(6, v)}%`,
                      background:
                        v === null ? "rgba(0,0,0,.08)" : toneColors[wellnessBand(v).tone].bar,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>{short(days[0]!)}</span>
                <span>{short(days[15]!)}</span>
                <span>Today</span>
              </div>
            </>
          ) : (
            <p className="text-[14px] leading-5 text-muted-foreground">
              Your score is saved each day you open iKAN. The chart appears from your second day.
            </p>
          )}
          <div className="mt-4 grid grid-cols-3 divide-x divide-foreground/10 text-center">
            <Mini value={score} label="Today" />
            <Mini value={weekAgo ?? null} label="Last week" />
            <Mini value={best} label="Your best" />
          </div>
        </section>

        <SectionTitle>What moved it</SectionTitle>
        <section className="mx-4 overflow-hidden rounded-[24px] border border-foreground/10">
          {present.length === 0 && hydrated ? (
            <p className="p-4 text-[14px] text-muted-foreground">Nothing has been logged yet.</p>
          ) : null}
          {present.map((p) => {
            const pts = Math.round(((p.value! - 50) * p.weight) / data.totalWeight);
            const meta = partMeta[p.key];
            const on = open === p.key;
            return (
              <div key={p.key} className="border-b border-foreground/10 last:border-0">
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? null : p.key)}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left",
                    stateLayer,
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: meta.color }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{p.label}</span>
                    <span className="block truncate text-[13px] text-muted-foreground">
                      {p.detail}
                    </span>
                  </span>
                  <span
                    className="font-display text-[17px] font-semibold tabular-nums"
                    style={{
                      color:
                        pts > 0 ? toneColors.success.fg : pts < 0 ? toneColors.error.fg : undefined,
                    }}
                  >
                    {pts > 0 ? `+${pts}` : pts < 0 ? `−${Math.abs(pts)}` : "0"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      on && "rotate-180",
                    )}
                  />
                </button>
                {on ? (
                  <div className="px-4 pb-4 pl-[38px] text-[13px] leading-5 text-muted-foreground">
                    Scores {Math.round(p.value!)} of 100 and carries{" "}
                    {Math.round((p.weight / data.totalWeight) * 100)}% of your score, so it moves
                    the total by {pts > 0 ? `+${pts}` : pts} against a middle reading of 50.{" "}
                    <Link to={meta.to} className="font-semibold text-foreground underline">
                      {meta.cta}
                    </Link>
                  </div>
                ) : null}
              </div>
            );
          })}
          {hydrated
            ? data.drafts.map((d) => (
                <Link
                  key={d.assessment!.slug}
                  to="/assessment-flow"
                  search={{ id: d.assessment!.slug }}
                  className={cn(
                    "flex min-h-14 items-center gap-3 border-t border-foreground/10 px-4 py-3",
                    stateLayer,
                  )}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-foreground/30" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">
                      {d.assessment!.name} unfinished · held
                    </span>
                    <span className="block text-[13px] text-muted-foreground">
                      {d.answered} of {d.assessment!.questions.length} answered, tap to finish
                    </span>
                  </span>
                  <span className="font-display text-[17px] font-semibold">0</span>
                </Link>
              ))
            : null}
        </section>
        <p className="mx-4 mt-2 text-[12px] leading-5 text-muted-foreground">
          Tap a factor to see why. A part-finished assessment contributes nothing until it is
          complete — it does not count against you.
        </p>

        <SectionTitle>Everything on one axis</SectionTitle>
        <OneAxis data={data} hydrated={hydrated} days={days} />

        <SectionTitle>Where it comes from</SectionTitle>
        <ul className="mx-4 overflow-hidden rounded-[24px] bg-secondary">
          {data.parts.map((p) => {
            const meta = partMeta[p.key];
            const Icon = meta.icon;
            const has = hydrated && p.value !== null;
            return (
              <li key={p.key} className="border-b border-background last:border-0">
                <Link
                  to={meta.to}
                  className={cn("flex min-h-16 items-center gap-3 px-4 py-3", stateLayer)}
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] text-white"
                    style={{ background: meta.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{p.label}</span>
                    <span className="block truncate text-[13px] text-muted-foreground">
                      {hydrated ? p.detail : ""}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block font-display text-[17px] font-semibold tabular-nums">
                      {p.weight}%
                    </span>
                    {!has ? (
                      <span className="block text-[11px] text-muted-foreground">not counted</span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mx-4 mt-2 text-[12px] leading-5 text-muted-foreground">
          Sources without data are left out and the others share their weight, so you aren’t marked
          down for what you haven’t started.
        </p>

        <SectionTitle>Reading it</SectionTitle>
        <p className="mx-4 text-[15px] leading-6 text-muted-foreground">
          The score is a summary, not a diagnosis. If it drops and you don’t know why, the factors
          above show what changed and when.
        </p>
        <div className="mx-4 mt-4 flex flex-wrap gap-2">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-secondary px-3 text-[13px]">
            <ShieldCheck className="h-4 w-4" /> Never shared
          </span>
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-secondary px-3 text-[13px]">
            <HardDrive className="h-4 w-4" /> Stored on this device
          </span>
        </div>
      </div>
    </IkanShell>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="mx-4 mb-3 mt-8 font-display text-[16px] font-semibold">{children}</h2>;
}

function Mini({ value, label }: { value: number | null; label: string }) {
  return (
    <div>
      <p className="font-display text-[22px] font-semibold tabular-nums">{value ?? "—"}</p>
      <p className="text-[12px] text-muted-foreground">{label}</p>
    </div>
  );
}

function OneAxis({
  data,
  hydrated,
  days,
}: {
  data: ReturnType<typeof useEverything>;
  hydrated: boolean;
  days: Date[];
}) {
  const keys = days.map(dayKey);
  const moodByDay = keys.map((k) => {
    const list = hydrated ? data.journal.entries.filter((e) => e.date === k) : [];
    return list.length ? list.reduce((n, e) => n + e.mood_rating, 0) / list.length : null;
  });
  const programDays = keys.map((k) =>
    hydrated
      ? data.events.filter((e) => e.type === "program" && dayKey(new Date(e.at)) === k).length
      : 0,
  );
  const assessDays = keys.map((k) =>
    hydrated
      ? data.events.filter((e) => e.type === "assessment" && dayKey(new Date(e.at)) === k)
      : [],
  );
  const moodColor = (m: number) =>
    ["#D2544F", "#E39A5A", "#D9C36A", "#8CC7AC", "#3E9B6C"][Math.round(m) - 1]!;
  const counts = {
    mood: moodByDay.filter((v) => v !== null).length,
    program: programDays.reduce((n, v) => n + v, 0),
    assess: assessDays.reduce((n, v) => n + v.length, 0),
  };

  return (
    <section className="mx-4 rounded-[24px] border border-foreground/10 p-4">
      <Lane icon={Smile} label="Mood, daily">
        {moodByDay.map((m, i) => (
          <span
            key={i}
            className="h-3 flex-1 rounded-[3px]"
            style={{ background: m === null ? "rgba(0,0,0,.06)" : moodColor(m) }}
            title={m === null ? undefined : moodScale[Math.round(m) - 1]!.label}
          />
        ))}
      </Lane>
      <Lane icon={Moon} label="Sleep, hours">
        <span className="flex h-3 flex-1 items-center justify-center rounded-[3px] border border-dashed border-foreground/20 text-[10px] text-muted-foreground">
          Connect Health Connect to see sleep
        </span>
      </Lane>
      <Lane icon={Sparkles} label="Program days done">
        {programDays.map((n, i) => (
          <span
            key={i}
            className="flex-1 rounded-[3px]"
            style={{ height: n ? 12 : 3, background: n ? "#4E8F75" : "rgba(0,0,0,.06)" }}
          />
        ))}
      </Lane>
      <Lane icon={ClipboardList} label="Assessments">
        {assessDays.map((list, i) => (
          <span key={i} className="flex h-3 flex-1 items-center justify-center">
            {list.length ? (
              <span
                className="h-3 w-3 rotate-45 rounded-[2px]"
                style={{ background: toneColors[list[0]!.tone ?? "warning"].bar }}
              />
            ) : null}
          </span>
        ))}
      </Lane>
      <div className="mt-1 flex justify-between pl-[112px] text-[11px] text-muted-foreground">
        <span>{short(days[0]!)}</span>
        <span>{short(days[14]!)}</span>
        <span>Today</span>
      </div>
      <p className="mt-3 text-[13px] leading-5 text-muted-foreground">
        {hydrated
          ? `In the last 30 days: ${counts.mood} days with a check-in, ${counts.program} program days and ${counts.assess} assessments.`
          : ""}
      </p>
    </section>
  );
}

function Lane({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="flex w-[104px] shrink-0 items-center gap-1.5 text-[12px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className="flex flex-1 items-end gap-[2px]">{children}</span>
    </div>
  );
}

function ScoreRing({ score }: { score: number | null }) {
  const r = 80;
  const c = 2 * Math.PI * r;
  const pct = score === null ? 0 : score / 100;
  const band = score !== null ? wellnessBand(score) : null;
  return (
    <div className="relative h-[200px] w-[200px]">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9BE3C3" />
            <stop offset="0.6" stopColor="#5FB8D6" />
            <stop offset="1" stopColor="#B7A4F0" />
          </linearGradient>
        </defs>
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="16"
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div>
          <p className="font-display text-[60px] font-bold leading-none tabular-nums">
            {score ?? "—"}
          </p>
          <p className="mt-1 text-[13px] opacity-70">
            {band ? `${band.label} · of 100` : "of 100"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Aurora() {
  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="a1" cx="0.2" cy="0.1" r="0.6">
          <stop offset="0" stopColor="#3FB68B" stopOpacity="0.55" />
          <stop offset="1" stopColor="#3FB68B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a2" cx="0.9" cy="0.3" r="0.5">
          <stop offset="0" stopColor="#7C6FE0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#7C6FE0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="a3" cx="0.5" cy="1" r="0.6">
          <stop offset="0" stopColor="#2F8FB5" stopOpacity="0.45" />
          <stop offset="1" stopColor="#2F8FB5" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#a1)" />
      <rect width="400" height="400" fill="url(#a2)" />
      <rect width="400" height="400" fill="url(#a3)" />
    </svg>
  );
}
