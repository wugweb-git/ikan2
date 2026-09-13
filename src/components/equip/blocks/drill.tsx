import { useState } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Block } from "@/lib/equip/types";
import { BlockHeading } from "../fields";

/** One prompt at a time. Never scored; the first item with a reveal is a worked example. */
export function DrillBlock({ block }: { block: Extract<Block, { kind: "drill" }> }) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Record<number, string[]>>(() => {
    const first = block.items[0];
    return first?.reveal ? { 0: [first.reveal] } : {};
  });

  const item = block.items[index];
  if (!item) return null;
  const multi = /everything/i.test(item.question);
  const chosen = picks[index] ?? [];
  const worked = index === 0 && Boolean(item.reveal);

  const toggle = (choice: string) => {
    if (worked) return;
    setPicks((prev) => {
      const current = prev[index] ?? [];
      const next = multi
        ? current.includes(choice)
          ? current.filter((c) => c !== choice)
          : [...current, choice]
        : [choice];
      return { ...prev, [index]: next };
    });
  };

  return (
    <div>
      <BlockHeading eyebrow="Practice" title={block.title} note={block.note} />

      {block.items.length > 1 ? (
        <div
          className="mt-5 flex gap-1.5"
          aria-label={`Prompt ${index + 1} of ${block.items.length}`}
        >
          {block.items.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-foreground" : "bg-secondary"}`}
            />
          ))}
        </div>
      ) : null}

      <div key={index} className="animate-fade-in mt-5">
        <div className="rounded-[20px] bg-secondary/70 p-4">
          <p className="font-display text-base font-semibold leading-snug">{item.prompt}</p>
        </div>
        <p className="mt-5 text-sm font-semibold">{item.question}</p>
        <div className="mt-3 space-y-2.5">
          {item.choices.map((choice) => {
            const active = chosen.includes(choice);
            return (
              <button
                key={choice}
                type="button"
                aria-pressed={active}
                onClick={() => toggle(choice)}
                className={`tile w-full rounded-2xl border p-4 text-left text-sm leading-6 transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card shadow-[var(--shadow-card)]"
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {worked ? (
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-mind-soft p-3.5 text-xs leading-5 text-mind-strong">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
            Worked example: this one is answered for you. Try the next prompts yourself.
          </p>
        ) : chosen.length ? (
          <p className="mt-4 text-xs text-muted-foreground">
            Noted. There is no score here, only practice.
          </p>
        ) : null}

        {index + 1 < block.items.length ? (
          <Button variant="outline" className="mt-5 w-full" onClick={() => setIndex(index + 1)}>
            Next prompt <ArrowRight />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
