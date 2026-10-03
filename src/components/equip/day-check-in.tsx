import { useState } from "react";
import { MessageSquareHeart } from "lucide-react";
import { useProgramme } from "@/lib/equip/store";
import { cn } from "@/lib/utils";
import { TextField } from "./m3";

/* End of a day, inside its conclusion: a 1 to 5 rating and a text box. Saved as the person
 * goes, so Finish just moves on. */

export function DayCheckIn({
  slug,
  day,
  prompt,
  text,
  onText,
}: {
  slug: string;
  day: number;
  /** the conclusion's own question; its answer stays with the day's answers */
  prompt?: string | undefined;
  text?: string | undefined;
  onText?: ((v: string) => void) | undefined;
}) {
  const { state, saveFeedback } = useProgramme(slug);
  const saved = state.feedback?.[String(day)];
  const [rating, setRating] = useState<number | undefined>(saved?.feel);
  const [note, setNote] = useState(saved?.note ?? "");

  const save = (next: { rating?: number; note?: string }) => {
    const r = next.rating ?? rating;
    const n = (next.note ?? note).trim();
    saveFeedback(day, { ...(r ? { feel: r } : {}), ...(n ? { note: n } : {}) });
  };

  return (
    <section className="mt-8 rounded-[24px] border border-foreground/10 bg-background p-4 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]">
          <MessageSquareHeart className="h-4 w-4" aria-hidden="true" />
        </span>
        <h2 className="type-body-lg font-semibold">How was today’s session?</h2>
      </div>
      <div
        role="radiogroup"
        aria-label="Rate today’s session from 1 to 5"
        className="mt-3 grid grid-cols-5 gap-2"
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const on = rating === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                setRating(n);
                save({ rating: n });
              }}
              className={cn(
                "type-subhead h-11 rounded-[14px] tabular-nums transition-colors",
                on ? "bg-[var(--accent-strong)] text-background" : "bg-secondary",
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="type-label-md mt-1.5 flex justify-between text-muted-foreground">
        <span>Not helpful</span>
        <span>Very helpful</span>
      </div>

      <div className="mt-4">
        {prompt && onText ? (
          <>
            <p className="type-body-lg font-semibold mb-2">{prompt}</p>
            <TextField
              label=""
              ariaLabel={prompt}
              value={text ?? ""}
              onChange={onText}
              multiline
              rows={2}
              maxLength={2000}
            />
          </>
        ) : (
          <TextField
            label="Anything that stood out? (optional)"
            value={note}
            onChange={(v) => {
              setNote(v);
              save({ note: v });
            }}
            multiline
            rows={2}
            maxLength={500}
          />
        )}
      </div>
    </section>
  );
}
