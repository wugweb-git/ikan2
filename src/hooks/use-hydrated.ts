import { useSyncExternalStore } from "react";

/** false during SSR and the hydration render, true after — for screens that read localStorage. */
export const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
