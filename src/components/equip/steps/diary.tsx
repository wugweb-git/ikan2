import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDuration, formatTime, nightMetrics, type DiaryEntry } from "@/lib/equip/metrics";
import { useProgramme } from "@/lib/equip/store";
import { Stepper, StepFooter, TimeField, type StepProps } from "../ui";

type Question =
  | { key: "bed" | "tried" | "woke" | "up"; kind: "time"; prompt: string }
  | { key: "latency" | "awake"; kind: "minutes"; prompt: string; presets: number[] }
  | { key: "wakings"; kind: "count"; prompt: string }
  | { key: "quality"; kind: "quality"; prompt: string };

const questions: Question[] = [
  { key: "bed", kind: "time", prompt: "What time did you go to bed?" },
  { key: "tried", kind: "time", prompt: "What time did you try to fall asleep?" },
  {
    key: "latency",
    kind: "minutes",
    prompt: "How long did it take to fall asleep?",
    presets: [5, 15, 30, 45, 60],
  },
  { key: "wakings", kind: "count", prompt: "How many times did you wake up?" },
  {
    key: "awake",
    kind: "minutes",
    prompt: "How long were you awake during the night, in total?",
    presets: [0, 10, 20, 30, 60],
  },
  { key: "woke", kind: "time", prompt: "What time did you wake up?" },
  { key: "up", kind: "time", prompt: "What time did you get out of bed?" },
  { key: "quality", kind: "quality", prompt: "How would you rate your sleep?" },
];

const qualityWords = ["Very poor", "Poor", "Okay", "Good", "Very good"];

export function DiaryStep({
  slug,
  day,
  onNext,
  onBack,
}: StepProps & { slug: string; day: number }) {
  const { state, saveDiary } = useProgramme(slug);
  const saved = state.diary[String(day)];
  // Start from last night's times when there are any; close estimates are fine.
  const previous = Object.entries(state.diary)
    .filter(([d]) => Number(d) < day)
    .sort((a, b) => Number(b[0]) - Number(a[0]))[0]?.[1];
  const [entry, setEntry] = useState<DiaryEntry>(() => saved ?? {});
  const [q, setQ] = useState(0);
  const question = questions[q];

  const set = (patch: DiaryEntry) => {
    const next = { ...entry, ...patch };
    setEntry(next);
    saveDiary(day, next);
  };

  if (!question) {
    const m = nightMetrics(entry);
    return (
      <>
        <p className="text-sm font-semibold text-muted-foreground">Sleep diary</p>
        <h2 className="mt-2 font-display text-[26px] font-semibold leading-[1.18]">Your night</h2>
        {m ? (
          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-7">
            <div>
              <dt className="text-sm text-muted-foreground">Asleep</dt>
              <dd className="font-display text-[34px] font-semibold tabular-nums tracking-[-0.02em]">
                {formatDuration(m.asleep)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">In bed</dt>
              <dd className="font-display text-[34px] font-semibold tabular-nums tracking-[-0.02em]">
                {formatDuration(m.inBed)}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm text-muted-foreground">Sleep efficiency</dt>
              <dd className="mt-2">
                <div className="h-3 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-mind transition-[width] duration-700"
                    style={{ width: `${m.efficiency}%` }}
                  />
                </div>
                <p className="mt-2 text-sm">
                  <span className="font-semibold tabular-nums">{m.efficiency}%</span> of your time
                  in bed was spent asleep.
                </p>
              </dd>
            </div>
          </dl>
        ) : null}
        <ul className="mt-8 divide-y divide-foreground/[0.07] text-[15px]">
          {questions.map((qq, i) => (
            <li key={qq.key}>
              <button
                type="button"
                onClick={() => setQ(i)}
                className="flex w-full items-center justify-between gap-4 py-3 text-left"
              >
                <span className="text-muted-foreground">{qq.prompt.replace(/\?$/, "")}</span>
                <span className="shrink-0 font-semibold tabular-nums">{answerText(qq, entry)}</span>
              </button>
            </li>
          ))}
        </ul>
        <StepFooter onBack={() => setQ(questions.length - 1)} onNext={onNext} label="Save diary" />
      </>
    );
  }

  const value = entry[question.key];
  const answered =
    question.kind === "time"
      ? Boolean(value)
      : question.kind === "quality"
        ? value !== undefined
        : true;

  const next = () => {
    if (question.kind === "minutes" || question.kind === "count") {
      if (entry[question.key] === undefined) set({ [question.key]: 0 });
    }
    setQ(q + 1);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">Sleep diary</p>
        <div className="flex gap-1" aria-label={`Question ${q + 1} of ${questions.length}`}>
          {questions.map((qq, i) => (
            <span
              key={qq.key}
              className={cn("h-1.5 w-3 rounded-full", i <= q ? "bg-foreground" : "bg-secondary")}
            />
          ))}
        </div>
      </div>
      <h2
        key={question.key}
        className="animate-fade-in mt-3 font-display text-[28px] font-semibold leading-[1.15] tracking-[-0.01em] text-balance"
      >
        {question.prompt}
      </h2>
      {q === 0 && !saved ? (
        <p className="mt-2 text-sm text-muted-foreground">Close estimates are fine.</p>
      ) : null}

      <div className="mt-10">
        {question.kind === "time" ? (
          <>
            <TimeField
              label={question.prompt}
              value={entry[question.key]}
              onChange={(v) => set({ [question.key]: v })}
            />
            {!entry[question.key] && previous?.[question.key] ? (
              <button
                type="button"
                onClick={() => set({ [question.key]: previous[question.key] })}
                className="mt-3 w-full text-center text-sm font-semibold text-muted-foreground underline underline-offset-4"
              >
                Same as last time, {formatTime(previous[question.key])}
              </button>
            ) : null}
          </>
        ) : null}
        {question.kind === "minutes" ? (
          <Stepper
            unit="min"
            step={5}
            max={600}
            value={entry[question.key]}
            presets={question.presets}
            onChange={(v) => set({ [question.key]: v })}
          />
        ) : null}
        {question.kind === "count" ? (
          <Stepper
            unit="times"
            max={30}
            value={entry.wakings}
            presets={[0, 1, 2, 3, 4]}
            onChange={(v) => set({ wakings: v })}
          />
        ) : null}
        {question.kind === "quality" ? (
          <div role="radiogroup" aria-label={question.prompt} className="grid grid-cols-5 gap-2">
            {qualityWords.map((word, i) => {
              const v = i + 1;
              const on = entry.quality !== undefined && v <= entry.quality;
              return (
                <button
                  key={word}
                  type="button"
                  role="radio"
                  aria-checked={entry.quality === v}
                  onClick={() => set({ quality: v })}
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className={cn(
                      "grid aspect-square w-full place-items-center rounded-full font-display text-lg font-semibold transition-colors",
                      on ? "bg-foreground text-background" : "bg-secondary",
                    )}
                  >
                    {v}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] leading-tight",
                      entry.quality === v ? "font-semibold" : "text-muted-foreground",
                    )}
                  >
                    {word}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <StepFooter
        onBack={q === 0 ? onBack : () => setQ(q - 1)}
        onNext={next}
        disabled={!answered}
      />
    </>
  );
}

function answerText(q: Question, e: DiaryEntry) {
  const v = e[q.key];
  if (v === undefined) return "–";
  if (q.kind === "time") return formatTime(v as string);
  if (q.kind === "minutes") return `${v} min`;
  if (q.kind === "count") return `${v}`;
  return qualityWords[(v as number) - 1] ?? "–";
}
