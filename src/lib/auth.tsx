import { createClient, type Session, type SupabaseClient, type User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { startCloudSync, stopCloudSync } from "@/lib/cloud-sync";
import { importLegacyData, resetLegacyImport } from "@/lib/legacy-import";
import { claimGuestData, getScope, setScope } from "@/lib/storage-scope";

import { BACKEND_KEY, BACKEND_URL, functionUrl } from "@/lib/backend";
import { isNativeApp, listenForNativeAuth, nativeOAuth } from "@/lib/native-auth";

/* Accounts live in the iKAN Supabase project (see backend.ts). */

export const SUPABASE_URL = BACKEND_URL;
export const SUPABASE_ANON_KEY = BACKEND_KEY;
/** the old iKan edge function (sign-up and the contact form) */
export const LEGACY_API = functionUrl("make-server-cc205da9");
export const LEGACY_ANON_KEY = BACKEND_KEY;
const LEGACY_KEY = BACKEND_KEY;
/** kept for the sign-up branch below; ikan2 now uses the iKAN project directly */
const usingLovableCloud = false;

/* "Keep me signed in": when off, the session lives only until the app is closed. */
const REMEMBER_KEY = "ikan.remember";
export const rememberLogin = () => {
  try {
    return window.localStorage.getItem(REMEMBER_KEY) !== "0";
  } catch {
    return true;
  }
};
export const setRememberLogin = (on: boolean) => {
  try {
    window.localStorage.setItem(REMEMBER_KEY, on ? "1" : "0");
  } catch {
    /* storage unavailable */
  }
};
const sessionStorageAdapter = {
  getItem: (k: string) => {
    try {
      return window.localStorage.getItem(k) ?? window.sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  setItem: (k: string, v: string) => {
    try {
      if (rememberLogin()) {
        window.localStorage.setItem(k, v);
        window.sessionStorage.removeItem(k);
      } else {
        window.sessionStorage.setItem(k, v);
        window.localStorage.removeItem(k);
      }
    } catch {
      /* storage unavailable */
    }
  },
  removeItem: (k: string) => {
    try {
      window.localStorage.removeItem(k);
      window.sessionStorage.removeItem(k);
    } catch {
      /* storage unavailable */
    }
  },
};

/* Lovable Cloud issues opaque sb_publishable_ keys. They go in the apikey header only; sending
 * one as a bearer token is rejected, so the signed-in user's token is the only bearer. */
const apiKeyFetch =
  (key: string): typeof fetch =>
  (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
      headers.delete("Authorization");
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };

let client: SupabaseClient | null = null;
export function supabase() {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { fetch: apiKeyFetch(SUPABASE_ANON_KEY) },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        ...(usingLovableCloud ? { flowType: "pkce" as const } : {}),
        ...(typeof window !== "undefined" ? { storage: sessionStorageAdapter } : {}),
      },
    });
  }
  return client;
}

export type AuthStatus = "loading" | "signedOut" | "signedIn";
export type Provider = "google" | "linkedin_oidc";

