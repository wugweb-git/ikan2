import type { ReactNode } from "react";
import { Illustration } from "@/components/art";
import type { Art } from "@/lib/resources";
import { cn } from "@/lib/utils";

/* Empty states.
 *
 * Four screens had written this by hand — history, notifications, the programme journal and a
 * past assessment — in two shapes, both kept here:
 *
 *   filled  a solid 24px card, usually with an illustration band. Used where the empty state
 *           is the whole screen and should still look finished.
 *   dashed  a dashed outline. Used where it sits inside a screen that has other content, so
 *           it reads as a slot waiting to be filled rather than a result.
 *
 * An empty state says what will appear here and, where there is something to do, offers it.
 * `action` is a slot rather than a label and a route, because the call sites need a typed
 * <Link> or their own navigate, and that belongs to them.
 */

export type EmptyTone = "filled" | "dashed";

export function EmptyState({
  title,
  children,
  tone = "filled",
  art,
  icon,
  action,
  className,
}: {
  title: string;
  /** What will show up here once there is something. One sentence. */
  children: ReactNode;
  tone?: EmptyTone | undefined;
  /** An illustration band above the text. `filled` only, and takes precedence over `icon`. */
  art?: Art | undefined;
  /** Shown in an accent circle on `dashed`, plain and muted on `filled`. */
  icon?: ReactNode | undefined;
  action?: ReactNode | undefined;
  className?: string | undefined;
}) {
  const dashed = tone === "dashed";
  return (
    <div
      className={cn(
        "overflow-hidden",
        dashed
          ? "flex flex-col items-center rounded-[16px] border border-dashed border-foreground/25 px-6 py-10 text-center"
          : "rounded-[24px] bg-secondary",
        className,
      )}
    >
      {!dashed && art ? (
        <div className="h-32">
          <Illustration art={art} />
        </div>
      ) : null}
      {dashed && icon ? (
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--accent-container)] text-[var(--on-accent-container)]">
          {icon}
        </span>
      ) : null}
      <div className={dashed ? "contents" : "p-5 text-center"}>
        {!dashed && !art && icon ? (
          <span className="mx-auto mb-2 grid h-6 w-6 place-items-center text-muted-foreground">
            {icon}
          </span>
        ) : null}
        <p
          className={cn("font-display font-semibold", dashed ? "mt-3 text-[16px]" : "text-[17px]")}
        >
          {title}
        </p>
        <p className="mt-1 text-[14px] text-muted-foreground">{children}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}

/** One line, no box: an empty slot inside a screen that already has its own container. */
export function EmptyLine({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <p className={cn("py-6 text-center text-[14px] text-muted-foreground", className)}>
      {children}
    </p>
  );
}
