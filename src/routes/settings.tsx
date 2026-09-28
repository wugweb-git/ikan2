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
  Share2,
  Sparkles,
  Trash2,
  TrendingUp,
  Watch,
  Footprints,
  SlidersHorizontal,
  BellRing,
  HeartPulse,
  Unlink,
  MapPin,
  Link2 as LinkIcon,
  Mail,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import {
  installApp,
  isInstalled,
  notify,
  requestLocation,
  requestNotifications,
  useCanInstall,
  useDevice,
  useLocationAccess,
  useNotificationAccess,
  weatherWord,
  clearLocation,
  setNotificationsOff,
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
import { supabase, useAuth, type Provider } from "@/lib/auth";
import { clearAllMirrored } from "@/lib/durable";
import { AddToCalendar } from "@/components/add-to-calendar";
import { recentAverage, useHealthConnect } from "@/lib/health-connect";
import { disablePush, enablePush, pushSupported, sendTestPush } from "@/lib/push";
import { enableNativePush, nativePushSupported } from "@/lib/native-push";
import { clearCloudData, syncNow, useSyncStatus } from "@/lib/cloud-sync";
import type { LegalSlug } from "@/lib/content";
import { cn } from "@/lib/utils";
import { defaultSettings, storageKeys, useSettings, type Settings } from "@/lib/profile";

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
  const device = useDevice();

  /* Keep this device's push subscription and reminder time in step with the settings.
   *
   * device.notificationsOff has to be a dependency, not just a value read inside: it was
   * guarded on but not depended on, so switching notifications back on changed the flag
   * without re-running this - and the re-registration never happened until the component
   * remounted. The switch now registers directly as well, but an effect that silently
   * ignores the state it reads is a trap for the next person. */
  useEffect(() => {
    if (!hydrated || notifications !== "granted" || !pushSupported() || device.notificationsOff)
      return;
    void enablePush({ moodReminder: stored.moodReminders, time: stored.moodReminderTime });
  }, [
    hydrated,
    notifications,
    device.notificationsOff,
    stored.moodReminders,
    stored.moodReminderTime,
  ]);

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
          title="Sign-in methods"
          note="How you get into this account. Connect or disconnect any of them — your journal, results and progress stay on the account either way."
        >
          <ConnectedAccounts onMessage={snack.show} />
        </Group>

        {/* Apps that supply data, as opposed to the sign-in methods above. Nothing here is
            required, each connects and disconnects on its own, and disconnecting one stops new
            data arriving without touching what is already saved. Strava and the like belong in
            this group: add a row beside HealthConnectRows. */}
        <Group
          title="Connected apps"
          note="Apps you have connected to iKAN. Each one is optional, and you can disconnect it at any time — what has already been saved stays."
        >
          <HealthConnectRows onMessage={snack.show} />
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
                /* Awaited, and before the reload. The Android app keeps a native copy of every
                 * key (durable.ts); mirrorRemove is fire-and-forget, so calling it per key and
                 * then navigating immediately meant the page went away before the dynamic
                 * import even resolved. The deletes never ran, restoreEvicted put everything
                 * back on the next launch, and cloud-sync then re-uploaded it - so "Clear
                 * everything" undid itself and said nothing. */
                await clearAllMirrored();
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

function HealthConnectRows({ onMessage }: { onMessage: (m: string) => void }) {
  const hydrated = useHydrated();
  const h = useHealthConnect();

  useEffect(() => {
    if (h.error) onMessage(h.error);
  }, [h.error]); // eslint-disable-line react-hooks/exhaustive-deps

  const steps = recentAverage(h.days, "steps");
  const sleep = recentAverage(h.days, "sleep_minutes");
  const summary = [
    steps ? `${Math.round(steps).toLocaleString("en-IN")} steps` : null,
    sleep ? `${Math.floor(sleep / 60)}h ${Math.round(sleep % 60)}m sleep` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const pill = (label: string, onClick: () => void, filled = true) => (
    <button
      type="button"
      disabled={h.busy}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] font-semibold disabled:opacity-50",
        filled ? "bg-foreground text-background" : "border border-foreground/15",
      )}
    >
      {h.busy ? "…" : label}
    </button>
  );

  if (!hydrated) return null;

  if (!h.native) {
    return (
      <Row
        icon={Watch}
        label="Health Connect"
        sub={
          summary
            ? `From your phone, 7-day average: ${summary}`
            : "Sleep, steps and heart rate, in the iKAN Android app (coming soon)"
        }
      >
        <span className="inline-flex h-9 shrink-0 items-center rounded-full bg-secondary px-4 text-[13px] font-semibold text-muted-foreground">
          Soon
        </span>
      </Row>
    );
  }

  return (
    <>
      <Row
        icon={Watch}
        label="Health Connect"
        sub={
          h.availability === "unavailable"
            ? "Not available on this phone"
            : h.availability === "update_required"
              ? "Install or update Health Connect first"
              : h.connected
                ? summary
                  ? `7-day average: ${summary}`
                  : "Connected. Data appears once your phone or watch records it."
                : "Sleep, steps, heart rate and exercise from your phone and watch"
        }
      >
        {h.availability === "update_required"
          ? pill("Install", () => void h.install())
          : h.availability === "available"
            ? h.connected
              ? pill("Sync", () => void h.sync().then(() => onMessage("Health data synced")), false)
              : pill("Connect", () => void h.connect())
            : null}
      </Row>
      {h.connected ? (
        <>
          <ActionRow
            icon={SlidersHorizontal}
            label="Choose what iKAN can read"
            sub="Opens Health Connect, where you can change or remove access"
            onClick={() => void h.manage()}
          />
          <ActionRow
            icon={Trash2}
            label="Delete synced health data"
            sub="Removes the daily summaries iKAN saved to your account"
            danger
            onClick={() => void h.removeData().then(() => onMessage("Health data deleted"))}
          />
        </>
      ) : null}
    </>
  );
}