type AuthValue = {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  /** true after arriving from a password-reset email */
  recovering: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<"signedIn" | "confirm">;
  signInWith: (provider: Provider) => Promise<void>;
  /** text a 6-digit code to a phone number in +<country><number> form */
  sendPhoneCode: (phone: string) => Promise<void>;
  verifyPhoneCode: (phone: string, code: string) => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export const displayName = (u: User | null) =>
  (u?.user_metadata?.["name"] as string | undefined) ||
  (u?.user_metadata?.["full_name"] as string | undefined) ||
  u?.email?.split("@")[0] ||
  "";

/** Supabase and edge errors, in words a person can act on. */
function friendly(message: string) {
  if (/invalid login credentials/i.test(message))
    return "That email and password don’t match. Check them and try again.";
  if (/not confirmed/i.test(message))
    return "Confirm your email first. We’ve sent the link to your inbox.";
  if (/already (been )?registered|already exists|user_already_exists/i.test(message))
    return "An account with this email already exists. Sign in instead.";
  if (/rate limit|too many/i.test(message))
    return "Too many attempts. Wait a minute and try again.";
  if (/password/i.test(message) && /(short|at least|weak)/i.test(message))
    return "Use a password of at least 8 characters.";
  if (/failed to fetch|network/i.test(message))
    return "Can’t reach iKAN. Check your connection and try again.";
  return message.replace(/^API Error: \d+\s*/, "") || "Something went wrong. Try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [recovering, setRecovering] = useState(false);

  const apply = (s: Session | null) => {
    if (s?.user) {
      const changed = getScope() !== s.user.id;
      claimGuestData(s.user.id);
      setScope(s.user.id);
      if (changed) {
        const token = async () => {
          const { data } = await supabase().auth.getSession();
          return data.session?.access_token ?? null;
        };
        const sync = startCloudSync(s.user.id, token);
        // accounts already moved to Lovable Cloud carry their iKan data; only the old
        // sign-in still needs to fetch it from the iKan app
        if (!usingLovableCloud) void sync.finally(() => importLegacyData(s.user.id, token));
      }
    } else {
      if (getScope() !== "guest") {
        stopCloudSync();
        resetLegacyImport();
      }
      setScope("guest");
    }
    setSession(s);
    setStatus(s ? "signedIn" : "signedOut");
  };

  useEffect(() => {
    const sb = supabase();
    let alive = true;
    sb.auth
      .getSession()
      .then(({ data }) => alive && apply(data.session))
      .catch(() => alive && apply(null));
    const { data } = sb.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
      apply(s);
    });
    let stopNative = () => {};
    void listenForNativeAuth(sb).then((stop) => {
      if (alive) stopNative = stop;
      else stop();
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
      stopNative();
    };
  }, []);

  const origin = () => (typeof window === "undefined" ? "" : window.location.origin);

  const value: AuthValue = {
    status,
    session,
    user: session?.user ?? null,
    recovering,
    signIn: async (email, password) => {
      const { error } = await supabase().auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw new Error(friendly(error.message));
    },
    signUp: async ({ name, email, password, phone }) => {
      if (usingLovableCloud) {
        const { data, error } = await supabase().auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${origin()}/login`,
            data: { name: name.trim(), full_name: name.trim(), ...(phone ? { phone } : {}) },
          },
        });
        if (error) throw new Error(friendly(error.message));
        // an existing, confirmed email comes back with no identities
        if (data.user && !data.user.identities?.length)
          throw new Error(friendly("user_already_exists"));
        return data.session ? "signedIn" : "confirm";
      }
      const res = await fetch(`${LEGACY_API}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LEGACY_KEY}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
          ...(phone ? { phone } : {}),
        }),
      }).catch(() => {
        throw new Error(friendly("Failed to fetch"));
      });
      if (!res.ok) {
        const text = await res.text();
        let message = text;
        try {
          const j = JSON.parse(text) as { error?: string; message?: string };
          message = j.error || j.message || text;
        } catch {
          /* plain text */
        }
        throw new Error(friendly(message));
      }
      const { error } = await supabase().auth.signInWithPassword({ email: email.trim(), password });
      if (!error) return "signedIn";
      if (/not confirmed/i.test(error.message)) {
        await supabase()
          .auth.resend({
            type: "signup",
            email: email.trim(),
            options: { emailRedirectTo: `${origin()}/login` },
          })
          .catch(() => {});
        return "confirm";
      }
      throw new Error(friendly(error.message));
    },
    signInWith: async (provider) => {
      if (isNativeApp()) {
        try {
          return await nativeOAuth(supabase(), provider);
        } catch (e) {
          throw new Error(friendly((e as Error).message));
        }
      }
      const { error } = await supabase().auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${origin()}/` },
      });
      if (error) throw new Error(friendly(error.message));
    },
    sendPhoneCode: async (phone) => {
      const { error } = await supabase().auth.signInWithOtp({ phone: phone.replace(/\s/g, "") });
      if (error) {
        if (
          /unsupported phone provider|phone.*(disabled|not enabled)|sms provider/i.test(
            error.message,
          )
        )
          throw new Error("Phone sign-in isn’t available yet. Use your email instead.");
        throw new Error(friendly(error.message));
      }
    },
    verifyPhoneCode: async (phone, code) => {
      const { error } = await supabase().auth.verifyOtp({
        phone: phone.replace(/\s/g, ""),
        token: code,
        type: "sms",
      });
      if (error) {
        if (/expired|invalid|otp/i.test(error.message))
          throw new Error("That code didn’t work. Check it, or send a new one.");
        throw new Error(friendly(error.message));
      }
    },
    resendConfirmation: async (email) => {
      const { error } = await supabase().auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: `${origin()}/login` },
      });
      if (error) throw new Error(friendly(error.message));
    },
    sendReset: async (email) => {
      const { error } = await supabase().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin()}/reset-password`,
      });
      if (error) throw new Error(friendly(error.message));
    },
    updatePassword: async (password) => {
      const { error } = await supabase().auth.updateUser({ password });
      if (error) throw new Error(friendly(error.message));
      setRecovering(false);
    },
    signOut: async () => {
      await import("@/lib/push").then((m) => m.disablePush()).catch(() => {});
      await supabase()
        .auth.signOut({ scope: "local" })
        .catch(() => {});
      apply(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth must be used inside AuthProvider");
  return v;
}
