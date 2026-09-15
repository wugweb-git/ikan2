/* "Fill from Google": asks Google for date of birth, gender, phone, address and photo, only
 * when the person taps the button. Uses Google's own popup (Google Identity Services), so the
 * iKAN sign-in session is never touched, and nothing is stored beyond the fields filled in. */

const CLIENT_ID = "374641147902-g2qtsl49j1u0e417o4gi8sicvgd0j66q.apps.googleusercontent.com";
const SCOPES = [
  "https://www.googleapis.com/auth/user.birthday.read",
  "https://www.googleapis.com/auth/user.gender.read",
  "https://www.googleapis.com/auth/user.phonenumbers.read",
  "https://www.googleapis.com/auth/user.addresses.read",
];

export type GoogleDetails = {
  birthday?: string;
  gender?: string;
  phone?: string;
  city?: string;
  zip?: string;
  avatar?: string;
};

type TokenResponse = { access_token?: string; error?: string };
type TokenClient = { requestAccessToken: (o?: { prompt?: string }) => void };
type Gsi = {
  accounts: {
    oauth2: {
      initTokenClient: (c: {
        client_id: string;
        scope: string;
        hint?: string;
        callback: (r: TokenResponse) => void;
        error_callback?: (e: { type?: string }) => void;
      }) => TokenClient;
      revoke: (token: string, done?: () => void) => void;
    };
  };
};

let loading: Promise<Gsi> | null = null;
function loadGsi(): Promise<Gsi> {
  const existing = (window as unknown as { google?: Gsi }).google;
  if (existing?.accounts?.oauth2) return Promise.resolve(existing);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve((window as unknown as { google: Gsi }).google);
    s.onerror = () => {
      loading = null;
      reject(new Error("Couldn’t reach Google. Check your connection and try again."));
    };
    document.head.appendChild(s);
  });
  return loading;
}

function requestToken(gsi: Gsi, hint?: string) {
  return new Promise<string>((resolve, reject) => {
    const client = gsi.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES.join(" "),
      ...(hint ? { hint } : {}),
      callback: (r) =>
        r.access_token
          ? resolve(r.access_token)
          : reject(new Error("Google didn’t share your details.")),
      error_callback: (e) =>
        reject(
          new Error(
            e.type === "popup_closed"
              ? "Google window closed. Nothing was filled in."
              : "Google didn’t open. Allow pop-ups for iKAN and try again.",
          ),
        ),
    });
    client.requestAccessToken({ prompt: "consent" });
  });
}

const pad = (n: number) => String(n).padStart(2, "0");
const genderFrom = (value?: string) =>
  value === "male"
    ? "Man"
    : value === "female"
      ? "Woman"
      : value
        ? "Prefer to self-describe"
        : undefined;

type Field<T> = T & { metadata?: { primary?: boolean } };
const pick = <T>(list?: Field<T>[]) => list?.find((x) => x.metadata?.primary) ?? list?.[0];

/** Load Google's script ahead of the tap, so the popup opens straight from the tap
 * (browsers block pop-ups that open after a delay). */
export const preloadGoogle = () => {
  if (typeof window !== "undefined") void loadGsi().catch(() => {});
};

export async function fillFromGoogle(hint?: string): Promise<GoogleDetails> {
  const ready = (window as unknown as { google?: Gsi }).google;
  // open the popup in the same tick as the tap when the script is ready
  const tokenPromise = ready?.accounts?.oauth2
    ? requestToken(ready, hint)
    : loadGsi().then((g) => requestToken(g, hint));
  const gsi = ready?.accounts?.oauth2 ? ready : await loadGsi();
  const token = await tokenPromise;
  try {
    const res = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=birthdays,genders,phoneNumbers,addresses,photos",
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) throw new Error("Google didn’t share your details. Try again.");
    const p = (await res.json()) as {
      birthdays?: Field<{ date?: { year?: number; month?: number; day?: number } }>[];
      genders?: Field<{ value?: string }>[];
      phoneNumbers?: Field<{ canonicalForm?: string; value?: string }>[];
      addresses?: Field<{ city?: string; postalCode?: string }>[];
      photos?: Field<{ url?: string; default?: boolean }>[];
    };
    const out: GoogleDetails = {};
    const b = p.birthdays?.find((x) => x.date?.year)?.date;
    if (b?.year && b.month && b.day) out.birthday = `${b.year}-${pad(b.month)}-${pad(b.day)}`;
    const gender = genderFrom(pick(p.genders)?.value);
    if (gender) out.gender = gender;
    const phone = pick(p.phoneNumbers);
    const raw = phone?.canonicalForm ?? phone?.value;
    if (raw) {
      const digits = raw.replace(/[^\d+]/g, "");
      out.phone = digits.startsWith("+91") ? `+91 ${digits.slice(3)}` : digits;
    }
    const address = pick(p.addresses);
    if (address?.city) out.city = address.city;
    if (address?.postalCode && /^[1-9]\d{5}$/.test(address.postalCode))
      out.zip = address.postalCode;
    const photo = p.photos?.find((x) => !x.default && x.url);
    if (photo?.url) out.avatar = photo.url.replace(/=s\d+(-c)?$/, "=s256-c");
    return out;
  } finally {
    // the details are copied into the form; the access isn't kept
    gsi.accounts.oauth2.revoke(token);
  }
}