/** Activity (steps, sleep, heart rate) comes from Health Connect, which only the Android app can read. */
function ActivityRow({ onMessage }: { onMessage: (m: string) => void }) {
  const hydrated = useHydrated();
  const h = useHealthConnect();
  if (!hydrated) return null;
  if (!h.native)
    return (
      <Row
        icon={Footprints}
        label="Activity"
        sub="Steps, sleep and heart rate from Health Connect, in the iKAN Android app"
      >
        <span className="inline-flex h-9 shrink-0 items-center rounded-full bg-secondary px-4 text-[13px] font-semibold text-muted-foreground">
          In app
        </span>
      </Row>
    );
  return (
    <Row
      icon={Footprints}
      label="Activity"
      sub={
        h.availability === "unavailable"
          ? "Health Connect isn’t available on this phone"
          : h.availability === "update_required"
            ? "Install Health Connect to share steps and sleep"
            : "Steps, sleep and heart rate from Health Connect"
      }
    >
      <Switch
        label="Activity"
        checked={h.connected}
        onChange={async (on) => {
          if (h.availability === "update_required") return void h.install();
          if (on) {
            await h.connect();
            return;
          }
          // Android only lets people remove access in Health Connect itself
          onMessage("Turn off iKAN’s access in Health Connect");
          await h.manage();
        }}
      />
    </Row>
  );
}

