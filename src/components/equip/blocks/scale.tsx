import { useEquipProgress } from "@/lib/equip/store";
import type { Block } from "@/lib/equip/types";
import { BlockHeading } from "../fields";

const levels = [
  { value: 1, label: "Exhausted", glyph: "😩" },
  { value: 2, label: "Tired", glyph: "😪" },
  { value: 3, label: "Okay", glyph: "😐" },
  { value: 4, label: "Rested", glyph: "🙂" },
  { value: 5, label: "Refreshed", glyph: "😊" },
];

export function ScaleBlock({
  block,
  unit,
}: {
  block: Extract<Block, { kind: "scale" }>;
  unit: number;
}) {
  const { state, setMood } = useEquipProgress();
  const current = state.mood[String(unit)];

  return (
    <div>
      <BlockHeading
        eyebrow="Mood log"
        title={block.title}
        note={block.note ?? "One tap. It is logged against this sitting."}
      />
      <div className="mt-6 grid grid-cols-5 gap-2" role="radiogroup" aria-label={block.title}>
        {levels.map((level) => {
          const active = current === level.value;
          return (
            <button
              key={level.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMood(unit, level.value)}
              className={`tile flex flex-col items-center gap-2 rounded-2xl border px-1 py-4 transition-colors ${
                active ? "border-foreground bg-foreground text-background" : "border-border bg-card"
              }`}
            >
              <span className="text-2xl" aria-hidden="true">
                {level.glyph}
              </span>
              <span className="text-[10px] font-semibold">{level.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-calm transition-[width] duration-500"
          style={{ width: `${((current ?? 0) / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}
