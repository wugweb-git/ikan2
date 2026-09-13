/* Material 3 building blocks for the Equip screens, in iKAN's monochrome palette.
 * Sizes follow M3: 64dp app bars, 48dp touch targets, 56dp list rows, 28dp sheet corners. */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Accent = "night" | "ember" | "calm" | "mind" | "mood";

/** Tonal accent per programme, used only for progress and selection.
 * `--accent-strong` is the text-safe shade (4.5:1+ on white) for small labels. */
export const accentStyle = (accent: Accent): CSSProperties =>
  ({
    night: {
      "--accent": "#5E86B8",
      "--accent-strong": "#2F5580",
      "--accent-container": "#E3ECF8",
      "--on-accent-container": "#1C3553",
    },
    ember: {
      "--accent": "#B98A22",
      "--accent-strong": "#7A5A12",
      "--accent-container": "#FBEFD2",
      "--on-accent-container": "#4F3A0A",
    },
    calm: {
      "--accent": "#4E8F75",
      "--accent-strong": "#2B634D",
      "--accent-container": "#DFF0E8",
      "--on-accent-container": "#173D2F",
    },
    mind: {
      "--accent": "#5D64B4",
      "--accent-strong": "#3B418C",
      "--accent-container": "#E6E7F6",
      "--on-accent-container": "#232761",
    },
    mood: {
      "--accent": "#C2607C",
      "--accent-strong": "#8C3652",
      "--accent-container": "#F9E2E9",
      "--on-accent-container": "#5A1F32",
    },
  })[accent] as unknown as CSSProperties;

/** State layer: the pressed/hovered tint M3 puts on interactive surfaces. */
export const stateLayer =
  "relative isolate overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:bg-current after:opacity-0 after:transition-opacity hover:after:opacity-[0.06] active:after:opacity-[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

export function IconButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-full",
        stateLayer,
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TopAppBar({
  leading,
  title,
  subtitle,
  trailing,
  className,
}: {
  leading?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn("sticky top-0 z-30 flex h-16 items-center gap-1 bg-background px-1", className)}
    >
      {leading}
      <div className="min-w-0 flex-1 px-2">
        {title ? (
          <p className="truncate font-display text-[20px] font-semibold leading-7">{title}</p>
        ) : null}
        {subtitle ? (
          <p className="truncate text-[13px] leading-4 text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {trailing}
    </header>
  );
}

export function LinearProgress({ value }: { value: number }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      className="flex h-1 w-full gap-1"
    >
      <div
        className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
        style={{ width: `${value}%` }}
      />
      <div className="h-full flex-1 rounded-full bg-[var(--accent-container)]" />
    </div>
  );
}

type ButtonVariant = "filled" | "tonal" | "outlined" | "text";

export function Button({
  variant = "filled",
  children,
  onClick,
  disabled,
  type = "button",
  className,
  icon,
}: {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean | undefined;
  type?: "button" | "submit";
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold tracking-[0.01em] transition-colors disabled:pointer-events-none disabled:opacity-40",
        stateLayer,
        variant === "filled" && "bg-foreground text-background",
        variant === "tonal" && "bg-[var(--accent-container)] text-[var(--on-accent-container)]",
        variant === "outlined" && "border border-foreground/25 text-foreground",
        variant === "text" && "px-3 text-foreground",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/** Radio (single) or checkbox (multi) list row. */
export function SelectRow({
  selected,
  multi,
  onClick,
  glyph,
  children,
}: {
  selected: boolean;
  multi?: boolean | undefined;
  onClick: () => void;
  glyph?: string | undefined;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex min-h-14 w-full items-center gap-4 px-4 py-3 text-left transition-colors",
        stateLayer,
        selected && "bg-[var(--accent-container)] text-[var(--on-accent-container)]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center border-2 transition-colors",
          multi ? "rounded-[3px]" : "rounded-full",
          selected ? "border-[var(--accent-strong)]" : "border-foreground/55",
          selected && multi && "bg-[var(--accent-strong)] text-background",
        )}
      >
        {selected ? (
          multi ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-strong)]" />
          )
        ) : null}
      </span>
      {glyph ? (
        <span className="text-[22px] leading-none" aria-hidden="true">
          {glyph}
        </span>
      ) : null}
      <span className="flex-1 text-[16px] leading-6">
        {typeof children === "string" ? <Label text={children} /> : children}
      </span>
    </button>
  );
}

