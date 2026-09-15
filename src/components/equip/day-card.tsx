import { Check, ChevronDown, Clock3, FileText } from "lucide-react";
import { DateText } from "@/components/date-text";
import { formatSeconds } from "@/hooks/use-active-time";
import { moodScale } from "@/lib/journal";
import type { SessionFeedback } from "@/lib/equip/store";
import { shortDate, type DayResponse } from "@/lib/equip/journey";

/** One finished programme day, collapsed to its title; opens to what was written or chosen. */
export function DayCard({
  title,
  day,
  at,
  responses,
  seconds,
  feedback,
}: {
  title: string;
  day: number;
  at?: string | undefined;
  responses: DayResponse[];
  /** active time spent on the day */
  seconds?: number | undefined;
  feedback?: SessionFeedback | undefined;
}) {
  const feel = feedback?.feel ? moodScale[feedback.feel - 1] : undefined;
  return (
    <details className="group overflow-hidden rounded-[20px] border border-foreground/10 bg-background">
      <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-foreground text-background">
          <Check className="h-[18px] w-[18px]" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold">
            {day === 0 ? "Onboarding" : `Day ${day} · ${title}`}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12px] text-muted-foreground">
            {at ? <DateText>{shortDate(at)}</DateText> : <span>Completed</span>}
            {seconds ? (
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                {formatSeconds(seconds)}
              </span>
            ) : null}
            {responses.length ? (
              <span>
                {responses.length} {responses.length === 1 ? "response" : "responses"}
              </span>
            ) : null}
            {feel ? <span aria-label={`Felt ${feel.label}`}>{feel.emoji}</span> : null}
          </span>
        </span>
        <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-2 border-t border-foreground/10 px-4 py-3">
        {feedback ? (
          <div className="rounded-[14px] border border-foreground/10 px-3.5 py-2.5 text-[14px]">
            <p className="text-[12px] font-semibold text-muted-foreground">How the session went</p>
            <p className="mt-1">
              {feedback.helpful ? `Helpful: ${feedback.helpful} of 5` : null}
              {feedback.helpful && feel ? " · " : null}
              {feel ? `Felt ${feel.label.toLowerCase()} after` : null}
            </p>
            {feedback.note ? <p className="mt-1 leading-6">“{feedback.note}”</p> : null}
          </div>
        ) : null}
        {responses.length ? (
          responses.map((r, i) => (
            <div key={i} className="rounded-[14px] bg-secondary px-3.5 py-2.5">
              <p className="flex items-center gap-2 text-[12px] font-semibold text-muted-foreground">
                <FileText className="h-3.5 w-3.5 shrink-0" /> {r.title}
              </p>
              <ul className="mt-1 space-y-1">
                {r.lines.map((l, n) => (
                  <li key={n} className="text-[15px] leading-6">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-[14px] text-muted-foreground">
            Lessons only, nothing to write this day.
          </p>
        )}
      </div>
    </details>
  );
}
