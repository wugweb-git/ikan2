import { Trash2 } from "lucide-react";
import { IconButton } from "@/components/equip/m3";
import { contextTags, energyScale, moodScale, stressScale, type JournalEntry } from "@/lib/journal";

/** One journal check-in: mood, energy, stress, note and tags. */
export function EntryCard({
  entry: e,
  onDelete,
  showDate,
}: {
  entry: JournalEntry;
  onDelete?: () => void;
  showDate?: boolean;
}) {
  const mood = moodScale[e.mood - 1]!;
  const energy = e.energy ? energyScale[e.energy - 1] : undefined;
  const stress = e.stress ? stressScale[e.stress - 1] : undefined;
  const when = new Date(e.createdAt);
  return (
    <article className="rounded-[20px] border border-foreground/10 p-4">
      <div className="flex items-center gap-3">
        <span className="text-[32px] leading-none" aria-hidden="true">
          {mood.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[16px] font-semibold">
            {mood.label}{" "}
            <span className="font-sans text-[13px] font-normal text-muted-foreground">
              {e.mood}/5
            </span>
          </p>
          <p className="text-[13px] text-muted-foreground">
            {showDate
              ? `${when.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}, `
              : ""}
            {when.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
        {onDelete ? (
          <IconButton label="Delete entry" onClick={onDelete} className="text-muted-foreground">
            <Trash2 className="h-5 w-5" />
          </IconButton>
        ) : null}
      </div>
      {energy || stress ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {energy ? <Chip>{`${energy.emoji} Energy: ${energy.label}`}</Chip> : null}
          {stress ? <Chip>{`${stress.emoji} Stress: ${stress.label}`}</Chip> : null}
        </div>
      ) : null}
      {e.note ? <p className="mt-3 text-[15px] leading-6">“{e.note}”</p> : null}
      {e.tags.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {e.tags.map((id) => {
            const t = contextTags.find((x) => x.id === id);
            return t ? <Chip key={id}>{`${t.emoji} ${t.label}`}</Chip> : null;
          })}
        </div>
      ) : null}
    </article>
  );
}

function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex h-7 items-center rounded-[8px] bg-secondary px-2.5 text-[13px]">
      {children}
    </span>
  );
}
