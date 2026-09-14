import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Trash2 } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import {
  accentStyle,
  Button,
  IconButton,
  Snackbar,
  stateLayer,
  TextField,
  useSnack,
} from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { cn } from "@/lib/utils";
import {
  addDays,
  checkinSteps,
  contextTags,
  dayKey,
  energyScale,
  moodScale,
  streaks,
  stressScale,
  useJournal,
  type Draft,
  type JournalEntry,
  type ScalePoint,
} from "@/lib/journal";

type Search = { mood?: number };

export const Route = createFileRoute("/journal")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const m = Number(search["mood"]);
    return Number.isInteger(m) && m >= 1 && m <= 5 ? { mood: m } : {};
  },
  head: () => pageMeta("Journal", "Track how you feel, one day at a time."),
  component: JournalPage,
});

const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

const DAYS = 14;

function JournalPage() {
  const hydrated = useHydrated();
  const { mood: preset } = Route.useSearch();
  const journal = useJournal();
  const snack = useSnack();
  const today = new Date();
  const todayKey = dayKey(today);
  const [selected, setSelected] = useState(todayKey);
  const strip = useRef<HTMLDivElement>(null);

  const days = Array.from({ length: DAYS }, (_, i) => addDays(today, i - (DAYS - 1)));
  const dates = new Set(journal.entries.map((e) => e.date));
  const { current, best } = streaks(dates, today);
  const avgOn = (key: string) => {
    const list = journal.on(key);
    return list.length ? list.reduce((n, e) => n + e.mood, 0) / list.length : null;
  };
  const daily = days.map((d) => avgOn(dayKey(d)));
  const logged = daily.filter((v): v is number => v !== null);
  const average = logged.length ? logged.reduce((n, v) => n + v, 0) / logged.length : null;

  useEffect(() => {
    const el = strip.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [hydrated]);

  const selectedDate = days.find((d) => dayKey(d) === selected) ?? today;
  const entries = hydrated ? journal.on(selected) : [];

  return (
    <IkanShell>
      <div style={accentStyle("mood")}>
        <header className="px-4 pb-1 pt-8">
          <h1 className="font-display text-[32px] font-semibold leading-10">Journal</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Track how you feel, one day at a time
          </p>
        </header>

        <section className="mt-5 grid grid-cols-2 gap-3 px-4">
          <Stat
            emoji={current > 0 ? "🔥" : "💤"}
            label="Current streak"
            value={hydrated ? current : 0}
          />
          <Stat emoji="🏆" label="Best streak" value={hydrated ? best : 0} />
        </section>

        <div
          ref={strip}
          className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-4 pb-1"
          role="tablist"
          aria-label="Choose a day"
        >
          {days.map((d, i) => {
            const key = dayKey(d);
            const on = key === selected;
            const avg = hydrated ? daily[i] : null;
            const point = avg != null ? moodScale[Math.round(avg) - 1] : undefined;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={d.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                onClick={() => setSelected(key)}
                className={cn(
                  "flex h-[84px] w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-[16px] transition-colors",
                  stateLayer,
                  on ? "bg-foreground text-background" : "bg-secondary",
                )}
              >
                <span className={cn("text-[12px]", on ? "opacity-80" : "text-muted-foreground")}>
                  {key === todayKey ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
                <span className="font-display text-[18px] font-semibold leading-6">
                  {d.getDate()}
                </span>
                <span className="h-5 text-[16px] leading-5" aria-hidden="true">
                  {point ? (
                    point.emoji
                  ) : (
                    <span
                      className={cn(
                        "mt-2 inline-block h-1.5 w-1.5 rounded-full",
                        on ? "bg-background/40" : "bg-foreground/20",
                      )}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <section className="mx-4 mt-4 rounded-[24px] bg-secondary p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-[16px] font-semibold">14-day mood</h2>
            <p className="text-[14px] tabular-nums text-muted-foreground">
              {hydrated && average !== null ? `Avg ${average.toFixed(1)}/5` : "No entries yet"}
            </p>
          </div>
          <Sparkline values={hydrated ? daily : []} />
        </section>

        <section className="mt-6 px-4">
          <h2 className="font-display text-[20px] font-semibold">
            {selected === todayKey
              ? "Today"
              : selectedDate.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
          </h2>

          {selected === todayKey && hydrated ? (
            <CheckIn
              preset={preset}
              countToday={journal.on(todayKey).length}
              onSave={(d) => journal.add(d)}
            />
          ) : null}

          {entries.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {entries.map((e) => (
                <li key={e.id}>
                  <EntryCard
                    entry={e}
                    onDelete={() => {
                      journal.remove(e.id);
                      snack.show("Entry deleted");
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : selected !== todayKey ? (
            <div className="mt-4 rounded-[24px] border border-dashed border-foreground/20 px-6 py-10 text-center">
              <p className="font-display text-[17px] font-semibold">Nothing logged this day</p>
              <p className="mt-1 text-[14px] text-muted-foreground">
                That's okay — every day is a fresh start
              </p>
            </div>
          ) : null}
        </section>
        <Snackbar message={snack.message} />
      </div>
    </IkanShell>
  );
}

function Stat({ emoji, label, value }: { emoji: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-[var(--accent-container)] p-4 text-[var(--on-accent-container)]">
      <span className="text-[28px] leading-none" aria-hidden="true">
        {emoji}
      </span>
      <span>
        <span className="block text-[12px]">{label}</span>
        <span className="block font-display text-[20px] font-semibold tabular-nums">
          {value} {value === 1 ? "day" : "days"}
        </span>
      </span>
    </div>
  );
}

function Sparkline({ values }: { values: (number | null)[] }) {
  const w = 320;
  const h = 80;
  const pad = 8;
  const pts = values.map((v, i) =>
    v === null
      ? null
      : { x: pad + (i * (w - pad * 2)) / (DAYS - 1), y: pad + ((5 - v) / 4) * (h - pad * 2) },
  );
  // break the line where a day has no entry
  const segments: { x: number; y: number }[][] = [];
  let run: { x: number; y: number }[] = [];
  pts.forEach((p) => {
    if (p) run.push(p);
    else if (run.length) {
      segments.push(run);
      run = [];
    }
  });
  if (run.length) segments.push(run);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-3 h-20 w-full"
      role="img"
      aria-label="Mood over the last 14 days, 1 to 5"
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
      {segments.map((s, i) => (
        <polyline
          key={i}
          points={s.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {pts.map((p, i) =>
        p ? (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="var(--accent-strong)"
            stroke="white"
            strokeWidth="2"
          />
        ) : null,
      )}
    </svg>
  );
}

const emptyDraft = (mood?: number): Partial<Draft> & { tags: string[] } =>
  mood ? { mood, tags: [] } : { tags: [] };

function CheckIn({
  preset,
  countToday,
  onSave,
}: {
  preset: number | undefined;
  countToday: number;
  onSave: (d: Draft) => void;
}) {
  const [step, setStep] = useState(preset ? 1 : 0);
  const [draft, setDraft] = useState(emptyDraft(preset));
  const [saved, setSaved] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (saved) {
    return (
      <div className="animate-fade mt-4 rounded-[28px] bg-[var(--accent-container)] p-6 text-center text-[var(--on-accent-container)]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--accent-strong)] text-background">
          <Check className="h-7 w-7" strokeWidth={3} />
        </span>
        <p className="mt-4 font-display text-[20px] font-semibold">Check-in saved</p>
        <p className="mt-1 text-[14px]">
          {countToday} {countToday === 1 ? "entry" : "entries"} logged today
        </p>
        <Button
          variant="outlined"
          className="mt-5 border-[var(--on-accent-container)]/30"
          onClick={() => {
            setDraft(emptyDraft());
            setStep(0);
            setSaved(false);
          }}
        >
          Log another
        </Button>
      </div>
    );
  }

  const current = checkinSteps[step]!;
  const last = step === checkinSteps.length - 1;
  const hasValue =
    current.key === "tags"
      ? draft.tags.length > 0
      : current.key === "note"
        ? Boolean(draft.note?.trim())
        : draft[current.key] !== undefined;

  const next = () => {
    window.clearTimeout(timer.current);
    if (!last) return setStep(step + 1);
    const entry: Draft = { mood: draft.mood!, tags: draft.tags };
    if (draft.energy !== undefined) entry.energy = draft.energy;
    if (draft.stress !== undefined) entry.stress = draft.stress;
    if (draft.note?.trim()) entry.note = draft.note.trim();
    onSave(entry);
    setSaved(true);
  };

  const pick = (key: "mood" | "energy" | "stress", value: number) => {
    setDraft((d) => ({ ...d, [key]: value }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => setStep((s) => Math.min(s + 1, checkinSteps.length - 1)),
      280,
    );
  };

  return (
    <div className="mt-4 rounded-[28px] bg-secondary p-5">
      <div className="flex gap-1.5" aria-label={`Step ${step + 1} of ${checkinSteps.length}`}>
        {checkinSteps.map((s, i) => (
          <span
            key={s.key}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= step ? "bg-[var(--accent)]" : "bg-foreground/10",
            )}
          />
        ))}
      </div>

      <div key={current.key} className="animate-fade">
        <p className="mt-5 font-display text-[20px] font-semibold leading-7">{current.title}</p>
        <p className="mt-1 text-[14px] text-muted-foreground">{current.subtitle}</p>

        <div className="mt-5">
          {current.key === "mood" ? (
            <EmojiScale
              scale={moodScale}
              value={draft.mood}
              onPick={(v) => pick("mood", v)}
              label={current.title}
            />
          ) : null}
          {current.key === "energy" ? (
            <EmojiScale
              scale={energyScale}
              value={draft.energy}
              onPick={(v) => pick("energy", v)}
              label={current.title}
            />
          ) : null}
          {current.key === "stress" ? (
            <EmojiScale
              scale={stressScale}
              value={draft.stress}
              onPick={(v) => pick("stress", v)}
              label={current.title}
            />
          ) : null}
          {current.key === "note" ? (
            <TextField
              label=""
              ariaLabel={current.title}
              value={draft.note ?? ""}
              onChange={(note) => setDraft((d) => ({ ...d, note }))}
              multiline
              placeholder="Write a line or two"
            />
          ) : null}
          {current.key === "tags" ? (
            <div className="flex flex-wrap gap-2">
              {contextTags.map((t) => {
                const on = draft.tags.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        tags: on ? d.tags.filter((x) => x !== t.id) : [...d.tags, t.id],
                      }))
                    }
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-[8px] border px-3 text-[14px] font-medium transition-colors",
                      stateLayer,
                      on
                        ? "border-transparent bg-[var(--accent-container)] text-[var(--on-accent-container)]"
                        : "border-foreground/25",
                    )}
                  >
                    {on ? <Check className="h-4 w-4" /> : <span aria-hidden="true">{t.emoji}</span>}
                    {t.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        {step > 0 ? (
          <Button variant="text" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        ) : null}
        <span className="flex-1" />
        {last ? (
          <Button onClick={next}>Save check-in</Button>
        ) : current.required ? (
          <Button onClick={next} disabled={!hasValue}>
            Next
          </Button>
        ) : (
          <Button variant={hasValue ? "filled" : "tonal"} onClick={next}>
            {hasValue ? "Next" : "Skip"}
          </Button>
        )}
      </div>
    </div>
  );
}

function EmojiScale({
  scale,
  value,
  onPick,
  label,
}: {
  scale: ScalePoint[];
  value: number | undefined;
  onPick: (v: number) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-5 gap-2">
      {scale.map((p) => {
        const on = value === p.value;
        return (
          <button
            key={p.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onPick(p.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-[16px] py-3 transition-[background-color,transform] active:scale-95",
              stateLayer,
              on
                ? "bg-[var(--accent-container)] text-[var(--on-accent-container)] ring-2 ring-[var(--accent)]"
                : "bg-background",
            )}
          >
            <span
              className={cn("text-[30px] leading-none transition-transform", on && "scale-110")}
              aria-hidden="true"
            >
              {p.emoji}
            </span>
            <span className="text-[12px] font-medium">{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function EntryCard({ entry: e, onDelete }: { entry: JournalEntry; onDelete: () => void }) {
  const mood = moodScale[e.mood - 1]!;
  const energy = e.energy ? energyScale[e.energy - 1] : undefined;
  const stress = e.stress ? stressScale[e.stress - 1] : undefined;
  return (
    <article className="rounded-[20px] border border-foreground/10 p-4">
      <div className="flex items-center gap-3">
        <span className="text-[32px] leading-none" aria-hidden="true">
          {mood.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[16px] font-semibold">
            {mood.label}{" "}
            <span className="font-sans text-[13px] font-normal text-muted-foreground">
              {e.mood}/5
            </span>
          </p>
          <p className="text-[13px] text-muted-foreground">
            {new Date(e.createdAt).toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <IconButton label="Delete entry" onClick={onDelete} className="text-muted-foreground">
          <Trash2 className="h-5 w-5" />
        </IconButton>
      </div>
      {energy || stress ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {energy ? <Chip>{`${energy.emoji} Energy: ${energy.label}`}</Chip> : null}
          {stress ? <Chip>{`${stress.emoji} Stress: ${stress.label}`}</Chip> : null}
        </div>
      ) : null}
      {e.note ? <p className="mt-3 text-[15px] leading-6">“{e.note}”</p> : null}
      {e.tags.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {e.tags.map((id) => {
            const t = contextTags.find((x) => x.id === id);
            return t ? <Chip key={id}>{`${t.emoji} ${t.label}`}</Chip> : null;
          })}
        </div>
      ) : null}
    </article>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex h-7 items-center rounded-[8px] bg-secondary px-2.5 text-[13px]">
      {children}
    </span>
  );
}