/** Notion writes options like "✅Yes"; give the emoji its own box so it can't overlap the word. */
export function Label({ text }: { text: string }) {
  const m = text.match(/^(\p{Extended_Pictographic}\uFE0F?)\s*(.*)$/u);
  if (!m) return <>{text}</>;
  return (
    <>
      <span aria-hidden="true" className="mr-1.5 inline-block">
        {m[1]}
      </span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{m[2]}</span>
    </>
  );
}

/** M3 segmented button, e.g. ✅Yes / ❌No. */
export function Segmented({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string | undefined;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex h-12 w-full overflow-hidden rounded-full border border-foreground/25"
    >
      {options.map((o, i) => {
        const on = value === o;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 px-3 text-[14px] font-semibold transition-colors",
              stateLayer,
              i > 0 && "border-l border-foreground/25",
              on && "bg-[var(--accent-container)] text-[var(--on-accent-container)]",
            )}
          >
            {on ? <Check className="h-4 w-4" strokeWidth={3} /> : null}
            <Label text={o} />
          </button>
        );
      })}
    </div>
  );
}

/** M3 filled text field. The label sits above the value so long Notion labels can wrap. */
export function TextField({
  label,
  value,
  onChange,
  type = "text",
  multiline,
  autoFocus,
  ariaLabel,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "time" | "date" | "datetime-local";
  multiline?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
  placeholder?: string;
}) {
  const common = {
    value,
    autoFocus,
    placeholder,
    "aria-label": label || ariaLabel,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    className: cn(
      "w-full bg-transparent px-4 text-[16px] leading-6 outline-none placeholder:text-muted-foreground/70",
      label ? "pb-2.5 pt-0.5" : "py-4",
      multiline && "min-h-24 resize-none",
    ),
  };
  return (
    <label className="block rounded-t-[4px] border-b border-foreground/50 bg-secondary transition-colors focus-within:border-b-2 focus-within:border-foreground">
      {label ? (
        <span className="block px-4 pt-2 text-[12px] leading-4 text-muted-foreground">{label}</span>
      ) : null}
      {multiline ? <textarea {...common} rows={3} /> : <input {...common} type={type} />}
    </label>
  );
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 animate-fade"
      />
      <div className="animate-sheet relative max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-background px-6 pb-8 pt-3">
        <div className="mx-auto h-1 w-8 rounded-full bg-foreground/30" />
        <p className="mt-5 font-display text-[22px] font-semibold">{title}</p>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export type SnackMessage = { text: string; id: number } | null;

/** A snackbar that shows for a few seconds each time a new message id arrives. */
export function Snackbar({ message }: { message: SnackMessage }) {
  const [shown, setShown] = useState<SnackMessage>(null);
  useEffect(() => {
    if (!message) return;
    setShown(message);
    const t = window.setTimeout(() => setShown(null), 2800);
    return () => window.clearTimeout(t);
  }, [message?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!shown) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-fade pointer-events-none fixed inset-x-0 bottom-[96px] z-50 flex justify-center px-4"
    >
      <p className="w-full max-w-sm rounded-[8px] bg-foreground px-4 py-3.5 text-[14px] text-background shadow-lg">
        {shown.text}
      </p>
    </div>
  );
}

export const useSnack = () => {
  const [message, setMessage] = useState<SnackMessage>(null);
  return { message, show: (text: string) => setMessage({ text, id: Date.now() }) };
};

/** Horizontal pager, one card per page, with page dots. */
export function Pager({
  pages,
  index,
  onIndex,
}: {
  pages: ReactNode[];
  index: number;
  onIndex: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = index * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) > 4) {
      programmatic.current = true;
      el.scrollTo({ left: target, behavior: "smooth" });
      window.setTimeout(() => (programmatic.current = false), 450);
    }
  }, [index, pages.length]);

  return (
    <div>
      <div
        ref={ref}
        onScroll={(e) => {
          if (programmatic.current) return;
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / el.clientWidth);
          if (i !== index) onIndex(i);
        }}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto"
      >
        {pages.map((p, i) => (
          <div key={i} className="w-full shrink-0 snap-center px-4" aria-hidden={i !== index}>
            {p}
          </div>
        ))}
      </div>
      {pages.length > 1 ? (
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Cards">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Card ${i + 1} of ${pages.length}`}
              onClick={() => onIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-6 bg-foreground" : "w-2 bg-foreground/25",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
