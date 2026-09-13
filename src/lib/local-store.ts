import { useSyncExternalStore } from "react";
import { getScope, onScopeChange, scopedKey } from "@/lib/storage-scope";

/* A small localStorage-backed store, kept per signed-in account (see storage-scope).
 * Hydration-safe: the server and the first client render see `empty`. */
export function createLocalStore<T extends object>(key: string, empty: T) {
  let cache: T | undefined;
  let cacheScope = "";
  const listeners = new Set<() => void>();

  const read = (): T => {
    if (cache && cacheScope === getScope()) return cache;
    if (typeof window === "undefined") return empty;
    let state = empty;
    try {
      const raw = window.localStorage.getItem(scopedKey(key));
      if (raw) state = { ...empty, ...(JSON.parse(raw) as Partial<T>) };
    } catch {
      /* unreadable storage — start fresh */
    }
    cache = state;
    cacheScope = getScope();
    return state;
  };

  const write = (next: T) => {
    cache = next;
    cacheScope = getScope();
    try {
      window.localStorage.setItem(scopedKey(key), JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in memory for this session */
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === scopedKey(key)) {
        cache = undefined;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    const offScope = onScopeChange(() => {
      cache = undefined;
      listener();
    });
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
      offScope();
    };
  };

  return {
    read,
    update: (fn: (s: T) => T) => write(fn(read())),
    use: () => useSyncExternalStore(subscribe, read, () => empty),
  };
}

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
