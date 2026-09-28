import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  ChartNoAxesColumn,
  ChevronRight,
  ClipboardList,
  CircleHelp,
  FileText,
  Info,
  Mail,
  HeartPulse,
  History,
  CalendarDays,
  House,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  NotebookPen,
  Settings,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { displayName, useAuth } from "@/lib/auth";
import { MadeBy } from "@/components/made-by";
import { ProfilePhoto } from "@/components/profile-photo";
import { useBackToClose } from "@/hooks/use-back-close";
import { useEverything } from "@/lib/activity";
import { useNotifications } from "@/lib/notifications";
import { profileInitials, useProfile, useSettings } from "@/lib/profile";
import { resources } from "@/lib/resources";
import { consultants } from "@/lib/consultants";
import { cn } from "@/lib/utils";
import type { LegalSlug } from "@/lib/content";

const navItems = [
  { to: "/", label: "Home", icon: House },
  { to: "/program", label: "Programs", icon: Sparkles },
  { to: "/assessments", label: "Assess", icon: ChartNoAxesColumn },
  { to: "/journal", label: "Journal", icon: BookOpen },
] as const;

/** Routes that live behind More rather than on a tab. */
const moreRoutes =
  /^\/(wellness|history|diaries|resources|consult|profile|notifications|settings|support)/;

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
    <div className="min-h-dvh bg-canvas text-foreground">
      <main className="mx-auto min-h-dvh w-full max-w-app bg-background pb-[calc(7.5rem+env(safe-area-inset-bottom))] lg:shadow-app">
        {children}
      </main>
      {moreOpen ? <MoreSheet onClose={() => setMoreOpen(false)} /> : null}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center print:hidden">
        <nav
          aria-label="Main navigation"
          className="pointer-events-auto mb-[max(12px,calc(env(safe-area-inset-bottom)+6px))] w-full max-w-app px-3"
        >
          <div className="grid grid-cols-5 rounded-[24px] border border-border/80 bg-background/92 p-2 shadow-dock backdrop-blur-xl">
            {navItems.map((item, index) => {
              const active =
                !moreOpen &&
                (index === 0
                  ? pathname === "/"
                  : pathname.startsWith(item.to) ||
                    (item.to === "/assessments" && pathname.startsWith("/result")));
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

type Row = { label: string; sub: string; icon: LucideIcon } & {
  to:
    | "/wellness"
    | "/history"
    | "/history/program"
    | "/diaries"
    | "/history/assessments"
    | "/history/journal"
    | "/resources"
    | "/consult"
    | "/notifications"
    | "/profile"
    | "/settings"
    | "/about"
    | "/faq"
    | "/contact";
};

function MoreSheet({ onClose }: { onClose: () => void }) {
  const hydrated = useHydrated();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const data = useEverything();
  const { unreadCount } = useNotifications();
  useBackToClose(true, onClose);

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
  const finishedRuns = data.archive.filter((e) => e.type === "program").length;
  const groups: { title: string; rows: Row[] }[] = [
    {
      title: "Your history",
      rows: [
        {
          to: "/history",
          label: "All history",
          sub: "Assessments, programs and journal in one place",
          icon: History,
        },
        {
          to: "/history/assessments",
          label: "Assessments",
          sub: hydrated
            ? n(data.results.length, "result", "results")
            : "Every result, by assessment",
          icon: ClipboardList,
        },
        {
          to: "/history/program",
          label: "Programs",
          sub: hydrated
            ? `${n(finishedRuns, "program", "programs")} finished`
            : "Finished programs",
          icon: Sparkles,
        },
        {
          to: "/history/journal",
          label: "Journal",
          sub: hydrated
            ? `${n(data.journal.entries.length, "check-in", "check-ins")} on a calendar`
            : "Your check-ins on a calendar",
          icon: CalendarDays,
        },
        {
          to: "/diaries",
          label: "Learning diaries",
          sub: "One for each program",
          icon: NotebookPen,
        },
      ],
    },
    {
      title: "Explore",
      rows: [
        {
          to: "/wellness",
          label: "iKAN Score",
          sub: hydrated && data.score !== null ? `${data.score} of 100` : "Your wellness index",
          icon: HeartPulse,
        },
        {
          to: "/resources",
          label: "Resources",
          sub: `${resources.length} articles and guides`,
          icon: BookOpen,
        },
        {
          to: "/consult",
          label: "Consultation",
          sub: `${consultants.length} consultants`,
          icon: CalendarCheck,
        },
      ],
    },
    {
      title: "App",
      rows: [
        {
          to: "/profile",
          label: "Profile",
          sub: "Your details, photo and emergency contact",
          icon: UserRound,
        },
        {
          to: "/notifications",
          label: "Notifications",
          sub: hydrated && unreadCount ? `${unreadCount} unread` : "All caught up",
          icon: Bell,
        },
        {
          to: "/settings",
          label: "Settings",
          sub: "Reminders, permissions, privacy",
          icon: Settings,
        },
      ],
    },
    {
      title: "About iKAN",
      rows: [
        { to: "/about", label: "About", sub: "Who we are", icon: Info },
        { to: "/faq", label: "FAQ", sub: "Common questions", icon: CircleHelp },
        { to: "/contact", label: "Contact", sub: "Write to us", icon: Mail },
      ],
    },
  ];

  const legal: { slug: LegalSlug; label: string }[] = [
    { slug: "terms", label: "Terms" },
    { slug: "privacy-policy", label: "Privacy" },
    { slug: "cancellation-policy", label: "Cancellation" },
    { slug: "return-policy", label: "Refunds" },
  ];

  const name = hydrated ? profile.name || displayName(user) : "";

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
      <div className="animate-sheet relative max-h-[calc(100dvh-24px)] w-full max-w-app overflow-y-auto overscroll-contain rounded-t-[28px] bg-background pb-[calc(7rem+env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto h-1 w-8 rounded-full bg-foreground/30" />

        <div className="flex items-center gap-3 px-4 pt-4">
          <Link
            to="/profile"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-[20px] p-1.5 pr-3 transition-colors hover:bg-secondary"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-foreground font-display text-[16px] font-semibold text-background">
              <ProfilePhoto src={hydrated ? profile.avatar : undefined}>
                {hydrated ? profileInitials(profile) : ""}
              </ProfilePhoto>
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-[17px] font-semibold leading-6">
                {name || "Your profile"}
              </span>
              <span className="block truncate text-[13px] text-muted-foreground">
                {user?.email ?? "View and edit your details"}
              </span>
            </span>
          </Link>
          <Link
            to="/support"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#F9DEDC] px-3 text-[13px] font-semibold text-[#8C1D18]"
          >
            <LifeBuoy className="h-4 w-4" /> Get help
          </Link>
        </div>

        {groups.map((g) => (
          <section key={g.title} className="mt-5">
            <h2 className="px-5 text-[13px] font-semibold text-muted-foreground">{g.title}</h2>
            <ul className="mx-3 mt-1.5 overflow-hidden rounded-[20px] bg-secondary">
              {g.rows.map((r) => {
                const Icon = r.icon;
                return (
                  <li key={r.to} className="border-b border-background last:border-0">
                    <Link
                      to={r.to}
                      className="flex min-h-14 items-center gap-3 px-3 py-2 transition-colors hover:bg-background/60"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-background">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium">{r.label}</span>
                        <span className="block truncate text-[12px] text-muted-foreground">
                          {r.sub}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <nav aria-label="Legal" className="mt-5 flex flex-wrap gap-x-4 gap-y-2 px-5 text-[13px]">
          {legal.map((l) => (
            <Link
              key={l.slug}
              to="/legal/$slug"
              params={{ slug: l.slug }}
              className="text-muted-foreground underline-offset-4 hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-5 flex items-center justify-between gap-3 px-5">
          <p className="min-w-0 truncate text-[12px] text-muted-foreground">
            {user?.email ? `Signed in as ${user.email}` : ""}
          </p>
          <button
            type="button"
            onClick={async () => {
              onClose();
              await signOut();
              navigate({ to: "/login", replace: true });
            }}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[#B3261E] hover:bg-[#F9DEDC]/60"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <p className="mx-5 mt-4 rounded-[16px] bg-secondary px-4 py-3 text-[12px] leading-5 text-muted-foreground">
          <span className="font-semibold text-foreground">Disclaimer:</span> We at iKan deeply care
          about your mental health but we do not provide emergency support. If you or someone you
          know needs immediate assistance, please reach out to the National Helpline:{" "}
          <a
            href="tel:18005990019"
            className="font-semibold text-foreground underline underline-offset-2"
          >
            1800-599-0019
          </a>{" "}
          or the iCALL Suicide Prevention Helpline:{" "}
          <a
            href="tel:+919152987821"
            className="font-semibold text-foreground underline underline-offset-2"
          >
            9152987821
          </a>
          .
        </p>
        <MadeBy className="mt-4" />
      </div>
    </div>
  );
}
