import { useEffect, useState } from "react";

export type DayPart = "morning" | "afternoon" | "evening" | "night";

export type PersonalContext = {
  dayPart: DayPart;
  greeting: string;
  subline: string;
  dateLabel: string;
  city: string;
  ready: boolean;
};

const copy: Record<DayPart, { greeting: string; subline: string }> = {
  morning: { greeting: "Good morning", subline: "You slept better. Let's protect that calm today." },
  afternoon: { greeting: "Good afternoon", subline: "Midday dip is normal — a short reset helps." },
  evening: { greeting: "Good evening", subline: "Your worry usually eases after 7:30. Let's start there." },
  night: { greeting: "Winding down", subline: "Screens down soon. A slow session will help you drift off." },
};

function partOfDay(hour: number): DayPart {
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

/**
 * Presentation-level personalisation: local time of day and locale-formatted
 * date. Resolved after hydration so server and client markup match.
 */
export function usePersonalContext(name: string, city = "Pune"): PersonalContext {
  const [dayPart, setDayPart] = useState<DayPart>("morning");
  const [dateLabel, setDateLabel] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const now = new Date();
    setDayPart(partOfDay(now.getHours()));
    setDateLabel(now.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }));
    setReady(true);
  }, []);

  return {
    dayPart,
    greeting: `${copy[dayPart].greeting}, ${name}`,
    subline: copy[dayPart].subline,
    dateLabel,
    city,
    ready,
  };
}

/** Scroll offset of the app scroller, for header collapse + parallax. */
export function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return y;
}