function PermissionsGroup({ onMessage }: { onMessage: (m: string) => void }) {
  const hydrated = useHydrated();
  const notifications = useNotificationAccess();
  // Needed when the switch goes back on, to re-register at the person's chosen reminder time.
  const { settings: stored } = useSettings();
  const device = useDevice();
  const [locationAccess, setLocationAccess] = useLocationAccess();
  const [busy, setBusy] = useState(false);
  const canInstall = useCanInstall();
  const installed = hydrated && isInstalled();

  return (
    <Group
      title="Permissions"
      note="Blocked? Open your phone’s settings for this site or app and allow it there."
    >
      <Row
        icon={Bell}
        label="Notifications"
        sub={
          hydrated && notifications === "denied"
            ? "Blocked. Allow notifications for iKAN in your phone’s settings."
            : "Daily check-in and program reminders"
        }
      >
        <Switch
          label="Notifications"
          checked={hydrated && notifications === "granted" && !device.notificationsOff}
          onChange={async (on) => {
            if (!on) {
              setNotificationsOff(true);
              await disablePush().catch(() => {});
              return onMessage("Notifications off");
            }
            const a = notifications === "granted" ? "granted" : await requestNotifications();
            if (a !== "granted")
              return onMessage(
                a === "unsupported"
                  ? "This browser can’t show notifications"
                  : "Notifications are blocked for iKAN in your phone’s settings",
              );
            setNotificationsOff(false);
            /* Turning the switch off unsubscribed this device and deleted its row, so turning
             * it back on has to register again. The effect above would do it, but it guards on
             * notificationsOff() without that value being one of its dependencies - so it does
             * not re-run here, and reminders stayed silently dead until the app was reopened.
             * Registering directly is what the person just asked for; do it here. */
            const prefs = { moodReminder: stored.moodReminders, time: stored.moodReminderTime };
            if (pushSupported()) await enablePush(prefs).catch(() => {});
            if (nativePushSupported()) await enableNativePush(prefs).catch(() => {});
            onMessage("Notifications on");
          }}
        />
      </Row>
      {hydrated && notifications === "granted" && !device.notificationsOff ? (
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
            : hydrated && locationAccess === "denied"
              ? "Blocked. Allow location for iKAN in your phone’s settings."
              : "City, weather and nearby helplines"
        }
      >
        <Switch
          label="Location"
          checked={hydrated && Boolean(device.location)}
          onChange={async (on) => {
            if (!on) {
              clearLocation();
              return onMessage("Location off");
            }
            if (busy) return;
            setBusy(true);
            try {
              await requestLocation();
              setLocationAccess("granted");
              onMessage("Location on");
            } catch (e) {
              setLocationAccess("denied");
              onMessage((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
      </Row>
      <ActivityRow onMessage={onMessage} />
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

/* Sign-in methods: the identities Supabase holds for this account.
 *
 * Every row can be disconnected and reconnected freely. Disconnecting removes the sign-in
 * method, not the person's data - the profile, journal and results live in ikan2_user_state
 * against the account, and reconnecting the same provider picks them straight back up.
 *
 * One limit is not ours: Supabase refuses to remove the last remaining identity, because the
 * account would have no way to authenticate afterwards. Rather than grey the button out and
 * decide on the person's behalf, the action runs and the server's own answer is shown. If that
 * rule changes, this needs no edit.
 *
 * Manual linking must be enabled on the Supabase project for Connect to work; if it is not,
 * the server says so and that message is passed through unaltered.
 *
 * Adding a provider is one entry in PROVIDERS - Strava and the rest slot in here. */
function ConnectedAccounts({ onMessage }: { onMessage: (m: string) => void }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const hydrated = useHydrated();

  const identities = user?.identities ?? [];
  const has = (p: string) => identities.some((i) => i.provider === p);
  const sole = identities.length <= 1;

  const providers: { id: Provider; label: string; sub: string }[] = [
    { id: "google", label: "Google", sub: "Sign in with your Google account" },
    { id: "linkedin_oidc", label: "LinkedIn", sub: "Sign in with your LinkedIn account" },
  ];

  const link = async (p: Provider) => {
    setBusy(p);
    try {
      const { error } = await supabase().auth.linkIdentity({
        provider: p,
        options: { redirectTo: `${window.location.origin}/settings` },
      });
      if (error) throw error;
      // On success the browser leaves for the provider; nothing after this runs.
    } catch (e) {
      onMessage((e as Error).message || "Could not connect that account.");
      setBusy(null);
    }
  };

  const unlink = async (p: Provider) => {
    const identity = identities.find((i) => i.provider === p);
    if (!identity) return;
    setBusy(p);
    try {
      const { error } = await supabase().auth.unlinkIdentity(identity);
      if (error) throw error;
      onMessage(`${p === "google" ? "Google" : "LinkedIn"} disconnected`);
    } catch (e) {
      onMessage((e as Error).message || "Could not disconnect that account.");
    } finally {
      setBusy(null);
    }
  };

  if (!hydrated) return null;

  return (
    <>
      {providers.map((p) => {
        const connected = has(p.id);
        return (
          <Row key={p.id} icon={LinkIcon} label={p.label} sub={connected ? "Connected" : p.sub}>
            <Button
              variant={connected ? "text" : "tonal"}
              disabled={busy === p.id}
              onClick={() => (connected ? unlink(p.id) : link(p.id))}
            >
              {busy === p.id ? "…" : connected ? "Disconnect" : "Connect"}
            </Button>
          </Row>
        );
      })}
      {identities.some((i) => i.provider === "email") ? (
        <Row icon={Mail} label="Email and password" sub={user?.email ?? "Connected"}>
          <span className="text-[13px] text-muted-foreground">Connected</span>
        </Row>
      ) : null}
      {identities.some((i) => i.provider === "phone") ? (
        <Row icon={Smartphone} label="Phone" sub={user?.phone ?? "Connected"}>
          <span className="text-[13px] text-muted-foreground">Connected</span>
        </Row>
      ) : null}
      {sole ? (
        <p className="px-4 pb-3 text-[13px] leading-5 text-muted-foreground">
          This is currently the only way you can sign in. Disconnecting your data is not affected
          either way — it stays on the account and comes back when you reconnect.
        </p>
      ) : null}
    </>
  );
}
