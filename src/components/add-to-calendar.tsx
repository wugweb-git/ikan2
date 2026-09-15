import { useState } from "react";
import { CalendarDays, CalendarPlus, ChevronRight } from "lucide-react";
import { BottomSheet } from "@/components/equip/m3";
import { googleCalendarUrl, nextAt, openIcs, type CalendarEvent } from "@/lib/calendar";
import { cn } from "@/lib/utils";

/**
 * "Add to calendar" with a choice of Google Calendar or the phone's own calendar.
 * When `time` is given the person can change it in the sheet before adding (daily reminders).
 */
export function AddToCalendar({
  event,
  time,
  filename,
  label = "Add to calendar",
  className,
  variant = "outlined",
}: {
  /** for daily reminders, `start` is recalculated from the chosen time */
  event: CalendarEvent;
  time?: string;
  filename: string;
  label?: string;
  className?: string;
  variant?: "outlined" | "row";
}) {
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState(time ?? "");
  const [added, setAdded] = useState<string | null>(null);
  const validTime = !time || /^\d{2}:\d{2}$/.test(at);
  const final: CalendarEvent = time && validTime ? { ...event, start: nextAt(at) } : event;

  const when = time
    ? `Every day at ${final.start.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}${
        typeof event.daily === "number" ? ` for ${event.daily} days` : ""
      }`
    : final.start.toLocaleString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      });

  return (
    <>
      {variant === "row" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn("flex min-h-14 w-full items-center gap-4 px-4 py-2 text-left", className)}
        >
          <CalendarPlus className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-[15px] font-medium">{label}</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-current/20 px-4 text-[14px] font-semibold",
            className,
          )}
        >
          <CalendarPlus className="h-4 w-4" /> {label}
        </button>
      )}

      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setAdded(null);
        }}
        title="Add to your calendar"
      >
        <div className="rounded-[20px] bg-secondary p-4">
          <p className="font-semibold">{event.title}</p>
          <p className="mt-0.5 text-[14px] text-muted-foreground">{when}</p>
          {time ? (
            <label className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[14px]">Time</span>
              <input
                type="time"
                required
                value={at}
                onChange={(e) => setAt(e.target.value)}
                aria-invalid={!validTime}
                className="h-10 rounded-[10px] bg-background px-3 text-[15px] font-semibold tabular-nums"
              />
            </label>
          ) : null}
          {!validTime ? (
            <p role="alert" className="mt-2 text-[13px] text-[#B3261E]">
              Pick a time for the reminder.
            </p>
          ) : null}
        </div>

        <div className="mt-4 overflow-hidden rounded-[20px] border border-foreground/10">
          <a
            href={validTime ? googleCalendarUrl(final) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!validTime}
            onClick={(e) => {
              if (!validTime) return e.preventDefault();
              setAdded("Finish saving it in Google Calendar.");
            }}
            className={cn(
              "flex min-h-16 items-center gap-3 border-b border-foreground/10 px-4 py-3",
              !validTime && "pointer-events-none opacity-50",
            )}
          >
            <GoogleCalendarMark />
            <span className="flex-1">
              <span className="block text-[15px] font-semibold">Google Calendar</span>
              <span className="block text-[13px] text-muted-foreground">
                Opens a ready-made event to save
              </span>
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </a>
          <button
            type="button"
            disabled={!validTime}
            onClick={() => {
              openIcs(final, filename);
              setAdded("Open the file to add it to your calendar.");
            }}
            className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left disabled:opacity-50"
          >
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-secondary">
              <CalendarDays className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-semibold">Phone calendar</span>
              <span className="block text-[13px] text-muted-foreground">
                Apple, Samsung, Outlook and others
              </span>
            </span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <p role="status" className="mt-3 min-h-5 text-center text-[13px] text-muted-foreground">
          {added ?? "Your calendar reminds you, even when iKAN is closed."}
        </p>
      </BottomSheet>
    </>
  );
}

function GoogleCalendarMark() {
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9" aria-hidden="true">
      <rect x="3" y="3" width="30" height="30" rx="6" fill="#fff" stroke="#DADCE0" />
      <rect x="3" y="3" width="30" height="8" rx="3" fill="#4285F4" />
      <text x="18" y="27" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1A73E8">
        31
      </text>
    </svg>
  );
}
