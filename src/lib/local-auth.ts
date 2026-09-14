/* Accounts kept on this phone, used while no sign-in service is connected.
 * Passwords are never stored: only a salted PBKDF2-SHA-256 hash. A session lasts until sign-out,
 * or until the app is closed when "Keep me signed in" is off. */

export type LocalUser = {
  id: string;
  email: string;
  name: string;
  phone?: string | undefined;
  createdAt: string;
};

type Account = LocalUser & { salt: string; hash: string };

const ACCOUNTS = "ikan.local-accounts.v1";
const SESSION = "ikan.local-session.v1";
const REMEMBER = "ikan.remember";

const read = <T>(storage: Storage, key: string): T | null => {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const accounts = () => read<Record<string, Account>>(localStorage, ACCOUNTS) ?? {};
const saveAccounts = (a: Record<string, Account>) =>
  localStorage.setItem(ACCOUNTS, JSON.stringify(a));

const toHex = (buf: ArrayBuffer | Uint8Array) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function hashPassword(password: string, saltHex: string) {
  const salt = new Uint8Array(saltHex.match(/../g)!.map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 150_000 },
    key,
    256,
  );
  return toHex(bits);
}

/** The account id this phone last used for an email, so data saved earlier stays attached. */
function previousIdFor(email: string): string | undefined {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) ?? "";
      if (!/^sb-.+-auth-token$/.test(k)) continue;
      const s = read<{ user?: { id?: string; email?: string } }>(localStorage, k);
      if (s?.user?.id && s.user.email?.toLowerCase() === email) return s.user.id;
    }
  } catch {
    /* storage unavailable */
  }
  return undefined;
}

const remember = () => {
  try {
    return localStorage.getItem(REMEMBER) !== "0";
  } catch {
    return true;
  }
};

export function currentLocalUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  return read<LocalUser>(localStorage, SESSION) ?? read<LocalUser>(sessionStorage, SESSION);
}

function startSession(user: LocalUser) {
  const store = remember() ? localStorage : sessionStorage;
  localStorage.removeItem(SESSION);
  sessionStorage.removeItem(SESSION);
  store.setItem(SESSION, JSON.stringify(user));
}

export function endLocalSession() {
  try {
    localStorage.removeItem(SESSION);
    sessionStorage.removeItem(SESSION);
  } catch {
    /* storage unavailable */
  }
}

const publicUser = ({ salt: _s, hash: _h, ...u }: Account): LocalUser => u;

export async function localSignUp(input: {
  name: string;
  email: string;
  password: string;
  phone?: string | undefined;
}) {
  const email = input.email.trim().toLowerCase();
  const all = accounts();
  if (all[email]) throw new Error("An account with this email already exists. Sign in instead.");
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const account: Account = {
    id: previousIdFor(email) ?? crypto.randomUUID(),
    email,
    name: input.name.trim(),
    ...(input.phone ? { phone: input.phone } : {}),
    createdAt: new Date().toISOString(),
    salt,
    hash: await hashPassword(input.password, salt),
  };
  saveAccounts({ ...all, [email]: account });
  const user = publicUser(account);
  startSession(user);
  return user;
}

export async function localSignIn(emailRaw: string, password: string) {
  const email = emailRaw.trim().toLowerCase();
  const account = accounts()[email];
  if (!account || (await hashPassword(password, account.salt)) !== account.hash)
    throw new Error("That email and password don’t match. Check them and try again.");
  const user = publicUser(account);
  startSession(user);
  return user;
}

export async function localUpdatePassword(password: string) {
  const user = currentLocalUser();
  if (!user) throw new Error("Sign in first, then set a new password.");
  const all = accounts();
  const account = all[user.email];
  if (!account) throw new Error("Sign in first, then set a new password.");
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  saveAccounts({
    ...all,
    [user.email]: { ...account, salt, hash: await hashPassword(password, salt) },
  });
}
