import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { moodScale } from "@/lib/journal";

/** The card itself, also shown at the end of a resource (the External section). */
export function MoodCheckinCard({
  loggedToday,
  className = "mx-4",
}: {
  loggedToday: number;
  className?: string | undefined;
}) {
  return (
    <section className={cn("surface p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="type-body-sm font-semibold text-muted-foreground">Today’s check-in</p>
          <h2 className="type-subhead mt-1">How are you feeling?</h2>
        </div>
        <span className="type-label-md rounded-full bg-secondary px-2.5 py-1 text-muted-foreground">
          {loggedToday ? `${loggedToday} today` : "40 sec"}
        </span>
      </div>
      <p className="type-body-sm mt-1 text-muted-foreground">
        Mood, sleep, stress and pain in a few quick taps.
      </p>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {moodScale.map((m) => (
          <Link
            key={m.value}
            to="/journal"
            search={{ mood: m.value }}
            aria-label={m.label}
            className="flex flex-col items-center gap-1 rounded-2xl bg-secondary py-2 transition-transform active:scale-95"
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {m.emoji}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">{m.label}</span>
          </Link>
        ))}
      </div>
      <Link
        to="/journal"
        className="type-body-md font-semibold mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-background transition-transform active:scale-[.98]"
      >
        <Plus className="h-4 w-4" /> {loggedToday ? "Add another check-in" : "Log today’s mood"}
      </Link>
    </section>
  );
}
