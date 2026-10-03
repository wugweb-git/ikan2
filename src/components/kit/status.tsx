import type { ReactNode } from "react";
import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

/* Failure states.
 *
 * Empty and failed are not the same thing and must not look the same. Empty means "nothing
 * here yet, and here is how to start"; failed means "something exists but we could not reach
 * it, and it is worth trying again". Showing an empty state after a failed fetch quietly tells
 * someone their journal is gone, which in this app is the worst possible lie.
 *
 * So these use the error colour, name what failed, and offer a retry — never a "get started"
 * action, which would be the wrong invitation.
 */

export function ErrorState({
  title = "That didn't load",
  children,
  onRetry,
  retryLabel = "Try again",
  offline = false,
  className,
}: {
  title?: string | undefined;
  /** What failed, in the user's terms. Not a status code. */
  children?: ReactNode | undefined;
  onRetry?: (() => void) | undefined;
  retryLabel?: string | undefined;
  /** Switches the icon and the default wording to a connection problem. */
  offline?: boolean | undefined;
  className?: string | undefined;
}) {
  const Icon = offline ? WifiOff : AlertTriangle;
  return (
    <div
      role="alert"
      className={cn(
        "motion-error rounded-[24px] border border-error/20 bg-error/5 p-5 text-center",
        className,
      )}
    >
      <Icon className="mx-auto h-6 w-6 text-error" aria-hidden="true" />
      <p className="mt-2 font-display text-[17px] font-semibold">
        {offline && title === "That didn't load" ? "You're offline" : title}
      </p>
      <p className="mt-1 text-[14px] text-muted-foreground">
        {children ??
          (offline
            ? "Your work is saved on this device and will sync when you're back."
            : "Nothing was lost. It just didn't come through this time.")}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="motion-press mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-[14px] font-semibold text-background"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}

/** One line, for a failure inside a container that already has its own frame. */
export function ErrorLine({
  children,
  onRetry,
  className,
}: {
  children: ReactNode;
  onRetry?: (() => void) | undefined;
  className?: string | undefined;
}) {
  return (
    <p
      role="alert"
      className={cn(
        "motion-error flex items-center justify-center gap-2 py-6 text-center text-[14px] text-error",
        className,
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
      {onRetry ? (
        <button type="button" onClick={onRetry} className="font-semibold underline">
          Retry
        </button>
      ) : null}
    </p>
  );
}

/**
 * The message under a field that failed validation.
 *
 * `role="alert"` so it is announced when it appears, and it renders nothing when there is no
 * error, so a caller can mount it unconditionally and not guard.
 */
export function FieldError({
  children,
  className,
}: {
  children?: ReactNode | undefined;
  className?: string | undefined;
}) {
  if (!children) return null;
  return (
    <span
      role="alert"
      className={cn("type-label-md motion-error mt-1 block px-1 text-error", className)}
    >
      {children}
    </span>
  );
}
