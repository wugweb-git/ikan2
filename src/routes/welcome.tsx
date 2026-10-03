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
  requestNotifications,
  useDevice,
  useNotificationAccess,
  type Access,
} from "@/lib/device";
import { profileInitials, useOnboarding, useProfile } from "@/lib/profile";
import type { Art } from "@/lib/resources";
import * as v from "@/lib/validate";
import { useHealthConnect } from "@/lib/health-connect";
import { fillFromGoogle, preloadGoogle } from "@/lib/google-people";
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
      <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background pb-[env(safe-area-inset-bottom)] pt-[var(--safe-top,env(safe-area-inset-top))] shadow-app">
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
            className="type-action h-12 px-4 text-muted-foreground"
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
            <p className="type-label-lg text-[var(--accent-strong)]">Step 2 of {STEPS}</p>
            <h1 className="type-headline-md mt-1">What brings you here?</h1>
            <p className="type-body mt-2 text-muted-foreground">
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
                <p className="type-body-sm mt-2 text-center text-muted-foreground">
                  Choose one to continue, or skip.
                </p>
              ) : null}
            </div>
          </main>
        ) : step === 2 ? (
          <Permissions onDone={() => (assessment ? setStep(3) : leave())} />
        ) : assessment && reason ? (
          <main className="flex flex-1 flex-col px-4 pb-8">
            <p className="type-label-lg text-[var(--accent-strong)]">Step 4 of {STEPS}</p>
            <h1 className="type-headline-md mt-1">Start with a short check</h1>
            <p className="type-body mt-2 text-muted-foreground">
              It shows where you are today and which program fits. It’s a screening, not a
              diagnosis.
            </p>
            <div className="mt-6 overflow-hidden rounded-[28px] bg-secondary">
              <div className="h-40">
                <Illustration art={reason.art} />
              </div>
              <div className="p-5">
                <p className="type-label-lg flex items-center gap-2 text-[var(--accent-strong)]">
                  {(() => {
                    const Icon = categoryIcon[assessment.category];
                    return <Icon className="h-4 w-4" />;
                  })()}
                  {assessment.name}
                </p>
                <p className="type-title-lg mt-1">{assessment.title}</p>
                <p className="type-body-md mt-3 flex gap-4 text-muted-foreground">
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
  const { user } = useAuth();
  const [google, setGoogle] = useState<{ busy: boolean; note: string | null }>({
    busy: false,
    note: null,
  });
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
  useEffect(() => preloadGoogle(), []);
  useEffect(() => {
    if (loaded) return;
    // older profiles say "Male"/"Female" and keep the PIN inside the city ("Noida, 201310")
    const gender =
      { male: "Man", female: "Woman" }[profile.gender.trim().toLowerCase()] ?? profile.gender;
    const pinInCity = profile.city.match(/[,\s]+([1-9]\d{5})\s*$/);
    setDraft({
      birthday: profile.birthday,
      gender: v.genders.includes(gender) ? gender : "",
      maritalStatus: profile.maritalStatus,
      city: pinInCity ? profile.city.slice(0, pinInCity.index).trim() : profile.city,
      zip: profile.zip || pinInCity?.[1] || "",
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

  const fromGoogle = async () => {
    setGoogle({ busy: true, note: null });
    try {
      const g = await fillFromGoogle(user?.email ?? undefined);
      const filled = (["birthday", "gender", "city", "zip"] as const).filter((k) => g[k]);
      setDraft((d) => ({
        ...d,
        ...(g.birthday && !v.birthday(g.birthday) ? { birthday: g.birthday } : {}),
        ...(g.gender ? { gender: g.gender } : {}),
        ...(g.city ? { city: g.city } : {}),
        ...(g.zip ? { zip: g.zip } : {}),
      }));
      const extra: Partial<typeof profile> = {};
      if (g.phone && !profile.phone) extra.phone = g.phone;
      if (g.avatar && !profile.avatar) extra.avatar = g.avatar;
      if (Object.keys(extra).length) save(extra);
      setGoogle({
        busy: false,
        note:
          filled.length || extra.phone
            ? "Filled in what Google has. Check it, then continue."
            : "Your Google account doesn’t have these details. Fill them in below.",
      });
    } catch (e) {
      setGoogle({ busy: false, note: (e as Error).message });
    }
  };

  return (
    <main className="flex flex-1 flex-col px-4 pb-8">
      <p className="type-label-lg text-[var(--accent-strong)]">{label}</p>
      <div className="mt-1 flex items-center gap-3">
        <span className="type-title-lg grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--accent-strong)] text-background">
          <ProfilePhoto src={profile.avatar}>{profileInitials(profile)}</ProfilePhoto>
        </span>
        <h1 className="font-display text-[26px] font-semibold leading-8">
          {name ? `Hi ${name}, tell us about you` : "Tell us about you"}
        </h1>
      </div>
      <p className="type-body mt-2 text-muted-foreground">
        This helps us suggest the right programs and local support. Only you and consultants you
        book can see it.
      </p>

      <button
        type="button"
        onClick={() => void fromGoogle()}
        disabled={google.busy}
        className="type-action mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/15 disabled:opacity-50"
      >
        <GoogleG /> {google.busy ? "Asking Google…" : "Fill from Google"}
      </button>
      {google.note ? (
        <p role="status" className="type-body-sm mt-2 text-center text-muted-foreground">
          {google.note}
        </p>
      ) : null}

      <form
        noValidate
        className="mt-5 space-y-3"
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
            className="type-body-md rounded-[14px] bg-error-container px-4 py-3 text-on-error-container"
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

  const health = useHealthConnect();
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
      id: "activity",
      icon: Footprints,
      title: "Activity",
      body: health.native
        ? "Steps, sleep and heart rate from Health Connect, so they count in your iKAN Score."
        : "Steps, sleep and heart rate from Health Connect, in the iKAN Android app.",
      state: !health.native
        ? "unsupported"
        : health.busy
          ? "busy"
          : health.connected
            ? "granted"
            : health.availability === "unavailable"
              ? "unsupported"
              : "prompt",
      allow: async () => {
        if (health.availability === "update_required") return health.install();
        await health.connect();
      },
    },
  ];

  return (
    <main className="flex flex-1 flex-col px-4 pb-8">
      <p className="type-label-lg text-[var(--accent-strong)]">Step 3 of {STEPS}</p>
      <h1 className="type-headline-md mt-1">Make iKAN yours</h1>
      <p className="type-body mt-2 text-muted-foreground">
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
                <span className="type-action block">{r.title}</span>
                <span className="type-body-sm mt-0.5 block text-muted-foreground">{r.body}</span>
              </span>
              <button
                type="button"
                disabled={granted || blocked || r.state === "busy"}
                onClick={() => void r.allow()}
                className={cn(
                  "type-body-sm font-semibold inline-flex h-9 shrink-0 items-center gap-1 self-center rounded-full px-4",
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
                  r.id === "activity" && !health.native ? (
                    "In app"
                  ) : (
                    "N/A"
                  )
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
      <p className="type-body-sm mt-3 text-muted-foreground">
        Health Connect and Google Fit sync come with the installed Android app.
      </p>
      {message ? (
        <p
          role="alert"
          className="type-body-md mt-3 rounded-[14px] bg-error-container px-4 py-3 text-on-error-container"
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

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
