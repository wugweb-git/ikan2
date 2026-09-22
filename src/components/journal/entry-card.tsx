import { Trash2 } from "lucide-react";
import { IconButton } from "@/components/equip/m3";
import {
  contextTags,
  energyScale,
  moodScale,
  painExperienceScale,
  painImpactScale,
  sleepScale,
  stressScale,
  type JournalEntry,
} from "@/lib/journal";

/** One journal check-in: mood, then sleep, stress and pain, the note and the tags. */
export function EntryCard({
  entry: e,
  onDelete,
  showDate,
}: {
  entry: JournalEntry;
  onDelete?: () => void;
  showDate?: boolean;
}) {
  const mood = moodScale[e.mood_rating - 1]!;
  const at = <T,>(scale: T[], v: number | undefined) => (v ? scale[v - 1] : undefined);
  const sleep = at(sleepScale, e.sleep_rating);
  const stress = at(stressScale, e.stress_level);
  const energy = at(energyScale, e.energy);
  const experience = at(painExperienceScale, e.pain_experience);
  const impact = at(painImpactScale, e.pain_impact);
  const pain =
    e.pain_exist === true
      ? `🩹 Pain${experience ? `: ${experience.label}` : ""}${impact ? ` · Impact: ${impact.label}` : ""}`
      : e.pain_exist === false
        ? "✅ No pain"
        : undefined;
  const chips = [
    sleep && `${sleep.emoji} Sleep: ${sleep.label}`,
    stress && `${stress.emoji} Stress: ${stress.label}`,
    pain,
    energy && `${energy.emoji} Energy: ${energy.label}`,
  ].filter((c): c is string => Boolean(c));
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
              {e.mood_rating}/5
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
      {chips.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
        </div>
      ) : null}
      {e.freehand_text_content ? (
        <p className="mt-3 text-[15px] leading-6">“{e.freehand_text_content}”</p>
      ) : null}
      {e.context_tags.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {e.context_tags.map((id) => {
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
