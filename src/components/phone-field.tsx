import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* A phone number as country code (with flag) plus a 10-digit number, stored as "+91 9876543210". */

export const countries = [
  { code: "IN", flag: "🇮🇳", dial: "+91", name: "India" },
  { code: "AE", flag: "🇦🇪", dial: "+971", name: "United Arab Emirates" },
  { code: "US", flag: "🇺🇸", dial: "+1", name: "United States" },
  { code: "GB", flag: "🇬🇧", dial: "+44", name: "United Kingdom" },
  { code: "CA", flag: "🇨🇦", dial: "+1", name: "Canada" },
  { code: "AU", flag: "🇦🇺", dial: "+61", name: "Australia" },
  { code: "SG", flag: "🇸🇬", dial: "+65", name: "Singapore" },
  { code: "SA", flag: "🇸🇦", dial: "+966", name: "Saudi Arabia" },
  { code: "QA", flag: "🇶🇦", dial: "+974", name: "Qatar" },
  { code: "DE", flag: "🇩🇪", dial: "+49", name: "Germany" },
  { code: "NP", flag: "🇳🇵", dial: "+977", name: "Nepal" },
  { code: "BD", flag: "🇧🇩", dial: "+880", name: "Bangladesh" },
  { code: "LK", flag: "🇱🇰", dial: "+94", name: "Sri Lanka" },
] as const;

type Country = (typeof countries)[number];

/** "+91 98765 43210", "9876543210", "+1 (415) 555-0100" → country and the last 10 digits. */
export function parsePhone(value: string): { country: Country; number: string } {
  const v = value.trim();
  const byDial = [...countries]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((c) => v.replace(/\s/g, "").startsWith(c.dial));
  const digits = (byDial ? v.replace(/\s/g, "").slice(byDial.dial.length) : v).replace(/\D/g, "");
  return { country: byDial ?? countries[0], number: digits.slice(-10) };
}

export const formatPhone = (country: Country, number: string) =>
  number ? `${country.dial} ${number}` : "";

export function PhoneField({
  label,
  value,
  onChange,
  error,
  hint,
  variant = "auth",
  autoComplete = "tel-national",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  hint?: string | undefined;
  variant?: "auth" | "m3";
  autoComplete?: string;
}) {
  const { country, number } = parsePhone(value);
  const setCountry = (code: string) => {
    const next = countries.find((c) => `${c.code}${c.dial}` === code) ?? countries[0];
    onChange(formatPhone(next, number) || `${next.dial} `);
  };
  const setNumber = (raw: string) =>
    onChange(formatPhone(country, raw.replace(/\D/g, "").slice(0, 10)));

  const select = (
    <span className="relative flex h-full shrink-0 items-center">
      <span
        aria-hidden="true"
        className="pointer-events-none flex items-center gap-1 pr-2 text-[16px]"
      >
        <span className="text-[20px] leading-none">{country.flag}</span>
        <span className="tabular-nums">{country.dial}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </span>
      <select
        aria-label="Country code"
        value={`${country.code}${country.dial}`}
        onChange={(e) => setCountry(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {countries.map((c) => (
          <option key={c.code} value={`${c.code}${c.dial}`}>
            {c.flag} {c.name} ({c.dial})
          </option>
        ))}
      </select>
    </span>
  );
  const input = (
    <input
      type="tel"
      inputMode="numeric"
      autoComplete={autoComplete}
      maxLength={10}
      value={number}
      onChange={(e) => setNumber(e.target.value)}
      placeholder="98765 43210"
      aria-label={label}
      aria-invalid={Boolean(error)}
      className="h-full min-w-0 flex-1 border-l border-foreground/15 bg-transparent pl-3 text-[16px] tabular-nums outline-none placeholder:text-muted-foreground/70"
    />
  );
  const message = error ? (
    <span role="alert" className="mt-1.5 block px-1 text-[13px] text-[#B3261E]">
      {error}
    </span>
  ) : hint ? (
    <span className="mt-1.5 block px-1 text-[13px] text-muted-foreground">{hint}</span>
  ) : null;

  if (variant === "m3")
    return (
      <div>
        <div
          className={cn(
            "rounded-t-[4px] border-b bg-secondary transition-colors focus-within:border-b-2",
            error ? "border-[#B3261E]" : "border-foreground/50 focus-within:border-foreground",
          )}
        >
          <span className="block px-4 pt-2 text-[12px] leading-4 text-muted-foreground">
            {label}
          </span>
          <div className="flex h-10 items-center px-4 pb-1">
            {select}
            {input}
          </div>
        </div>
        {message}
      </div>
    );

  return (
    <div>
      <span className="mb-1.5 block text-[13px] font-medium text-muted-foreground">{label}</span>
      <div
        className={cn(
          "flex h-14 items-center rounded-[16px] border bg-secondary px-4 transition-colors focus-within:border-foreground/60 focus-within:bg-background",
          error ? "border-[#B3261E]" : "border-transparent",
        )}
      >
        {select}
        {input}
      </div>
      {message}
    </div>
  );
}
