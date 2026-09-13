import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Step } from "@/lib/equip/types";
import { StepFooter, StepTitle, type StepProps } from "../ui";

type Label = "Thought" | "Feeling";

function Toggle({
  value,
  onChange,
  disabled,
}: {
  value: Label | undefined;
  onChange: (v: Label) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-background p-1 ring-1 ring-foreground/10">
      {(["Thought", "Feeling"] as const).map((l) => (
        <button
          key={l}
          type="button"
          disabled={disabled}
          aria-pressed={value === l}
          onClick={() => onChange(l)}
          className={cn(
            "h-10 rounded-full text-sm font-semibold transition-colors",
            value === l ? "bg-foreground text-background" : "text-muted-foreground",
            disabled && value !== l && "opacity-40",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/** Label each line as a thought or a feeling. Never scored. */
export function SortStep({
  step,
  onNext,
  onBack,
}: StepProps & { step: Extract<Step, { kind: "sort" }> }) {
  // page 0 is the worked example
  const [page, setPage] = useState(0);
  const [labels, setLabels] = useState<Record<string, Label>>({});
  const item = page === 0 ? null : step.items[page - 1];
  const total = step.items.length + 1;

  const lines = item ? item.lines.map((text) => ({ text, answer: undefined })) : step.worked.lines;
  const situation = item ? item.situation : step.worked.situation;
  const done = item ? item.lines.every((l) => labels[`${page}:${l}`]) : true;
  const same = item && done && new Set(item.lines.map((l) => labels[`${page}:${l}`])).size === 1;

  return (
    <>
      <div className="flex items-center justify-between">
        <StepTitle title={step.title} />
        <span className="text-sm tabular-nums text-muted-foreground">
          {page + 1} of {total}
        </span>
      </div>
      <p className="mt-2 text-[17px] leading-[1.5]">
        {page === 0 ? step.prompt : "Which line is the thought, and which is the feeling?"}
      </p>

      <div key={page} className="animate-fade-in mt-6 rounded-[26px] bg-secondary/70 p-5">
        <p className="font-display text-[22px] font-semibold leading-tight">{situation}</p>
        {page === 0 ? <p className="mt-1 text-sm text-muted-foreground">Done for you</p> : null}
        <div className="mt-5 space-y-5">
          {lines.map((line) => (
            <div key={line.text}>
              <p className="text-[16px] leading-[1.45]">&ldquo;{line.text}&rdquo;</p>
              <Toggle
                value={line.answer ?? labels[`${page}:${line.text}`]}
                disabled={page === 0}
                onChange={(v) => setLabels((prev) => ({ ...prev, [`${page}:${line.text}`]: v }))}
              />
            </div>
          ))}
        </div>
      </div>
      {same ? (
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          One of these is a sentence about what happened, the other is a reaction. Have another
          look.
        </p>
      ) : null}

      <StepFooter
        onBack={page === 0 ? onBack : () => setPage(page - 1)}
        onNext={() => (page + 1 < total ? setPage(page + 1) : onNext())}
        disabled={!done}
        label={page === 0 ? "Try it yourself" : "Continue"}
      />
    </>
  );
}
