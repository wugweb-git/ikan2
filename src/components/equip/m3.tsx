import { createPortal } from "react-dom";
/* Material 3 building blocks for the Equip screens, in iKAN's monochrome palette.
 * Sizes follow M3: 64dp app bars, 48dp touch targets, 56dp list rows, 28dp sheet corners. */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Brain, Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBackToClose } from "@/hooks/use-back-close";

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
      className={cn(
        // min-h, not h: the bar carries safe-top-sm, and a fixed height with border-box would
        // spend that padding squashing its own contents instead of clearing the notch.
        "safe-top-sm sticky top-0 z-30 flex min-h-16 items-center gap-1 bg-background px-1 print:hidden",
        className,
      )}
    >
      {leading}
      <div className="min-w-0 flex-1 px-2">
        {title ? <p className="type-title-lg font-semibold truncate">{title}</p> : null}
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

/* M3 names five button emphases. `elevated` is the filled card-like one; the rest were
 * already here. `destructive` is iKAN's own — delete-account and clear-data needed it and
 * were reaching for a raw hex. */
export type ButtonVariant = "filled" | "tonal" | "outlined" | "text" | "elevated" | "destructive";

/* The five heights the screens actually use. `lg` is the default because it is what every
 * existing call site renders today. */
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

/* Height and padding per size; the type comes from a role.
 *
 * `md` and `lg` are `type-action` — 15/22/600 is the primary CTA spec, and it had no name
 * until now, so every button re-decided it. The outliers borrow the nearest role rather than
 * inventing a size: xs is Body S, sm is Label L, xl is Body L at the button's own weight. */
const buttonSizes: Record<ButtonSize, string> = {
  xs: "h-9 px-4 type-body-sm font-semibold",
  sm: "h-10 px-5 type-label-lg font-semibold",
  md: "h-11 px-5 type-action",
  lg: "h-12 px-6 type-action",
  xl: "h-14 px-7 type-body-lg font-semibold",
};

const buttonVariants: Record<ButtonVariant, string> = {
  filled: "bg-foreground text-background",
  tonal: "bg-[var(--accent-container)] text-[var(--on-accent-container)]",
  outlined: "border border-foreground/25 text-foreground",
  text: "text-foreground",
  elevated: "bg-card text-foreground shadow-[var(--shadow-card)]",
  destructive: "bg-error text-on-error",
};

export function Button({
  variant = "filled",
  size = "lg",
  children,
  onClick,
  disabled,
  loading,
  full,
  type = "button",
  className,
  icon,
  trailingIcon,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize | undefined;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean | undefined;
  /** Blocks the button and shows a spinner in place of the leading icon. */
  loading?: boolean | undefined;
  /** Fills the width of its container, as the form submit buttons do. */
  full?: boolean | undefined;
  type?: "button" | "submit";
  className?: string;
  icon?: ReactNode;
  trailingIcon?: ReactNode | undefined;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "motion-press inline-flex items-center justify-center gap-2 rounded-full disabled:pointer-events-none disabled:opacity-40",
        buttonSizes[size],
        stateLayer,
        buttonVariants[variant],
        /* a text button has no fill, so it should not carry the fill's side padding */
        variant === "text" && "px-3",
        full && "w-full",
        className,
      )}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        icon
      )}
      {children}
      {trailingIcon}
    </button>
  );
}

/** The one floating action button: a circle that sits above the content, not in it. */
export function Fab({
  label,
  onClick,
  children,
  extended,
  className,
}: {
  label: string;
  onClick?: (() => void) | undefined;
  children: ReactNode;
  /** Adds the label beside the icon, as M3's extended FAB does. */
  extended?: boolean | undefined;
  className?: string | undefined;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={extended ? undefined : label}
      className={cn(
        "motion-press inline-flex h-14 items-center justify-center gap-2 rounded-full bg-foreground text-background shadow-dock",
        extended ? "px-5 text-[15px] font-semibold" : "w-14",
        stateLayer,
        className,
      )}
    >
      {children}
      {extended ? label : null}
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
const optionIcons: Record<string, typeof Brain> = { thought: Brain, feeling: Heart };

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
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${Math.min(options.length, 5)}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const on = value === o;
        const Icon = optionIcons[o.trim().toLowerCase()];
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            className={cn(
              "flex min-h-12 items-center justify-center gap-2 rounded-[14px] border px-3 py-2 text-[15px] font-semibold transition-colors",
              stateLayer,
              on
                ? "border-transparent bg-[var(--accent-strong)] text-background"
                : "border-foreground/10 bg-background",
            )}
          >
            {on ? (
              <Check className="h-4 w-4 shrink-0" strokeWidth={3} />
            ) : Icon ? (
              <Icon className="h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
            ) : null}
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
  error,
  hint,
  maxLength,
  inputMode,
  autoComplete,
  max,
  min,
  onBlur,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "time" | "date" | "datetime-local" | "email";
  multiline?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
  placeholder?: string | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  maxLength?: number | undefined;
  inputMode?: "text" | "numeric" | "email" | "tel" | undefined;
  autoComplete?: string | undefined;
  max?: string | undefined;
  min?: string | undefined;
  onBlur?: (() => void) | undefined;
  /** visible lines for a multiline field (default 3) */
  rows?: number | undefined;
}) {
  const common = {
    value,
    autoFocus,
    placeholder,
    maxLength,
    inputMode,
    autoComplete,
    onBlur,
    "aria-label": label || ariaLabel,
    "aria-invalid": Boolean(error),
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    className: cn(
      "w-full bg-transparent px-4 text-[16px] leading-6 outline-none placeholder:text-muted-foreground/70",
      label ? "pb-2.5 pt-0.5" : "py-4",
      multiline && (rows ? "resize-none" : "min-h-24 resize-none"),
    ),
  };
  return (
    <div>
      <label
        className={cn(
          "block rounded-t-[4px] border-b bg-secondary transition-colors focus-within:border-b-2",
          error ? "border-error" : "border-foreground/50 focus-within:border-foreground",
        )}
      >
        {label ? (
          <span className="type-label-md block px-4 pt-2 text-muted-foreground">{label}</span>
        ) : null}
        {multiline ? (
          <textarea {...common} rows={rows ?? 3} />
        ) : (
          <input {...common} type={type} max={max} min={min} />
        )}
      </label>
      <FieldMessage
        error={error}
        hint={hint}
        count={multiline && maxLength ? [value.length, maxLength] : undefined}
      />
    </div>
  );
}

