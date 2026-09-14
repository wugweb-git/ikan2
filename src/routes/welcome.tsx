import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bell, Check, Clock3, Footprints, ListChecks, MapPin } from "lucide-react";
import { Illustration } from "@/components/art";
import {
  accentStyle,
  Button,
  IconButton,
  LinearProgress,
  SelectField,
  SelectRow,
  TextField,
} from "@/components/equip/m3";
import { pageMeta } from "@/components/equip/program-header";
import { categoryIcon } from "@/components/assessment/ui";
import { ProfilePhoto } from "@/components/profile-photo";
import { getAssessment } from "@/lib/assessment/instruments";
import { displayName, useAuth } from "@/lib/auth";
import {
  requestLocation,
  requestMotion,
  requestNotifications,
  useDevice,
  useNotificationAccess,
  type Access,
} from "@/lib/device";
import { profileInitials, useOnboarding, useProfile } from "@/lib/profile";
import type { Art } from "@/lib/resources";
import * as v from "@/lib/validate";
import { cn } from "@/lib/utils";

type Search = { step?: "about" };

export const Route = createFileRoute("/welcome")({
  validateSearch: (s: Record<string, unknown>): Search =>
    s["step"] === "about" ? { step: "about" } : {},
  head: () =>
    pageMeta("Welcome to iKAN", "Tell us a little about you and we’ll suggest where to start."),
  component: WelcomePage,
});

const reasons: { id: string; label: string; slug: string; art: Art }[] = [
  {
    id: "stress",
    label: "I feel stressed or worried",
    slug: "feeling-worried-and-stressed",
    art: "stress",
  },
  {
    id: "anxiety",
    label: "I feel anxious or overwhelmed",
    slug: "feeling-overwhelmed-and-anxious",
    art: "anxiety",
  },
  {
    id: "low",
    label: "I’ve been feeling low",
    slug: "feeling-depressed-and-hopeless",
    art: "mood",
  },
  {
    id: "sleep",
    label: "I’m not sleeping well",
    slug: "struggling-with-quality-sleep",
    art: "sleep",
  },
  {
    id: "work",
    label: "Work is taking over my life",
    slug: "struggling-to-balance-life",
    art: "work",
  },
  {
    id: "burnout",
    label: "I feel drained or burned out",
    slug: "feeling-drained-and-burned-out",
    art: "burnout",
  },
  {
    id: "unsure",
    label: "I’m not sure, I want to check in",
    slug: "unsure-or-general-concern",
    art: "checkup",
  },
];

const STEPS = 4;

function WelcomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { step: only } = Route.useSearch();
  const { finish, done } = useOnboarding();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const reason = reasons.find((r) => r.id === choice);
  const assessment = reason ? getAssessment(reason.slug) : undefined;

  const leave = (to: "/" | "/profile" = "/") => {
    if (!done) finish(choice ?? "");
    navigate({ to, replace: true });
  };

  return (
    <div className="min-h-dvh bg-canvas" style={accentStyle("calm")}>
      <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-app">
        <header className="flex h-16 items-center gap-1 px-1">
          {step > 0 && !only ? (
            <IconButton label="Back" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="h-6 w-6" />
            </IconButton>
          ) : (
            <span className="w-12" />
          )}
          <div className="flex-1 px-2">
            <LinearProgress value={only ? 100 : ((step + 1) / STEPS) * 100} />
          </div>
          <button
            type="button"
            onClick={() =>
              only
                ? navigate({ to: "/", replace: true })
                : step < STEPS - 1
                  ? setStep(step + 1)
                  : leave()
            }
            className="h-12 px-4 text-[15px] font-semibold text-muted-foreground"
          >
            Skip
          </button>
        </header>

        {step === 0 || only ? (
          <AboutYou
            name={displayName(user).split(" ")[0] ?? ""}
            label={only ? "Your details" : `Step 1 of ${STEPS}`}
            cta={only ? "Save" : "Continue"}
            onDone={() => (only ? navigate({ to: "/", replace: true }) : setStep(1))}
          />
        ) : step === 1 ? (
          <main className="flex flex-1 flex-col px-4 pb-8">
            <p className="text-[14px] font-medium text-[var(--accent-strong)]">Step 2 of {STEPS}</p>
            <h1 className="mt-1 font-display text-[28px] font-semibold leading-9">
              What brings you here?
            </h1>
            <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
              Pick the one that fits best. You can explore everything later.
            </p>
            <div
              role="radiogroup"
              aria-label="What brings you here"
              className="mt-6 overflow-hidden rounded-[20px] border border-foreground/10"
            >
              {reasons.map((r, i) => (
                <div key={r.id} className={i > 0 ? "border-t border-foreground/10" : undefined}>
                  <SelectRow selected={choice === r.id} onClick={() => setChoice(r.id)}>
                    {r.label}
                  </SelectRow>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <Button className="w-full" disabled={!choice} onClick={() => setStep(2)}>
                Continue
              </Button>
              {!choice ? (
                <p className="mt-2 text-center text-[13px] text-muted-foreground">
                  Choose one to continue, or skip.
                </p>
              ) : null}
            </div>
          </main>
        ) : step === 2 ? (
          <Permissions onDone={() => (assessment ? setStep(3) : leave())} />
        ) : assessment && reason ? (
          <main className="flex flex-1 flex-col px-4 pb-8">
            <p className="text-[14px] font-medium text-[var(--accent-strong)]">Step 4 of {STEPS}</p>
            <h1 className="mt-1 font-display text-[28px] font-semibold leading-9">
              Start with a short check
            </h1>
            <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
              It shows where you are today and which program fits. It’s a screening, not a
              diagnosis.
            </p>
            <div className="mt-6 overflow-hidden rounded-[28px] bg-secondary">
              <div className="h-40">
                <Illustration art={reason.art} />
              </div>
              <div className="p-5">
                <p className="flex items-center gap-2 text-[14px] font-medium text-[var(--accent-strong)]">
                  {(() => {
                    const Icon = categoryIcon[assessment.category];
                    return <Icon className="h-4 w-4" />;
                  })()}
                  {assessment.name}
                </p>
                <p className="mt-1 font-display text-[22px] font-semibold leading-7">
                  {assessment.title}
                </p>
                <p className="mt-3 flex gap-4 text-[14px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ListChecks className="h-4 w-4" /> {assessment.questions.length} questions
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" /> {assessment.minutes} min
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-auto space-y-2 pt-6">
              <Button
                className="w-full"
                onClick={() => {
                  finish(reason.id);
                  navigate({
                    to: "/assessment-flow",
                    search: { id: assessment.slug },
                    replace: true,
                  });
                }}
              >
                Start assessment
              </Button>
              <Button variant="text" className="w-full" onClick={() => leave()}>
                Go to home first
              </Button>
            </div>
          </main>
        ) : (
          <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <Button onClick={() => leave()}>Go to home</Button>
          </main>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- about you ------------------------------- */

function AboutYou({
  name,
  label,
  cta,
  onDone,
}: {
  name: string;
  label: string;
  cta: string;
  onDone: () => void;
}) {
  const { profile, save } = useProfile();
  const [draft, setDraft] = useState({
    birthday: "",
    gender: "",
    maritalStatus: "",
    city: "",
    zip: "",
    bio: "",
  });
  const [loaded, setLoaded] = useState(false);
  const [tried, setTried] = useState(false);
  useEffect(() => {
    if (loaded) return;
    setDraft({
      birthday: profile.birthday,
      gender: profile.gender,
      maritalStatus: profile.maritalStatus,
      city: profile.city,
      zip: profile.zip,
      bio: profile.bio,
    });
    setLoaded(true);
  }, [profile, loaded]);

  const { errors, ok } = v.validate(draft, {
    birthday: v.birthday,
    gender: v.required("Choose one, or ‘Prefer not to say’."),
    maritalStatus: v.required("Choose one, or ‘Prefer not to say’."),
    city: v.city,
    zip: v.pin,
    bio: v.maxLength(500, "this"),
  });
  const set = (k: keyof typeof draft) => (val: string) => setDraft((d) => ({ ...d, [k]: val }));
  const err = (k: keyof typeof draft) => (tried ? errors[k] : undefined);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="flex flex-1 flex-col px-4 pb-8">
      <p className="text-[14px] font-medium text-[var(--accent-strong)]">{label}</p>
      <div className="mt-1 flex items-center gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--accent-strong)] font-display text-[20px] font-semibold text-background">
          <ProfilePhoto src={profile.avatar}>{profileInitials(profile)}</ProfilePhoto>
        </span>
        <h1 className="font-display text-[26px] font-semibold leading-8">
          {name ? `Hi ${name}, tell us about you` : "Tell us about you"}
        </h1>
      </div>
      <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
        This helps us suggest the right programs and local support. Only you and consultants you
        book can see it.
      </p>

      <form
        noValidate
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
          if (!ok) return;
          save({ ...draft, city: draft.city.trim(), bio: draft.bio.trim() });
          onDone();
        }}
      >
        <TextField
          label="Date of birth"
          type="date"
          max={today}
          min="1915-01-01"
          value={draft.birthday}
          onChange={set("birthday")}
          error={err("birthday")}
        />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            label="Gender"
            options={v.genders}
            value={draft.gender}
            onChange={set("gender")}
            error={err("gender")}
          />
          <SelectField
            label="Marital status"
            options={v.maritalStatuses}
            value={draft.maritalStatus}
            onChange={set("maritalStatus")}
            error={err("maritalStatus")}
          />
        </div>
        <div className="grid grid-cols-[1fr_7.5rem] gap-3">
          <TextField
            label="City"
            autoComplete="address-level2"
            maxLength={60}
            value={draft.city}
            onChange={set("city")}
            error={err("city")}
          />
          <TextField
            label="PIN code"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            value={draft.zip}
            onChange={(val) => set("zip")(val.replace(/\D/g, "").slice(0, 6))}
            error={err("zip")}
          />
        </div>
        <TextField
          label="About you (optional)"
          multiline
          maxLength={500}
          placeholder="Anything you’d like us or a consultant to know"
          value={draft.bio}
          onChange={set("bio")}
          error={err("bio")}
        />
        {tried && !ok ? (
          <p
            role="alert"
            className="rounded-[14px] bg-[#F9DEDC] px-4 py-3 text-[14px] text-[#8C1D18]"
          >
            Check the highlighted fields.
          </p>
        ) : null}
        <div className="pt-3">
          <Button type="submit" className="w-full">
            {cta}
          </Button>
        </div>
      </form>
    </main>
  );
}

/* ------------------------------ permissions ------------------------------ */

function Permissions({ onDone }: { onDone: () => void }) {
  const notifications = useNotificationAccess();
  const device = useDevice();
  const [locationState, setLocationState] = useState<Access | "busy">(
    device.location ? "granted" : "prompt",
  );
  const [message, setMessage] = useState<string | null>(null);

  const rows: {
    id: string;
    icon: typeof Bell;
    title: string;
    body: string;
    state: Access | "busy";
    allow: () => Promise<void>;
  }[] = [
    {
      id: "notifications",
      icon: Bell,
      title: "Reminders",
      body: "A nudge for your daily check-in and program days. You choose the time in Settings.",
      state: notifications,
      allow: async () => {
        const a = await requestNotifications();
        if (a === "denied")
          setMessage("Notifications are blocked. Turn them on for iKAN in your phone’s settings.");
      },
    },
    {
      id: "location",
      icon: MapPin,
      title: "City and weather",
      body: "Shows your city and today’s weather, and helplines near you. We never track where you go.",
      state: locationState,
      allow: async () => {
        setLocationState("busy");
        try {
          await requestLocation();
          setLocationState("granted");
        } catch (e) {
          setLocationState("denied");
          setMessage((e as Error).message);
        }
      },
    },
    {
      id: "motion",
      icon: Footprints,
      title: "Activity",
      body: "Counts movement on this phone to add activity to your iKAN Score.",
      state: device.motion ?? "prompt",
      allow: async () => {
        const a = await requestMotion();
        if (a === "unsupported") setMessage("This phone doesn’t share motion with web apps.");
      },
    },
  ];

  return (
    <main className="flex flex-1 flex-col px-4 pb-8">
      <p className="text-[14px] font-medium text-[var(--accent-strong)]">Step 3 of {STEPS}</p>
      <h1 className="mt-1 font-display text-[28px] font-semibold leading-9">Make iKAN yours</h1>
      <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
        Allow what’s useful to you. Each one is optional and you can change it any time in Settings.
      </p>
      <ul className="mt-6 space-y-3">
        {rows.map((r) => {
          const Icon = r.icon;
          const granted = r.state === "granted";
          const blocked = r.state === "denied" || r.state === "unsupported";
          return (
            <li key={r.id} className="flex items-start gap-3 rounded-[20px] bg-secondary p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-background">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">{r.title}</span>
                <span className="mt-0.5 block text-[13px] leading-5 text-muted-foreground">
                  {r.body}
                </span>
              </span>
              <button
                type="button"
                disabled={granted || blocked || r.state === "busy"}
                onClick={() => void r.allow()}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1 self-center rounded-full px-4 text-[13px] font-semibold",
                  granted
                    ? "bg-[var(--accent-container)] text-[var(--on-accent-container)]"
                    : blocked
                      ? "text-muted-foreground"
                      : "bg-foreground text-background",
                )}
              >
                {granted ? (
                  <>
                    <Check className="h-4 w-4" /> On
                  </>
                ) : r.state === "busy" ? (
                  "…"
                ) : r.state === "unsupported" ? (
                  "N/A"
                ) : blocked ? (
                  "Blocked"
                ) : (
                  "Allow"
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[13px] leading-5 text-muted-foreground">
        Health Connect and Google Fit sync come with the installed Android app.
      </p>
      {message ? (
        <p
          role="alert"
          className="mt-3 rounded-[14px] bg-[#F9DEDC] px-4 py-3 text-[14px] text-[#8C1D18]"
        >
          {message}
        </p>
      ) : null}
      <div className="mt-auto pt-6">
        <Button className="w-full" onClick={onDone}>
          Continue
        </Button>
      </div>
    </main>
  );
}
