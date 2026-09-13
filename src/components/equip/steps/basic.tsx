import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgramme } from "@/lib/equip/store";
import type { Step } from "@/lib/equip/types";
import { OptionTile, StepFooter, StepTitle, fieldClass, type StepProps } from "../ui";

type Ctx = StepProps & { slug: string; day: number };

export function LessonStep({
  step,
  onNext,
  onBack,
}: Ctx & { step: Extract<Step, { kind: "lesson" }> }) {
  return (
    <>
      <h2 className="font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.015em] text-balance">
        {step.title}
      </h2>
      <div className="mt-5 space-y-4 text-[17px] leading-[1.6] text-foreground/80">
        {step.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {step.bullets ? (
        <ul className="mt-6 divide-y divide-foreground/[0.07] border-y border-foreground/[0.07]">
          {step.bullets.map((b) => (
            <li key={b} className="py-3.5 text-[16px] font-medium">
              {b}
            </li>
          ))}
        </ul>
      ) : null}
      {step.example ? (
        <figure className="mt-6 rounded-[22px] bg-secondary/70 p-5">
          <figcaption className="text-sm font-semibold text-muted-foreground">
            For example
          </figcaption>
          <p className="mt-2 text-[15px] leading-[1.55]">{step.example}</p>
        </figure>
      ) : null}
      <StepFooter onBack={onBack} onNext={onNext} />
    </>
  );
}

export function ChoiceStep({
  step,
  slug,
  onNext,
  onBack,
}: Ctx & { step: Extract<Step, { kind: "choice" }> }) {
  const { state, setAnswer } = useProgramme(slug);
  const raw = state.answers[step.key];
  const picked = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
  const known = new Set(step.options.map((o) => o.label));
  const custom = picked.filter((p) => !known.has(p));
  const [other, setOther] = useState("");

  const toggle = (label: string) => {
    if (!step.multi) return setAnswer(step.key, label);
    setAnswer(
      step.key,
      picked.includes(label) ? picked.filter((p) => p !== label) : [...picked, label],
    );
  };

  return (
    <>
      <StepTitle title={step.title} prompt={step.prompt} />
      <p className="mt-2 text-sm text-muted-foreground">
        {step.multi ? "Choose all that apply." : "Choose one."}
      </p>
      <div
        className="mt-6 space-y-2"
        role={step.multi ? "group" : "radiogroup"}
        aria-label={step.prompt}
      >
        {step.options.map((o) => (
          <OptionTile
            key={o.label}
            selected={picked.includes(o.label)}
            multi={step.multi}
            glyph={o.glyph}
            onClick={() => toggle(o.label)}
          >
            {o.label}
          </OptionTile>
        ))}
        {custom.map((label) => (
          <OptionTile key={label} selected multi onClick={() => toggle(label)}>
            {label}
          </OptionTile>
        ))}
      </div>
      {step.other ? (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const label = other.trim();
            if (label && !picked.includes(label)) setAnswer(step.key, [...picked, label]);
            setOther("");
          }}
        >
          <input
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="Something else"
            aria-label="Add something else"
            className={fieldClass}
          />
          <button
            type="submit"
            disabled={!other.trim()}
            className="h-[50px] shrink-0 rounded-[16px] bg-secondary px-4 text-sm font-semibold disabled:opacity-40"
          >
            Add
          </button>
        </form>
      ) : null}
      <StepFooter onBack={onBack} onNext={onNext} disabled={picked.length === 0} />
    </>
  );
}

