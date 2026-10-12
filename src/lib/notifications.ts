import { createLocalStore } from "@/lib/local-store";
import { getAssessment } from "@/lib/assessment/instruments";
import { frozen } from "@/lib/assessment/frozen";
import { getConsultant, hourLabel } from "@/lib/consultants";
import { getProgramme } from "@/lib/equip/programs";
import { dayKey } from "@/lib/journal";
import { useSettings } from "@/lib/profile";
import { mediumOf, resources, slugOf, useResourceStore } from "@/lib/resources";
import {
  useEverything,
  useWellnessSnapshots,
  wellnessBand,
  type ActivityEvent,
} from "@/lib/activity";

/* Notifications, in the three tiers from the iKan prototype:
 *   Needs you — something is blocked or decaying and you can fix it (the only tier that would push)
 *   Changed   — score or band moved, a new recommendation appeared (in-app only)
 *   Happened  — the activity log (never notifies)
 * Two rules: never lead with a number in "Needs you", and never report a lost streak. */

export type Notice = {
  id: string;
  tier: "needs" | "changed";
  title: string;
  body: string;
  at: string;
  icon: "assessment" | "mood" | "health" | "consult" | "score" | "program" | "resource";
  link:
    | { to: "/assessment-flow"; search: { id: string } }
    | { to: "/journal" }
    | { to: "/settings" }
    | { to: "/consult/$id"; params: { id: string } }
    | { to: "/wellness" }
    | { to: "/assessments/$slug"; params: { slug: string } }
    | { to: "/program/$slug"; params: { slug: string } }
    | { to: "/resources/$slug"; params: { slug: string } };
};

const readStore = createLocalStore<{ read: string[] }>("ikan.notifications.v1", { read: [] });

const HOUR = 3_600_000;

