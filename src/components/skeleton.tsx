import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, CloudOff, LifeBuoy, RotateCw } from "lucide-react";
import { sceneInk, StateIllustration, type StateScene } from "@/components/art";
import { IkanMark } from "@/components/ikan-mark";
import { stateLayer } from "@/components/equip/m3";
import { cn } from "@/lib/utils";

/* Loading, empty and error states shared by every screen. */

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton", className)} />;
}

/** A page-shaped placeholder: app bar, hero, a row of tiles and a list. */
export function PageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto min-h-dvh w-full max-w-app bg-background px-4 pt-[max(1rem,var(--safe-top,env(safe-area-inset-top)))]"
    >
      <div className="flex h-12 items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="mt-4 h-44 rounded-[28px]" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-[20px]" />
        <Skeleton className="h-24 rounded-[20px]" />
      </div>
      <Skeleton className="mt-6 h-5 w-32" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="mt-3 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-[14px]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

/* The screens nobody wants to land on. They get the same care as the rest of the app: the
 * drawing says what happened before the words do, the mark says whose app you are still in, and
 * the crisis row stays in reach as an offer rather than a footnote, because someone who has hit
 * a dead end may already be having a hard day. */
function StateScreen({
  scene,
  title,
  body,
  children,
}: {
  scene: StateScene;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <IkanMark className="h-4 w-4" />
          <span className="font-display text-[13px] font-semibold tracking-[0.08em]">iKAN</span>
        </span>
        <span
          className="surface-wash mt-10 block w-full"
          style={{ color: sceneInk[scene] }}
          aria-hidden="true"
        >
          <StateIllustration scene={scene} />
        </span>
        <h1 className="mt-8 font-display text-[26px] font-semibold leading-8 tracking-[-0.01em] text-balance">
          {title}
        </h1>
        <p className="type-body mt-2.5 text-muted-foreground text-balance">{body}</p>
        <div className="mt-8 flex w-full flex-col gap-2">{children}</div>
        <Link
          to="/support"
          className={cn(
            "motion-tint mt-8 flex w-full items-center gap-3 rounded-[20px] border border-on-error-container/20 bg-on-error-container/[0.04] px-4 py-3 text-left",
            stateLayer,
          )}
        >
          <LifeBuoy className="h-5 w-5 shrink-0 text-on-error-container" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="type-body-md font-semibold block text-on-error-container">
              Need help now?
            </span>
            <span className="type-body-sm block text-muted-foreground">
              Free, confidential helplines are open right now.
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-on-error-container" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

const primary =
  "type-action flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-background";
const secondary =
  "type-action flex h-12 items-center justify-center rounded-full border border-foreground/15 px-6";

export function NotFoundScreen() {
  return (
    <StateScreen
      scene="lost"
      title="We can’t find that one"
      body="The link may be old, or the page has moved since. Nothing you’ve saved has gone anywhere."
    >
      <Link to="/" className={primary}>
        Take me home
      </Link>
      <Link to="/resources" className={secondary}>
        Browse the library
      </Link>
    </StateScreen>
  );
}

export function ErrorScreen({ reset }: { reset?: () => void }) {
  const router = useRouter();
  const online = useOnline();
  const [retrying, setRetrying] = useState(false);

  const retry = () => {
    setRetrying(true);
    void router.invalidate();
    reset?.();
  };

  /* Only when the connection actually comes back, never on first render: retrying the thing
   * that just failed, the instant it failed, is how you get a loop instead of a page. */
  const wasOffline = useRef(false);
  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      setRetrying(false);
      return;
    }
    if (wasOffline.current) {
      wasOffline.current = false;
      retry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  useEffect(() => {
    if (!retrying) return;
    const t = setTimeout(() => setRetrying(false), 4000);
    return () => clearTimeout(t);
  }, [retrying]);

  return (
    <StateScreen
      scene={online ? "broken" : "offline"}
      title={online ? "That didn’t load" : "You’re offline"}
      body={
        online
          ? "Something went wrong at our end, not yours. Give it another go in a moment."
          : "We’ll pick this up the moment you’re back on. Everything saved on this phone is still here."
      }
    >
      <button type="button" className={primary} onClick={retry} disabled={retrying}>
        <RotateCw className={cn("h-4 w-4", retrying && "motion-spin")} />
        {retrying ? "Trying…" : online ? "Try again" : "Try anyway"}
      </button>
      <a href="/" className={secondary}>
        Take me home
      </a>
    </StateScreen>
  );
}

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

/** A thin banner at the top while the phone has no connection. */
export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[95] flex justify-center pt-[var(--safe-top,env(safe-area-inset-top))] print:hidden"
    >
      <p className="type-body-sm font-semibold mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-background shadow-dock">
        <CloudOff className="h-4 w-4" /> Offline. Changes save on this phone.
      </p>
    </div>
  );
}
