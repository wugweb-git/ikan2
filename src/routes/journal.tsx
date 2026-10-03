import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, History } from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { EntryCard } from "@/components/journal/entry-card";
import {
  BlockHeader,
  EmojiScaleBlock,
  NoteBlock,
  TagsBlock,
  YesNoBlock,
} from "@/components/journal/blocks";
import {
  accentStyle,
  Button,
  Snackbar,
  stateLayer,
  TextField,
  useSnack,
} from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { cn } from "@/lib/utils";
import {
  addDays,
  blocksFor,
  dayKey,
  moodScale,
  painExperienceScale,
  sleepScale,
  streaks,
  stressScale,
  useJournal,
  type Answers,
  type Draft,
  type ScalePoint,
} from "@/lib/journal";
import { diaryQualityOn } from "@/lib/equip/store";
import { track } from "@/lib/analytics";

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

  const days = Array.from({ length: DAYS }, (_, i) => addDays(today, i - (DAYS - 1)));
  const dates = new Set(journal.entries.map((e) => e.date));
  const { current, best } = streaks(dates, today);
  const avgOn = (key: string) => {
    const list = journal.on(key);
    return list.length ? list.reduce((n, e) => n + e.mood_rating, 0) / list.length : null;
  };
  const daily = days.map((d) => avgOn(dayKey(d)));
  const logged = daily.filter((v): v is number => v !== null);
  const average = logged.length ? logged.reduce((n, v) => n + v, 0) / logged.length : null;

  const entries = hydrated ? journal.on(todayKey) : [];

  return (
    <IkanShell>
      <div style={accentStyle("mood")}>
        <header className="safe-top relative px-4 pb-1">
          <Link
            to="/history/journal"
            aria-label="Journal history"
            className={cn(
              stateLayer,
              "safe-pin absolute right-2 grid h-12 w-12 place-items-center rounded-full",
            )}
          >
            <History className="h-6 w-6" />
          </Link>
          <h1 className="type-headline-md">Journal</h1>
          <p className="text-[14px] text-muted-foreground">Track how you feel, one day at a time</p>
        </header>

        <section className="mt-4 grid grid-cols-2 gap-2 px-4">
          <Stat
            emoji={current > 0 ? "🔥" : "💤"}
            label="Current streak"
            value={hydrated ? current : 0}
          />
          <Stat emoji="🏆" label="Best streak" value={hydrated ? best : 0} />
        </section>

        <section className="mx-4 mt-2 rounded-[20px] bg-foreground/[0.035] px-4 py-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-[16px] font-semibold">14-day mood</h2>
            <p className="text-[14px] tabular-nums text-muted-foreground">
              {hydrated && average !== null ? `Avg ${average.toFixed(1)}/5` : "No entries yet"}
            </p>
          </div>
          <Sparkline values={hydrated ? daily : []} />
        </section>

        <section className="mt-4 px-4">
          <h2 className="font-display text-[18px] font-semibold">Today</h2>

          {hydrated ? (
            <CheckIn
              preset={preset}
              countToday={journal.on(todayKey).length}
              onSave={(d) => {
                journal.add(d);
                // No answers and no note text - only that a check-in happened.
                track("journal_saved", { answers: Object.keys(d).length });
              }}
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
          ) : null}
        </section>
        <Snackbar message={snack.message} />
      </div>
    </IkanShell>
  );
}

function Stat({ emoji, label, value }: { emoji: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-foreground/[0.05] px-4 py-3">
      <span className="text-[24px] leading-none" aria-hidden="true">
        {emoji}
      </span>
      <span>
        <span className="block text-[12px] text-muted-foreground">{label}</span>
        <span className="block font-display text-[20px] font-semibold tabular-nums">
          {value} {value === 1 ? "day" : "days"}
        </span>
      </span>
    </div>
  );
}

function Sparkline({ values }: { values: (number | null)[] }) {
  const w = 320;
  const h = 56;
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
    <>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-2 block h-auto w-full"
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
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>
          {addDays(new Date(), -(DAYS - 1)).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </span>
        <span>Today</span>
      </div>
    </>
  );
}

const emptyDraft = (mood?: number): Draft => {
  const d: Draft = { context_tags: [] };
  if (mood) d.mood_rating = mood;
  // the sleep block shares its answer with the sleep diary's last question
  const sleep = diaryQualityOn(dayKey(new Date()));
  if (sleep) d.sleep_rating = sleep;
  return d;
};

/** Only answered fields are saved; a No to pain drops the two pain follow-ups. */
function toAnswers(d: Draft): Answers {
  const a: Answers = {
    mood_rating: d.mood_rating!,
    sleep_rating: d.sleep_rating!,
    stress_level: d.stress_level!,
    pain_exist: d.pain_exist!,
    context_tags: d.context_tags ?? [],
  };
  if (d.pain_exist && d.pain_experience !== undefined) a.pain_experience = d.pain_experience;
  if (d.pain_exist && d.pain_impact !== undefined) a.pain_impact = d.pain_impact;
  if (d.freehand_text_content?.trim()) a.freehand_text_content = d.freehand_text_content.trim();
  return a;
}

