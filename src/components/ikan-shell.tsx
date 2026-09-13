import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  ChartNoAxesColumn,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  HeartPulse,
  History,
  House,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  NotebookPen,
  Settings,
  Smile,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuth } from "@/lib/auth";
import { useEverything } from "@/lib/activity";
import { useNotifications } from "@/lib/notifications";
import { useSettings } from "@/lib/profile";
import { resources } from "@/lib/resources";
import { consultants } from "@/lib/consultants";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: House },
  { to: "/program", label: "Programs", icon: Sparkles },
  { to: "/assessment", label: "Assess", icon: ChartNoAxesColumn },
  { to: "/journal", label: "Journal", icon: BookOpen },
] as const;

/** Routes that live behind More rather than on a tab. */
const moreRoutes =
  /^\/(wellness|history|assessments|resources|consult|profile|notifications|settings|support)/;

export function IkanShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);
  const hydrated = useHydrated();
  const { unreadCount } = useNotifications();

  useEffect(() => setMoreOpen(false), [pathname]);
  const { settings } = useSettings();
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", hydrated && settings.reduceMotion);
  }, [hydrated, settings.reduceMotion]);

  const moreActive = moreOpen || moreRoutes.test(pathname);

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <main className="mx-auto min-h-screen w-full max-w-md bg-background pb-28 shadow-app">
        {children}
      </main>
      {moreOpen ? <MoreSheet onClose={() => setMoreOpen(false)} /> : null}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <nav aria-label="Main navigation" className="pointer-events-auto mb-3 w-full max-w-md px-3">
          <div className="grid grid-cols-5 rounded-[24px] border border-border/80 bg-background/92 p-2 shadow-dock backdrop-blur-xl">
            {navItems.map((item, index) => {
              const active =
                !moreOpen &&
                (index === 0
                  ? pathname === "/"
                  : pathname.startsWith(item.to) ||
                    (item.to === "/assessment" && pathname.startsWith("/result")));
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={active ? "nav-item text-foreground" : "nav-item text-muted-foreground"}
                >
                  <span className={active ? "nav-icon bg-foreground text-background" : "nav-icon"}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="dialog"
              onClick={() => setMoreOpen((o) => !o)}
              className={moreActive ? "nav-item text-foreground" : "nav-item text-muted-foreground"}
            >
              <span
                className={cn(
                  "relative",
                  moreActive ? "nav-icon bg-foreground text-background" : "nav-icon",
                )}
              >
                <LayoutGrid aria-hidden="true" />
                {hydrated && unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#B3261E] px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </span>
              <span>More</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

type Row = { label: string; sub: string; icon: LucideIcon } & (
  | {
      to:
        | "/wellness"
        | "/history"
        | "/assessments"
        | "/journal"
        | "/program"
        | "/resources"
        | "/consult"
        | "/profile"
        | "/notifications"
        | "/settings"
        | "/support";
    }
  | { href: string }
);

function MoreSheet({ onClose }: { onClose: () => void }) {
  const hydrated = useHydrated();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const data = useEverything();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const n = (v: number, one: string, many: string) => `${v} ${v === 1 ? one : many}`;
  const groups: { title: string; rows: Row[] }[] = [
    {
      title: "Your data",
      rows: [
        {
          to: "/wellness",
          label: "iKAN Score",
          sub: `Your Collective Wellness Index${hydrated && data.score !== null ? ` · ${data.score}` : ""}`,
          icon: HeartPulse,
        },
        {
          to: "/history",
          label: "My history",
          sub: hydrated
            ? n(data.events.length, "event", "events") + " on one timeline"
            : "Everything on one timeline",
          icon: History,
        },
        {
          to: "/assessments",
          label: "Assessment history",
          sub: hydrated
            ? `${n(data.results.length, "result", "results")} · grouped by assessment`
            : "Grouped by assessment",
          icon: ClipboardList,
        },
        {
          to: "/journal",
          label: "Mood journal",
          sub: hydrated ? n(data.journal.entries.length, "entry", "entries") : "Daily check-ins",
          icon: Smile,
        },
        { to: "/program", label: "Learning diaries", sub: "One per program", icon: NotebookPen },
      ],
    },
    {
      title: "Explore",
      rows: [
        {
          to: "/resources",
          label: "Resources",
          sub: `${resources.length} articles and guides`,
          icon: BookOpen,
        },
        {
          to: "/consult",
          label: "Consultation",
          sub: `${consultants.length} consultants available`,
          icon: CalendarCheck,
        },
      ],
    },
    {
      title: "Account",
      rows: [
        {
          to: "/profile",
          label: "Profile",
          sub: "Name, email, emergency contact",
          icon: UserRound,
        },
        {
          to: "/notifications",
          label: "Notifications",
          sub: hydrated && unreadCount ? `${unreadCount} unread` : "What needs you",
          icon: Bell,
        },
        {
          to: "/settings",
          label: "Settings",
          sub: "Reminders, health data, privacy",
          icon: Settings,
        },
      ],
    },
    {
      title: "About iKAN",
      rows: [
        {
          href: "https://ikanhealth.in/about",
          label: "About",
          sub: "Who we are",
          icon: ExternalLink,
        },
        {
          href: "https://ikanhealth.in/faq",
          label: "FAQ",
          sub: "Common questions",
          icon: ExternalLink,
        },
        {
          href: "https://ikanhealth.in/contact",
          label: "Contact",
          sub: "Get in touch",
          icon: ExternalLink,
        },
      ],
    },
    {
      title: "Legal",
      rows: [
        {
          href: "https://ikanhealth.in/terms",
          label: "Terms of use",
          sub: "Service terms",
          icon: ExternalLink,
        },
        {
          href: "https://ikanhealth.in/privacy-policy",
          label: "Privacy policy",
          sub: "How your data is handled",
          icon: ExternalLink,
        },
        {
          href: "https://ikanhealth.in/cancellation-policy",
          label: "Cancellation policy",
          sub: "Cancelling a booking",
          icon: ExternalLink,
        },
        {
          href: "https://ikanhealth.in/return-policy",
          label: "Return policy",
          sub: "Refunds",
          icon: ExternalLink,
        },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="More"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-fade absolute inset-0 bg-foreground/40"
      />
      <div className="animate-sheet relative max-h-[calc(100vh-24px)] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-background pb-28 pt-3">
        <div className="mx-auto h-1 w-8 rounded-full bg-foreground/30" />
        <div className="flex items-center justify-between px-5 pt-4">
          <p className="font-display text-[24px] font-semibold">More</p>
          <Link
            to="/support"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#F9DEDC] px-3 text-[13px] font-semibold text-[#8C1D18]"
          >
            <LifeBuoy className="h-4 w-4" /> Get support now
          </Link>
        </div>
        {groups.map((g) => (
          <section key={g.title} className="mt-4">
            <h2 className="px-5 text-[13px] font-semibold text-muted-foreground">{g.title}</h2>
            <ul className="mx-3 mt-1 overflow-hidden rounded-[20px] bg-secondary">
              {g.rows.map((r) => {
                const Icon = r.icon;
                const inner = (
                  <>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-background">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium">{r.label}</span>
                      <span className="block truncate text-[12px] text-muted-foreground">
                        {r.sub}
                      </span>
                    </span>
                    {"to" in r ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : null}
                  </>
                );
                const cls =
                  "flex min-h-14 items-center gap-3 px-3 py-2 transition-colors hover:bg-background/60";
                return (
                  <li key={r.label} className="border-b border-background last:border-0">
                    {"to" in r ? (
                      <Link to={r.to} className={cls} onClick={onClose}>
                        {inner}
                      </Link>
                    ) : (
                      <a href={r.href} target="_blank" rel="noreferrer" className={cls}>
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <div className="mx-3 mt-5">
          <button
            type="button"
            onClick={async () => {
              onClose();
              await signOut();
              navigate({ to: "/login", replace: true });
            }}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-foreground/15 text-[15px] font-semibold text-[#B3261E]"
          >
            <LogOut className="h-5 w-5" /> Log out
          </button>
          {user?.email ? (
            <p className="mt-2 text-center text-[12px] text-muted-foreground">
              Signed in as {user.email}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
