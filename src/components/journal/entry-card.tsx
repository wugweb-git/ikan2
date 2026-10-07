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

/** One journal check-in: mood, then sleep, stress and pain, the note and the tags. Read-only:
 * a saved check-in is a record and can't be changed or deleted. */
export function EntryCard({ entry: e, showDate }: { entry: JournalEntry; showDate?: boolean }) {
  const mood = moodScale[e.mood_rating - 1]!;
  const at = <T,>(scale: T[], v: number | undefined) => (v ? scale[v - 1] : undefined);
  const sleep = at(sleepScale, e.sleep_rating);
  const stress = at(stressScale, e.stress_level);
  const energy = at(energyScale, e.energy);
  const experience = at(painExperienceScale, e.pain_experience);
  const impact = at(painImpactScale, e.pain_impact);
  // a strip of small cells: sleep (or energy on older check-ins), stress, pain
  const cells: { emoji: string; label: string; value: string }[] = [];
  if (sleep) cells.push({ emoji: sleep.emoji, label: "Sleep", value: sleep.label });
  else if (energy) cells.push({ emoji: energy.emoji, label: "Energy", value: energy.label });
  if (stress) cells.push({ emoji: stress.emoji, label: "Stress", value: stress.label });
  if (e.pain_exist === true)
    cells.push({
      emoji: experience?.emoji ?? "🩹",
      label: "Pain",
      value: [experience?.label, impact && `Impact: ${impact.label.toLowerCase()}`]
        .filter(Boolean)
        .join(" · "),
    });
  else if (e.pain_exist === false) cells.push({ emoji: "✅", label: "Pain", value: "No pain" });
  const when = new Date(e.createdAt);
  return (
    <article className="rounded-[20px] border border-foreground/10 p-4">
      <div className="flex items-center gap-3">
        <span className="text-[32px] leading-none" aria-hidden="true">
          {mood.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="type-title-md">
            {mood.label}{" "}
            <span className="type-body-sm font-sans text-muted-foreground">{e.mood_rating}/5</span>
          </p>
          <p className="type-body-sm text-muted-foreground">
            {showDate
              ? `${when.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}, `
              : ""}
            {when.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
      </div>
      {cells.length ? (
        <dl
          className="mt-3 grid gap-px overflow-hidden rounded-[14px] bg-foreground/10"
          style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
        >
          {cells.map((c) => (
            <div key={c.label} className="bg-background px-2 py-2 text-center">
              <dt className="text-[11px] text-muted-foreground">{c.label}</dt>
              <dd className="mt-0.5 text-[13px] font-medium leading-4">
                <span aria-hidden="true" className="mr-1">
                  {c.emoji}
                </span>
                {c.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {e.freehand_text_content ? (
        <p className="type-body mt-3">“{e.freehand_text_content}”</p>
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
    <span className="type-body-sm inline-flex h-7 items-center rounded-[8px] bg-secondary px-2.5">
      {children}
    </span>
  );
}
