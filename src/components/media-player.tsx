import { useRef, useState, type SyntheticEvent } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { stateLayer } from "@/components/equip/m3";
import { cn } from "@/lib/utils";

/* The one player in the app. Resources use it for video and audio posts; the Equip blocks will
 * use it for watch and listen steps, which is why it takes a src and a kind rather than reaching
 * for a Resource.
 *
 * It takes whatever URL you have:
 * - a file (mp4, webm, mp3, m4a) plays in the browser's own <video>/<audio>, with no player
 *   library and nothing loaded from anyone else. Supabase Storage, this repo's public/ folder,
 *   any CDN. `playsInline` keeps iOS Safari from throwing the video into its own fullscreen
 *   player the moment it starts, which is what makes an embed feel like a pop-up;
 * - a YouTube, Vimeo or Spotify link becomes that service's embed, but only after someone asks
 *   for it. Until the play button is pressed the app shows its own artwork and makes no request
 *   to Google or Spotify at all. An embed that loads on render would phone a third party about
 *   every reader of a mental health page before they had decided to watch anything, which is not
 *   a trade this app should make quietly. YouTube is loaded from youtube-nocookie.com.
 *
 * Size is the caller's: `className` replaces the default box, so an Equip block can be shorter
 * than an article's 16:9. */

type Source =
  | { kind: "file" }
  | { kind: "embed"; provider: "youtube" | "vimeo" | "spotify"; url: string; height?: number };

const ID = /^[A-Za-z0-9_-]+$/;

/** What a URL actually is. Anything unrecognised is treated as a file, which is the old behaviour. */
export function parseSource(src: string): Source {
  let u: URL;
  try {
    u = new URL(src, "https://app.ikanhealth.in");
  } catch {
    return { kind: "file" };
  }
  const host = u.hostname.replace(/^www\./, "");
  const parts = u.pathname.split("/").filter(Boolean);

  if (
    host === "youtu.be" ||
    host.endsWith("youtube.com") ||
    host.endsWith("youtube-nocookie.com")
  ) {
    const id =
      u.searchParams.get("v") ??
      (host === "youtu.be"
        ? parts[0]
        : parts[0] === "embed" || parts[0] === "shorts"
          ? parts[1]
          : undefined);
    if (id && ID.test(id)) {
      const start = u.searchParams.get("t")?.replace(/[^0-9]/g, "");
      return {
        kind: "embed",
        provider: "youtube",
        url:
          /* rel=0 no longer removes suggestions, it only keeps them to the same channel, and
           * modestbranding was retired in 2024, so it is not set here. YouTube's title bar, logo,
           * pause overlay, end screen and any ads are part of its embed and cannot be turned off
           * or covered. A video that must play clean belongs in storage as a file. */
          `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&iv_load_policy=3&color=white` +
          (start ? `&start=${start}` : ""),
      };
    }
  }

  if (host.endsWith("vimeo.com")) {
    const id = parts.find((p) => /^\d+$/.test(p));
    if (id) {
      return {
        kind: "embed",
        provider: "vimeo",
        url: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`,
      };
    }
  }

  if (host.endsWith("spotify.com")) {
    const i = parts[0] === "embed" ? 1 : 0;
    const type = parts[i];
    const id = parts[i + 1];
    if (type && id && ID.test(id)) {
      return {
        kind: "embed",
        provider: "spotify",
        url: `https://open.spotify.com/embed/${type}/${id}`,
        /* Spotify's own sizes: the compact one for a single track, the tall one for anything
         * with a list or episode art behind it. */
        height: type === "track" ? 152 : 352,
      };
    }
  }

  return { kind: "file" };
}

const label = {
  youtube: "Play on YouTube",
  vimeo: "Play on Vimeo",
  spotify: "Listen on Spotify",
} as const;

const openLabel = {
  youtube: "Watch on YouTube",
  vimeo: "Watch on Vimeo",
  spotify: "Listen on Spotify",
} as const;

const note = {
  youtube: "Loads from YouTube when you press play.",
  vimeo: "Loads from Vimeo when you press play.",
  spotify: "Loads from Spotify when you press play. Full tracks need a Spotify account.",
} as const;

