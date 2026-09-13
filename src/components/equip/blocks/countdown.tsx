import { useEffect, useState } from "react";
import { Play, Timer } from "lucide-react";

/** A countdown that runs once. `done` flips to true at zero — a hard stop for the caller to honour. */
export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  return {
    left,
    running,
    started: running || left < seconds,
    done: left === 0,
    start: () => setRunning(true),
  };
}

export function CountdownBar({
  total,
  clock,
}: {
  total: number;
  clock: ReturnType<typeof useCountdown>;
}) {
  const mm = Math.floor(clock.left / 60);
  const ss = String(clock.left % 60).padStart(2, "0");

  if (!clock.started) {
    return (
      <button
        type="button"
        onClick={clock.start}
        className="tile flex w-full items-center justify-between rounded-2xl bg-foreground px-4 py-3.5 text-background"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Timer className="h-4 w-4" /> {Math.round(total / 60)} minute timer
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          Start <Play className="h-4 w-4" />
        </span>
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-secondary p-3.5" role="timer" aria-live="polite">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span className="flex items-center gap-2">
          <Timer className="h-4 w-4" /> {clock.done ? "Time's up" : "Keep going"}
        </span>
        <span className="font-display tabular-nums">
          {mm}:{ss}
        </span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-background">
        <div
          className="h-full rounded-full bg-foreground transition-[width] duration-1000 ease-linear"
          style={{ width: `${(clock.left / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
