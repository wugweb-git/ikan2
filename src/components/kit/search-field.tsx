import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* The search field. One screen has one today (the FAQ), which is exactly when a pattern is
 * worth naming — the second one should not have to be re-derived.
 *
 * `type="search"` so phones offer a Search key and a native clear affordance; the explicit
 * clear button is for the platforms that do not draw one. The label is always present for
 * screen readers even though the field shows only a placeholder.
 */

export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Read out by screen readers; also the placeholder unless one is given separately. */
  label: string;
  placeholder?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <label
      className={cn(
        "flex h-12 items-center gap-3 rounded-full border border-foreground/15 px-4 focus-within:border-foreground/40",
        className,
      )}
    >
      <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        aria-label={label}
        className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </label>
  );
}