export function MediaPlayer({
  src,
  kind,
  embeddable = true,
  poster,
  className,
  title,
  startAt,
  onProgress,
  onEnded,
}: {
  src: string;
  kind: "video" | "audio";
  /** false when the provider forbids embedding: the card opens the service in a new tab */
  embeddable?: boolean;
  /** the piece's own artwork: a video still, an episode cover, an mp3's embedded art */
  poster?: string;
  className?: string;
  /** names the embed for screen readers, since the iframe's own title is the service's */
  title?: string;
  /** resume point in seconds, from the last time this was played */
  startAt?: number;
  /** files only: how far through, as it plays */
  onProgress?: (at: number, of: number) => void;
  /** for Equip: a watch or listen block that completes when the thing has been played. Files
   * only - an embed plays inside the other service and never tells us it finished. */
  onEnded?: () => void;
}) {
  const source = parseSource(src);
  const [playing, setPlaying] = useState(false);

  /* Moving between two media articles keeps this component mounted, so without this the next
   * one would open with the previous one's "already playing" and load its embed before anyone
   * asked. That would quietly undo the only privacy promise this component makes. */
  const shown = useRef(src);
  if (shown.current !== src) {
    shown.current = src;
    setPlaying(false);
  }

  if (source.kind === "embed") {
    const box =
      source.provider === "spotify"
        ? { height: source.height }
        : { aspectRatio: "16 / 9" as const };
    /* Some owners forbid embedding. Showing their iframe anyway renders a black "Video
     * unavailable" box, so the card becomes a door to the service instead of a broken player. */
    if (!embeddable) {
      return (
        <div className={cn("relative", className)} style={box}>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group relative block h-full w-full overflow-hidden rounded-[20px] bg-secondary text-left",
              poster && "text-white",
              stateLayer,
            )}
          >
            {poster ? (
              <>
                <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
              </>
            ) : null}
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-foreground shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
                <ArrowUpRight className="h-7 w-7" />
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 block px-4 pb-3.5">
              <span className="block text-[15px] font-semibold">{openLabel[source.provider]}</span>
              <span
                className={cn(
                  "mt-0.5 block text-[12px] leading-4",
                  poster ? "text-white/85" : "text-muted-foreground",
                )}
              >
                {`${source.provider === "spotify" ? "Spotify" : source.provider === "vimeo" ? "Vimeo" : "YouTube"} does not allow this one to play here. Opens in a new tab.`}
              </span>
            </span>
          </a>
        </div>
      );
    }
    if (!playing) {
      /* The embed's own height is Spotify's, and it is tall. The placeholder does not need it:
       * before anyone presses play there is nothing to show but the artwork and a button. */
      const rest = source.provider === "spotify" ? { height: 200 } : box;
      return (
        <div className={cn("relative", className)} style={rest}>
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className={cn(
              "group relative block h-full w-full overflow-hidden rounded-[20px] bg-secondary text-left",
              poster && "text-white",
              stateLayer,
            )}
          >
            {/* The piece's own artwork, committed to this repo rather than fetched, so the
             * placeholder still reaches nobody. Never the article's illustration: that is the
             * hero directly above, and repeating it put the same picture on screen twice. */}
            {poster ? (
              <>
                <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
              </>
            ) : null}
            <span className="absolute inset-0 grid place-items-center">
              <PlayBadge />
            </span>
            <span className="absolute inset-x-0 bottom-0 block px-4 pb-3.5">
              <span className="block text-[15px] font-semibold">{label[source.provider]}</span>
              <span
                className={cn(
                  "mt-0.5 block text-[12px] leading-4",
                  poster ? "text-white/85" : "text-muted-foreground",
                )}
              >
                {note[source.provider]}
              </span>
            </span>
          </button>
        </div>
      );
    }
    return (
      <div className={cn("overflow-hidden rounded-[20px] bg-black", className)} style={box}>
        <iframe
          src={source.url}
          title={title ?? label[source.provider]}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          allowFullScreen
        />
      </div>
    );
  }

  if (kind === "audio") {
    return (
      <AudioPlayer
        src={src}
        poster={poster}
        className={className}
        startAt={startAt}
        onProgress={onProgress}
        onEnded={onEnded}
      />
    );
  }
  return (
    <FileVideo
      src={src}
      poster={poster}
      className={className}
      startAt={startAt}
      onProgress={onProgress}
      onEnded={onEnded}
    />
  );
}

/* One play affordance everywhere: dead centre, and it answers the press. The ring behind it
 * breathes so a still frame does not read as a broken image, and stops for reduced motion. */
function PlayBadge({ paused = true }: { paused?: boolean }) {
  return (
    <span className="relative grid h-16 w-16 place-items-center">
      <span className="media-pulse absolute inset-0 rounded-full bg-white/30" aria-hidden="true" />
      <span className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-foreground shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
        {paused ? (
          <Play className="ml-1 h-7 w-7 fill-current" />
        ) : (
          <Pause className="h-7 w-7 fill-current" />
        )}
      </span>
    </span>
  );
}