function CheckIn({
  preset,
  countToday,
  onSave,
}: {
  preset: number | undefined;
  countToday: number;
  onSave: (a: Answers) => void;
}) {
  const [step, setStep] = useState(preset ? 1 : 0);
  const [draft, setDraft] = useState(() => emptyDraft(preset));
  const [fromDiary] = useState(() => draft.sleep_rating);
  const [saved, setSaved] = useState<Answers | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (saved) {
    return (
      <div className="animate-fade mt-4 rounded-[28px] bg-[var(--accent-container)] p-6 text-center text-[var(--on-accent-container)]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--accent-strong)] text-background">
          <Check className="h-7 w-7" strokeWidth={3} />
        </span>
        <p className="mt-4 font-display text-[20px] font-semibold">Check-in saved</p>
        <p className="mt-2 text-[15px]" aria-label="What you logged">
          {summaryOf(saved)}
        </p>
        <p className="mt-1 text-[13px] opacity-80">
          {countToday} {countToday === 1 ? "entry" : "entries"} logged today
        </p>
        <Button
          variant="text"
          className="mt-2"
          onClick={() => {
            setDraft(emptyDraft());
            setStep(0);
            setSaved(null);
          }}
        >
          Log another
        </Button>
      </div>
    );
  }

  const blocks = blocksFor(draft);
  const i = Math.min(step, blocks.length - 1);
  const current = blocks[i]!;
  const last = i === blocks.length - 1;
  const value = draft[current.save_as];
  const hasValue = Array.isArray(value)
    ? value.length > 0
    : typeof value === "string"
      ? value.trim().length > 0
      : value !== undefined;

  const next = () => {
    window.clearTimeout(timer.current);
    if (!last) return setStep(i + 1);
    const answers = toAnswers(draft);
    onSave(answers);
    setSaved(answers);
  };

  /** Set an answer and move on a moment later, so the choice is seen first. */
  const pick = (patch: Draft) => {
    const d = { ...draft, ...patch };
    if (d.pain_exist === false) {
      delete d.pain_experience;
      delete d.pain_impact;
    }
    setDraft(d);
    window.clearTimeout(timer.current);
    const count = blocksFor(d).length;
    timer.current = window.setTimeout(() => setStep((s) => Math.min(s + 1, count - 1)), 280);
  };

  return (
    <div className="mt-3 rounded-[24px] bg-secondary p-4">
      <div className="flex gap-1.5" aria-hidden="true">
        {blocks.map((b, n) => (
          <span
            key={b.id}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              n <= i ? "bg-[var(--accent)]" : "bg-foreground/10",
            )}
          />
        ))}
      </div>

      <div key={current.id} className="animate-fade mt-4">
        <BlockHeader
          id={current.id}
          question={current.question}
          subtitle={current.subtitle}
          step={i + 1}
          of={blocks.length}
          followUp={Boolean(current.when)}
        />
        <div className="mt-4">
          {current.type === "emoji_scale" && current.scale ? (
            <EmojiScaleBlock
              scale={current.scale}
              value={value as number | undefined}
              onPick={(v) => pick({ [current.save_as]: v })}
              label={current.question}
              note={
                current.id === "sleep" && fromDiary && draft.sleep_rating === fromDiary
                  ? "From today’s sleep diary"
                  : undefined
              }
            />
          ) : null}
          {current.type === "yes_no" ? (
            <YesNoBlock
              value={draft.pain_exist}
              onPick={(v) => pick({ pain_exist: v })}
              label={current.question}
            />
          ) : null}
          {current.type === "free_text" ? (
            <NoteBlock
              value={draft.freehand_text_content ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, freehand_text_content: v }))}
              label={current.question}
            />
          ) : null}
          {current.type === "multi_select" ? (
            <TagsBlock
              value={draft.context_tags ?? []}
              onChange={(context_tags) => setDraft((d) => ({ ...d, context_tags }))}
            />
          ) : null}
        </div>
      </div>

      {current.required && !hasValue ? (
        <p className="mt-4 text-center text-[13px] text-muted-foreground" role="status">
          Pick one to continue
        </p>
      ) : null}
      <div
        className={cn("flex items-center gap-2", current.required && !hasValue ? "mt-2" : "mt-4")}
      >
        {i > 0 ? (
          <Button variant="text" onClick={() => setStep(i - 1)}>
            Back
          </Button>
        ) : null}
        <span className="flex-1" />
        {current.required ? (
          <Button onClick={next} disabled={!hasValue}>
            {last ? "Save check-in" : "Next"}
          </Button>
        ) : last ? (
          <Button onClick={next}>Save check-in</Button>
        ) : (
          <Button variant={hasValue ? "filled" : "tonal"} onClick={next}>
            {hasValue ? "Next" : "Skip"}
          </Button>
        )}
      </div>
    </div>
  );
}

/** One line: mood, sleep and stress emoji, then pain. */
function summaryOf(a: Answers) {
  const at = (scale: ScalePoint[], v: number | undefined) => (v ? scale[v - 1] : undefined);
  const parts = [
    at(moodScale, a.mood_rating)?.emoji,
    at(sleepScale, a.sleep_rating) && `${at(sleepScale, a.sleep_rating)!.emoji} sleep`,
    at(stressScale, a.stress_level) && `${at(stressScale, a.stress_level)!.emoji} stress`,
    a.pain_exist
      ? `pain: ${at(painExperienceScale, a.pain_experience)?.label.toLowerCase() ?? "yes"}`
      : "no pain",
  ].filter(Boolean);
  return parts.join(" · ");
}
