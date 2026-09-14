import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  currentLocalUser,
  endLocalSession,
  localSignIn,
  localSignUp,
  localUpdatePassword,
  type LocalUser,
} from "@/lib/local-auth";
import { claimGuestData, getScope, setScope } from "@/lib/storage-scope";

/* Sign-in for the app, independent of any backend. The screens only talk to `useAuth()`.
 *
 * Today accounts are kept on this phone (see local-auth). To connect an auth provider, replace
 * the `backend` object below: every method keeps its signature, and `restore` returns the
 * signed-in user (or null) when the app opens. Nothing else needs to change. */

/** The old iKan contact form endpoint (not used for sign-in). */
export const LEGACY_API =
  "https://jpfvoevxegnknxoqmwye.supabase.co/functions/v1/make-server-cc205da9";
export const LEGACY_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZnZvZXZ4ZWdua254b3Ftd3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjIyNDIsImV4cCI6MjA3MzY5ODI0Mn0.VGYSE8LqBEggrQcUHJH9NcvursaoNfQK9K8-ESCo-rc";

export type AuthUser = {
  id: string;
  email?: string | undefined;
  user_metadata: Record<string, unknown>;
};
export type AuthSession = { user: AuthUser };
export type AuthStatus = "loading" | "signedOut" | "signedIn";
export type Provider = "google" | "linkedin_oidc";

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

const toAuthUser = (u: LocalUser): AuthUser => ({
  id: u.id,
  email: u.email,
  user_metadata: { name: u.name, full_name: u.name, ...(u.phone ? { phone: u.phone } : {}) },
});

const providerName: Record<Provider, string> = { google: "Google", linkedin_oidc: "LinkedIn" };

/** The one place that knows how accounts work. Swap this for a real auth provider. */
const backend = {
  restore: async (): Promise<AuthUser | null> => {
    const u = currentLocalUser();
    return u ? toAuthUser(u) : null;
  },
  signIn: async (email: string, password: string) => toAuthUser(await localSignIn(email, password)),
  signUp: async (input: { name: string; email: string; password: string; phone?: string }) => ({
    user: toAuthUser(await localSignUp(input)),
    needsConfirmation: false,
  }),
  signInWith: async (provider: Provider): Promise<void> => {
    throw new Error(
      `${providerName[provider]} sign-in isn’t connected yet. Use your email and password.`,
    );
  },
  resendConfirmation: async (_email: string): Promise<void> => {},
  sendReset: async (_email: string): Promise<void> => {
    throw new Error(
      "Password reset by email isn’t connected yet. Contact us from the Contact page and we’ll help.",
    );
  },
  updatePassword: (password: string) => localUpdatePassword(password),
  signOut: async () => endLocalSession(),
};

type AuthValue = {
  status: AuthStatus;
  session: AuthSession | null;
  user: AuthUser | null;
  /** true after arriving from a password-reset link */
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

export const displayName = (u: AuthUser | null) =>
  (u?.user_metadata?.["name"] as string | undefined) ||
  (u?.user_metadata?.["full_name"] as string | undefined) ||
  u?.email?.split("@")[0] ||
  "";

const message = (e: unknown) =>
  e instanceof Error && e.message ? e.message : "Something went wrong. Try again.";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  const apply = (u: AuthUser | null) => {
    if (u) {
      claimGuestData(u.id);
      setScope(u.id);
    } else if (getScope() !== "guest") {
      setScope("guest");
    }
    setUser(u);
    setStatus(u ? "signedIn" : "signedOut");
  };

  useEffect(() => {
    let alive = true;
    backend
      .restore()
      .then((u) => alive && apply(u))
      .catch(() => alive && apply(null));
    return () => {
      alive = false;
    };
  }, []);

  const value: AuthValue = {
    status,
    session: user ? { user } : null,
    user,
    recovering: false,
    signIn: async (email, password) => {
      try {
        apply(await backend.signIn(email, password));
      } catch (e) {
        throw new Error(message(e));
      }
    },
    signUp: async (input) => {
      try {
        const { user: u, needsConfirmation } = await backend.signUp(input);
        if (needsConfirmation) return "confirm";
        apply(u);
        return "signedIn";
      } catch (e) {
        throw new Error(message(e));
      }
    },
    signInWith: (provider) => backend.signInWith(provider),
    resendConfirmation: (email) => backend.resendConfirmation(email),
    sendReset: (email) => backend.sendReset(email),
    updatePassword: (password) => backend.updatePassword(password),
    signOut: async () => {
      await backend.signOut();
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
