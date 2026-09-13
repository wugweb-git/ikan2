import { Link } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, nightMetrics, type DiaryEntry } from "@/lib/equip/metrics";
import type { Entry } from "@/lib/equip/store";
import type { Programme } from "@/lib/equip/types";
import { allDays } from "@/lib/equip/programs";

/** The programme as a sky of nights: one moon per day. */
export function NightGrid({
  programme,
  completed,
  next,
}: {
  programme: Programme;
  completed: number[];
  next: number;
}) {
  const days = allDays(programme);
  return (
    <ol className="grid grid-cols-7 gap-x-2 gap-y-3" aria-label="Your days">
      {days.map(({ day, title }) => {
        const done = completed.includes(day);
        const open = day === next;
        const label = `Day ${day}, ${title}${done ? ", done" : open ? ", up next" : ", locked"}`;
        const moon = (
          <span
            className={cn(
              "grid aspect-square w-full place-items-center rounded-full font-display text-[13px] font-semibold tabular-nums transition-colors",
              done && "bg-foreground text-background",
              open &&
                "bg-background text-foreground ring-2 ring-foreground ring-offset-2 ring-offset-background",
              !done && !open && "bg-secondary text-muted-foreground/70",
            )}
          >
            {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : day}
          </span>
        );
        return (
          <li key={day}>
            {done || open ? (
              <Link
                to="/program/$slug/day/$day"
                params={{ slug: programme.slug, day: String(day) }}
                aria-label={label}
                className="block rounded-full focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {moon}
              </Link>
            ) : (
              <span aria-label={label} role="img" className="block">
                {moon}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function UnitList({
  programme,
  completed,
  next,
}: {
  programme: Programme;
  completed: number[];
  next: number;
}) {
  return (
    <ol className="divide-y divide-foreground/[0.07]">
      {programme.units.map((u) => {
        const first = u.days[0]!.day;
        const last = u.days[u.days.length - 1]!.day;
        const done = u.days.filter((d) => completed.includes(d.day)).length;
        const current = u.days.some((d) => d.day === next);
        const locked = !current && done === 0;
        return (
          <li key={u.n} className="flex items-center gap-4 py-4">
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold",
                done === u.days.length
                  ? "bg-foreground text-background"
                  : current
                    ? "bg-mind-soft text-mind-strong"
                    : "bg-secondary text-muted-foreground",
              )}
            >
              {done === u.days.length ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : locked ? (
                <Lock className="h-3.5 w-3.5" />
              ) : (
                u.n
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "font-display text-[15px] font-semibold",
                  locked && "text-muted-foreground",
                )}
              >
                {u.title}
              </p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">{u.focus}</p>
            </div>
            <p className="shrink-0 text-right text-[13px] tabular-nums text-muted-foreground">
              {first === last ? `Day ${first}` : `Days ${first}–${last}`}
              {done > 0 && done < u.days.length ? (
                <span className="block font-semibold text-foreground">
                  {done}/{u.days.length}
                </span>
              ) : null}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

/** Asleep inside time in bed, per diary entry. */
export function NightsChart({ diary }: { diary: Record<string, DiaryEntry> }) {
  const nights = Object.entries(diary)
    .map(([day, e]) => ({ day: Number(day), m: nightMetrics(e), quality: e.quality }))
    .filter(
      (
        n,
      ): n is {
        day: number;
        m: NonNullable<ReturnType<typeof nightMetrics>>;
        quality: number | undefined;
      } => n.m !== null,
    )
    .sort((a, b) => a.day - b.day)
    .slice(-14);

  if (nights.length === 0) {
    return (
      <p className="text-[15px] leading-6 text-muted-foreground">
        Your nights show up here once you've filled in the sleep diary.
      </p>
    );
  }

  const maxBed = Math.max(...nights.map((n) => n.m.inBed), 600);
  const avg = (pick: (n: (typeof nights)[number]) => number) =>
    nights.reduce((s, n) => s + pick(n), 0) / nights.length;

  return (
    <div>
      <dl className="grid grid-cols-3 gap-3">
        <div>
          <dt className="text-[13px] text-muted-foreground">Asleep</dt>
          <dd className="font-display text-[22px] font-semibold tabular-nums">
            {formatDuration(avg((n) => n.m.asleep))}
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted-foreground">In bed</dt>
          <dd className="font-display text-[22px] font-semibold tabular-nums">
            {formatDuration(avg((n) => n.m.inBed))}
          </dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted-foreground">Efficiency</dt>
          <dd className="font-display text-[22px] font-semibold tabular-nums">
            {Math.round(avg((n) => n.m.efficiency))}%
          </dd>
        </div>
      </dl>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Average over your last {nights.length} {nights.length === 1 ? "night" : "nights"}
      </p>
      <div
        className="mt-5 flex h-40 items-end gap-1.5"
        role="img"
        aria-label="Time asleep inside time in bed for each night"
      >
        {nights.map((n) => (
          <div key={n.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <div
              className="relative w-full overflow-hidden rounded-[8px] bg-mind/30"
              style={{ height: `${(n.m.inBed / maxBed) * 100}%` }}
            >
              <div
                className="absolute inset-x-0 bottom-0 rounded-[8px] bg-mind"
                style={{ height: `${(n.m.asleep / n.m.inBed) * 100}%` }}
              />
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground">{n.day}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-[12px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-sm bg-mind" /> Asleep
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-sm bg-mind/30" /> In bed
        </span>
        <span className="ml-auto">By programme day</span>
      </div>
    </div>
  );
}

/** Streak calendar: one row per habit, one dot per tracked day. */
export function HabitStreaks({
  habits,
  tracker,
  field,
}: {
  habits: Entry[];
  tracker: Record<string, Record<string, boolean>>;
  field: string;
}) {
  const days = Object.keys(tracker)
    .map(Number)
    .sort((a, b) => a - b);
  if (habits.length === 0 || days.length === 0) {
    return (
      <p className="text-[15px] leading-6 text-muted-foreground">
        Habits you track from day 18 show up here.
      </p>
    );
  }
  return (
    <ul className="space-y-5">
      {habits.map((h) => {
        const done = days.filter((d) => tracker[String(d)]?.[h.id]).length;
        return (
          <li key={h.id}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[15px] font-semibold">{String(h.values[field] ?? "")}</p>
              <p className="shrink-0 text-[13px] tabular-nums text-muted-foreground">
                {done} of {days.length} days
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {days.map((d) => (
                <span
                  key={d}
                  title={`Day ${d}`}
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full text-[10px] tabular-nums",
                    tracker[String(d)]?.[h.id]
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {d}
                </span>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
