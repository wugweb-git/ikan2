import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { EntryCard } from "@/components/journal/entry-card";
import { accentStyle, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import {
  addDays,
  contextTags,
  dayKey,
  moodScale,
  sleepScale,
  streaks,
  stressScale,
  useJournal,
  type JournalEntry,
  type ScalePoint,
} from "@/lib/journal";

/* Journal history: a summary, 30-day trends for mood, sleep, stress and pain, a month calendar
 * (tap a day to read it) and one line per month. The day-to-day journal lives at /journal. */

export const Route = createFileRoute("/history/journal")({
  head: () => pageMeta("Journal history", "Your mood check-ins, day by day and month by month."),
  component: JournalHistoryPage,
});

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthLabel = (y: number, m: number) =>
  new Date(y, m, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

function JournalHistoryPage() {
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const journal = useJournal();
  const list = hydrated
    ? [...journal.entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];
  const streak = streaks(new Set(list.map((e) => e.date)));
  const painDays = new Set(list.filter((e) => e.pain_exist).map((e) => e.date)).size;

  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState(dayKey(now));
  const shift = (n: number) =>
    setCursor(({ y, m }) => {
      const d = new Date(y, m + n, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const first = new Date(cursor.y, cursor.m, 1);
  const lead = (first.getDay() + 6) % 7; // Monday first
  const daysIn = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysIn }, (_, i) => new Date(cursor.y, cursor.m, i + 1)),
  ];
  const moodOn = (key: string) => {
    const es = list.filter((e) => e.date === key);
    return es.length ? es.reduce((n, e) => n + e.mood_rating, 0) / es.length : null;
  };
  const inMonth = list.filter((e) =>
    e.date.startsWith(`${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`),
  );
  const dayEntries = list.filter((e) => e.date === selected);
  const isFuture = (d: Date) => dayKey(d) > dayKey(now);

  const monthKeys = [...new Set(list.map((e) => e.date.slice(0, 7)))];
  const months = monthKeys.map((key) => {
    const es = list.filter((e) => e.date.startsWith(key));
    const [y, mo] = key.split("-").map(Number) as [number, number];
    const tagCount = new Map<string, number>();
    for (const e of es) for (const t of e.context_tags) tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
    return {
      key,
      y,
      m: mo - 1,
      label: monthLabel(y, mo - 1),
      count: es.length,
      mood: mean(es, "mood_rating"),
      sleep: mean(es, "sleep_rating"),
      stress: mean(es, "stress_level"),
      pain: new Set(es.filter((e) => e.pain_exist).map((e) => e.date)).size,
      tags: [...tagCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => contextTags.find((t) => t.id === id))
        .filter((t) => t !== undefined),
    };
  });

  const trendDays = Array.from({ length: TREND_DAYS }, (_, i) =>
    dayKey(addDays(now, i - (TREND_DAYS - 1))),
  );
  const onDay = (k: string) => list.filter((e) => e.date === k);
  const painOn = (k: string) => {
    const es = onDay(k).filter((e) => e.pain_exist);
    if (!es.length) return null;
    return Math.max(...es.map((e) => e.pain_impact ?? 1));
  };

  return (
    <IkanShell>
      <div style={accentStyle("mood")}>
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/journal" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
          title="Journal history"
        />

        <section className="mx-4 space-y-2">
          <div className="grid grid-cols-3 divide-x divide-background rounded-[24px] bg-secondary py-4 text-center">
            {[
              { v: hydrated ? String(list.length) : "—", l: "Check-ins" },
              { v: hydrated ? String(streak.best) : "—", l: "Best streak" },
              { v: hydrated ? String(painDays) : "—", l: "Days with pain" },
            ].map((x) => (
              <div key={x.l}>
                <p className="font-display text-[22px] font-bold tabular-nums">{x.v}</p>
                <p className="type-label-md text-muted-foreground">{x.l}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["Mood", moodScale, mean(list, "mood_rating")],
                ["Sleep", sleepScale, mean(list, "sleep_rating")],
                ["Stress", stressScale, mean(list, "stress_level")],
              ] as const
            ).map(([label, scale, v]) => (
              <div key={label} className="rounded-[20px] border border-foreground/10 p-3">
                <p className="type-label-md text-muted-foreground">{label}</p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-[22px] leading-none" aria-hidden="true">
                    {v !== null ? scale[Math.round(v) - 1]?.emoji : "·"}
                  </span>
                  <span className="font-display text-[17px] font-semibold tabular-nums">
                    {v !== null ? v.toFixed(1) : "—"}
                  </span>
                  <span className="type-label-md text-muted-foreground">/5</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Trends */}
        <section className="mx-4 mt-4 rounded-[24px] border border-foreground/10 p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-[17px] font-semibold">Last 30 days</h2>
            <p className="type-label-md text-muted-foreground">daily average, 1 to 5</p>
          </div>
          <div className="mt-3 space-y-3">
            {(
              [
                ["Mood", "mood_rating", moodScale],
                ["Sleep", "sleep_rating", sleepScale],
                ["Stress", "stress_level", stressScale],
              ] as const
            ).map(([label, key, scale]) => (
              <TrendLine
                key={key}
                label={label}
                scale={scale}
                values={hydrated ? trendDays.map((d) => mean(onDay(d), key)) : []}
              />
            ))}
            <div>
              <div className="flex items-baseline justify-between">
                <p className="type-body-sm font-medium">Pain</p>
                <p className="type-label-md text-muted-foreground">darker = more impact</p>
              </div>
              <div
                className="mt-1.5 grid gap-[3px]"
                style={{ gridTemplateColumns: `repeat(${TREND_DAYS}, minmax(0, 1fr))` }}
                role="img"
                aria-label={`Pain on ${trendDays.filter((d) => painOn(d) !== null).length} of the last ${TREND_DAYS} days`}
              >
                {trendDays.map((d) => {
                  const p = hydrated ? painOn(d) : null;
                  return (
                    <span
                      key={d}
                      className="aspect-square rounded-[3px]"
                      style={{
                        background:
                          p === null
                            ? "color-mix(in srgb, currentColor 7%, transparent)"
                            : `color-mix(in srgb, var(--accent-strong) ${30 + p * 14}%, transparent)`,
                      }}
                    />
                  );
                })}
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                <span>
                  {addDays(now, -(TREND_DAYS - 1)).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar */}
        <section className="mx-4 mt-4 rounded-[24px] border border-foreground/10 p-3">
          <div className="flex items-center justify-between">
            <IconButton label="Previous month" onClick={() => shift(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </IconButton>
            <div className="text-center">
              <p className="font-display text-[17px] font-semibold">
                {monthLabel(cursor.y, cursor.m)}
              </p>
              <p className="type-label-md text-muted-foreground">
                {hydrated
                  ? `${inMonth.length} ${inMonth.length === 1 ? "check-in" : "check-ins"}`
                  : ""}
              </p>
            </div>
            <IconButton label="Next month" onClick={() => shift(1)}>
              <ChevronRight className="h-5 w-5" />
            </IconButton>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1 text-center" role="grid">
            {weekdays.map((w) => (
              <span key={w} className="py-1 text-[11px] font-medium text-muted-foreground">
                {w}
              </span>
            ))}
            {cells.map((d, i) => {
              if (!d) return <span key={`x${i}`} />;
              const key = dayKey(d);
              const mood = hydrated ? moodOn(key) : null;
              const pained = hydrated && list.some((e) => e.date === key && e.pain_exist);
              const on = key === selected;
              const today = key === dayKey(now);
              return (
                <button
                  key={key}
                  type="button"
                  disabled={isFuture(d)}
                  onClick={() => setSelected(key)}
                  aria-pressed={on}
                  aria-label={`${d.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}${pained ? ", pain logged" : ""}`}
                  className={cn(
                    "type-label-md relative flex aspect-square flex-col items-center justify-center rounded-[12px] transition-colors disabled:opacity-30",
                    stateLayer,
                    on
                      ? "bg-foreground text-background"
                      : mood
                        ? "bg-[var(--accent-container)]"
                        : "",
                    today && !on && "ring-1 ring-foreground/40",
                  )}
                >
                  <span className="leading-none">{d.getDate()}</span>
                  <span className="mt-0.5 h-4 text-[13px] leading-4" aria-hidden="true">
                    {mood ? moodScale[Math.round(mood) - 1]?.emoji : ""}
                  </span>
                  {pained ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute right-1 top-1 h-1.5 w-1.5 rounded-full",
                        on ? "bg-background" : "bg-[var(--accent-strong)]",
                      )}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 px-4">
          <h2 className="font-display text-[18px] font-semibold">
            {new Date(`${selected}T00:00:00`).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h2>
          {dayEntries.length ? (
            <ul className="mt-3 space-y-3">
              {dayEntries.map((e) => (
                <li key={e.id}>
                  <EntryCard entry={e} />
                </li>
              ))}
            </ul>
          ) : hydrated ? (
            <p className="type-action mt-3 rounded-[20px] border border-dashed border-foreground/20 p-5 text-center text-muted-foreground">
              Nothing logged this day.
            </p>
          ) : null}
        </section>

        {months.length ? (
          <section className="mt-8 px-4">
            <h2 className="font-display text-[18px] font-semibold">By month</h2>
            <ul className="mt-3 space-y-2">
              {months.map((m) => (
                <li key={m.key}>
                  <button
                    type="button"
                    onClick={() => setCursor({ y: m.y, m: m.m })}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-[20px] bg-secondary p-4 text-left",
                      stateLayer,
                    )}
                  >
                    <span className="text-[28px] leading-none" aria-hidden="true">
                      {m.mood !== null ? moodScale[Math.round(m.mood) - 1]?.emoji : "·"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="type-title-md block">{m.label}</span>
                      <span className="type-body-sm block text-muted-foreground">
                        {m.count} {m.count === 1 ? "check-in" : "check-ins"}
                        {m.pain ? ` · pain on ${m.pain} ${m.pain === 1 ? "day" : "days"}` : ""}
                      </span>
                      <span className="type-label-md mt-2 flex flex-wrap gap-1.5">
                        {(
                          [
                            ["Mood", m.mood],
                            ["Sleep", m.sleep],
                            ["Stress", m.stress],
                          ] as const
                        )
                          .filter(([, v]) => v !== null)
                          .map(([l, v]) => (
                            <span
                              key={l}
                              className="rounded-full bg-background px-2 py-0.5 tabular-nums"
                            >
                              {l} {v!.toFixed(1)}
                            </span>
                          ))}
                        {m.tags.map((t) => (
                          <span key={t.id} className="rounded-full bg-background px-2 py-0.5">
                            {t.emoji} {t.label}
                          </span>
                        ))}
                      </span>
                    </span>
                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </IkanShell>
  );
}

const TREND_DAYS = 30;

type NumKey = "mood_rating" | "sleep_rating" | "stress_level";

/** Average of one answer over the check-ins that have it; null when none do. */
function mean(es: JournalEntry[], key: NumKey) {
  const vs = es.map((e) => e[key]).filter((v): v is number => v !== undefined);
  return vs.length ? vs.reduce((n, v) => n + v, 0) / vs.length : null;
}

/** One small line chart, 1 to 5, with gaps on days without an answer. */
function TrendLine({
  label,
  scale,
  values,
}: {
  label: string;
  scale: readonly ScalePoint[];
  values: (number | null)[];
}) {
  const w = 300;
  const h = 40;
  const pad = 5;
  const n = Math.max(values.length, TREND_DAYS);
  const pts = values.map((v, i) =>
    v === null
      ? null
      : { x: pad + (i * (w - pad * 2)) / (n - 1), y: pad + ((5 - v) / 4) * (h - pad * 2) },
  );
  const segments: { x: number; y: number }[][] = [];
  let run: { x: number; y: number }[] = [];
  for (const p of pts) {
    if (p) run.push(p);
    else if (run.length) {
      segments.push(run);
      run = [];
    }
  }
  if (run.length) segments.push(run);
  const known = values.filter((v): v is number => v !== null);
  const latest = known.at(-1);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="type-body-sm font-medium">{label}</p>
        <p className="type-label-md text-muted-foreground">
          {latest !== undefined
            ? `latest ${scale[Math.round(latest) - 1]?.emoji ?? ""} ${latest.toFixed(1)}`
            : "no answers yet"}
        </p>
      </div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-1 block h-auto w-full"
        role="img"
        aria-label={`${label} over the last ${TREND_DAYS} days, ${known.length} days with an answer`}
      >
        {[1, 3, 5].map((v) => (
          <line
            key={v}
            x1={pad}
            x2={w - pad}
            y1={pad + ((5 - v) / 4) * (h - pad * 2)}
            y2={pad + ((5 - v) / 4) * (h - pad * 2)}
            stroke="currentColor"
            strokeOpacity="0.08"
          />
        ))}
        {segments.map((seg, i) =>
          seg.length > 1 ? (
            <polyline
              key={i}
              points={seg.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null,
        )}
        {pts.map((p, i) =>
          p ? <circle key={i} cx={p.x} cy={p.y} r="2.6" fill="var(--accent-strong)" /> : null,
        )}
      </svg>
    </div>
  );
}
