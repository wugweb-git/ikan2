import { createLocalStore } from "@/lib/local-store";
import { scopedKey } from "@/lib/storage-scope";

/* Profile and settings, kept on this device until accounts exist.
 * Fields follow the old iKan account screens (profile, emergency contact, notifications, legal). */

export type Profile = {
  name: string;
  email: string;
  phone: string;
  city: string;
  birthday: string;
  gender: string;
  bio: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  memberSince: string;
  /** profile picture URL (imported from the old iKan app) */
  avatar: string;
};

export const defaultProfile: Profile = {
  avatar: "",
  name: "",
  email: "",
  phone: "",
  city: "",
  birthday: "",
  gender: "",
  bio: "",
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelation: "",
  memberSince: "2026-09-01",
};

export type Settings = {
  moodReminders: boolean;
  moodReminderTime: string;
  assessmentReminders: boolean;
  programUpdates: boolean;
  weeklyProgress: boolean;
  newResources: boolean;
  healthConnect: boolean;
  shareWithConsultant: boolean;
  reduceMotion: boolean;
};

export const defaultSettings: Settings = {
  moodReminders: true,
  moodReminderTime: "20:30",
  assessmentReminders: true,
  programUpdates: true,
  weeklyProgress: true,
  newResources: false,
  healthConnect: false,
  shareWithConsultant: false,
  reduceMotion: false,
};

const profileStore = createLocalStore<Profile>("ikan.profile.v1", defaultProfile);
const settingsStore = createLocalStore<Settings>("ikan.settings.v1", defaultSettings);

export function useProfile() {
  const profile = profileStore.use();
  return {
    profile,
    save: (patch: Partial<Profile>) => profileStore.update((p) => ({ ...p, ...patch })),
  };
}

export function useSettings() {
  const settings = settingsStore.use();
  return {
    settings,
    set: <K extends keyof Settings>(key: K, value: Settings[K]) =>
      settingsStore.update((s) => ({ ...s, [key]: value })),
  };
}

/** "Noida, 201310" → "Noida": the place name without a postal code. */
export const cityName = (city: string) =>
  city
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x && !/^\d[\d\s-]*$/.test(x))
    .join(", ");

export const firstName = (p: Profile) => p.name.trim().split(/\s+/)[0] || "there";
export const profileInitials = (p: Profile) =>
  p.name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

/** Every key this app stores for the signed-in account, for export and "clear all data". */
export const storageKeys = () =>
  [
    "ikan.assessments.v1",
    "ikan.journal.v1",
    "ikan.resources.v1",
    "ikan.consult.v1",
    "ikan.profile.v1",
    "ikan.settings.v1",
    "ikan.wellness.v1",
    "ikan.notifications.v1",
    "ikan.onboarding.v1",
    "ikan.equip.sleep-tight.v2",
    "ikan.equip.unburn.v2",
    "ikan.equip.stress-buster.v2",
  ].map(scopedKey);

export const legalLinks = [
  { id: "about", label: "About iKAN", description: "Our mission and story" },
  { id: "faq", label: "FAQ", description: "Frequently asked questions" },
  { id: "privacy-policy", label: "Privacy Policy", description: "How we handle your data" },
  { id: "terms", label: "Terms of Use", description: "Service terms and conditions" },
  {
    id: "cancellation-policy",
    label: "Cancellation Policy",
    description: "How to cancel subscriptions",
  },
  { id: "return-policy", label: "Return Policy", description: "Refund and return guidelines" },
];

/** Profile details from the old iKan app. The first import fills everything it has; later
 * imports only fill fields that are still empty, so edits made here are kept. */
export function importProfile(
  incoming: { [K in keyof Profile]?: string | undefined },
  first: boolean,
) {
  profileStore.update((p) => {
    const next = { ...p };
    for (const [k, v] of Object.entries(incoming) as [keyof Profile, string | undefined][]) {
      if (!v) continue;
      if (first || !next[k]) next[k] = v;
    }
    return next;
  });
}

/** Fill a fresh profile from the signed-in account (name, email, phone), once. A photo from
 * Google or LinkedIn fills an empty avatar whenever it arrives. */
export function seedProfile(account: {
  name: string;
  email: string;
  phone?: string;
  avatar?: string | undefined;
}) {
  const current = profileStore.read();
  if (current.email) {
    if (account.avatar && !current.avatar)
      profileStore.update((p) => ({ ...p, avatar: account.avatar! }));
    return;
  }
  profileStore.update((p) => ({
    ...p,
    name: account.name || p.name,
    email: account.email,
    phone: p.phone || account.phone || "",
    avatar: p.avatar || account.avatar || "",
    memberSince:
      p.memberSince === defaultProfile.memberSince
        ? new Date().toISOString().slice(0, 10)
        : p.memberSince,
  }));
}

const onboardingStore = createLocalStore<{ done: boolean; reason: string }>("ikan.onboarding.v1", {
  done: false,
  reason: "",
});
export const useOnboarding = () => {
  const state = onboardingStore.use();
  return {
    ...state,
    finish: (reason: string) => onboardingStore.update(() => ({ done: true, reason })),
  };
};
export const onboardingDone = () => onboardingStore.read().done;
