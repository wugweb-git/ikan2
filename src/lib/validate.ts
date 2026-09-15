/* Form rules used across the app. Each returns the message to show, or undefined when the value
 * is fine. Messages say what to enter, not what went wrong. */

export type Check = (value: string) => string | undefined;

export const required =
  (message: string): Check =>
  (v) =>
    v.trim() ? undefined : message;

export const email: Check = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? undefined : "Enter a valid email address.";

export const personName: Check = (v) => {
  const t = v.trim();
  if (!t) return "Tell us what to call you.";
  if (t.length < 2) return "Use at least 2 letters.";
  if (t.length > 60) return "Keep it under 60 characters.";
  if (!/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(t)) return "Use letters, spaces, apostrophes or hyphens.";
  return undefined;
};

export const passwordRules = (v: string) => [
  { ok: v.length >= 8, label: "At least 8 characters" },
  { ok: /[A-Za-z]/.test(v) && /\d/.test(v), label: "Letters and a number" },
];

export const password: Check = (v) => {
  if (v.length < 8) return "Use at least 8 characters.";
  if (!(/[A-Za-z]/.test(v) && /\d/.test(v))) return "Use letters and at least one number.";
  if (v.length > 72) return "Keep it under 72 characters.";
  return undefined;
};

/** A national number: exactly 10 digits. */
const DIAL_CODES = [
  "+971",
  "+966",
  "+974",
  "+977",
  "+880",
  "+91",
  "+44",
  "+61",
  "+65",
  "+49",
  "+94",
  "+1",
];

/** Splits "+91 98765 43210" into its country code and national digits ("9876543210"). */
export function splitPhone(v: string) {
  const compact = v.replace(/[\s()-]/g, "");
  const dial = DIAL_CODES.find((d) => compact.startsWith(d)) ?? "";
  return { dial, digits: compact.slice(dial.length).replace(/\D/g, "") };
}
/** The national number only, without the country code. */
export const phoneDigits = (v: string) => splitPhone(v).digits;

/** 10 digits after the country code; an Indian mobile also starts with 6, 7, 8 or 9. */
export const phone10: Check = (v) => {
  const { dial, digits } = splitPhone(v);
  if (!/^\d{10}$/.test(digits)) return "Enter a 10-digit phone number.";
  if ((dial === "+91" || dial === "") && !/^[6-9]/.test(digits))
    return "Indian mobile numbers start with 6, 7, 8 or 9.";
  return undefined;
};

/** Indian PIN code: 6 digits, not starting with 0. */
export const pin: Check = (v) =>
  /^[1-9]\d{5}$/.test(v.trim()) ? undefined : "Enter a 6-digit PIN code.";

export const city: Check = (v) => {
  const t = v.trim();
  if (t.length < 2) return "Enter your city.";
  if (!/^[\p{L}][\p{L}\p{M} .'-]*$/u.test(t)) return "Use letters only.";
  return undefined;
};

/** Date of birth as yyyy-mm-dd: a real date, not in the future, age 13 to 110. */
export const birthday: Check = (v) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return "Enter your date of birth.";
  const d = new Date(`${v}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "Enter a real date.";
  const now = new Date();
  if (d > now) return "Date of birth can’t be in the future.";
  let age = now.getFullYear() - d.getFullYear();
  if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) age -= 1;
  if (age < 13) return "You need to be 13 or older to use iKAN.";
  if (age > 110) return "Check the year.";
  return undefined;
};

export const maxLength =
  (n: number, what = "this"): Check =>
  (v) =>
    v.length > n ? `Keep ${what} under ${n} characters.` : undefined;

export const minLength =
  (n: number, message: string): Check =>
  (v) =>
    v.trim().length < n ? message : undefined;

/** Run checks in order, only when there is something to check (for optional fields). */
export const optional =
  (...checks: Check[]): Check =>
  (v) =>
    // a country code with no number counts as empty
    v.trim() && !/^\+\d{1,4}$/.test(v.replace(/\s/g, "")) ? all(...checks)(v) : undefined;

export const all =
  (...checks: Check[]): Check =>
  (v) => {
    for (const c of checks) {
      const m = c(v);
      if (m) return m;
    }
    return undefined;
  };

/** Validate a record of fields at once; `ok` is true when nothing failed. */
export function validate<K extends string>(
  values: Record<K, string>,
  rules: Partial<Record<K, Check>>,
) {
  const errors = {} as Partial<Record<K, string>>;
  for (const k of Object.keys(rules) as K[]) {
    const m = rules[k]!(values[k] ?? "");
    if (m) errors[k] = m;
  }
  return { errors, ok: Object.keys(errors).length === 0 };
}

export const genders = [
  "Woman",
  "Man",
  "Non-binary",
  "Prefer to self-describe",
  "Prefer not to say",
];
export const maritalStatuses = [
  "Single",
  "In a relationship",
  "Married",
  "Separated",
  "Divorced",
  "Widowed",
  "Prefer not to say",
];

export const relationships = [
  "Parent",
  "Spouse or partner",
  "Sibling",
  "Child",
  "Friend",
  "Relative",
  "Guardian",
  "Colleague",
  "Other",
];

export const oneOf =
  (options: readonly string[], message: string): Check =>
  (v) =>
    options.includes(v) ? undefined : message;
