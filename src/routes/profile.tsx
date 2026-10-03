import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  ImageUp,
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
  BottomSheet,
  Button,
  SelectField,
  Snackbar,
  stateLayer,
  TextField,
  useSnack,
} from "@/components/equip/m3";
import { PhoneField } from "@/components/phone-field";
import * as v from "@/lib/validate";
import { providerPhoto, uploadAvatar } from "@/lib/avatar";
import { fillFromGoogle, preloadGoogle } from "@/lib/google-people";
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
  const [photoSheet, setPhotoSheet] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  useEffect(() => preloadGoogle(), []);
  const fileInput = useRef<HTMLInputElement>(null);

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
    emergencyRelation: v.optional(v.oneOf(v.relationships, "Choose a relationship.")),
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
              "safe-pin absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-background/80 backdrop-blur",
            )}
          >
            <Settings className="h-6 w-6" />
          </Link>
          <div className="-mt-12 flex flex-col items-center px-4 text-center">
            <button
              type="button"
              onClick={() => setPhotoSheet(true)}
              aria-label="Change profile photo"
              className="relative"
            >
              <span className="type-headline-lg grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-background bg-[var(--accent-strong)] text-background">
                <ProfilePhoto src={p.avatar}>{profileInitials(p)}</ProfilePhoto>
              </span>
              <span className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-foreground text-background">
                <Camera className="h-4 w-4" />
              </span>
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setPhotoSheet(false);
                setPhotoBusy(true);
                try {
                  const url = await uploadAvatar(file);
                  save({ avatar: url });
                  setDraft((d) => ({ ...d, avatar: url }));
                  snack.show("Photo updated");
                } catch (err) {
                  snack.show((err as Error).message);
                } finally {
                  setPhotoBusy(false);
                }
              }}
            />
            <h1 className="mt-3 font-display text-[26px] font-semibold leading-8">
              {p.name || "Your name"}
            </h1>
            {p.email ? <p className="type-body-md mt-1 text-muted-foreground">{p.email}</p> : null}
            <p className="type-body-sm mt-0.5 inline-flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Member since{" "}
              {new Date(p.memberSince).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
            {photoBusy ? (
              <p role="status" className="type-body-sm mt-1 text-muted-foreground">
                Uploading photo…
              </p>
            ) : null}
          </div>
        </header>

        <h2 className="type-body-sm font-semibold mx-4 mb-2 mt-6 text-muted-foreground">Jump to</h2>
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
                  <span className="type-body-md font-semibold block truncate">{j.label}</span>
                  <span className="type-label-md block truncate opacity-75">{j.sub}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <section className="mt-8 px-4">
          <h2 className="type-subhead flex items-center gap-2">
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
          <div className="flex items-center justify-between gap-3">
            <h2 className="type-subhead">Personal details</h2>
            <button
              type="button"
              disabled={googleBusy}
              onClick={async () => {
                setGoogleBusy(true);
                try {
                  const g = await fillFromGoogle(profile.email || undefined);
                  /* Fill, not overwrite. Only fields that are empty right now are touched, and
                   * only when Google actually has a value - so pressing this can never replace
                   * something you typed, and can never blank a field. birthday, gender, city
                   * and zip used to overwrite whatever was in the form while phone and avatar
                   * did not, which was an inconsistency rather than a decision. */
                  const fill = <K extends keyof typeof draft>(k: K, v: string | undefined) =>
                    v && !draft[k] ? { [k]: v } : {};
                  const next = {
                    ...fill("birthday", g.birthday),
                    ...fill("gender", g.gender),
                    ...fill("city", g.city),
                    ...fill("zip", g.zip),
                    ...fill("phone", g.phone),
                    ...fill("avatar", g.avatar),
                  };
                  setDraft((d) => ({ ...d, ...next }));
                  snack.show(
                    Object.keys(next).length
                      ? "Filled in from Google. Check it, then save."
                      : "Your Google account doesn’t have these details",
                  );
                } catch (e) {
                  snack.show((e as Error).message);
                } finally {
                  setGoogleBusy(false);
                }
              }}
              className="type-body-sm font-semibold inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-foreground/15 px-3 disabled:opacity-50"
            >
              {googleBusy ? "Asking Google…" : "Fill from Google"}
            </button>
          </div>
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
          <h2 className="type-subhead flex items-center gap-2">
            <ShieldPlus className="h-5 w-5" /> Emergency contact
          </h2>
          <p className="type-body-md mt-1 text-muted-foreground">
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
            <SelectField
              label="Relationship"
              options={v.relationships}
              {...field("emergencyRelation")}
              value={
                v.relationships.includes(draft.emergencyRelation) ? draft.emergencyRelation : ""
              }
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

        <h2 className="type-subhead mx-4 mb-2 mt-8">Archive</h2>
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
                    <span className="type-action font-medium block">{r.label}</span>
                    <span className="type-body-sm block truncate text-muted-foreground">
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
                <span className="type-action font-medium block">Export your data</span>
                <span className="type-body-sm block text-muted-foreground">
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
          <span className="type-action font-medium flex-1">Settings</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
        <BottomSheet open={photoSheet} onClose={() => setPhotoSheet(false)} title="Profile photo">
          <div className="flex flex-col gap-2">
            <Button
              icon={<ImageUp className="h-5 w-5" />}
              onClick={() => fileInput.current?.click()}
            >
              Choose a photo
            </Button>
            <Button
              variant="outlined"
              onClick={async () => {
                const pic = await providerPhoto();
                setPhotoSheet(false);
                if (!pic) return snack.show("Your Google or LinkedIn account has no photo");
                save({ avatar: pic });
                setDraft((d) => ({ ...d, avatar: pic }));
                snack.show("Photo updated");
              }}
            >
              Use my Google or LinkedIn photo
            </Button>
            {p.avatar ? (
              <Button
                variant="text"
                className="text-error"
                onClick={() => {
                  save({ avatar: "" });
                  setDraft((d) => ({ ...d, avatar: "" }));
                  setPhotoSheet(false);
                  snack.show("Photo removed");
                }}
              >
                Remove photo
              </Button>
            ) : null}
          </div>
        </BottomSheet>
        <Snackbar message={snack.message} />
        {/* Room for the sticky "continue" bar above the dock. Without it the last rows
            can never scroll clear of the button that floats over them. */}
        <div aria-hidden className="h-24" />
      </div>
    </IkanShell>
  );
}