export function ScaleStep({
  step,
  slug,
  onNext,
  onBack,
}: Ctx & { step: Extract<Step, { kind: "scale" }> }) {
  const { state, setAnswer } = useProgramme(slug);
  const value =
    typeof state.answers[step.key] === "number" ? (state.answers[step.key] as number) : undefined;
  const values = Array.from({ length: step.max - step.min + 1 }, (_, i) => step.min + i);

  return (
    <>
      <StepTitle title={step.title} prompt={step.prompt} />
      <p className="mt-8 text-center font-display text-[64px] font-semibold leading-none tabular-nums tracking-[-0.03em]">
        {value ?? "–"}
        <span className="ml-2 align-middle text-lg font-medium text-muted-foreground">
          {step.unit}
        </span>
      </p>
      <div className="mt-8 flex h-44 items-end gap-2" role="radiogroup" aria-label={step.prompt}>
        {values.map((v, i) => {
          const active = value !== undefined && v <= value;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={value === v}
              aria-label={`${v} ${step.unit}`}
              onClick={() => setAnswer(step.key, v)}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span
                className={cn(
                  "w-full rounded-[10px] transition-colors duration-300",
                  active ? "bg-foreground" : "bg-secondary",
                )}
                style={{ height: `${28 + (i / (values.length - 1)) * 72}%` }}
              />
              <span
                className={cn(
                  "text-xs font-semibold tabular-nums",
                  value === v ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {v}
              </span>
            </button>
          );
        })}
      </div>
      <StepFooter onBack={onBack} onNext={onNext} disabled={value === undefined} />
    </>
  );
}

export function ReflectStep({
  step,
  slug,
  onNext,
  onBack,
}: Ctx & { step: Extract<Step, { kind: "reflect" }> }) {
  const { state, setAnswer } = useProgramme(slug);
  const value =
    typeof state.answers[step.key] === "string" ? (state.answers[step.key] as string) : "";
  return (
    <>
      <StepTitle title={step.title} prompt={step.prompt} />
      <textarea
        value={value}
        onChange={(e) => setAnswer(step.key, e.target.value)}
        placeholder="Write as much or as little as you like"
        aria-label={step.prompt}
        className={cn(
          fieldClass,
          "mt-6 min-h-48 resize-none bg-secondary/60 text-[17px] leading-[1.55] ring-0",
        )}
      />
      <StepFooter onBack={onBack} onNext={onNext} disabled={!step.optional && !value.trim()} />
    </>
  );
}

export function ConcludeStep({
  step,
  slug,
  day,
  onNext,
  onBack,
  isLastDay,
}: Ctx & { step: Extract<Step, { kind: "conclude" }>; isLastDay: boolean }) {
  const { state, setAnswer } = useProgramme(slug);
  const key = step.reflectKey ? `${step.reflectKey}@${day}` : null;
  const value = key && typeof state.answers[key] === "string" ? (state.answers[key] as string) : "";
  const [full, setFull] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setFull(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <div className="flex flex-col items-center pt-6 text-center">
        {/* crescent waxes to a full moon */}
        <div
          className="relative h-28 w-28 overflow-hidden rounded-full bg-foreground"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 rounded-full bg-background transition-transform duration-[1600ms] ease-[cubic-bezier(.32,.72,0,1)] motion-reduce:transition-none"
            style={{ transform: full ? "translateX(105%)" : "translateX(28%)" }}
          />
          <Check
            className="absolute inset-0 m-auto h-10 w-10 text-background transition-opacity delay-700 duration-500"
            style={{ opacity: full ? 1 : 0 }}
            strokeWidth={2.5}
          />
        </div>
        <p className="mt-7 text-sm font-semibold text-muted-foreground">Day {day} complete</p>
        <p className="mt-2 max-w-[20rem] font-display text-[24px] font-semibold leading-[1.25] text-balance">
          {step.line}
        </p>
      </div>
      {key ? (
        <div className="mt-8">
          <label className="text-sm font-semibold" htmlFor="stood-out">
            {step.prompt}
          </label>
          <textarea
            id="stood-out"
            value={value}
            onChange={(e) => setAnswer(key, e.target.value)}
            placeholder="Optional"
            className={cn(fieldClass, "mt-2 min-h-28 resize-none bg-secondary/60 ring-0")}
          />
        </div>
      ) : null}
      <StepFooter
        onBack={onBack}
        onNext={onNext}
        label={isLastDay ? "Finish the programme" : `Finish day ${day}`}
      />
    </>
  );
}
