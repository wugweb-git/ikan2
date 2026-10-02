/* Is this password already in a public breach corpus?
 *
 * Supabase has this built in, but it is a Pro-plan feature and iKAN is on Free, where the
 * toggle cannot be turned on at all. Rather than leave the check out until the plan changes,
 * it is done here against the same source Supabase uses - Have I Been Pwned.
 *
 * The password never leaves the device. HIBP's range API takes the first five characters of
 * the SHA-1 hash and returns every suffix it holds under that prefix - some hundreds of
 * hashes - and the match is made locally. The service learns five hex characters, which is
 * shared by tens of thousands of passwords, and nothing else. No key, no account, no cost.
 *
 * Where this is weaker than the Pro feature: Supabase enforces it inside the auth server, so
 * nothing can get past it. This runs in the client, so a request crafted by hand can skip it.
 * That is worth accepting - the only person who could bypass it is the one choosing their own
 * password, and the people this protects are the ones typing a reused password in good faith.
 */

const RANGE = "https://api.pwnedpasswords.com/range/";

const sha1Hex = async (text: string) => {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
};

/**
 * How many breaches this password appears in, or 0 if none.
 *
 * Fails open: if HIBP is unreachable, offline, or slow, this returns 0. A person must never
 * be locked out of creating an account because a third-party service is down - the password
 * rules still apply either way.
 */
export async function breachCount(password: string): Promise<number> {
  if (!password || typeof crypto?.subtle?.digest !== "function") return 0;
  try {
    const hash = await sha1Hex(password);
    const res = await fetch(`${RANGE}${hash.slice(0, 5)}`, {
      headers: { "Add-Padding": "true" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return 0;
    const suffix = hash.slice(5);
    for (const line of (await res.text()).split("\n")) {
      const [candidate, count] = line.trim().split(":");
      // Padded responses carry decoy hashes with a count of 0; they must not register as a hit.
      if (candidate === suffix) return Number(count) || 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

/** The message shown when a password is known to be breached, or undefined when it is not. */
export async function breachError(password: string): Promise<string | undefined> {
  const n = await breachCount(password);
  if (!n) return undefined;
  return n > 1
    ? `This password has appeared in ${n.toLocaleString("en-IN")} data breaches. Please choose a different one.`
    : "This password has appeared in a data breach. Please choose a different one.";
}