export function useNotifications() {
  const data = useEverything();
  const { settings } = useSettings();
  const snapshots = useWellnessSnapshots();
  const { read } = readStore.use();
  const reading = useResourceStore();
  const now = new Date();
  const notices: Notice[] = [];

  /* Needs you */
  for (const d of data.drafts) {
    if (!d.assessment || !d.updatedAt) continue;
    if (now.getTime() - new Date(d.updatedAt).getTime() < 48 * HOUR) continue;
    notices.push({
      id: `draft-${d.assessment.slug}-${d.updatedAt}`,
      tier: "needs",
      title: `Finish your ${d.assessment.name.toLowerCase()} assessment`,
      body: `You stopped partway. Pick up where you left off, it only counts once it’s complete.`,
      at: d.updatedAt,
      icon: "assessment",
      link: { to: "/assessment-flow", search: { id: d.assessment.slug } },
    });
  }

  const [rh, rm] = settings.moodReminderTime.split(":").map(Number) as [number, number];
  const reminderAt = new Date(now);
  reminderAt.setHours(rh || 21, rm || 0, 0, 0);
  const loggedToday = data.journal.entries.some((e) => e.date === dayKey(now));
  if (settings.moodReminders && now >= reminderAt && !loggedToday) {
    notices.push({
      id: `mood-${dayKey(now)}`,
      tier: "needs",
      title: "How was today?",
      body: "A quick check-in takes under a minute.",
      at: reminderAt.toISOString(),
      icon: "mood",
      link: { to: "/journal" },
    });
  }

  const latestBySlug = new Map<string, (typeof data.results)[number]>();
  for (const r of data.results) {
    const prev = latestBySlug.get(r.slug);
    if (!prev || r.completedAt > prev.completedAt) latestBySlug.set(r.slug, r);
  }
  if (settings.assessmentReminders) {
    for (const r of latestBySlug.values()) {
      const due = new Date(r.completedAt).getTime() + 14 * 24 * HOUR;
      const a = getAssessment(r.slug);
      if (!a || now.getTime() < due) continue;
      notices.push({
        id: `retake-${r.id}`,
        tier: "needs",
        title: `Time to retake ${a.name.toLowerCase()}`,
        body: "It’s been two weeks. Retaking shows how things have changed.",
        at: new Date(due).toISOString(),
        icon: "assessment",
        link: { to: "/assessments/$slug", params: { slug: a.slug } },
      });
    }
  }

  if (settings.healthConnect) {
    notices.push({
      id: "health-connect-unsynced",
      tier: "needs",
      title: "Health Connect hasn’t synced",
      body: "Your score is running without sleep and steps until it does.",
      at: now.toISOString(),
      icon: "health",
      link: { to: "/settings" },
    });
  }

  for (const b of data.bookings) {
    if (b.status !== "requested") continue;
    const start = new Date(b.startsAt);
    const until = start.getTime() - now.getTime();
    if (until < 0 || until > 24 * HOUR) continue;
    const c = getConsultant(b.consultantId);
    if (!c) continue;
    notices.push({
      id: `session-${b.id}`,
      tier: "needs",
      title: `Session with ${c.name} ${dayKey(start) === dayKey(now) ? "today" : "tomorrow"}`,
      body: `${b.mode} at ${hourLabel(start.getHours())}.`,
      at: b.createdAt,
      icon: "consult",
      link: { to: "/consult/$id", params: { id: c.id } },
    });
  }

  /* Changed */
  const weekAgoKey = dayKey(new Date(now.getTime() - 7 * 24 * HOUR));
  const weekAgo = Object.entries(snapshots)
    .filter(([k]) => k <= weekAgoKey)
    .sort(([x], [y]) => y.localeCompare(x))[0]?.[1];
  if (data.score !== null && weekAgo !== undefined && data.score !== weekAgo) {
    const up = data.score > weekAgo;
    const bandNow = wellnessBand(data.score);
    const bandThen = wellnessBand(weekAgo);
    notices.push({
      id: `score-${dayKey(now)}-${data.score}`,
      tier: "changed",
      title:
        bandNow !== bandThen
          ? `Your iKAN Score moved to ${bandNow.label}`
          : `Your iKAN Score went ${up ? "up" : "down"} this week`,
      body: up ? "See what moved it." : "The factors show what changed and when.",
      at: now.toISOString(),
      icon: "score",
      link: { to: "/wellness" },
    });
  }

  const recommended = new Set<string>();
  for (const r of [...latestBySlug.values()].sort((x, y) =>
    y.completedAt.localeCompare(x.completedAt),
  )) {
    const a = getAssessment(r.slug);
    if (!a) continue;
    const recs = frozen(a, r).recommends;
    const p = recs[0] ? getProgramme(recs[0]) : undefined;
    if (!p || recommended.has(p.slug)) continue;
    recommended.add(p.slug);
    notices.push({
      id: `rec-${r.id}`,
      tier: "changed",
      title: `New for you: ${p.name}`,
      body: `Recommended from your ${a.name.toLowerCase()} result.`,
      at: r.completedAt,
      icon: "program",
      link: { to: "/program/$slug", params: { slug: p.slug } },
    });
  }

  /* Changed: something new in the library, for two weeks after it is published and until it is
   * finished. Only the three newest, so a batch published on one day does not fill the page. */
  let fresh = 0;
  for (const r of resources) {
    if (fresh >= 3) break;
    const published = new Date(`${r.date}T00:00:00`);
    if (now.getTime() - published.getTime() > 14 * 24 * HOUR || published > now) continue;
    if (reading.progressOf(r)?.done) continue;
    const verb = { article: "read", video: "watch", audio: "listen to" }[mediumOf(r)];
    fresh += 1;
    notices.push({
      id: `resource-${r.id}`,
      tier: "changed",
      title: `New to ${verb}: ${r.title}`,
      body: `${r.category} · ${r.minutes} min`,
      at: published.toISOString(),
      icon: "resource",
      link: { to: "/resources/$slug", params: { slug: slugOf(r) } },
    });
  }

  notices.sort((x, y) => y.at.localeCompare(x.at));
  const needs = notices.filter((n) => n.tier === "needs");
  const changed = notices.filter((n) => n.tier === "changed");
  const unread = notices.filter((n) => !read.includes(n.id));
  const happened: ActivityEvent[] = data.events.slice(0, 30);

  return {
    needs,
    changed,
    happened,
    unreadIds: new Set(unread.map((n) => n.id)),
    unreadCount: unread.length,
    markAllRead: () =>
      readStore.update((s) => ({
        read: [...new Set([...s.read, ...notices.map((n) => n.id)])].slice(-300),
      })),
  };
}
