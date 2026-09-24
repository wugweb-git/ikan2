import { useSyncExternalStore } from "react";
import { BACKEND_KEY, BACKEND_URL } from "@/lib/backend";
import { getScope, refreshStores, setWriteHook } from "@/lib/storage-scope";

/* Saves each account's app data to the iKAN backend (public.ikan2_user_state), one row per store.
 * The device copy stays the working copy: screens read and write localStorage as before, every
 * save is pushed a moment later, and on sign-in the account's rows are pulled and merged in, so
 * the same account sees the same data on every phone. Row level security keeps each account to
 * its own rows. */

const DB_URL = BACKEND_URL;
const DB_KEY = BACKEND_KEY;
const TABLE = "ikan2_user_state";
export const cloudConfigured = true;

/** Store names as saved in the database (the part after `ikan.u.<userId>.`). */
const SYNCED = new Set([
  "assessments.v1",
  "journal.v1",
  "equip.sleep-tight.v2",
  "equip.unburn.v2",
  "equip.stress-buster.v2",
  "consult.v1",
  "profile.v1",
  "settings.v1",
  "resources.v1",
  "wellness.v1",
  "onboarding.v1",
  "notifications.v1",
]);

type Status = {
  state: "off" | "unconfigured" | "syncing" | "synced" | "error";
  at?: string;
  message?: string;
};
let status: Status = { state: cloudConfigured ? "off" : "unconfigured" };
const statusListeners = new Set<() => void>();
const setStatus = (s: Status) => {
  status = s;
  statusListeners.forEach((l) => l());
};
export const useSyncStatus = () =>
  useSyncExternalStore(
    (l) => {
      statusListeners.add(l);
      return () => statusListeners.delete(l);
    },
    () => status,
    () => status,
  );

