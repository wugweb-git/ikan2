import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/equip/metrics";
import { useProgramme, type Entry } from "@/lib/equip/store";
import type { EntryValues, Field, Step } from "@/lib/equip/types";
import { StepFooter, StepTitle, YesNo, fieldClass, type StepProps } from "../ui";

type Ctx = StepProps & { slug: string; day: number };

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: EntryValues[string] | undefined;
  onChange: (v: string | boolean) => void;
}) {
  if (field.type === "yesno") {
    return (
      <YesNo
        label={field.label}
        value={typeof value === "boolean" ? value : null}
        onChange={onChange}
      />
    );
  }
  if (field.type === "longtext") {
    return (
      <textarea
        aria-label={field.label}
        value={typeof value === "string" ? value : ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(fieldClass, "min-h-28 resize-none")}
      />
    );
  }
  return (
    <input
      aria-label={field.label}
      type={field.type === "time" ? "time" : field.type === "date" ? "date" : "text"}
      value={typeof value === "string" ? value : ""}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={fieldClass}
    />
  );
}

const show = (field: Field, v: EntryValues[string] | undefined) => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (field.type === "time") return formatTime(v);
  if (field.type === "date")
    return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return v;
};

/** Horizontal, swipeable rail of cards — one card per entry. */
function Rail({ children, count }: { children: ReactNode; count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef(count);
  useEffect(() => {
    // follow a card the user just added; don't jump when cards are seeded in bulk
    if (count === last.current + 1)
      ref.current?.scrollTo({ left: ref.current.scrollWidth, behavior: "smooth" });
    last.current = count;
  }, [count]);
  return (
    <div
      ref={ref}
      className="no-scrollbar -mx-5 mt-6 flex items-start snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2"
    >
      {children}
    </div>
  );
}

const cardClass = "w-[86%] shrink-0 snap-start rounded-[26px] p-5";

function SavedCard({
  entry,
  fields,
  index,
  onRemove,
  children,
}: {
  entry: Entry;
  fields: Field[];
  index: number;
  onRemove?: () => void;
  children?: ReactNode;
}) {
  return (
    <article className={cn(cardClass, "bg-secondary/70")} aria-label={`Card ${index + 1}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-muted-foreground">Card {index + 1}</p>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Delete card ${index + 1}`}
            className="-m-2 grid h-9 w-9 place-items-center rounded-full text-muted-foreground active:bg-background"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <dl className="mt-2 space-y-3">
        {fields.map((f) => {
          const v = show(f, entry.values[f.key]);
          return v ? (
            <div key={f.key}>
              <dt className="text-xs text-muted-foreground">{f.label}</dt>
              <dd className="mt-0.5 whitespace-pre-line text-[15px] font-medium leading-snug">
                {v}
              </dd>
            </div>
          ) : null;
        })}
      </dl>
      {children}
    </article>
  );
}

function NewCard({
  fields,
  onAdd,
  label = "New card",
}: {
  fields: Field[];
  onAdd: (v: EntryValues) => void;
  label?: string;
}) {
  const [values, setValues] = useState<EntryValues>({});
  const firstText = fields.find(
    (f) => f.type !== "yesno" && f.type !== "time" && f.type !== "date",
  );
  const ready = firstText
    ? Boolean(String(values[firstText.key] ?? "").trim())
    : Object.keys(values).length > 0;
  return (
    <form
      className={cn(cardClass, "bg-background ring-1 ring-foreground/10")}
      onSubmit={(e) => {
        e.preventDefault();
        if (!ready) return;
        onAdd(values);
        setValues({});
      }}
    >
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-3 space-y-3">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {f.label}
            </span>
            <FieldInput
              field={f}
              value={values[f.key]}
              onChange={(v) => setValues((p) => ({ ...p, [f.key]: v }))}
            />
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={!ready}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background disabled:opacity-30"
      >
        <Plus className="h-4 w-4" /> Add card
      </button>
    </form>
  );
}

function Timer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(
      () => setLeft((l) => (l <= 1 ? (setRunning(false), 0) : l - 1)),
      1000,
    );
    return () => window.clearInterval(t);
  }, [running]);
  return (
    <button
      type="button"
      onClick={() => (left === 0 ? (setLeft(seconds), setRunning(true)) : setRunning(!running))}
      className="mt-4 flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-semibold"
      aria-live="polite"
    >
      {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      <span className="tabular-nums">
        {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
      </span>
      <span className="font-normal text-muted-foreground">
        {left === 0 ? "Time's up" : running ? "writing time" : "Start timer"}
      </span>
    </button>
  );
}

export function EntriesStep({
  step,
  slug,
  day,
  onNext,
  onBack,
}: Ctx & { step: Extract<Step, { kind: "entries" }> }) {
  const { entries, addEntry, removeEntry } = useProgramme(slug);
  const list = entries(step.collection);
  const full = step.limit !== undefined && list.length >= step.limit;

  return (
    <>
      <StepTitle title={step.title} prompt={step.prompt} />
      <div className="flex items-center gap-3">
        {step.timerSeconds ? <Timer seconds={step.timerSeconds} /> : null}
        <p className="mt-4 text-sm text-muted-foreground">
          {list.length} {list.length === 1 ? "card" : "cards"}
          {step.limit ? ` of ${step.limit}` : ""}
          {list.length > 1 ? ", swipe to see them" : ""}
        </p>
      </div>
      <Rail count={list.length}>
        {step.example && list.length === 0 ? (
          <article className={cn(cardClass, "bg-mind-soft")}>
            <p className="text-sm font-semibold text-mind-strong">Example</p>
            <dl className="mt-2 space-y-3">
              {step.fields.map((f) => {
                const v = show(f, step.example?.[f.key]);
                return v ? (
                  <div key={f.key}>
                    <dt className="text-xs text-mind-strong/80">{f.label}</dt>
                    <dd className="mt-0.5 text-[15px] font-medium">{v}</dd>
                  </div>
                ) : null;
              })}
            </dl>
          </article>
        ) : null}
        {list.map((entry, i) => (
          <SavedCard
            key={entry.id}
            entry={entry}
            fields={step.fields}
            index={i}
            {...(entry.day === day
              ? { onRemove: () => removeEntry(step.collection, entry.id) }
              : {})}
          />
        ))}
        {full ? null : (
          <NewCard fields={step.fields} onAdd={(v) => addEntry(step.collection, v, day)} />
        )}
      </Rail>
      <StepFooter onBack={onBack} onNext={onNext} />
    </>
  );
}

export function ReviewStep({
  step,
  slug,
  day,
  onNext,
  onBack,
}: Ctx & { step: Extract<Step, { kind: "review" }> }) {
  const { state, entries, addEntry, patchEntry } = useProgramme(slug);
  const list = entries(step.collection);
  const reviewKeys = new Set(step.fields.map((f) => f.key));

  // Seed checklist picks as cards once, so the user reviews what they chose.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current || !step.seedFrom) return;
    const raw = state.answers[step.seedFrom.choiceKey];
    // wait for stored answers to hydrate before deciding what to seed
    if (raw === undefined && Object.keys(state.answers).length === 0) return;
    seeded.current = true;
    const picks = Array.isArray(raw) ? raw : [];
    const have = new Set(list.map((e) => String(e.values[step.seedFrom!.field] ?? "")));
    picks
      .filter((p) => !have.has(p))
      .forEach((p) => addEntry(step.collection, { [step.seedFrom!.field]: p }, day));
  }, [state.answers, step, list, addEntry, day]);

  const infoFields = (e: Entry): Field[] =>
    Object.keys(e.values)
      .filter((k) => !reviewKeys.has(k))
      .map(
        (k) =>
          step.addFields?.find((f) => f.key === k) ?? { key: k, label: labelFor(k), type: "text" },
      );

  const answered = list.filter((e) =>
    step.fields.every((f) => e.values[f.key] !== undefined && e.values[f.key] !== ""),
  ).length;

  return (
    <>
      <StepTitle title={step.title} prompt={step.prompt} />
      <p className="mt-4 text-sm text-muted-foreground">
        {list.length === 0
          ? "No cards yet."
          : `${answered} of ${list.length} answered${list.length > 1 ? ", swipe to see them" : ""}`}
      </p>
      <Rail count={list.length}>
        {list.map((entry, i) => (
          <SavedCard key={entry.id} entry={entry} fields={infoFields(entry)} index={i}>
            <div className="mt-4 space-y-3 border-t border-foreground/[0.07] pt-4">
              {step.fields.map((f) => (
                <label key={f.key} className="block">
                  <span className="mb-2 block text-sm font-semibold">{f.label}</span>
                  <FieldInput
                    field={f}
                    value={entry.values[f.key]}
                    onChange={(v) => patchEntry(step.collection, entry.id, { [f.key]: v })}
                  />
                </label>
              ))}
            </div>
          </SavedCard>
        ))}
        {step.addFields ? (
          <NewCard
            fields={[...step.addFields, ...step.fields]}
            onAdd={(v) => addEntry(step.collection, v, day)}
          />
        ) : null}
      </Rail>
      <StepFooter onBack={onBack} onNext={onNext} />
    </>
  );
}

