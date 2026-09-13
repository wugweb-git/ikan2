import { createClient, type Session, type SupabaseClient, type User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { claimGuestData, setScope } from "@/lib/storage-scope";

/* Sign-in against the existing iKan Supabase project ("Ikan - App"), the same way the live app
 * does it: password sign-in and OAuth through Supabase Auth, and sign-up through the app's edge
 * function, which creates the auth user and the iKan profile together.
 * The anon key is the public client key already shipped in the live app. */

export const SUPABASE_PROJECT = "jpfvoevxegnknxoqmwye";
export const SUPABASE_URL = `https://${SUPABASE_PROJECT}.supabase.co`;
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZnZvZXZ4ZWdua254b3Ftd3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjIyNDIsImV4cCI6MjA3MzY5ODI0Mn0.VGYSE8LqBEggrQcUHJH9NcvursaoNfQK9K8-ESCo-rc";
const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-cc205da9`;

let client: SupabaseClient | null = null;
export function supabase() {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
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
      claimGuestData(s.user.id);
      setScope(s.user.id);
    } else {
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
    return () => {
      alive = false;
      data.subscription.unsubscribe();
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
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
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
      const { error } = await supabase().auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${origin()}/` },
      });
      if (error) throw new Error(friendly(error.message));
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