type Meta = Record<string, { changed: string; pushed?: string }>;
const prefix = (uid: string) => `ikan.u.${uid}.`;
const metaKey = (uid: string) => `${prefix(uid)}sync.meta`;
const readMeta = (uid: string): Meta => {
  try {
    return JSON.parse(localStorage.getItem(metaKey(uid)) ?? "{}") as Meta;
  } catch {
    return {};
  }
};
const writeMeta = (uid: string, m: Meta) => {
  try {
    localStorage.setItem(metaKey(uid), JSON.stringify(m));
  } catch {
    /* storage unavailable */
  }
};
const readLocal = (uid: string, name: string): unknown => {
  try {
    const raw = localStorage.getItem(prefix(uid) + name);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
};

async function rest<T>(
  path: string,
  token: string,
  init: { method?: string; body?: unknown; prefer?: string } = {},
): Promise<T> {
  const res = await fetch(`${DB_URL}/rest/v1/${path}`, {
    method: init.method ?? "GET",
    headers: {
      apikey: DB_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
    },
    ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
  });
  if (!res.ok) {
    let message = `Saving failed (${res.status})`;
    try {
      message = ((await res.json()) as { message?: string }).message ?? message;
    } catch {
      /* not JSON */
    }
    throw new Error(message);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

/* ---------------------------- merging ---------------------------- */

type Obj = Record<string, unknown>;
const byId = <T extends { id: string }>(local: T[] = [], remote: T[] = []) => {
  const seen = new Map(remote.map((x) => [x.id, x]));
  for (const x of local) seen.set(x.id, x);
  return [...seen.values()];
};

/** Both the device and the account changed the same store: keep everything from both. */
function merge(name: string, local: unknown, remote: unknown): unknown {
  const l = (local ?? {}) as Obj;
  const r = (remote ?? {}) as Obj;
  if (name === "journal.v1") return { entries: byId(l["entries"] as never, r["entries"] as never) };
  if (name === "assessments.v1")
    return {
      results: byId(l["results"] as never, r["results"] as never),
      drafts: { ...(r["drafts"] as Obj), ...(l["drafts"] as Obj) },
    };
  if (name === "consult.v1")
    return { bookings: byId(l["bookings"] as never, r["bookings"] as never) };
  if (name === "resources.v1")
    return {
      saved: [
        ...new Set([...((r["saved"] as string[]) ?? []), ...((l["saved"] as string[]) ?? [])]),
      ],
      opened: { ...(r["opened"] as Obj), ...(l["opened"] as Obj) },
    };
  if (name === "wellness.v1") return { days: { ...(r["days"] as Obj), ...(l["days"] as Obj) } };
  if (name === "notifications.v1")
    return {
      read: [...new Set([...((r["read"] as string[]) ?? []), ...((l["read"] as string[]) ?? [])])],
    };
  if (name.startsWith("equip.")) {
    const lc = (l["collections"] ?? {}) as Record<string, { id: string }[]>;
    const rc = (r["collections"] ?? {}) as Record<string, { id: string }[]>;
    const collections: Record<string, { id: string }[]> = {};
    for (const k of new Set([...Object.keys(lc), ...Object.keys(rc)]))
      collections[k] = byId(lc[k], rc[k]);
    const lt = (l["tracker"] ?? {}) as Record<string, Obj>;
    const rt = (r["tracker"] ?? {}) as Record<string, Obj>;
    const tracker: Record<string, Obj> = {};
    for (const k of new Set([...Object.keys(lt), ...Object.keys(rt)]))
      tracker[k] = { ...rt[k], ...lt[k] };
    return {
      ...r,
      ...l,
      completed: [
        ...new Set([
          ...((r["completed"] as number[]) ?? []),
          ...((l["completed"] as number[]) ?? []),
        ]),
      ].sort((a, b) => a - b),
      completedAt: { ...(r["completedAt"] as Obj), ...(l["completedAt"] as Obj) },
      answers: { ...(r["answers"] as Obj), ...(l["answers"] as Obj) },
      diary: { ...(r["diary"] as Obj), ...(l["diary"] as Obj) },
      collections,
      tracker,
    };
  }
  return local; // profile, settings, onboarding: the device's newer edit wins
}

/* ----------------------------- session ----------------------------- */

let session: { uid: string; token: () => Promise<string | null> } | null = null;
let timer: number | undefined;
let pushing = false;

export async function startCloudSync(uid: string, token: () => Promise<string | null>) {
  session = { uid, token };
  setWriteHook((key) => {
    const s = session;
    if (!s || !key.startsWith(prefix(s.uid))) return;
    const name = key.slice(prefix(s.uid).length);
    if (!SYNCED.has(name)) return;
    const m = readMeta(s.uid);
    m[name] = { ...m[name], changed: new Date().toISOString() };
    writeMeta(s.uid, m);
    schedulePush();
  });
  if (!cloudConfigured) return setStatus({ state: "unconfigured" });
  flushOnReconnect();
  await pull();
}

export function stopCloudSync() {
  session = null;
  setWriteHook(null);
  window.clearTimeout(timer);
  setStatus({ state: cloudConfigured ? "off" : "unconfigured" });
}

/* Retry delay after a failed push. A phone with no signal used to retry every 1.5s forever;
 * it now backs off to a minute, and a reconnect (below) flushes immediately anyway, so the
 * wait never costs the user a late save. Reset on every success. */
const PUSH_DELAY = 1500;
const MAX_DELAY = 60_000;
let retryDelay = PUSH_DELAY;

function schedulePush(delay = PUSH_DELAY) {
  if (!cloudConfigured) return;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => void push(), delay);
}

/** True while anything in the queue is still waiting to reach the backend. */
function hasPending(uid: string) {
  const m = readMeta(uid);
  return [...SYNCED].some((n) => m[n] && (!m[n]!.pushed || m[n]!.changed > m[n]!.pushed!));
}

/* The queue is drained as soon as the connection is back, rather than on the next timer. The
 * browser's online event covers the web and the installed PWA; @capacitor/network is added on
 * top for the Android app, where the WebView's online event is not dependable. */
let watchingNetwork = false;
function flushOnReconnect() {
  if (watchingNetwork || typeof window === "undefined") return;
  watchingNetwork = true;
  const flush = () => {
    if (!session || !hasPending(session.uid)) return;
    retryDelay = PUSH_DELAY;
    schedulePush(0);
  };
  window.addEventListener("online", flush);
  void import("@capacitor/core")
    .then(({ Capacitor }) => (Capacitor.isNativePlatform() ? import("@capacitor/network") : null))
    .then((mod) => {
      void mod?.Network.addListener("networkStatusChange", (s) => {
        if (s.connected) flush();
      });
    })
    .catch(() => {
      /* the plugin is absent on the web - the online event is enough there */
    });
}

async function pull() {
  const s = session;
  if (!s) return;
  const token = await s.token();
  if (!token) return;
  setStatus({ state: "syncing" });
  try {
    const rows = await rest<{ key: string; value: unknown; updated_at: string }[]>(
      `${TABLE}?select=key,value,updated_at&user_id=eq.${s.uid}`,
      token,
    );
    if (session?.uid !== s.uid || getScope() !== s.uid) return;
    const meta = readMeta(s.uid);
    const now = new Date().toISOString();
    for (const row of rows ?? []) {
      if (!SYNCED.has(row.key)) continue;
      const local = readLocal(s.uid, row.key);
      const m = meta[row.key];
      // device data that has never been saved to the account counts as changed
      const localDirty = local !== undefined && (!m || !m.pushed || m.changed > m.pushed);
      let next: unknown;
      if (local === undefined || !localDirty) {
        next = row.value;
        meta[row.key] = { changed: row.updated_at, pushed: row.updated_at };
      } else {
        next = merge(row.key, local, row.value);
        meta[row.key] = { changed: now, ...(m?.pushed ? { pushed: m.pushed } : {}) };
      }
      try {
        localStorage.setItem(prefix(s.uid) + row.key, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
    }
    // anything on the device the account doesn't have yet gets uploaded
    for (const name of SYNCED) {
      if (
        readLocal(s.uid, name) !== undefined &&
        !(rows ?? []).some((r) => r.key === name) &&
        !meta[name]?.pushed
      ) {
        meta[name] = { changed: meta[name]?.changed ?? now };
      }
    }
    writeMeta(s.uid, meta);
    refreshStores();
    setStatus({ state: "synced", at: now });
    await push();
  } catch (e) {
    setStatus({ state: "error", message: (e as Error).message });
  }
}

async function push() {
  const s = session;
  if (!s || pushing || !cloudConfigured) return;
  let failed = false;
  const meta = readMeta(s.uid);
  const dirty = [...SYNCED].filter(
    (name) => meta[name] && (!meta[name]!.pushed || meta[name]!.changed > meta[name]!.pushed!),
  );
  if (!dirty.length) return;
  const token = await s.token();
  if (!token) return;
  pushing = true;
  setStatus({ state: "syncing" });
  try {
    const items = dirty
      .map((key) => ({ key, value: readLocal(s.uid, key), updated_at: meta[key]!.changed }))
      .filter((i) => i.value !== undefined);
    if (items.length)
      await rest(`${TABLE}?on_conflict=user_id,key`, token, {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=minimal",
        body: items.map((i) => ({ user_id: s.uid, ...i })),
      });
    const after = readMeta(s.uid);
    for (const i of items)
      if (after[i.key]?.changed === i.updated_at)
        after[i.key] = { ...after[i.key]!, pushed: i.updated_at };
    writeMeta(s.uid, after);
    retryDelay = PUSH_DELAY;
    setStatus({ state: "synced", at: new Date().toISOString() });
  } catch (e) {
    failed = true;
    setStatus({ state: "error", message: (e as Error).message });
  } finally {
    pushing = false;
  }
  // Still dirty: either more was written while this ran (retry at once) or this attempt failed
  // and the next one waits longer each time, up to a minute.
  if (hasPending(s.uid)) {
    if (failed) retryDelay = Math.min(retryDelay * 2, MAX_DELAY);
    schedulePush(failed ? retryDelay : PUSH_DELAY);
  }
}

/** Delete this account's saved data from the database (used by "Clear all data"). */
export async function clearCloudData() {
  const s = session;
  if (!s || !cloudConfigured) return;
  const token = await s.token();
  if (!token) return;
  await rest(`${TABLE}?user_id=eq.${s.uid}`, token, { method: "DELETE" });
  try {
    localStorage.removeItem(metaKey(s.uid));
  } catch {
    /* storage unavailable */
  }
}

/** Retry now, e.g. from Settings after an error. */
export const syncNow = () => void pull();
