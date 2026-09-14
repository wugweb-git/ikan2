import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Download,
  HeartPulse,
  History,
  NotebookPen,
  Settings,
  ShieldPlus,
  Smile,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { IkanShell } from "@/components/ikan-shell";
import { ProfilePhoto } from "@/components/profile-photo";
import { Illustration } from "@/components/art";
import {
  accentStyle,
  Button,
  SelectField,
  Snackbar,
  stateLayer,
  TextField,
  useSnack,
} from "@/components/equip/m3";
import { PhoneField } from "@/components/phone-field";
import * as v from "@/lib/validate";
import { pageMeta } from "@/components/equip/program-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { useEverything } from "@/lib/activity";
import { programmes } from "@/lib/equip/programs";
import { useNotifications } from "@/lib/notifications";
import {
  defaultProfile,
  profileInitials,
  storageKeys,
  useProfile,
  type Profile,
} from "@/lib/profile";
import { resources } from "@/lib/resources";
import { consultants } from "@/lib/consultants";

export const Route = createFileRoute("/profile")({
  head: () => pageMeta("You", "Your details, emergency contact and archive."),
  component: ProfilePage,
});

function ProfilePage() {
  const hydrated = useHydrated();
  const { profile, save } = useProfile();
  const data = useEverything();
  const { unreadCount } = useNotifications();
  const snack = useSnack();
  const [draft, setDraft] = useState<Profile>(defaultProfile);

  useEffect(() => {
    if (hydrated) setDraft(profile);
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const p = hydrated ? profile : defaultProfile;
  const dirty = hydrated && JSON.stringify(draft) !== JSON.stringify(profile);
  const [showErrors, setShowErrors] = useState(false);
  const { errors, ok } = v.validate(draft, {
    name: v.personName,
    email: v.email,
    phone: v.optional(v.phone10),
    bio: v.maxLength(500, "this"),
    birthday: v.optional(v.birthday),
    city: v.optional(v.city),
    zip: v.optional(v.pin),
    emergencyName: v.optional(v.personName),
    emergencyPhone: v.optional(v.phone10),
    emergencyRelation: v.maxLength(40, "this"),
  });
  const field = (key: keyof Profile) => ({
    value: draft[key],
    onChange: (val: string) => setDraft((d) => ({ ...d, [key]: val })),
    error: showErrors ? errors[key] : undefined,
  });

  const finished = programmes.filter((pr) => {
    const s = data.programmeStates[pr.slug];
    return hydrated && Boolean(s?.runs?.length);
  });
  const started = programmes.filter(
    (pr) =>
      hydrated &&
      ((data.programmeStates[pr.slug]?.completed.length ?? 0) > 0 ||
        Boolean(data.programmeStates[pr.slug]?.runs?.length)),
  );
  const firstResult = hydrated
    ? [...data.results].sort((a, b) => a.completedAt.localeCompare(b.completedAt))[0]
    : undefined;

  const jump: {
    to: "/wellness" | "/resources" | "/consult" | "/notifications";
    label: string;
    sub: string;
    icon: LucideIcon;
    tint: string;
  }[] = [
    {
      to: "/wellness",
      label: "iKAN Score",
      sub: hydrated && data.score !== null ? `${data.score} of 100` : "Not started",
      icon: HeartPulse,
      tint: "#DFF0E8",
    },
    {
      to: "/resources",
      label: "Resources",
      sub: `${resources.length} articles`,
      icon: BookOpen,
      tint: "#FBEFD2",
    },
    {
      to: "/consult",
      label: "Consultation",
      sub: `${consultants.length} available`,
      icon: CalendarCheck,
      tint: "#E3ECF8",
    },
    {
      to: "/notifications",
      label: "Notifications",
      sub: hydrated && unreadCount ? `${unreadCount} unread` : "All caught up",
      icon: Bell,
      tint: "#F9E2E9",
    },
  ];

  const archive: {
    to: "/history/assessments" | "/history/program" | "/diaries" | "/history/journal" | "/history";
    label: string;
    sub: string;
    icon: LucideIcon;
  }[] = [
    {
      to: "/history/assessments",
      label: "Assessment history",
      sub:
        hydrated && data.results.length
          ? `${data.results.length} taken · earliest ${new Date(firstResult!.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}`
          : "None taken yet",
      icon: ClipboardList,
    },
    {
      to: "/history/program",
      label: "Program history",
      sub: finished.length
        ? `Finished: ${finished.map((f) => f.name).join(", ")}`
        : "None finished yet",
      icon: Sparkles,
    },
    {
      to: "/diaries",
      label: "Learning diaries",
      sub: finished.length
        ? `${finished.length} ${finished.length === 1 ? "diary" : "diaries"} from finished programs`
        : "Diaries move here when a program is finished",
      icon: NotebookPen,
    },
    {
      to: "/history/journal",
      label: "Journal history",
      sub: hydrated ? `${data.journal.entries.length} mood check-ins` : "",
      icon: Smile,
    },
    {
      to: "/history",
      label: "My history",
      sub: "Assessments, programs and journal",
      icon: History,
    },
  ];

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
      <div style={accentStyle("mood")}>
        <header className="relative">
          <div className="h-32 overflow-hidden">
            <Illustration art="mood" />
          </div>
          <Link
            to="/settings"
            aria-label="Settings"
            className={cn(
              stateLayer,
              "absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-background/80 backdrop-blur",
            )}
          >
            <Settings className="h-6 w-6" />
          </Link>
          <div className="-mt-12 flex flex-col items-center px-4 text-center">
            <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-background bg-[var(--accent-strong)] font-display text-[32px] font-semibold text-background">
              <ProfilePhoto src={p.avatar}>{profileInitials(p)}</ProfilePhoto>
            </span>
            <h1 className="mt-3 font-display text-[26px] font-semibold leading-8">
              {p.name || "Your name"}
            </h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {p.email ||
                `Member since ${new Date(p.memberSince).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`}
            </p>
          </div>
        </header>

        <h2 className="mx-4 mb-2 mt-6 text-[13px] font-semibold text-muted-foreground">Jump to</h2>
        <div className="mx-4 grid grid-cols-2 gap-2">
          {jump.map((j) => {
            const Icon = j.icon;
            return (
              <Link
                key={j.to}
                to={j.to}
                className={cn("flex items-center gap-3 rounded-[20px] p-3", stateLayer)}
                style={{ background: j.tint }}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-background/80">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold">{j.label}</span>
                  <span className="block truncate text-[12px] opacity-75">{j.sub}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <section className="mt-8 px-4">
          <h2 className="flex items-center gap-2 font-display text-[18px] font-semibold">
            <UserRound className="h-5 w-5" /> Profile
          </h2>
          <div className="mt-3 space-y-3">
            <TextField label="Full name" autoComplete="name" maxLength={60} {...field("name")} />
            <TextField
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              {...field("email")}
              placeholder="you@example.com"
            />
            <PhoneField variant="m3" label="Phone" {...field("phone")} />
            <TextField
              label="About me"
              multiline
              maxLength={500}
              {...field("bio")}
              placeholder="Anything you’d like your consultant to know"
            />
          </div>
        </section>

        <section className="mt-8 px-4">
          <h2 className="font-display text-[18px] font-semibold">Personal details</h2>
          <div className="mt-3 space-y-3">
            <TextField
              label="Date of birth"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              {...field("birthday")}
            />
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Gender" options={v.genders} {...field("gender")} />
              <SelectField
                label="Marital status"
                options={v.maritalStatuses}
                {...field("maritalStatus")}
              />
            </div>
            <div className="grid grid-cols-[1fr_7.5rem] gap-3">
              <TextField label="City" autoComplete="address-level2" {...field("city")} />
              <TextField
                label="PIN code"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                {...field("zip")}
                onChange={(val) =>
                  setDraft((d) => ({ ...d, zip: val.replace(/\D/g, "").slice(0, 6) }))
                }
              />
            </div>
          </div>
        </section>

        <section className="mt-8 px-4">
          <h2 className="flex items-center gap-2 font-display text-[18px] font-semibold">
            <ShieldPlus className="h-5 w-5" /> Emergency contact
          </h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Who we call, and how, if you need urgent help.
          </p>
          <div className="mt-3 space-y-3">
            <TextField label="Name" maxLength={60} {...field("emergencyName")} />
            <PhoneField
              variant="m3"
              label="Phone"
              autoComplete="off"
              {...field("emergencyPhone")}
            />
            <TextField
              label="Relationship"
              {...field("emergencyRelation")}
              placeholder="Parent, partner, friend"
            />
          </div>
        </section>

        {dirty ? (
          <div className="sticky bottom-[88px] z-20 mt-6 flex gap-2 bg-gradient-to-t from-background via-background to-transparent px-4 pb-3 pt-6">
            <Button variant="outlined" className="flex-1" onClick={() => setDraft(profile)}>
              Discard
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (!ok) {
                  setShowErrors(true);
                  snack.show("Check the highlighted fields");
                  return;
                }
                save({
                  ...draft,
                  name: draft.name.trim(),
                  email: draft.email.trim(),
                  city: draft.city.trim(),
                });
                setShowErrors(false);
                snack.show("Profile saved");
              }}
            >
              Save changes
            </Button>
          </div>
        ) : null}

        <h2 className="mx-4 mb-2 mt-8 font-display text-[18px] font-semibold">Archive</h2>
        <ul className="mx-4 overflow-hidden rounded-[24px] border border-foreground/10">
          {archive.map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.label} className="border-b border-foreground/10 last:border-0">
                <Link
                  to={r.to}
                  className={cn("flex min-h-16 items-center gap-3 px-4 py-3", stateLayer)}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium">{r.label}</span>
                    <span className="block truncate text-[13px] text-muted-foreground">
                      {r.sub}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={exportData}
              className={cn(
                "flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left",
                stateLayer,
              )}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary">
                <Download className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium">Export your data</span>
                <span className="block text-[13px] text-muted-foreground">
                  Everything above, as a file
                </span>
              </span>
            </button>
          </li>
        </ul>

        <Link
          to="/settings"
          className={cn(
            "mx-4 mt-4 flex min-h-14 items-center gap-3 rounded-[20px] bg-secondary px-4",
            stateLayer,
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="flex-1 text-[15px] font-medium">Settings</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <Snackbar message={snack.message} />
      </div>
    </IkanShell>
  );
}
