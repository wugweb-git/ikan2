import { useEffect, useRef } from "react";

const IDLE_MS = 120_000;
const FLUSH_EVERY = 15;

/**
 * Counts active seconds while `key` is on screen: the page is visible and the person has touched,
 * scrolled or typed in the last two minutes. Seconds are handed to `onFlush` every 15 seconds,
 * when the key changes, when the page is hidden and on unmount, so nothing is lost.
 */
export function useActiveTime(key: string, onFlush: (key: string, seconds: number) => void) {
  const flushRef = useRef(onFlush);
  flushRef.current = onFlush;

  useEffect(() => {
    let seconds = 0;
    let lastInput = Date.now();
    const flush = () => {
      if (seconds > 0) flushRef.current(key, seconds);
      seconds = 0;
    };
    const touch = () => {
      lastInput = Date.now();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else touch();
    };
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);
    const tick = window.setInterval(() => {
      if (document.visibilityState !== "visible" || Date.now() - lastInput > IDLE_MS) return;
      seconds += 1;
      if (seconds >= FLUSH_EVERY) flush();
    }, 1000);
    return () => {
      window.clearInterval(tick);
      events.forEach((e) => window.removeEventListener(e, touch));
      document.removeEventListener("visibilitychange", onVisibility);
      flush();
    };
  }, [key]);
}

/** "45 sec", "12 min", "1 h 5 min" */
export const formatSeconds = (seconds: number) => {
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))} sec`;
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h} h ${m % 60} min` : `${h} h`;
};
