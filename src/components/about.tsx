import { useState, type ReactNode } from "react";
import { ShieldAlert, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BottomSheet, Button } from "@/components/equip/m3";
import { cn } from "@/lib/utils";
import { scopedKey } from "@/lib/storage-scope";

/** A top-level group on a detail page. */
export function Group({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-10 px-4", className)}>
      <h2 className="font-display text-[20px] font-semibold leading-7">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** A heading inside a group. */
export function SubHead({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 mt-5 text-[15px] font-semibold">{children}</h3>;
}

/* Theme tints for tiles and icons: calm, mind, rest, alert. */
export const tints = [
  { bg: "oklch(0.95 0.035 165)", fg: "oklch(0.44 0.09 165)" },
  { bg: "oklch(0.95 0.03 245)", fg: "oklch(0.45 0.1 245)" },
  { bg: "oklch(0.96 0.05 85)", fg: "oklch(0.47 0.1 75)" },
  { bg: "oklch(0.95 0.035 25)", fg: "oklch(0.45 0.17 25)" },
] as const;

export type Tile = { icon: LucideIcon; text: string; label?: string | undefined };

/** Bullet content as a bento grid: two columns, an odd last tile spans the row. Neutral greys
 * with alternating depth; only the icon carries the page accent. */
export function Bento({
  items,
  offset = 0,
  colored = false,
}: {
  items: Tile[];
  offset?: number;
  /** theme tints per tile instead of neutral greys */
  colored?: boolean;
}) {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {items.map((t, i) => {
        const Icon = t.icon;
        const wide = items.length % 2 === 1 && i === items.length - 1;
        const deep = (i + offset) % 3 === 0;
        const tint = tints[(i + offset) % tints.length]!;
        return (
          <li
            key={t.text}
            className={cn(
              "rounded-[20px] p-4",
              wide && "col-span-2",
              !colored && (deep ? "bg-foreground/[0.07]" : "bg-foreground/[0.035]"),
            )}
            style={colored ? { background: tint.bg } : undefined}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-[12px] bg-background text-[var(--accent-strong)]"
              style={colored ? { color: tint.fg } : undefined}
            >
              <Icon className="h-5 w-5" />
            </span>
            {t.label ? <p className="mt-3 text-[14px] font-semibold leading-5">{t.label}</p> : null}
            <p
              className={cn(
                "text-[14px] leading-5",
                t.label ? "mt-1 text-muted-foreground" : "mt-3 font-medium",
              )}
            >
              {t.text}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/** One short "good to know" paragraph on a tinted background, with a way to get help. */
export function ImportantNote({ text, className }: { text: string; className?: string }) {
  return (
    <section
      className={cn("mx-4 mt-10 flex gap-3 rounded-[24px] p-4", className)}
      style={{ background: tints[2].bg }}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-background/70"
        style={{ color: tints[2].fg }}
      >
        <ShieldAlert className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold">Good to know</h2>
        <p className="mt-1 text-[14px] leading-5 text-foreground/80">{text}</p>
        <Link to="/support" className="mt-2 inline-block text-[14px] font-semibold underline">
          Need help now?
        </Link>
      </div>
    </section>
  );
}

/* "Before you start": a few short lines, confirmed once per assessment or programme. */

const ackKey = (id: string) => scopedKey(`ikan.before-start.${id}`);

export const acknowledged = (id: string) => {
  try {
    return Boolean(window.localStorage.getItem(ackKey(id)));
  } catch {
    return false;
  }
};

export function useBeforeStart(id: string, start: () => void) {
  const [open, setOpen] = useState(false);
  return {
    open,
    close: () => setOpen(false),
    /** show the notes every time something is started; confirming starts it */
    request: () => setOpen(true),
    confirm: () => {
      try {
        window.localStorage.setItem(ackKey(id), new Date().toISOString());
      } catch {
        /* storage unavailable: ask again next time */
      }
      setOpen(false);
      start();
    },
  };
}

export function BeforeYouStart({
  open,
  onClose,
  onConfirm,
  items,
  cta,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: Tile[];
  cta: string;
}) {
  const [agreed, setAgreed] = useState(false);
  return (
    <BottomSheet open={open} onClose={onClose} title="Before you start">
      <ul className="space-y-3">
        {items.map((t, i) => {
          const tint = tints[i % tints.length]!;
          const Icon = t.icon;
          return (
            <li key={t.text} className="flex items-center gap-3 text-[15px] leading-5">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px]"
                style={{ background: tint.bg, color: tint.fg }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>{t.text}</span>
            </li>
          );
        })}
      </ul>
      <label className="mt-5 flex cursor-pointer items-center gap-3 text-[15px]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="h-5 w-5 shrink-0 accent-[var(--accent-strong)]"
        />
        I understand
      </label>
      <div className="mt-5 flex flex-col gap-2">
        <Button onClick={onConfirm} disabled={!agreed}>
          {cta}
        </Button>
        <Button variant="text" onClick={onClose}>
          Not now
        </Button>
      </div>
    </BottomSheet>
  );
}
