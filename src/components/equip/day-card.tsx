import { Check, Clock3, FileText } from "lucide-react";
import { Disclosure } from "@/components/kit/disclosure";
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
    <Disclosure
      tone="outlined"
      radius={20}
      leading={
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-foreground text-background">
          <Check className="h-[18px] w-[18px]" strokeWidth={2.5} />
        </span>
      }
      bodyClassName="space-y-2 border-t border-foreground/10 px-4 py-3"
      title={
        <>
          <span className="type-action block">
            {day === 0 ? "Onboarding" : `Day ${day} · ${title}`}
          </span>
          <span className="type-label-md mt-0.5 flex flex-wrap items-center gap-x-2 text-muted-foreground">
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
        </>
      }
    >
      {feedback ? (
        <div className="type-body-md rounded-[14px] border border-foreground/10 px-3.5 py-2.5">
          <p className="type-label-md font-semibold text-muted-foreground">How the session went</p>
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
            <p className="type-label-md font-semibold flex items-center gap-2 text-muted-foreground">
              <FileText className="h-3.5 w-3.5 shrink-0" /> {r.title}
            </p>
            <ul className="mt-1 space-y-1">
              {r.lines.map((l, n) => (
                <li key={n} className="type-body">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="type-body-md text-muted-foreground">
          Lessons only, nothing to write this day.
        </p>
      )}
    </Disclosure>
  );
}
