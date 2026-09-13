import { useSyncExternalStore } from "react";

/* A small localStorage-backed store (no accounts yet).
 * Hydration-safe: the server and the first client render see `empty`. */
export function createLocalStore<T extends object>(key: string, empty: T) {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    if (cache) return cache;
    if (typeof window === "undefined") return empty;
    let state = empty;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = { ...empty, ...(JSON.parse(raw) as Partial<T>) };
    } catch {
      /* unreadable storage — start fresh */
    }
    cache = state;
    return state;
  };

  const write = (next: T) => {
    cache = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in memory for this session */
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        cache = undefined;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
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
