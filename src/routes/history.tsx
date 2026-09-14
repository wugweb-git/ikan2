import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Flame,
  Smile,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Illustration } from "@/components/art";
import { accentStyle, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { toneColors } from "@/components/assessment/ui";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { useEverything, wellnessBand, type ActivityEvent, type ActivityType } from "@/lib/activity";
import { addDays, dayKey, streaks } from "@/lib/journal";

export const Route = createFileRoute("/history")({
  head: () => pageMeta("My history", "Everything you’ve done in iKAN, in one place."),
  component: HistoryPage,
});

const typeMeta: Record<
  ActivityType,
  { label: string; icon: LucideIcon; color: string; soft: string }
> = {
  assessment: { label: "Assessments", icon: ClipboardList, color: "#3B418C", soft: "#E6E7F6" },
  mood: { label: "Journal", icon: Smile, color: "#8C3652", soft: "#F9E2E9" },
  program: { label: "Programs", icon: Sparkles, color: "#2B634D", soft: "#DFF0E8" },
  consult: { label: "Consultations", icon: CalendarCheck, color: "#2F5580", soft: "#E3ECF8" },
  resource: { label: "Reading", icon: BookOpen, color: "#7A5A12", soft: "#FBEFD2" },
};

/** My history covers the three things people come back to: assessments, programs and the journal. */
const HISTORY_TYPES: ActivityType[] = ["assessment", "program", "mood"];
const filters: ("all" | ActivityType)[] = ["all", ...HISTORY_TYPES];

function HistoryPage() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const data = useEverything();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const events = hydrated ? data.events.filter((e) => HISTORY_TYPES.includes(e.type)) : [];

  const count = (t: ActivityType) => events.filter((e) => e.type === t).length;
  const weekAgo = addDays(new Date(), -6);
  const week = events.filter((e) => new Date(e.at) >= new Date(dayKey(weekAgo)));
  const weekMood = hydrated ? data.journal.entries.filter((e) => e.date >= dayKey(weekAgo)) : [];
  const weekAvg = weekMood.length
    ? weekMood.reduce((n, e) => n + e.mood, 0) / weekMood.length
    : null;
  const streak = hydrated
    ? streaks(new Set(data.journal.entries.map((e) => e.date)))
    : { current: 0, best: 0 };
  const shown = filter === "all" ? events : events.filter((e) => e.type === filter);

  const groups: { label: string; items: ActivityEvent[] }[] = [];
  for (const e of shown) {
    const label = dayTitle(e.at);
    const g = groups.at(-1);
    if (g && g.label === label) g.items.push(e);
    else groups.push({ label, items: [e] });
  }

  return (
    <IkanShell>
      <div style={accentStyle("mind")}>
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
        />
        <header className="px-4 pb-1">
          <h1 className="font-display text-[32px] font-semibold leading-10">My history</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Your assessments, programs and journal, in one place
          </p>
        </header>

        <section className="mx-4 mt-5 overflow-hidden rounded-[28px] bg-foreground text-background">
          <div className="flex items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] opacity-70">This week</p>
              <p className="mt-1 font-display text-[22px] font-semibold leading-7">
                {week.length === 0
                  ? "A fresh week"
                  : `${week.length} ${week.length === 1 ? "thing" : "things"} done`}
              </p>
              <p className="mt-1 text-[14px] leading-5 opacity-80">
                {weekAvg !== null
                  ? `Average mood ${weekAvg.toFixed(1)}/5 across ${weekMood.length} check-ins.`
                  : "Log a check-in to see your weekly mood."}
              </p>
            </div>
            <Link
              to="/wellness"
              className="grid h-[76px] w-[76px] shrink-0 place-items-center rounded-full border-[6px] text-center"
              style={{
                borderColor:
                  data.score !== null && hydrated
                    ? toneColors[wellnessBand(data.score).tone].bar
                    : "rgba(255,255,255,.2)",
              }}
            >
              <span>
                <span className="block font-display text-[22px] font-bold leading-none">
                  {hydrated && data.score !== null ? data.score : "—"}
                </span>
                <span className="text-[10px] opacity-70">wellness</span>
              </span>
            </Link>
          </div>
          <div className="flex h-10 items-end gap-1 px-5 pb-4" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => {
              const key = dayKey(addDays(new Date(), i - 6));
              const n = events.filter((e) => dayKey(new Date(e.at)) === key).length;
              return (
                <span
                  key={key}
                  className="flex-1 rounded-full bg-background"
                  style={{ height: Math.min(24, 3 + n * 6), opacity: n ? 0.9 : 0.2 }}
                />
              );
            })}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-2 px-4">
          <Stat
            icon={ClipboardList}
            value={count("assessment")}
            label="Assessments"
            meta={typeMeta.assessment}
          />
          <Stat icon={Smile} value={count("mood")} label="Journal check-ins" meta={typeMeta.mood} />
          <Stat
            icon={Sparkles}
            value={count("program")}
            label="Program days"
            meta={typeMeta.program}
          />
          <Stat
            icon={Flame}
            value={streak.current}
            label="Day streak"
            meta={{ color: "#B3441E", soft: "#FDE7D8" }}
          />
        </section>

        <div
          className="no-scrollbar mt-6 flex gap-2 overflow-x-auto px-4"
          role="tablist"
          aria-label="Filter history"
        >
          {filters.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(f)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center rounded-[8px] border px-3.5 text-[14px] font-medium transition-colors",
                  stateLayer,
                  on
                    ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]"
                    : "border-foreground/20",
                )}
              >
                {f === "all" ? "All" : typeMeta[f].label}
              </button>
            );
          })}
        </div>

        {hydrated && shown.length === 0 ? (
          <div className="mx-4 mt-4 overflow-hidden rounded-[24px] bg-secondary">
            <div className="h-32">
              <Illustration art="mood" />
            </div>
            <div className="p-5 text-center">
              <p className="font-display text-[17px] font-semibold">Nothing here yet</p>
              <p className="mt-1 text-[14px] text-muted-foreground">
                Your check-ins, assessments, program days and sessions will appear here.
              </p>
              <Link
                to="/journal"
                className="mt-4 inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[14px] font-semibold text-background"
              >
                Log today’s mood
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-2 px-4">
            {groups.map((g) => (
              <section key={g.label} className="mt-4">
                <h2 className="text-[13px] font-semibold text-muted-foreground">{g.label}</h2>
                <ol className="relative mt-2 space-y-1 before:absolute before:bottom-4 before:left-[22px] before:top-4 before:w-px before:bg-foreground/10">
                  {g.items.map((e) => (
                    <li key={e.id}>
                      <EventRow e={e} />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>
    </IkanShell>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  meta,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  meta: { color: string; soft: string };
}) {
  return (
    <div className="rounded-[20px] p-3" style={{ background: meta.soft, color: meta.color }}>
      <Icon className="h-5 w-5" />
      <p className="mt-2 font-display text-[24px] font-bold leading-7 tabular-nums">{value}</p>
      <p className="text-[12px] font-medium">{label}</p>
    </div>
  );
}

function EventRow({ e }: { e: ActivityEvent }) {
  const meta = typeMeta[e.type];
  const Icon = meta.icon;
  return (
    <Link
      {...e.link}
      className={cn("relative flex items-center gap-3 rounded-[16px] py-2 pr-2", stateLayer)}
    >
      <span
        className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[20px]"
        style={{ background: meta.soft, color: meta.color }}
      >
        {e.emoji ? <span aria-hidden="true">{e.emoji}</span> : <Icon className="h-5 w-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[15px] font-semibold">{e.title}</span>
          {e.tone ? (
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: toneColors[e.tone].bar }}
            />
          ) : null}
        </span>
        <span className="line-clamp-1 block text-[13px] text-muted-foreground">{e.detail}</span>
      </span>
      <span className="text-[12px] tabular-nums text-muted-foreground">
        {new Date(e.at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function dayTitle(iso: string) {
  const key = dayKey(new Date(iso));
  if (key === dayKey(new Date())) return "Today";
  if (key === dayKey(addDays(new Date(), -1))) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
