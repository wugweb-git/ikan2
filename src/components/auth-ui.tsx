import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Eye, EyeOff, Lock, ShieldCheck, Sparkles, UserRoundCheck } from "lucide-react";
import { Illustration } from "@/components/art";
import { cn } from "@/lib/utils";
import { displayName, useAuth, type Provider } from "@/lib/auth";
import { onboardingDone, seedProfile } from "@/lib/profile";
import { MadeBy } from "@/components/made-by";

const PUBLIC =
  /^\/(login|signup|verify-email|forgot-password|reset-password|support|about|faq|contact|legal)(\/|$)/;
const AUTH_ONLY = /^\/(login|signup|verify-email|forgot-password)(\/|$)/;

/** Keeps the app behind sign-in. Crisis support and the auth screens stay open to everyone. */
export function AuthGate({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const location = useRouterState({ select: (s) => s.location });
  const navigate = useNavigate();
  const path = location.pathname;
  const isPublic = PUBLIC.test(path);

  useEffect(() => {
    if (status === "signedOut" && !isPublic) {
      navigate({ to: "/login", search: { redirect: location.href }, replace: true });
    }
    if (status === "signedIn" && user) {
      seedProfile({
        name: displayName(user),
        email: user.email ?? "",
        phone: (user.user_metadata?.["phone"] as string | undefined) ?? "",
        avatar:
          (user.user_metadata?.["avatar_url"] as string | undefined) ??
          (user.user_metadata?.["picture"] as string | undefined),
      });
      if (AUTH_ONLY.test(path)) {
        const redirect = new URLSearchParams(location.searchStr).get("redirect");
        const target =
          redirect && redirect.startsWith("/") && !AUTH_ONLY.test(redirect) ? redirect : "/";
        if (!onboardingDone()) navigate({ to: "/welcome", replace: true });
        else navigate({ href: target, replace: true });
      } else if (
        !isPublic &&
        path !== "/welcome" &&
        path !== "/reset-password" &&
        !path.startsWith("/support") &&
        !onboardingDone()
      ) {
        navigate({ to: "/welcome", replace: true });
      }
    }
  }, [status, path]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPublic) return <>{children}</>;
  if (status !== "signedIn") return <Splash />;
  return <>{children}</>;
}

function Splash() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas px-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <img src="/favicon.svg" alt="" className="h-20 w-20 animate-pulse rounded-[22px]" />
        <p className="font-display text-[22px] font-semibold">iKAN</p>
        <p className="text-[14px] text-muted-foreground" role="status">
          Opening your space…
        </p>
      </div>
      <div className="mx-auto w-full max-w-sm">
        <TrustList />
        <MadeBy className="mt-6" />
      </div>
    </div>
  );
}

export function AuthLayout({
  title,
  subtitle,
  art = "mood",
  children,
  footer,
}: {
  title: string;
  subtitle?: ReactNode;
  art?: "mood" | "sleep" | "checkup" | "anxiety" | "welcome";
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background pb-[env(safe-area-inset-bottom)] shadow-app">
        <div className="relative h-44 overflow-hidden">
          {art === "welcome" ? <WelcomeArt /> : <Illustration art={art} />}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
          <Link
            to="/login"
            className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-background/85 py-1.5 pl-1.5 pr-3 backdrop-blur"
          >
            <img src="/favicon.svg" alt="" className="h-8 w-8 rounded-[10px]" />
            <span className="font-display text-[17px] font-semibold">iKAN</span>
          </Link>
        </div>
        <main className="flex flex-1 flex-col px-6 pb-8">
          <h1 className="font-display text-[30px] font-semibold leading-9">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{subtitle}</p>
          ) : null}
          <div className="mt-6">{children}</div>
          <div className="mt-auto pt-8">
            {footer}
            <MadeBy className={footer ? "mt-6" : ""} />
          </div>
        </main>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  placeholder,
  error,
  hint,
  maxLength,
  onBlur,
}: {
  label: string;
  type?: "text" | "email" | "password" | "tel";
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
  error?: string | undefined;
  hint?: string;
  maxLength?: number;
  onBlur?: () => void;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-muted-foreground">{label}</span>
      <span
        className={cn(
          "flex h-14 items-center rounded-[16px] border bg-secondary px-4 transition-colors focus-within:border-foreground/60 focus-within:bg-background",
          error ? "border-[#B3261E]" : "border-transparent",
        )}
      >
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          maxLength={maxLength}
          onBlur={onBlur}
          inputMode={type === "email" ? "email" : undefined}
          autoCapitalize={type === "email" || type === "password" ? "none" : undefined}
          spellCheck={type === "email" || type === "password" ? false : undefined}
          aria-invalid={Boolean(error)}
          className="h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted-foreground/70"
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="-mr-2 grid h-10 w-10 place-items-center rounded-full text-muted-foreground"
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        ) : null}
      </span>
      {error ? (
        <span role="alert" className="mt-1.5 block text-[13px] text-[#B3261E]">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[13px] text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

export function PrimaryButton({
  children,
  busy,
  disabled,
  type = "submit",
  onClick,
}: {
  children: ReactNode;
  busy?: boolean;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || busy}
      className="relative flex h-14 w-full items-center justify-center rounded-full bg-foreground text-[16px] font-semibold text-background transition-opacity disabled:opacity-50"
    >
      {busy ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-background/40 border-t-background" />
      ) : (
        children
      )}
    </button>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-[14px] bg-[#F9DEDC] px-4 py-3 text-[14px] leading-5 text-[#8C1D18]"
    >
      {message}
    </p>
  );
}

export function SocialButtons({ onError }: { onError: (m: string) => void }) {
  const { signInWith } = useAuth();
  const [busy, setBusy] = useState<Provider | null>(null);
  const go = async (p: Provider) => {
    setBusy(p);
    try {
      await signInWith(p);
    } catch (e) {
      onError((e as Error).message);
      setBusy(null);
    }
  };
  return (
    <div>
      <div className="my-6 flex items-center gap-3 text-[13px] text-muted-foreground">
        <span className="h-px flex-1 bg-foreground/10" /> or{" "}
        <span className="h-px flex-1 bg-foreground/10" />
      </div>
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => go("google")}
          disabled={Boolean(busy)}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-foreground/15 text-[15px] font-semibold disabled:opacity-50"
        >
          <GoogleMark /> {busy === "google" ? "Opening Google…" : "Continue with Google"}
        </button>
        <button
          type="button"
          onClick={() => go("linkedin_oidc")}
          disabled={Boolean(busy)}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-foreground/15 text-[15px] font-semibold disabled:opacity-50"
        >
          <LinkedInMark />{" "}
          {busy === "linkedin_oidc" ? "Opening LinkedIn…" : "Continue with LinkedIn"}
        </button>
      </div>
    </div>
  );
}

