import { Link } from "@tanstack/react-router";
import { Bookmark, CalendarDays, Check, Clock3 } from "lucide-react";
import { Illustration } from "@/components/art";
import { IconButton, stateLayer } from "@/components/equip/m3";
import { cn } from "@/lib/utils";
import {
  cardDate,
  lengthLabel,
  mediumIcon,
  mediumLabel,
  mediumOf,
  slugOf,
  useResourceStore,
  type Resource,
} from "@/lib/resources";

/* A resource on a card: the row (Resources list, Keep reading) and the meta line every resource
 * card shares (also Home's block card). The map is src/lib/content/RESOURCES.md. */

/** One resource in a list: cover, category, title, type and length, and save. The library
 * list and an article's Keep reading both use it, so a resource looks the same wherever it is
 * listed. */
export function ResourceRow({
  r,
  hydrated,
  onToggleSave,
}: {
  r: Resource;
  hydrated: boolean;
  onToggleSave: (r: Resource) => void;
}) {
  const store = useResourceStore();
  const saved = hydrated && store.isSaved(r.id);
  /* Where someone is with it, in the meta line where the length is: part way through it says
   * how much is left, finished it says Read, Watched or Listened with a check. Nothing in the
   * eyebrow, which is only the category. */
  const progress = hydrated ? store.progressOf(r) : null;
  return (
    <li className="border-b border-foreground/10 last:border-0">
      <div className="flex items-center gap-3 py-3">
        <Link
          to="/resources/$slug"
          params={{ slug: slugOf(r) }}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 rounded-[16px] text-left",
            stateLayer,
          )}
        >
          <span className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[16px]">
            <Illustration art={r.art} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="type-label-md font-semibold block text-[var(--accent-strong)]">
              {r.category}
            </span>
            <h3 className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-5">{r.title}</h3>
            <ResourceMeta r={r} progress={progress} className="mt-1" />
          </span>
        </Link>
        <IconButton
          label={saved ? "Remove from saved" : "Save for later"}
          onClick={() => onToggleSave(r)}
        >
          {saved ? (
            <Bookmark className="h-5 w-5 fill-current text-[var(--accent-strong)]" />
          ) : (
            <Bookmark className="h-5 w-5 text-muted-foreground" />
          )}
        </IconButton>
      </div>
    </li>
  );
}

/** A resource's meta line, shared by the row and the block card on Home: date, type and
 * length, or progress in their place, on one line. On a narrow phone the type word gives way
 * with an ellipsis, since its icon says the same; the length always shows in full. See
 * src/lib/content/RESOURCES.md. */
export function ResourceMeta({
  r,
  progress,
  className,
}: {
  r: Resource;
  progress: { label: string; done: boolean } | null;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "type-label-md flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-muted-foreground [&>span]:shrink-0 [&>span:nth-child(2)]:min-w-0 [&>span:nth-child(2)]:shrink [&>span:nth-child(2)]:overflow-hidden [&_svg]:shrink-0",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {cardDate(r.date)}
      </span>
      {/* finished: the check replaces the type ("Read", not "Read ✓ Read") */}
      {progress?.done ? (
        <span className="inline-flex h-5 items-center gap-1 rounded-full bg-[var(--accent-container)] px-2 font-semibold text-[var(--on-accent-container)]">
          <Check className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.5} />
          <span className="truncate">{progress.label}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1">
          {(() => {
            const Icon = mediumIcon[mediumOf(r)];
            return <Icon className="h-3.5 w-3.5" />;
          })()}
          <span className="truncate">{mediumLabel(r)}</span>
        </span>
      )}
      {/* part way: how much is left replaces the length */}
      <span
        className={cn(
          "inline-flex items-center gap-1",
          progress &&
            !progress.done &&
            "h-5 gap-1 rounded-full bg-[var(--accent-container)] px-2 font-semibold text-[var(--on-accent-container)]",
        )}
      >
        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{" "}
        {progress && !progress.done ? progress.label : lengthLabel(r)}
      </span>
    </span>
  );
}
