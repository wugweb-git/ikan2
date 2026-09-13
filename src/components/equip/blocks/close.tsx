import { Check } from "lucide-react";
import { instruments } from "@/lib/equip/program";
import { useEquipProgress } from "@/lib/equip/store";
import type { Block, Unit } from "@/lib/equip/types";

/** The authored closing line plus what was collected this sitting. */
export function CloseBlock({
  block,
  unit,
}: {
  block: Extract<Block, { kind: "close" }>;
  unit: Unit;
}) {
  const { state } = useEquipProgress();

  const collected = unit.blocks.flatMap((b) => {
    if (b.kind === "pool") {
      const n = state.pools[b.instrument]?.length ?? 0;
      return n ? [`${n} picked · ${b.title}`] : [];
    }
    if (b.kind === "scale") return state.mood[String(unit.n)] ? ["Mood logged"] : [];
    if (b.kind === "record" || b.kind === "nested" || b.kind === "timed" || b.kind === "diary") {
      const key = b.kind === "diary" ? "diary" : b.instrument;
      const n = (state.entries[key] ?? []).filter((r) => r["unit"] === String(unit.n)).length;
      return n
        ? [`${n} ${n === 1 ? "entry" : "entries"} · ${instruments[key]?.name ?? b.title}`]
        : [];
    }
    return [];
  });
  const unique = Array.from(new Set(collected));

  return (
    <div className="pt-6 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-calm-soft">
        <Check className="h-9 w-9 text-calm-strong" strokeWidth={3} />
      </div>
      <p className="eyebrow mt-6">Unit {unit.n} complete</p>
      <p className="mx-auto mt-2 max-w-sm font-display text-xl font-semibold leading-snug">
        {block.line}
      </p>

      <div className="surface mt-7 p-4 text-left">
        <p className="eyebrow">This sitting</p>
        {unique.length ? (
          <ul className="mt-3 space-y-2">
            {unique.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground text-background">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            You read through this sitting. That counts.
          </p>
        )}
      </div>
    </div>
  );
}