function FieldMessage({
  error,
  hint,
  count,
}: {
  error?: string | undefined;
  hint?: string | undefined;
  count?: [number, number] | undefined;
}) {
  if (!error && !hint && !count) return null;
  return (
    <span className="type-label-md mt-1 flex gap-3 px-4">
      <span
        role={error ? "alert" : undefined}
        className={cn("flex-1", error ? "text-error" : "text-muted-foreground")}
      >
        {error ?? hint}
      </span>
      {count ? (
        <span className="tabular-nums text-muted-foreground">
          {count[0]}/{count[1]}
        </span>
      ) : null}
    </span>
  );
}

/** Earlier answers offered back as one-tap picks. */
export function QuickPicks({
  title = "From earlier days",
  items,
  selected,
  onPick,
}: {
  title?: string;
  items: { label: string; value: string }[];
  selected?: string | undefined;
  onPick: (value: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="mt-3">
      <p className="text-[12px] text-muted-foreground">{title}</p>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {items.map((it) => (
          <button
            key={it.value}
            type="button"
            // keep focus where it is: blurring first closes the keyboard, the sheet jumps and
            // the tap lands on whatever moved under the finger
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onPick(it.value)}
            className={cn(
              "inline-flex min-h-9 max-w-full items-center rounded-full px-3 py-1.5 text-left text-[13px] font-medium",
              stateLayer,
              selected === it.value
                ? "bg-foreground text-background"
                : "border border-foreground/10 bg-secondary text-foreground",
            )}
          >
            <span className="line-clamp-1">{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** A native select styled like TextField. */
export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Choose",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  error?: string | undefined;
}) {
  return (
    <div>
      <label
        className={cn(
          "relative block rounded-t-[4px] border-b bg-secondary transition-colors focus-within:border-b-2",
          error ? "border-error" : "border-foreground/50 focus-within:border-foreground",
        )}
      >
        <span className="type-label-md block px-4 pt-2 text-muted-foreground">{label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full appearance-none bg-transparent px-4 pb-2.5 pt-0.5 pr-10 text-[16px] leading-6 outline-none",
            !value && "text-muted-foreground/70",
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
        >
          <path
            d="m6 9 6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </label>
      <FieldMessage error={error} />
    </div>
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
  useBackToClose(open, onClose);
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

  if (!open || typeof document === "undefined") return null;
  // rendered into <body> above everything, so the bottom navigation never covers it
  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center"
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
      <div className="animate-sheet relative max-h-[88dvh] w-full max-w-app overflow-y-auto rounded-t-[28px] bg-background px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto h-1 w-8 rounded-full bg-foreground/30" />
        <p className="mt-5 font-display text-[22px] font-semibold">{title}</p>
        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body,
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
  peek = true,
}: {
  pages: ReactNode[];
  index: number;
  onIndex: (i: number) => void;
  /** show the edge of the next card; off when each page is a full screen of its own */
  peek?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);

  const many = peek && pages.length > 1;
  const offsetOf = (el: HTMLDivElement, i: number) => {
    const child = el.children[i] as HTMLElement | undefined;
    return child ? child.offsetLeft - el.offsetLeft : 0;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = offsetOf(el, index);
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
          let best = 0;
          for (let i = 0; i < pages.length; i++)
            if (
              Math.abs(offsetOf(el, i) - el.scrollLeft) <
              Math.abs(offsetOf(el, best) - el.scrollLeft)
            )
              best = i;
          if (best !== index) onIndex(best);
        }}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 overflow-x-auto"
      >
        {pages.map((p, i) => (
          // with more than one card the next one peeks in, so it's clear there is more
          <div
            key={i}
            className={cn(
              "shrink-0 snap-start pl-4",
              many ? "w-[82%] last:w-[calc(82%+1rem)] last:pr-4" : "w-full pr-4",
            )}
            aria-hidden={i !== index}
          >
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

/** M3 switch: 52×32 track, thumb grows when on. */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-8 w-[52px] shrink-0 rounded-full border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
        checked
          ? "border-transparent bg-[var(--accent-strong,#1f2937)]"
          : "border-foreground/40 bg-secondary",
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full transition-all",
          checked
            ? "left-[22px] h-6 w-6 bg-background text-[var(--accent-strong,#1f2937)]"
            : "left-1.5 h-4 w-4 bg-foreground/55",
        )}
      >
        {checked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
    </button>
  );
}
