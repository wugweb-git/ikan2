/* Reminders in the person's own calendar, with no account connection and no stored access:
 * Google Calendar opens a pre-filled event, and every other calendar app (Apple, Samsung,
 * Outlook) gets a standard .ics file with the repeat and an alert built in. */

export type CalendarEvent = {
  title: string;
  details: string;
  /** local start time */
  start: Date;
  minutes: number;
  /** repeat every day; a number limits how many days */
  daily?: boolean | number;
  /** page to open from the event */
  url?: string;
  /** alert this many minutes before the start */
  alertBefore?: number;
};

const pad = (n: number) => String(n).padStart(2, "0");
/** Floating local time (no zone), so the calendar keeps it at the same clock time. */
const local = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const utcStamp = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
const end = (e: CalendarEvent) => new Date(e.start.getTime() + e.minutes * 60_000);
const rrule = (e: CalendarEvent) =>
  e.daily ? `RRULE:FREQ=DAILY${typeof e.daily === "number" ? `;COUNT=${e.daily}` : ""}` : null;
const body = (e: CalendarEvent) => (e.url ? `${e.details}\n\nOpen iKAN: ${e.url}` : e.details);

export function googleCalendarUrl(e: CalendarEvent) {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${local(e.start)}/${local(end(e))}`,
    details: body(e),
    ctz: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
  });
  const r = rrule(e);
  if (r) q.set("recur", r);
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

const escape = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** RFC 5545 lines are folded at 75 octets. */
const fold = (line: string) => {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }
  out.push(rest);
  return out.join("\r\n");
};

export function icsFile(e: CalendarEvent) {
  const uid = `${utcStamp(e.start)}-${Math.random().toString(36).slice(2)}@ikanhealth.in`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//iKAN//Reminders//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${local(e.start)}`,
    `DTEND:${local(end(e))}`,
    rrule(e),
    `SUMMARY:${escape(e.title)}`,
    `DESCRIPTION:${escape(body(e))}`,
    e.url ? `URL:${e.url}` : null,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escape(e.title)}`,
    `TRIGGER:-PT${e.alertBefore ?? 0}M`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((l): l is string => Boolean(l));
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** Hands the .ics to the phone, which offers to add it to the default calendar app. */
export function openIcs(e: CalendarEvent, filename: string) {
  const blob = new Blob([icsFile(e)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** The next occurrence of hh:mm from now (today if still ahead, else tomorrow). */
export function nextAt(time: string, from = new Date()) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(from);
  d.setHours(h ?? 20, m ?? 30, 0, 0);
  if (d.getTime() <= from.getTime()) d.setDate(d.getDate() + 1);
  return d;
}
