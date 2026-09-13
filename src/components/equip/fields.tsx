import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Column } from "@/lib/equip/types";

export type FieldValue = string | boolean | null;

export function Chip({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean | undefined;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "tile inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-left text-sm font-semibold transition-colors disabled:opacity-50",
        active ? "border-foreground bg-foreground text-background" : "border-border bg-card",
      )}
    >
      {active ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} /> : null}
      {children}
    </button>
  );
}

export const inputClass =
  "w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 disabled:opacity-60";

export function FieldInput({
  column,
  value,
  onChange,
  disabled,
  options,
}: {
  column: Column;
  value: FieldValue | undefined;
  onChange: (value: FieldValue) => void;
  disabled?: boolean | undefined;
  /** overrides column.options — used for join columns picked from other instruments */
  options?: string[];
}) {
  const choices = options ?? column.options;

  if (column.type === "bool") {
    return (
      <div className="flex gap-2">
        <Chip
          active={value === true}
          disabled={disabled}
          onClick={() => onChange(value === true ? null : true)}
        >
          Yes
        </Chip>
        <Chip
          active={value === false}
          disabled={disabled}
          onClick={() => onChange(value === false ? null : false)}
        >
          No
        </Chip>
      </div>
    );
  }

  if (choices?.length) {
    return (
      <div className="flex flex-wrap gap-2">
        {choices.map((option) => (
          <Chip
            key={option}
            active={value === option}
            disabled={disabled}
            onClick={() => onChange(value === option ? null : option)}
          >
            {option}
          </Chip>
        ))}
      </div>
    );
  }

  return (
    <input
      type={column.type === "time" ? "time" : "text"}
      aria-label={column.label}
      placeholder={column.type === "time" ? undefined : column.label}
      value={typeof value === "string" ? value : ""}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    />
  );
}

export function displayValue(value: unknown) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export function BlockHeading({
  title,
  note,
  eyebrow,
}: {
  title: string;
  note?: string | undefined;
  eyebrow?: string | undefined;
}) {
  return (
    <div>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-1.5 font-display text-[24px] font-semibold leading-[1.2] tracking-tight">
        {title}
      </h2>
      {note ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{note}</p> : null}
    </div>
  );
}
