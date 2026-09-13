import { sleepTight } from "./sleep-tight";
import type { Day, Programme } from "./types";

export const programmes: Programme[] = [sleepTight];

/** Equip programmes named in the docs whose content isn't in the app yet. */
export const upcoming = [
  { name: "Unburn", body: "Understand, manage and recover from burnout." },
  { name: "Stressbuster", body: "Skills for when stress is what keeps you up." },
  { name: "Productivity Reset", body: "Reset focus and routine, one sitting at a time." },
];

export const getProgramme = (slug: string) => programmes.find((p) => p.slug === slug);

export const allDays = (p: Programme): Day[] => p.units.flatMap((u) => u.days);

export const getDay = (p: Programme, day: number) => allDays(p).find((d) => d.day === day);

export const unitOf = (p: Programme, day: number) =>
  p.units.find((u) => u.days.some((d) => d.day === day));

export const minutesFor = (d: Day) =>
  Math.max(5, d.steps.filter((s) => s.kind !== "conclude").length * 3);