export function TrustList() {
  const items = [
    { icon: Lock, text: "Private and secure. Your answers are never sold or shared." },
    { icon: ShieldCheck, text: "Built on assessments used by clinicians." },
    { icon: UserRoundCheck, text: "Real professionals when you want to talk." },
  ];
  return (
    <ul className="space-y-3">
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="flex gap-3 text-[13px] leading-5 text-muted-foreground">
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#2B634D]" /> {text}
        </li>
      ))}
    </ul>
  );
}

export const TermsNote = () => (
  <p className="mt-5 text-center text-[12px] leading-5 text-muted-foreground">
    By continuing you agree to the{" "}
    <Link to="/legal/$slug" params={{ slug: "terms" }} className="underline underline-offset-2">
      Terms of use
    </Link>{" "}
    and{" "}
    <Link
      to="/legal/$slug"
      params={{ slug: "privacy-policy" }}
      className="underline underline-offset-2"
    >
      Privacy policy
    </Link>
    .
  </p>
);

export const SparkleIcon = Sparkles;

function GoogleMark() {
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
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7.1 9.4H4.6V19h2.5V9.4zM5.9 5a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9zM19.4 13.6c0-2.6-1.4-4.3-3.6-4.3-1.3 0-2.2.7-2.6 1.4V9.4h-2.4V19h2.5v-5c0-1.3.6-2.2 1.7-2.2 1.1 0 1.6.8 1.6 2.2v5h2.5v-5.4z"
      />
    </svg>
  );
}

/** "Keep me signed in" for the sign-in screens. */
export function RememberMe({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[14px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 accent-foreground"
      />
      Keep me signed in
    </label>
  );
}

/** Sign-up scene: a sunrise over soft hills with the iKAN burst as the sun. */
function WelcomeArt() {
  return (
    <svg
      viewBox="0 0 320 176"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DCEBF6" />
          <stop offset="0.6" stopColor="#EAF4EE" />
          <stop offset="1" stopColor="#FFF4E0" />
        </linearGradient>
        <radialGradient id="wa-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD27A" stopOpacity="0.75" />
          <stop offset="1" stopColor="#FFD27A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="176" fill="url(#wa-sky)" />
      <circle cx="214" cy="84" r="70" fill="url(#wa-glow)" />
      <g transform="translate(214 84)" stroke="#E7A93B" strokeWidth="5" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          const r1 = i % 2 ? 18 : 14;
          const r2 = i % 2 ? 34 : 42;
          return (
            <line
              key={i}
              x1={Math.cos(a) * r1}
              y1={Math.sin(a) * r1}
              x2={Math.cos(a) * r2}
              y2={Math.sin(a) * r2}
            />
          );
        })}
        <circle r="10" fill="#E7A93B" stroke="none" />
      </g>
      <path
        d="M0 132 C 60 104, 120 120, 176 110 S 280 96, 320 112 L320 176 L0 176 Z"
        fill="#9CCBB1"
      />
      <path
        d="M0 150 C 70 132, 150 150, 220 138 S 300 132, 320 140 L320 176 L0 176 Z"
        fill="#6FAE8E"
      />
      <path d="M0 166 C 90 156, 190 170, 320 158 L320 176 L0 176 Z" fill="#4E8F75" />
      <g fill="#4E8F75" opacity="0.5">
        <circle cx="52" cy="46" r="2" />
        <circle cx="96" cy="30" r="1.5" />
        <circle cx="140" cy="52" r="1.8" />
      </g>
    </svg>
  );
}
