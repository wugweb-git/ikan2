import { useRef, useState } from "react";
import { Play } from "lucide-react";
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

const note = {
  youtube: "Loads from YouTube when you press play.",
  vimeo: "Loads from Vimeo when you press play.",
  spotify: "Loads from Spotify when you press play. Full tracks need a Spotify account.",
} as const;

export function MediaPlayer({
  src,
  kind,
  poster,
  className,
  title,
  onEnded,
}: {
  src: string;
  kind: "video" | "audio";
  /** a still for a file video; without one the browser shows the first frame */
  poster?: string;
  className?: string;
  /** names the embed for screen readers, since the iframe's own title is the service's */
  title?: string;
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
    /* The embed's own height is Spotify's, and it is tall. The placeholder does not need it:
     * before anyone presses play there is nothing to show but a button. */
    const box =
      source.provider === "spotify"
        ? { height: source.height }
        : { aspectRatio: "16 / 9" as const };
    if (!playing) {
      const rest = source.provider === "spotify" ? { height: 168 } : box;
      return (
        <div className={cn("relative", className)} style={rest}>
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className={cn(
              "flex h-full w-full flex-col items-center justify-center gap-3 rounded-[20px] bg-secondary px-6 text-center",
              stateLayer,
            )}
          >
            {/* No artwork here on purpose: the article's illustration is already the hero
             * directly above, and repeating it put the same picture on screen twice. */}
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--accent-strong,theme(colors.foreground))] text-background">
              <Play className="ml-0.5 h-6 w-6 fill-current" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold">{label[source.provider]}</span>
              <span className="mt-0.5 block text-[12px] leading-4 text-muted-foreground">
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
      <div className={cn("rounded-[20px] bg-secondary p-4", className)}>
        <audio src={src} controls preload="metadata" onEnded={onEnded} className="w-full" />
      </div>
    );
  }
  return (
    <video
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      onEnded={onEnded}
      className={cn("aspect-video w-full rounded-[20px] bg-black", className)}
    />
  );
}
