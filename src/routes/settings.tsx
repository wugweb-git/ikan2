import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Cloud,
  CloudOff,
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
  BellRing,
  HeartPulse,
  Unlink,
  Footprints,
  MapPin,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import {
  installApp,
  isInstalled,
  notify,
  requestLocation,
  requestMotion,
  requestNotifications,
  useCanInstall,
  useDevice,
  useLocationAccess,
  useNotificationAccess,
  weatherWord,
  type Access,
} from "@/lib/device";
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
import { recentAverage, useGoogleHealth } from "@/lib/google-health";
import { AddToCalendar } from "@/components/add-to-calendar";
import { enablePush, pushSupported, sendTestPush } from "@/lib/push";
import { clearCloudData, syncNow, useSyncStatus } from "@/lib/cloud-sync";
import type { LegalSlug } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  defaultSettings,
  legalLinks,
  storageKeys,
  useSettings,
  type Settings,
} from "@/lib/profile";

type Search = { health?: "connected" | "cancelled" | "error" };

export const Route = createFileRoute("/settings")({
  validateSearch: (s: Record<string, unknown>): Search =>
    s["health"] === "connected" || s["health"] === "cancelled" || s["health"] === "error"
      ? { health: s["health"] }
      : {},
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
  const notifications = useNotificationAccess();

  // keep this device's push subscription and reminder time in step with the settings
  useEffect(() => {
    if (!hydrated || notifications !== "granted" || !pushSupported()) return;
    void enablePush({ moodReminder: stored.moodReminders, time: stored.moodReminderTime });
  }, [hydrated, notifications, stored.moodReminders, stored.moodReminderTime]);

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
          <SyncRow />
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

        <PermissionsGroup onMessage={snack.show} />

        <Group
          title="Notifications"
          note="Reminders arrive when notifications are allowed above. Install iKAN for the most reliable delivery."
        >
          <Row icon={Bell} label="Mood reminders" sub="Daily reminder to log your mood">
            <Switch
              label="Mood reminders"
              checked={settings.moodReminders}
              onChange={(v) => set("moodReminders", v)}
            />
          </Row>
          {settings.moodReminders ? (
            <>
              <label className="flex min-h-14 items-center gap-4 px-4 py-2 pl-[72px]">
                <span className="flex-1 text-[14px] text-muted-foreground">Remind me at</span>
                <input
                  type="time"
                  value={settings.moodReminderTime}
                  onChange={(e) => set("moodReminderTime", e.target.value)}
                  className="h-10 rounded-[10px] bg-secondary px-3 text-[15px] font-semibold tabular-nums"
                />
              </label>
              <AddToCalendar
                variant="row"
                className="pl-[72px]"
                label="Add daily reminder to my calendar"
                filename="ikan-mood-check-in"
                time={settings.moodReminderTime}
                event={{
                  title: "iKAN mood check-in",
                  details: "A 30-second check-in on how you feel today.",
                  start: new Date(),
                  minutes: 5,
                  daily: true,
                  url: "https://app.ikanhealth.in/journal",
                }}
              />
            </>
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

        <Group
          title="Health data"
          note="iKAN collects health and fitness data you choose to connect to show your sleep, steps and heart rate alongside your iKAN Score and programs. It is never sold or shared."
        >
          <GoogleHealthRows onMessage={snack.show} />
          {toggle(
            "healthConnect",
            "Health Connect",
            "All phone health data, from the iKAN Android app (coming soon)",
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

        <p className="mt-6 text-center text-[12px] text-muted-foreground">iKAN preview</p>

        <BottomSheet open={clearing} onClose={() => setClearing(false)} title="Clear all data?">
          <p className="text-[15px] leading-6 text-muted-foreground">
            This removes your assessment results, journal check-ins, program progress, bookings,
            saved articles, profile and settings from this device and from your account. It can’t be
            undone.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button
              className="bg-[#B3261E] text-white"
              onClick={async () => {
                await clearCloudData().catch(() => {});
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

function GoogleHealthRows({ onMessage }: { onMessage: (m: string) => void }) {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const { health } = Route.useSearch();
  const g = useGoogleHealth();

  useEffect(() => {
    if (!health) return;
    onMessage(
      health === "connected"
        ? "Google Health is connected"
        : health === "cancelled"
          ? "Google Health wasn’t connected"
          : "Google Health didn’t connect. Try again.",
    );
    void navigate({ to: "/settings", search: {}, replace: true });
  }, [health]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (g.error) onMessage(g.error);
  }, [g.error]); // eslint-disable-line react-hooks/exhaustive-deps

  const connected = hydrated && g.status?.connected;
  const steps = recentAverage(g.days, "steps");
  const sleep = recentAverage(g.days, "sleep_minutes");
  const moodLogs = g.days.slice(-7).reduce((n, d) => n + (d.moods?.length ?? 0), 0);
  const summary = [
    steps ? `${Math.round(steps).toLocaleString("en-IN")} steps` : null,
    sleep ? `${Math.floor(sleep / 60)}h ${Math.round(sleep % 60)}m sleep` : null,
    moodLogs ? `${moodLogs} mood ${moodLogs === 1 ? "log" : "logs"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const synced = g.status?.lastSyncedAt
    ? new Date(g.status.lastSyncedAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <>
      <Row
        icon={HeartPulse}
        label="Google Health"
        sub={
          connected
            ? summary
              ? `7-day average: ${summary}`
              : "Connected. Data appears after your device syncs."
            : "Sleep, steps, heart rate and mood logs from Fitbit and Google devices"
        }
      >
        <button
          type="button"
          disabled={g.busy || !hydrated || g.status === null || g.status.configured === false}
          onClick={() => void (connected ? g.sync() : g.connect())}
          className={cn(
            "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold disabled:opacity-50",
            connected ? "border border-foreground/15" : "bg-foreground text-background",
          )}
        >
          {g.busy ? "…" : connected ? "Sync" : g.status?.configured === false ? "Soon" : "Connect"}
        </button>
      </Row>
      {connected ? (
        <ActionRow
          icon={Unlink}
          label="Disconnect Google Health"
          sub={
            synced
              ? `Last synced ${synced}. Removes the health data iKAN saved.`
              : "Removes the health data iKAN saved"
          }
          onClick={() => void g.disconnect().then(() => onMessage("Google Health disconnected"))}
        />
      ) : null}
    </>
  );
}

function PermissionsGroup({ onMessage }: { onMessage: (m: string) => void }) {
  const hydrated = useHydrated();
  const notifications = useNotificationAccess();
  const device = useDevice();
  const [locationAccess, setLocationAccess] = useLocationAccess();
  const [busy, setBusy] = useState(false);
  const canInstall = useCanInstall();
  const installed = hydrated && isInstalled();

  const label = (a: Access) =>
    a === "granted" ? "On" : a === "denied" ? "Blocked" : a === "unsupported" ? "N/A" : "Allow";
  const Pill = ({ access, onClick }: { access: Access; onClick: () => void }) => (
    <button
      type="button"
      disabled={access !== "prompt" || busy}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold",
        access === "prompt"
          ? "bg-foreground text-background"
          : access === "granted"
            ? "bg-[var(--accent-container)] text-[var(--on-accent-container)]"
            : "text-muted-foreground",
      )}
    >
      {label(access)}
    </button>
  );

  return (
    <Group
      title="Permissions"
      note="Blocked? Open your phone’s settings for this site or app and allow it there."
    >
      <Row icon={Bell} label="Notifications" sub="Daily check-in and program reminders">
        <Pill
          access={hydrated ? notifications : "prompt"}
          onClick={async () => {
            const a = await requestNotifications();
            if (a === "granted")
              void notify("Reminders are on", "We’ll nudge you at the time you choose.");
            else if (a === "denied") onMessage("Notifications are blocked for iKAN");
          }}
        />
      </Row>
      {hydrated && notifications === "granted" ? (
        <ActionRow
          icon={BellRing}
          label="Send a test notification"
          sub="Check that reminders reach this phone"
          onClick={async () => {
            const sent = await sendTestPush().catch(() => 0);
            if (sent) return onMessage("Test notification sent");
            const ok = await notify("Hello from iKAN", "This is how reminders will look.");
            onMessage(ok ? "Test notification sent" : "Couldn’t show a notification");
          }}
        />
      ) : null}
      <Row
        icon={MapPin}
        label="Location"
        sub={
          hydrated && device.location
            ? `${device.location.city || "Location saved"}${device.weather ? ` · ${device.weather.temp}° ${weatherWord(device.weather.code)}` : ""}`
            : "City, weather and nearby helplines"
        }
      >
        {hydrated && device.location ? (
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await requestLocation();
                onMessage("Location updated");
              } catch (e) {
                onMessage((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
            className="inline-flex h-9 shrink-0 items-center rounded-full border border-foreground/15 px-4 text-[13px] font-semibold"
          >
            Update
          </button>
        ) : (
          <Pill
            access={locationAccess}
            onClick={async () => {
              setBusy(true);
              try {
                await requestLocation();
                setLocationAccess("granted");
              } catch (e) {
                setLocationAccess("denied");
                onMessage((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          />
        )}
      </Row>
      <Row icon={Footprints} label="Activity" sub="Movement on this phone, for your iKAN Score">
        <Pill
          access={hydrated ? (device.motion ?? "prompt") : "prompt"}
          onClick={async () => {
            const a = await requestMotion();
            if (a === "unsupported") onMessage("This phone doesn’t share motion with web apps");
          }}
        />
      </Row>
      {installed ? null : (
        <Row
          icon={Smartphone}
          label="Install iKAN"
          sub={
            canInstall
              ? "Add iKAN to your home screen. It opens full screen."
              : "In your browser menu, tap Add to Home screen"
          }
        >
          {canInstall ? (
            <button
              type="button"
              onClick={async () => {
                if (await installApp()) onMessage("iKAN is on your home screen");
              }}
              className="inline-flex h-9 shrink-0 items-center rounded-full bg-foreground px-4 text-[13px] font-semibold text-background"
            >
              Install
            </button>
          ) : (
            <span />
          )}
        </Row>
      )}
    </Group>
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

function SyncRow() {
  const status = useSyncStatus();
  const hydrated = useHydrated();
  const when = status.at
    ? new Date(status.at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
    : "";
  const text = !hydrated
    ? ""
    : status.state === "synced"
      ? `Saved to your account${when ? `, last at ${when}` : ""}`
      : status.state === "syncing"
        ? "Saving to your account…"
        : status.state === "error"
          ? "Couldn’t save to your account. Your data is safe on this device."
          : status.state === "unconfigured"
            ? "Saved on this device. Account saving isn’t connected yet."
            : "Saved on this device";
  return (
    <div className="flex min-h-[72px] items-center gap-4 px-4 py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]">
        {status.state === "error" ? (
          <CloudOff className="h-5 w-5" />
        ) : (
          <Cloud className="h-5 w-5" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[16px]">Your data</span>
        <span className="block text-[13px] leading-5 text-muted-foreground">{text}</span>
      </span>
      {status.state === "error" ? (
        <button
          type="button"
          onClick={syncNow}
          className="h-9 rounded-full border border-foreground/20 px-3 text-[13px] font-semibold"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
