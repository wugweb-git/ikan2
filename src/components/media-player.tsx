import { cn } from "@/lib/utils";

/* The one player in the app. Resources use it for video and audio posts; the Equip blocks will
 * use it for watch and listen steps, which is why it takes a src and a kind rather than reaching
 * for a Resource.
 *
 * It plays inline, with the browser's own controls and no player library:
 * - nothing is requested and no cookie is set until someone presses play, so a page with a video
 *   on it is still as private as the rest of the app;
 * - `playsInline` keeps iOS Safari from throwing the video into its own fullscreen player the
 *   moment it starts, which is what makes an embedded video feel like a pop-up;
 * - a plain file URL stays playable offline once the browser has it cached, which a third-party
 *   embed never is.
 *
 * Size is the caller's: `className` replaces the default box, so an Equip block can be shorter
 * than an article's 16:9. */
export function MediaPlayer({
  src,
  kind,
  poster,
  className,
  onEnded,
}: {
  src: string;
  kind: "video" | "audio";
  /** a still shown before play; without one the browser shows the first frame */
  poster?: string;
  className?: string;
  /** for Equip: a watch or listen block that completes when the thing has been played */
  onEnded?: () => void;
}) {
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
