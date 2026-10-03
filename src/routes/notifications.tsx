import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BellOff,
  CalendarCheck,
  ClipboardList,
  HeartPulse,
  Settings,
  Smile,
  Sparkles,
  Watch,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { Illustration } from "@/components/art";
import { accentStyle, IconButton, stateLayer, TopAppBar } from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { useNotifications, type Notice } from "@/lib/notifications";
import type { ActivityEvent } from "@/lib/activity";
import { EmptyState } from "@/components/kit/empty";

export const Route = createFileRoute("/notifications")({
  head: () => pageMeta("Notifications", "What needs you, what changed, and what happened."),
  component: NotificationsPage,
});

const noticeIcon: Record<Notice["icon"], { icon: LucideIcon; color: string; soft: string }> = {
  assessment: { icon: ClipboardList, color: "#3B418C", soft: "#E6E7F6" },
  mood: { icon: Smile, color: "#8C3652", soft: "#F9E2E9" },
  health: { icon: Watch, color: "#7A5A12", soft: "#FBEFD2" },
  consult: { icon: CalendarCheck, color: "#2F5580", soft: "#E3ECF8" },
  score: { icon: HeartPulse, color: "#2B634D", soft: "#DFF0E8" },
  program: { icon: Sparkles, color: "#2B634D", soft: "#DFF0E8" },
};

const eventIcon: Record<ActivityEvent["type"], LucideIcon> = {
  assessment: ClipboardList,
  mood: Smile,
  program: Sparkles,
  consult: CalendarCheck,
  resource: BookOpen,
};

const ago = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Now";
  if (mins < 60) return `${mins} min`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} h`;
  const d = Math.round(h / 24);
  return d < 7
    ? `${d} d`
    : new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

function NotificationsPage() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const n = useNotifications();
  const [tab, setTab] = useState<"all" | "needs" | "changed" | "happened">("all");
  // remember what was unread when the page opened, then mark everything read
  const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!hydrated) return;
    setFreshIds(n.unreadIds);
    const t = window.setTimeout(n.markAllRead, 600);
    return () => window.clearTimeout(t);
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const needs = hydrated ? n.needs : [];
  const changed = hydrated ? n.changed : [];
  const happened = hydrated ? n.happened : [];
  const empty = needs.length + changed.length + happened.length === 0;

  const tabs = [
    { id: "all", label: "All" },
    { id: "needs", label: `Needs you${needs.length ? ` ${needs.length}` : ""}` },
    { id: "changed", label: "Changed" },
    { id: "happened", label: "Happened" },
  ] as const;

  return (
    <IkanShell>
      <div style={accentStyle("night")}>
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
          trailing={
            <Link
              to="/settings"
              aria-label="Notification settings"
              className={cn("grid h-12 w-12 place-items-center rounded-full", stateLayer)}
            >
              <Settings className="h-6 w-6" />
            </Link>
          }
        />
        <header className="px-4">
          <h1 className="font-display text-[32px] font-semibold leading-10">Notifications</h1>
        </header>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-4" role="tablist">
          {tabs.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center rounded-[8px] border px-3.5 text-[14px] font-medium transition-colors",
                  stateLayer,
                  on ? "border-transparent bg-foreground text-background" : "border-foreground/20",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {hydrated && empty ? (
          <EmptyState art="sleep" title="All quiet" className="mx-4 mt-6">
            Nothing needs you right now.
          </EmptyState>
        ) : null}

        {(tab === "all" || tab === "needs") && needs.length ? (
          <Tier title="Needs you" note="Things you can act on now.">
            {needs.map((x) => (
              <NoticeRow key={x.id} n={x} fresh={freshIds.has(x.id)} strong />
            ))}
          </Tier>
        ) : null}

        {(tab === "all" || tab === "changed") && changed.length ? (
          <Tier title="Changed" note="Worth seeing. These wait here until you open iKAN.">
            {changed.map((x) => (
              <NoticeRow key={x.id} n={x} fresh={freshIds.has(x.id)} />
            ))}
          </Tier>
        ) : null}

        {(tab === "all" || tab === "happened") && happened.length ? (
          <Tier title="Happened" note="Your activity log. It never notifies.">
            {happened.map((e) => {
              const Icon = eventIcon[e.type];
              return (
                <Link
                  key={e.id}
                  {...e.link}
                  className={cn("flex min-h-14 items-center gap-3 px-4 py-2.5", stateLayer)}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
                    {e.emoji ? (
                      <span aria-hidden="true">{e.emoji}</span>
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px]">{e.title}</span>
                    <span className="block truncate text-[12px] text-muted-foreground">
                      {e.detail}
                    </span>
                  </span>
                  <span className="text-[12px] tabular-nums text-muted-foreground">
                    {ago(e.at)}
                  </span>
                </Link>
              );
            })}
          </Tier>
        ) : null}
      </div>
    </IkanShell>
  );
}

function Tier({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="px-4 font-display text-[16px] font-semibold">{title}</h2>
      <p className="px-4 text-[12px] leading-5 text-muted-foreground">{note}</p>
      <div className="mx-4 mt-2 overflow-hidden rounded-[20px] border border-foreground/10 [&>*+*]:border-t [&>*+*]:border-foreground/10">
        {children}
      </div>
    </section>
  );
}

function NoticeRow({ n, fresh, strong }: { n: Notice; fresh: boolean; strong?: boolean }) {
  const meta = noticeIcon[n.icon];
  const Icon = meta.icon;
  return (
    <Link
      {...n.link}
      className={cn(
        "relative flex items-start gap-3 px-4 py-3.5",
        stateLayer,
        fresh && "bg-[var(--accent-container)]/40",
      )}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
        style={{ background: meta.soft, color: meta.color }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn("block text-[15px] leading-5", strong ? "font-semibold" : "font-medium")}
        >
          {n.title}
        </span>
        <span className="mt-0.5 block text-[13px] leading-5 text-muted-foreground">{n.body}</span>
      </span>
      <span className="flex flex-col items-end gap-2">
        <span className="text-[12px] tabular-nums text-muted-foreground">{ago(n.at)}</span>
        {fresh ? (
          <span
            className="h-2.5 w-2.5 rounded-full bg-[var(--accent-strong)]"
            aria-label="Unread"
          />
        ) : null}
      </span>
    </Link>
  );
}
