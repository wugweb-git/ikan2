import { useEffect, useState } from "react";
import { ExternalLink } from "@/components/kit/link";
import { IkanMark } from "@/components/ikan-mark";

/* Launch screen, under the same sky as Home for the time of day. One sequence: the disc opens,
 * the iKAN burst blooms into it, then the name, promise and a loading line rise in; a soft
 * pulse keeps going while iKAN opens. Everything is shown still for people who ask for less
 * motion. */

type Part = "dawn" | "morning" | "afternoon" | "evening" | "night";

const partOf = (h: number): Part =>
  h >= 5 && h < 8
    ? "dawn"
    : h < 12 && h >= 8
      ? "morning"
      : h >= 12 && h < 17
        ? "afternoon"
        : h >= 17 && h < 20
          ? "evening"
          : "night";

const skies: Record<Part, { from: string; to: string; ink: string; muted: string; hill: string }> =
  {
    dawn: { from: "#FFE4C9", to: "#FFC085", ink: "#3A2210", muted: "#6E4A2E", hill: "#F2A96A" },
    morning: { from: "#E8F4FD", to: "#B8DFF7", ink: "#12263A", muted: "#44607A", hill: "#9CCBEA" },
    afternoon: {
      from: "#FFF8E1",
      to: "#FFD97A",
      ink: "#3A2A05",
      muted: "#6E5820",
      hill: "#F0C458",
    },
    evening: { from: "#E8D5F5", to: "#C09FDE", ink: "#2A1740", muted: "#58446F", hill: "#A884CC" },
    night: { from: "#2A2A3E", to: "#151525", ink: "#E8E8F0", muted: "#A0A0C0", hill: "#23233A" },
  };

export function Splash() {
  const [part, setPart] = useState<Part>("morning");

  useEffect(() => {
    setPart(partOf(new Date().getHours()));
  }, []);

  const s = skies[part];

  return (
    <div
      className="splash splash-phone-only relative flex min-h-dvh flex-col overflow-hidden transition-[background] duration-700"
      style={{ background: `linear-gradient(180deg, ${s.from} 0%, ${s.to} 100%)`, color: s.ink }}
    >
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 pt-[var(--safe-top,env(safe-area-inset-top))] text-center">
        <div className="relative grid h-40 w-40 place-items-center">
          {/* after the mark lands, a slow pulse keeps going while iKAN opens */}
          {[0, 1].map((i) => (
            <span
              key={i}
              aria-hidden="true"
              className="splash-ring absolute inset-0 rounded-full border"
              style={{ borderColor: s.ink, animationDelay: `${1100 + i * 1600}ms` }}
            />
          ))}
          <span
            className="splash-disc grid h-24 w-24 place-items-center rounded-full shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)]"
            style={{ background: part === "night" ? "#E8E8F0" : "#FFFFFF", color: "#151515" }}
          >
            <IkanMark className="splash-mark h-[72px] w-[72px]" />
          </span>
        </div>

        <p
          className="splash-rise mt-5 font-display text-[20px] font-semibold tracking-[0.02em]"
          style={{ animationDelay: "700ms" }}
        >
          iKAN
        </p>
        <h1
          className="splash-rise mt-3 max-w-[16ch] font-display text-[30px] font-semibold leading-9 tracking-[-0.01em] text-balance"
          style={{ animationDelay: "950ms" }}
        >
          Reimagining mental health care.
        </h1>
        <p
          className="type-body splash-rise mt-3 max-w-[32ch]"
          style={{ color: s.muted, animationDelay: "1200ms" }}
        >
          Stay on top of your mental health with real-time monitoring and insights, expert
          therapists, and science-backed tools and programs.
        </p>
        <span
          aria-hidden="true"
          className="splash-rise mt-8 block h-1 w-24 overflow-hidden rounded-full"
          style={{ background: `${s.ink}1f`, animationDelay: "1400ms" }}
        >
          <span
            className="splash-progress block h-full w-1/3 rounded-full"
            style={{ background: s.ink }}
          />
        </span>
        <span className="sr-only" role="status">
          Opening iKAN
        </span>
      </main>

      <svg
        aria-hidden="true"
        viewBox="0 0 390 120"
        preserveAspectRatio="none"
        className="splash-hills pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full"
      >
        <path
          d="M0 70 C 70 40, 150 80, 220 58 S 340 40, 390 60 L390 120 L0 120 Z"
          fill={s.hill}
          fillOpacity="0.45"
        />
        <path
          d="M0 92 C 90 74, 190 100, 280 84 S 370 80, 390 86 L390 120 L0 120 Z"
          fill={s.hill}
          fillOpacity="0.7"
        />
      </svg>

      <footer
        className="type-label-md splash-rise relative z-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center"
        style={{ color: s.muted, animationDelay: "1500ms" }}
      >
        Made by{" "}
        <ExternalLink
          href="https://wugweb.com"
          underline={false}
          className="font-semibold hover:underline"
          style={{ color: s.ink }}
        >
          wugweb
        </ExternalLink>
      </footer>
    </div>
  );
}
