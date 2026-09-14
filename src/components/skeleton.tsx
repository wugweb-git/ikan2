import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CloudOff, LifeBuoy, RotateCw, SearchX } from "lucide-react";
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
      className="mx-auto min-h-dvh w-full max-w-app bg-background px-4 pt-[max(1rem,env(safe-area-inset-top))]"
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

function StateScreen({
  icon: Icon,
  title,
  body,
  children,
}: {
  icon: typeof SearchX;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-6">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-[20px] bg-secondary">
          <Icon className="h-8 w-8" />
        </span>
        <h1 className="mt-5 font-display text-[24px] font-semibold leading-8">{title}</h1>
        <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{body}</p>
        <div className="mt-6 flex w-full flex-col gap-2">{children}</div>
        <Link
          to="/support"
          className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#8C1D18]"
        >
          <LifeBuoy className="h-4 w-4" /> Need help now?
        </Link>
      </div>
    </div>
  );
}

const primary =
  "flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[15px] font-semibold text-background";
const secondary =
  "flex h-12 items-center justify-center rounded-full border border-foreground/15 px-6 text-[15px] font-semibold";

export function NotFoundScreen() {
  return (
    <StateScreen
      icon={SearchX}
      title="This page isn’t here"
      body="The link may be old, or the page has moved. Everything you saved is safe."
    >
      <Link to="/" className={primary}>
        Go to home
      </Link>
    </StateScreen>
  );
}

export function ErrorScreen({ reset }: { reset?: () => void }) {
  const router = useRouter();
  const online = useOnline();
  return (
    <StateScreen
      icon={online ? RotateCw : CloudOff}
      title={online ? "This page didn’t load" : "You’re offline"}
      body={
        online
          ? "Something went wrong while opening it. Try again, or go back home."
          : "Connect to the internet and try again. Anything saved on this phone is still here."
      }
    >
      <button
        type="button"
        className={primary}
        onClick={() => {
          void router.invalidate();
          reset?.();
        }}
      >
        <RotateCw className="h-4 w-4" /> Try again
      </button>
      <a href="/" className={secondary}>
        Go to home
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
      className="fixed inset-x-0 top-0 z-[95] flex justify-center pt-[env(safe-area-inset-top)] print:hidden"
    >
      <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[13px] font-semibold text-background shadow-dock">
        <CloudOff className="h-4 w-4" /> Offline. Changes save on this phone.
      </p>
    </div>
  );
}
