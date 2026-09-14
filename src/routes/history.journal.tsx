import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { EntryCard } from "@/components/journal/entry-card";
import { accentStyle, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { dayKey, moodScale, streaks, useJournal } from "@/lib/journal";

/* Journal history: a summary, a month calendar of moods (tap a day to read it) and one line per
 * month. The design is still open; the day-to-day journal lives at /journal. */

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
  const avg = list.length ? list.reduce((n, e) => n + e.mood, 0) / list.length : null;
  const streak = streaks(new Set(list.map((e) => e.date)));

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
    return es.length ? es.reduce((n, e) => n + e.mood, 0) / es.length : null;
  };
  const inMonth = list.filter((e) =>
    e.date.startsWith(`${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}`),
  );
  const dayEntries = list.filter((e) => e.date === selected);
  const isFuture = (d: Date) => dayKey(d) > dayKey(now);

  const months: { key: string; label: string; count: number; avg: number }[] = [];
  for (const e of list) {
    const key = e.date.slice(0, 7);
    const m = months.find((x) => x.key === key);
    if (m) {
      m.avg = (m.avg * m.count + e.mood) / (m.count + 1);
      m.count += 1;
    } else {
      const [y, mo] = key.split("-").map(Number) as [number, number];
      months.push({ key, label: monthLabel(y, mo - 1), count: 1, avg: e.mood });
    }
  }

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

        <section className="mx-4 grid grid-cols-3 divide-x divide-background rounded-[24px] bg-secondary py-4 text-center">
          {[
            { v: hydrated ? String(list.length) : "—", l: "Check-ins" },
            { v: avg !== null ? `${avg.toFixed(1)}/5` : "—", l: "Average mood" },
            { v: hydrated ? String(streak.best) : "—", l: "Best streak" },
          ].map((x) => (
            <div key={x.l}>
              <p className="font-display text-[22px] font-bold tabular-nums">{x.v}</p>
              <p className="text-[12px] text-muted-foreground">{x.l}</p>
            </div>
          ))}
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
              <p className="text-[12px] text-muted-foreground">
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
              const on = key === selected;
              const today = key === dayKey(now);
              return (
                <button
                  key={key}
                  type="button"
                  disabled={isFuture(d)}
                  onClick={() => setSelected(key)}
                  aria-pressed={on}
                  aria-label={d.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center rounded-[12px] text-[12px] transition-colors disabled:opacity-30",
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
            <p className="mt-3 rounded-[20px] border border-dashed border-foreground/20 p-5 text-center text-[15px] text-muted-foreground">
              Nothing logged this day.
            </p>
          ) : null}
        </section>

        {months.length ? (
          <section className="mt-8 px-4">
            <h2 className="font-display text-[18px] font-semibold">By month</h2>
            <ul className="mt-3 space-y-2">
              {months.map((m) => {
                const [y, mo] = m.key.split("-").map(Number) as [number, number];
                return (
                  <li key={m.key}>
                    <button
                      type="button"
                      onClick={() => setCursor({ y, m: mo - 1 })}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[20px] bg-secondary p-4 text-left",
                        stateLayer,
                      )}
                    >
                      <span className="text-[28px] leading-none" aria-hidden="true">
                        {moodScale[Math.round(m.avg) - 1]?.emoji}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[16px] font-semibold">
                          {m.label}
                        </span>
                        <span className="block text-[13px] text-muted-foreground">
                          {m.count} {m.count === 1 ? "check-in" : "check-ins"} · average{" "}
                          {m.avg.toFixed(1)}/5
                        </span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
      </div>
    </IkanShell>
  );
}
