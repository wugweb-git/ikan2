import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  KeyRound,
  LogOut,
  UserRound,
  Bell,
  BookOpen,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  Download,
  Accessibility,
  LifeBuoy,
  Lock,
  Share2,
  Sparkles,
  Trash2,
  TrendingUp,
  Watch,
  type LucideIcon,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import {
  accentStyle,
  BottomSheet,
  Button,
  IconButton,
  Snackbar,
  stateLayer,
  Switch,
  TopAppBar,
  useSnack,
} from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuth } from "@/lib/auth";
import type { LegalSlug } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  defaultSettings,
  legalLinks,
  storageKeys,
  useSettings,
  type Settings,
} from "@/lib/profile";

export const Route = createFileRoute("/settings")({
  head: () => pageMeta("Settings", "Notifications, health data, privacy and legal."),
  component: SettingsPage,
});

function SettingsPage() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const { settings: stored, set } = useSettings();
  const { user, signOut, sendReset } = useAuth();
  const settings = hydrated ? stored : defaultSettings;
  const snack = useSnack();
  const [clearing, setClearing] = useState(false);

  const toggle = (key: keyof Settings, label: string, sub: string, icon: LucideIcon) => (
    <Row icon={icon} label={label} sub={sub}>
      <Switch
        label={label}
        checked={Boolean(settings[key])}
        onChange={(v) => set(key, v as never)}
      />
    </Row>
  );

  const exportData = () => {
    const out: Record<string, unknown> = { exportedAt: new Date().toISOString() };
    for (const k of storageKeys()) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) out[k] = JSON.parse(raw);
      } catch {
        /* skip unreadable */
      }
    }
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(out, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `ikan-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    snack.show("Your data is downloading");
  };

  return (
    <IkanShell>
      <div style={accentStyle("night")}>
        <TopAppBar
          leading={
            <IconButton label="Back" onClick={() => navigate({ to: "/profile" })}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          }
          title="Settings"
        />

        <Group title="Account">
          <div className="flex min-h-[72px] items-center gap-4 px-4 py-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]">
              <UserRound className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px]">Signed in</span>
              <span className="block truncate text-[13px] leading-5 text-muted-foreground">
                {user?.email ?? ""}
              </span>
            </span>
          </div>
          <ActionRow
            icon={KeyRound}
            label="Change password"
            sub="We’ll email you a link to set a new one"
            onClick={async () => {
              if (!user?.email) return;
              try {
                await sendReset(user.email);
                snack.show("Check your email for the link");
              } catch (e) {
                snack.show((e as Error).message);
              }
            }}
          />
          <ActionRow
            icon={LogOut}
            label="Sign out"
            sub="Your data stays on this device for next time"
            onClick={async () => {
              await signOut();
              navigate({ to: "/login", replace: true });
            }}
          />
        </Group>

        <Group
          title="Notifications"
          note="Saved on this device. Reminders are sent once the iKAN app is installed."
        >
          <Row icon={Bell} label="Mood reminders" sub="Daily reminder to log your mood">
            <Switch
              label="Mood reminders"
              checked={settings.moodReminders}
              onChange={(v) => set("moodReminders", v)}
            />
          </Row>
          {settings.moodReminders ? (
            <label className="flex min-h-14 items-center gap-4 px-4 py-2 pl-[72px]">
              <span className="flex-1 text-[14px] text-muted-foreground">Remind me at</span>
              <input
                type="time"
                value={settings.moodReminderTime}
                onChange={(e) => set("moodReminderTime", e.target.value)}
                className="h-10 rounded-[10px] bg-secondary px-3 text-[15px] font-semibold tabular-nums"
              />
            </label>
          ) : null}
          {toggle(
            "assessmentReminders",
            "Assessment reminders",
            "Periodic prompts to retake assessments",
            ClipboardList,
          )}
          {toggle(
            "programUpdates",
            "Program updates",
            "Notifications about your active programs",
            Sparkles,
          )}
          {toggle(
            "weeklyProgress",
            "Weekly progress",
            "Summary of your weekly activity and insights",
            TrendingUp,
          )}
          {toggle(
            "newResources",
            "New resources",
            "Get notified when new articles are published",
            BookOpen,
          )}
        </Group>

        <Group title="Health data">
          {toggle(
            "healthConnect",
            "Health Connect",
            "Share sleep and steps to add them to your Wellness Score",
            Watch,
          )}
        </Group>

        <Group title="Privacy">
          {toggle(
            "shareWithConsultant",
            "Share results with my consultant",
            "Let consultants you book see your assessment results",
            Share2,
          )}
          <ActionRow
            icon={Download}
            label="Export my data"
            sub="Download a copy of everything stored on this device"
            onClick={exportData}
          />
          <ActionRow
            icon={Trash2}
            label="Clear all data"
            sub="Remove results, check-ins, progress and bookings from this device"
            danger
            onClick={() => setClearing(true)}
          />
        </Group>

        <Group title="Accessibility">
          {toggle(
            "reduceMotion",
            "Reduce motion",
            "Fewer animations across the app",
            Accessibility,
          )}
        </Group>

        <Group title="Help">
          <LinkRow
            icon={LifeBuoy}
            label="Get support now"
            sub="Free, confidential helplines, open 24×7"
            to="/support"
          />
          <LinkRow
            icon={CalendarClock}
            label="Book a consultation"
            sub="Talk to a therapist or counselor"
            to="/consult"
          />
        </Group>

        <Group title="Legal">
          {legalLinks.map((l) => {
            const inner = (
              <>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary">
                  <Lock className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px]">{l.label}</span>
                  <span className="block text-[13px] text-muted-foreground">{l.description}</span>
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </>
            );
            const cls = cn("flex min-h-16 items-center gap-4 px-4 py-3", stateLayer);
            return l.id === "about" || l.id === "faq" ? (
              <Link key={l.id} to={l.id === "about" ? "/about" : "/faq"} className={cls}>
                {inner}
              </Link>
            ) : (
              <Link
                key={l.id}
                to="/legal/$slug"
                params={{ slug: l.id as LegalSlug }}
                className={cls}
              >
                {inner}
              </Link>
            );
          })}
        </Group>

        <p className="mt-6 text-center text-[12px] text-muted-foreground">
          iKAN preview, data stays on this device
        </p>

        <BottomSheet open={clearing} onClose={() => setClearing(false)} title="Clear all data?">
          <p className="text-[15px] leading-6 text-muted-foreground">
            This removes your assessment results, mood check-ins, program progress, bookings, saved
            articles, profile and settings from this device. It can’t be undone.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button
              className="bg-[#B3261E] text-white"
              onClick={() => {
                for (const k of storageKeys()) {
                  try {
                    localStorage.removeItem(k);
                  } catch {
                    /* ignore */
                  }
                }
                window.location.assign("/");
              }}
            >
              Clear everything
            </Button>
            <Button variant="text" onClick={() => setClearing(false)}>
              Keep my data
            </Button>
          </div>
        </BottomSheet>
        <Snackbar message={snack.message} />
      </div>
    </IkanShell>
  );
}

function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="px-4 text-[14px] font-semibold text-[var(--accent-strong)]">{title}</h2>
      {note ? <p className="px-4 text-[12px] text-muted-foreground">{note}</p> : null}
      <div className="mt-1">{children}</div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  sub,
  children,
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[72px] items-center gap-4 px-4 py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px]">{label}</span>
        <span className="block text-[13px] leading-5 text-muted-foreground">{sub}</span>
      </span>
      {children}
    </div>
  );
}

function ActionRow({
  icon: Icon,
  label,
  sub,
  onClick,
  danger,
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("flex min-h-[72px] w-full items-center gap-4 px-4 py-3 text-left", stateLayer)}
    >
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-full",
          danger
            ? "bg-[#F9DEDC] text-[#8C1D18]"
            : "bg-[var(--accent-container)] text-[var(--on-accent-container)]",
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-[16px]", danger && "text-[#8C1D18]")}>{label}</span>
        <span className="block text-[13px] leading-5 text-muted-foreground">{sub}</span>
      </span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}

function LinkRow({
  icon: Icon,
  label,
  sub,
  to,
}: {
  icon: LucideIcon;
  label: string;
  sub: string;
  to: "/support" | "/consult";
}) {
  return (
    <Link to={to} className={cn("flex min-h-[72px] items-center gap-4 px-4 py-3", stateLayer)}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px]">{label}</span>
        <span className="block text-[13px] leading-5 text-muted-foreground">{sub}</span>
      </span>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Link>
  );
}