const clock = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/** Shared wiring for the two file players: resume, report progress, report the end. */
function useMedia(
  ref: { current: HTMLMediaElement | null },
  startAt?: number,
  onProgress?: (at: number, of: number) => void,
  onEnded?: () => void,
) {
  const [at, setAt] = useState(startAt ?? 0);
  const [of, setOf] = useState(0);
  const [playing, setPlaying] = useState(false);
  const resumed = useRef(false);

  const bind = {
    onLoadedMetadata: (e: SyntheticEvent<HTMLMediaElement>) => {
      const el = e.currentTarget;
      setOf(el.duration);
      /* Resume, but not from the very end: finishing something and coming back should start it
       * again rather than drop you on the last second of it. */
      if (!resumed.current && startAt && startAt > 1 && startAt < el.duration - 3) {
        el.currentTime = startAt;
      }
      resumed.current = true;
    },
    onTimeUpdate: (e: SyntheticEvent<HTMLMediaElement>) => {
      const el = e.currentTarget;
      setAt(el.currentTime);
      onProgress?.(el.currentTime, el.duration || 0);
    },
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onEnded: () => {
      setPlaying(false);
      onEnded?.();
    },
  };

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const seek = (fraction: number) => {
    const el = ref.current;
    if (el && Number.isFinite(el.duration)) el.currentTime = el.duration * fraction;
  };

  return { at, of, playing, bind, toggle, seek };
}

/* `undefined` is spelled out because the project runs exactOptionalPropertyTypes: these are
 * forwarded straight from MediaPlayer's own optional props. */
type FileProps = {
  src: string;
  poster: string | undefined;
  className: string | undefined;
  startAt: number | undefined;
  onProgress: ((at: number, of: number) => void) | undefined;
  onEnded: (() => void) | undefined;
};

/* A listening piece deserves more than the browser's grey pill. Its own artwork, one big
 * control in the middle of it, and a bar you can drag. */
function AudioPlayer({ src, poster, className, startAt, onProgress, onEnded }: FileProps) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const { at, of, playing, bind, toggle, seek } = useMedia(ref, startAt, onProgress, onEnded);
  const pct = of > 0 ? Math.min(100, (at / of) * 100) : 0;

  return (
    <div className={cn("overflow-hidden rounded-[20px] bg-secondary", className)}>
      <audio ref={ref} src={src} preload="metadata" className="hidden" {...bind} />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className={cn(
          "group relative grid w-full place-items-center overflow-hidden",
          /* With artwork the panel is a picture to look at. Without, it is just a button, and a
           * 16:10 box of empty grey for one button is a lot of nothing. */
          poster ? "aspect-[16/10]" : "py-8",
          poster && "text-white",
        )}
      >
        {poster ? (
          <>
            <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 bg-black/40" />
          </>
        ) : null}
        <PlayBadge paused={!playing} />
      </button>
      <div className="px-4 pt-3 pb-4">
        <Scrubber pct={pct} onSeek={seek} />
        <div className="mt-2 flex justify-between text-[12px] tabular-nums text-muted-foreground">
          <span>{clock(at)}</span>
          <span>{of > 0 ? clock(of) : "--:--"}</span>
        </div>
      </div>
    </div>
  );
}

function FileVideo({ src, poster, className, startAt, onProgress, onEnded }: FileProps) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const { bind } = useMedia(ref, startAt, onProgress, onEnded);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className={cn("aspect-video w-full rounded-[20px] bg-black", className)}
      {...bind}
    />
  );
}

/** A draggable bar. Click or drag anywhere on it; the whole row is the hit area, not the 4px. */
function Scrubber({ pct, onSeek }: { pct: number; onSeek: (fraction: number) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const to = (clientX: number) => {
    const box = ref.current?.getBoundingClientRect();
    if (box && box.width) onSeek(Math.max(0, Math.min(1, (clientX - box.left) / box.width)));
  };
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        to(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) to(e.clientX);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onSeek(Math.min(1, pct / 100 + 0.05));
        if (e.key === "ArrowLeft") onSeek(Math.max(0, pct / 100 - 0.05));
      }}
      className="group -my-2 cursor-pointer py-2 focus-visible:outline-none"
    >
      <div className="h-1.5 w-full rounded-full bg-foreground/15">
        <div
          className="relative h-1.5 rounded-full bg-[var(--accent-strong,currentColor)]"
          style={{ width: `${pct}%` }}
        >
          <span className="absolute top-1/2 right-0 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--accent-strong,currentColor)] shadow transition-transform group-hover:scale-125 group-focus-visible:scale-125" />
        </div>
      </div>
    </div>
  );
}