const labelFor = (key: string) => key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");

export function TrackerStep({
  step,
  slug,
  day,
  onNext,
  onBack,
}: Ctx & { step: Extract<Step, { kind: "tracker" }> }) {
  const { state, entries, addEntry, setTracked } = useProgramme(slug);
  const habits = entries(step.collection);
  const today = state.tracker[String(day)] ?? {};
  const [draft, setDraft] = useState("");
  const pastDays = Object.keys(state.tracker)
    .map(Number)
    .filter((d) => d < day)
    .sort((a, b) => a - b)
    .slice(-6);

  return (
    <>
      <StepTitle title={step.title} prompt={step.prompt} />
      {habits.length === 0 ? (
        <p className="mt-6 text-[15px] leading-6 text-muted-foreground">
          Add the habit you're building to start tracking it.
        </p>
      ) : null}
      <ul className="mt-6 space-y-3">
        {habits.map((h) => (
          <li key={h.id} className="rounded-[22px] bg-secondary/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[16px] font-semibold leading-snug">
                {String(h.values[step.field] ?? "")}
              </p>
              <div className="flex gap-1" aria-label="Recent days">
                {pastDays.map((d) => (
                  <span
                    key={d}
                    title={`Day ${d}`}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      state.tracker[String(d)]?.[h.id] ? "bg-foreground" : "bg-foreground/15",
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3">
              <YesNo
                label={step.prompt}
                value={today[h.id]}
                onChange={(v) => setTracked(day, h.id, v)}
              />
            </div>
          </li>
        ))}
      </ul>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          addEntry(step.collection, { [step.field]: draft.trim() }, day);
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a habit"
          aria-label="Add a habit"
          className={fieldClass}
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="h-[50px] shrink-0 rounded-[16px] bg-secondary px-4 text-sm font-semibold disabled:opacity-40"
        >
          Add
        </button>
      </form>
      <StepFooter onBack={onBack} onNext={onNext} />
    </>
  );
}
